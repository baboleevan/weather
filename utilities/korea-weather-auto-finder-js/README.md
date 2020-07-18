# korea-weather-auto-finder-js
**위도, 경도를 통하여 인접 행정구역의 날씨 정보를 제공하는 모듈입니다.**

✅ Node.js 12+에서 사용할 수 있습니다.

✅ TypeScript를 지원합니다.

⚠ 날씨 정보는 대한민국에 한하여 제공됩니다.

```
npm install korea-weather-auto-finder-js
```
*Node.js 프로젝트 폴더에서 위 명령을 입력하여 설치할 수 있습니다.*

----

# 사용 예
다음 예는 서울특별시청의 위도, 경도 값을 입력하여 날씨 정보를 수신하는 방법을 설명합니다.

```js
const WeatherAF = require('korea-weather-auto-finder-js');

const WeatherAFApp = new WeatherAF(null, (app) => {
    console.log(app.find(37.566676, 126.978414));
});
```

----

# 설명
## Constructor
```js
new WeatherAF(options, readyEventCallback) ⇒ Object
```

### 예
```js
const WeatherAFApp = new WeatherAF(null, (app) => {
    // ...
});
```

### 매개변수(옵션)
- **options** (Object) — 모듈의 객체 생성을 사용자화할 수 있는 옵션입니다.
    - **endpoint** (String) — 날씨 정보 데이터베이스를 제공하는 서버입니다. [날씨 정보 데이터베이스의 규격](https://github.com/donghoony1/weather/blob/master/README.md)을 참고하세요. 기본 값은 `https://raw.githubusercontent.com/donghoony1/weather/master/ARCHIVES/donghoony1_weather_2_latest.min.json`입니다. 제공되는 날씨 정보 데이터베이스를 더 빠른 서버로 미러한 후 참조할 수 있습니다.
    - **attemptThreshold** (Number) — 날씨 정보 데이터 수신 실패 시 재시도할 회수입니다. 기본 값은 5입니다.
    - **tooFarCriteria** (Number) — 탐색된 인접 행정구역이 너무 멀 경우 오류를 반환하는데 사용될 기준입니다. 오차는 제공된 위도, 경도로부터 인접 행정구역의 대표 위도, 경도의 오차의 합으로 계산됩니다. 기본 값은 2입니다.
    - **certaintyCriteria** (Number) — 순차 탐색 중 인접 행정구역이 발견될 경우 탐색을 조기 종료하는데 사용될 기준입니다. 오차 계산 방법은 **tooFarCriteria**와 같습니다. 기본 값은 0.001입니다.
    - **defaultPath** (String) — 캐시 데이터 파일이 저장될 경로입니다. 경로의 마지막에 `/`를 넣지 마십시오. 기본 값은 `process.cwd() + /.weatherAF`입니다.
- **readyEventCallback** (Function) — 날씨 정보 데이터베이스를 성공적으로 내려받고 가공이 완료될 때 실행할 콜백 함수입니다.
    - **app** (WeatherAF) — 생성된 원본 객체입니다.

## find
위도, 경도로 인접 행정구역의 기상 정보를 탐색하고 반환합니다.

```js
find(latitude, longitude) ⇒ Object
```

### 예
```js
WeatherAFApp.find(latitude, longitude);
```

### 매개변수(필수)
- **latitude** (Number) – 탐색할 위치의 위도입니다. World Geodetic System(WGS84) 표준을 따릅니다.
- **longitude** (Number) - 탐색할 위치의 경도입니다. World Geodetic System(WGS84) 표준을 따릅니다.

### 반환 값
#### 정상
- **response** (Object)
    - **location** (Object) – 위치 정보입니다.
        - **state** (String) – 도, 특별시, 광역시, 특별자치시 단위 이름입니다.
        - **city** (String) – 시, 군, 구 단위 이름입니다.
        - **region** (String) – 동, 읍, 면 단위 이름입니다.
        - **WGS84** (Object) – World Geodetic System(WGS84) 표준의 위도, 경도입니다.
            - **latitude** (Number) – 위도입니다.
            - **longitude** (Number) – 경도입니다.
    - **weather** (Object) – 기상 정보입니다.
        - **time** (Number) – Unixtime의 기상 예보 기준 시간입니다.
        - **description** (Object) – 기상 상황 요약입니다.
            - **ko** – 한국어로 작성된 기상 상황 요약입니다.
            - **en** – 영어(미국)로 작성된 기상 상황 요약입니다.
        - **temperature** – 기온(섭씨) 정보입니다.
            - **data** – 현재 기온 정보입니다.
            - **minimum** – 당일 최저 기온입니다. 정보 부재 시 `null`로 반환됩니다.
            - **maximum** – 당일 최고 기온입니다. 정보 부재 시 `null`로 반환됩니다.
        - **humidity** – 습도(%)입니다.
        - **chanceOfShower** – 예상 강수 확률(%)입니다.
        - **wind** – 바람 정보입니다.
            - **speed** – 풍속(meter per second; m/s)입니다.
            - **direction** – 풍향(E, N, NE, NW, S, SE, SW, W)입니다.

#### 오류
- **error** (Object)
    - **code** (String) – 오류 코드(`INVALID_INPUT`, `TOO_FAR`, `NOT_READY`, `UNKNOWN`)입니다.
    - **message** (String) – 오류 설명 메시지입니다.

## isReady
모듈의 사용 준비 여부를 반환합니다.

```js
WeatherAFApp.isReady()
```

### 예
```js
WeatherAFApp.isReady() ⇒ Boolean
```

### 매개변수
없음

### 반환
`Boolean`
- **`true`** – 모듈 사용 준비가 완료되었음을 나타냅니다.
- **`false`** – 모듈 사용 준비가 완료되지 않았음을 나타냅니다.