/*

    korea-weather-auto-finder-js/index.d.ts
    - The file to define interfaces and types for TypeScript.

    Powered by DongHoon Yoo.
    - Blog:     https://blog.donghoonyoo.com
    - GitHub:   https://github.com/donghoony1
    - Email:    yoodonghoon01@gmail.com | nano@kakao.com

    Licensed under the GNU General Public License v3.0.

*/

interface WeatherAFOptions {
    endpoint: String,
    attemptThreshold: Number,
    tooFarCriteria: Number,
    certaintyCriteria: Number,
    defaultPath: String
} 

type readyEventCallback = (app: WeatherAF) => void;

interface WeatherAFInfoWeather {
    time: Number,
    description: {
        ko: String,
        en: String
    },
    temperature: {
        data: Number,
        minimum: Number,
        maximum: Number
    },
    humidity: Number,
    chanceOfShower: Number,
    wind: {
        speed: Number,
        direction: 'E' | 'N' | 'NE' | 'NW' | 'S' | 'SE' | 'SW' | 'W';
    }
}

interface WeatherAFInfoLocation {
    latitude: Number,
    longitude: Number
}

interface WeatherAFReturnFind {
    response: {
        location: {
            state: String,
            city: String,
            region: String,
            WGS84: WeatherAFInfoLocation
        },
        weather: WeatherAFInfoWeather,
    }
}

interface WeatherAFReturnError {
    error: {
        code: 'INVALID_INPUT' | 'TOO_FAR' | 'NOT_READY' | 'UNKNOWN';
        message: String
    }
}

declare class WeatherAF {
    constructor(options: WeatherAFOptions, readyCallback: readyEventCallback);

    private event: Event;
    
    private isReadyState: Boolean;
    private endpoint: String;
    private attemptThreshold: Number;
    private tooFarCriteria: Number;
    private certaintyCriteria: Number;
    private defaultPath: String;
    private dbInfoPath: String;
    private databasePath: String;
    private dbInfo: String;
    private database: {
        [key: string]: {
            [key: string]: {
                [key: string]: {
                    weather: Array<WeatherAFInfoWeather>,
                    location: WeatherAFInfoLocation
                } | WeatherAFInfoLocation,
            } | WeatherAFInfoLocation
        }
    };

    private updateDatabase(): void;

    public find(latitude: Number, longitude: Number): WeatherAFReturnFind | WeatherAFReturnError;

    public isReady(): Boolean;
}