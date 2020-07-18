/*

    korea-weather-auto-finder-js/index.js
    - The module to find location with latitude/longitude and provide weather information.

    Powered by DongHoon Yoo.
    - Blog:     https://blog.donghoonyoo.com
    - GitHub:   https://github.com/donghoony1
    - Email:    yoodonghoon01@gmail.com | nano@kakao.com

    Licensed under the GNU General Public License v3.0.

*/

const fs = require('fs');
const axios = require('axios');
const events = require('events');

Date.prototype.yyyymmdd = function() {
    const mm = (this.getMonth() + 1).toString();
    const dd = this.getDate().toString();
    return this.getFullYear().toString() + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]);
}

module.exports = class WeatherAF {
    constructor(options, readyEventCallback) {
        if(process.version.match(/\d{1,}/)[0] < 12)
            throw Error('[korea-weather-auto-finder-js] This module is supported on Node.js 12 or higher.');

        this.event = new events.EventEmitter();
        this.event.on('isReady', readyEventCallback);

        this.isReadyState = false;

        if(!options)
            options = {};
        
        this.endpoint = options.endpoint ? options.endpoint : 'https://raw.githubusercontent.com/donghoony1/weather/master/ARCHIVES/donghoony1_weather_2_latest.min.json';
        this.attemptThreshold = options.attemptThreshold ? options.attemptThreshold : 5;
        this.tooFarCriteria = options.tooFarCriteria ? options.tooFarCriteria : 2;
        this.certaintyCriteria = options.certaintyCriteria ? options.certaintyCriteria : 0.001;
        this.defaultPath = options.defaultPath ? options.defaultPath : process.cwd() + '/.weatherAF';
        this.dbInfoPath = this.defaultPath + '/dbInfo.inf';
        this.databasePath = this.defaultPath + '/database.json';
        this.dbInfo = null;
        this.database = null;

        if(fs.existsSync(this.dbInfoPath) 
        && fs.existsSync(this.databasePath)
        && (this.dbInfo = fs.readFileSync(this.dbInfoPath, 'utf-8')) == new Date().yyyymmdd()) {
            this.database = JSON.parse(fs.readFileSync(this.databasePath, 'utf-8'));
            this.isReadyState = true;
            this.event.emit('isReady', this);
        } else
            this.updateDatabase();
    }

    updateDatabase() {
        const httpRequest = (endpoint, attempts) => new Promise((resolve, reject) => {
            if(this.attemptThreshold <= attempts)
                reject(Error('The endpoint is not responding. - ' + endpoint));
            attempts = attempts === undefined ? 1 : attempts;
            axios.get(endpoint).then((response) => {
                if(!(response || response.status === 200))
                    resolve(httpRequest(endpoint, attempts));
                resolve(response);
            }).catch(() => httpRequest(endpoint, attempts));
        })

        const getUnixtime = (timeString) => {
            const dateInstance = new Date();
            const splitted = timeString.split(' ');
            dateInstance.setUTCDate(dateInstance.getDate() + (splitted[0] === '오늘' ? 0 : 1));
            dateInstance.setUTCHours(parseInt(splitted[1]) - 9);
            dateInstance.setMinutes(0);
            dateInstance.setSeconds(0);
            return Math.floor(dateInstance.getTime() / 1000);
        }

        httpRequest(this.endpoint).then((response) => {
            let data = response.data;

            Object.keys(data).forEach((state) => (
                Object.keys(data[state]).forEach((city) => (
                    Object.keys(data[state][city]).forEach((region) => {
                        data[state][city][region].weather.forEach((weather, index) => (
                            data[state][city][region].weather[index].time = getUnixtime(weather.time)
                        ));
                        data[state][city][region].location = {
                            latitude: data[state][city][region].WGS84.n,
                            longitude: data[state][city][region].WGS84.e
                        };
                        delete data[state][city][region].WGS84;
                    })
                ))
            ));

            Object.keys(data).forEach((state) => {
                const cities = Object.keys(data[state]);
                const citiesLength = cities.length;

                cities.forEach((city) => {
                    const regions = Object.keys(data[state][city]);
                    const regionsLength = regions.length;

                    data[state][city].locationAverage = {
                        latitude: regions.reduce((a, c) => a += data[state][city][c].location.latitude, 0) / regionsLength,
                        longitude: regions.reduce((a, c) => a += data[state][city][c].location.longitude, 0) / regionsLength
                    };
                });

                data[state].locationAverage = {
                    latitude: cities.reduce((a, c) => a += data[state][c].locationAverage.latitude, 0) / citiesLength,
                    longitude: cities.reduce((a, c) => a += data[state][c].locationAverage.longitude, 0) / citiesLength
                };
            });

            fs.mkdirSync(this.defaultPath, { recursive: true });
            fs.writeFileSync(this.dbInfoPath, new Date().yyyymmdd());
            fs.writeFileSync(this.databasePath, JSON.stringify(data));

            this.dbInfo = new Date().yyyymmdd();
            this.database = data;
            this.isReadyState = true;

            this.event.emit('isReady', this);
        }).catch((error) => {
            throw Error('[korea-weather-auto-finder-js] The endpoint is not responding.\n', error);
        });
    }

    find(latitude, longitude) {
        if(this.isReadyState === undefined)
            return {
                error: {
                    code: 'NOT_READY',
                    message: 'Database is not ready.'
                }
            };
        
        if(latitude === undefined
        || longitude === undefined
        || isNaN(latitude)
        || isNaN(longitude))
            return {
                error: {
                    code: 'INVALID_INPUT',
                    message: 'Latitude and longitude must be a number(double).'
                }
            };
        
        const getAccuracy = (location) => Math.abs(location.latitude - latitude) + Math.abs(location.longitude - longitude);
        const sorting = (a, b) => getAccuracy(a.locationAverage) - getAccuracy(b.locationAverage);
        const filterLocationAverage = (e) => e !== 'locationAverage';

        let abutment = {
            location: {
                state: null,
                city: null,
                region: null
            },
            accuracy: 1000
        };
        
        Object.keys(this.database).filter(filterLocationAverage).sort((a, b) => sorting(this.database[a], this.database[b])).some((state) => (
            Object.keys(this.database[state]).filter(filterLocationAverage).sort((a, b) => sorting(this.database[state][a], this.database[state][b])).some((city) => (
                Object.keys(this.database[state][city]).filter(filterLocationAverage).some((region) => {
                    let accuracy = getAccuracy(this.database[state][city][region].location);
                    
                    if(accuracy < abutment.accuracy)
                        abutment = {
                            location: { state, city, region },
                            accuracy
                        };
                    
                    if(accuracy <= this.certaintyCriteria)
                        return true;
                })
            ))
        ));

        if(this.tooFarCriteria <= abutment.accuracy)
            return {
                error: {
                    code: 'TOO_FAR',
                    message: 'The given location does not '
                }
            };
        
        const now = Math.floor(new Date().getTime() / 1000);

        return {
            response: {
                location: {
                    ...abutment.location,
                    WGS84: this.database[abutment.location.state][abutment.location.city][abutment.location.region].location
                },
                weather: this.database[abutment.location.state][abutment.location.city][abutment.location.region].weather.filter((e) => now <= e.time)[0]
            }
        };
    }

    isReady() {
        return this.isReadyState;
    }
}