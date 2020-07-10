# 대한민국 기상 정보
기상청에서 제공하는 대한민국 기상 정보의 아카이브입니다.

> [LICENSE](https://github.com/donghoony1/weather/blob/master/LICENSE) 문서에서 저작권을 확인할 수 있습니다.

> [Issues](https://github.com/donghoony1/weather/issues) 또는 [이메일](mailto:yoodonghoon01@gmail.com)으로 문의할 수 있습니다.

## ⚠️ 주의 사항
- 기상청에서 기상 정보의 제공 방법의 변경 또는 중지 등의 이유로 데이터 제공이 원활하지 않거나 중단될 수 있습니다.
- 자동 수집 및 가공 프로그램 또는 서버의 예기치 못한 오작동으로 데이터 제공이 원활하지 않거나 중단될 수 있습니다.
- 데이터가 정시에 배포되지 않거나 누락될 가능성이 있습니다.
- 데이터 유형의 변동 계획이 있을 시 최소 7일 전 본 Repository의 `UPDATE` 폴더에 `UPDATE_<버전>.md` 파일이 게시됩니다.

## ℹ️ 이용 안내
### 요약
- **유형** | 데이터는 `JSON` 형태로 제공됩니다.
- **경로** | 데이터는 [/archive](https://github.com/donghoony1/weather/blob/master/archive)에 업로드됩니다.
- **이름** | 데이터의 이름은 `donghoony1-weather_버전_시간.min.json` 형태로 제공됩니다. *시간: 데이터가 가공 완료된 일시를 년월일(YYYYMMdd)로 표기*
- **갱신 주기** | 데이터는 매일 자정에 자동으로 수집 및 가공이 시작되고 처리가 완료되면 commit됩니다. *예상 소요 시간: 1시간 30분*
- **보존 기간** | 30일이 지난 데이터는 자동으로 삭제됩니다.

### JSON 파일 설명
- **도, 특별시, 광역시, 특별자치시** — *예: 서울특별시, 경기도*
    - **시, 군, 구** — *예: 강남구, 서초구, 수원시 권선구, 성남시 분당구, 과천시*
        - **동, 읍, 면** — *예: 신사동, 백현동, 부발읍, 청평면*
            - **weather** — 각 지역의 날씨 정보
                - Array
                    - **time** — 오늘/내일/모레 O시 *24시간제*
                    - **description** — 기상 상황 요약
                        - **ko** — 한국어
                        - **en** — 영어(미국)
                    - **temperature** — 기온(섭씨)
                        - **data** — 기온 정보
                        - **minimum** — 최저 기온 *정보 부재 시 null로 반환*
                        - **maximum** — 최고 기온 *정보 부재 시 null로 반환*
                    - **humidity** — 습도(%)
                    - **chanceOfShower** — 예상 강수 확률(%)
                    - **wind** — 바람
                        - **speed** — 풍속(meter per second; m/s)
                        - **direction** — 풍향 *E, N, NE, NW, S, SE, SW, W*
            - **WG84** — WG84 기반 위도, 경도 데이터
                - **n** — 위도(Latitude; N)
                - **e** — 경도(Longitude; E)

#### 추가 설명
- 기상청에 의하여 일부 행정 구역은 '종로1.2.3.4가동'과 같이 병합되어 제공됩니다.
- 세종특별자치시와 같이 '구' 단위의 행정 구역이 존재하지 않는 '도, 특별시, 광역시, 특별자치시'의 '시, 군, 구'란에는 상위 행정 구역 명칭이 동일하게 사용됩니다.

### 자동화에 관한 이용 지향성
본 아카이브 가공•제공자(본인)은 이용자가 자동으로 본 데이터를 참조하고자 하는 경우 다음과 같이 이용되기를 지향합니다.
1. 미리 준비한 서버에서 본 GitHub Repository에 업로드된 아카이브 파일을 내려받습니다.
2. 해제된 데이터를 적절히 가공하거나 원본을 이용자의 웹 서버 등으로 복사하여 API 형태로 이용합니다.

### 활용 아이디어
- 기상 정보를 기록하여 전국 기상 추세를 작성할 수 있습니다.
- 웹에서 접속자의 위치 정보를 수집하고 제공되는 위도, 경도 데이터를 활용하여 인접 지역의 명칭과 기상 정보를 제공할 수 있습니다. [#](https://www.w3schools.com/html/html5_geolocation.asp)

## ℹ️ 기타
### 운영 정보
- **서버** | 본 기상 정보의 수집, 가공 및 배포에는 [Amazon Web Services](https://aws.amazon.com)의 Lightsail, Lambda, CloudWatch EventBridge, Route 53 Health Check, SNS가 이용되고 있습니다.
- **프로그램** | 본 기상 정보의 수집, 가공 및 배포 프로그램은 `JavaScript`로 작성되었으며 [Node.js](https://nodejs.org) 런타임으로 실행되고 있습니다.

### 자주 묻는 질문
> **Q. 별도의 데이터 제공 수단(Amazon S3 등)이 필요합니다.**
>
> A. 보유하고 계신 Amazon S3 Bucket에 IAM 권한을 부여해 주시면 업로드 가능합니다. [이메일](yoodonghoon01@gmail.com)로 연락바랍니다.

> **Q. 수집, 가공 및 배포 관련 코드가 필요합니다.**
>
> A. 본 아카이브 솔루션은 배포자 개인 용도의 위젯 개발에 필요하여 기상청 날씨 정보를 수집 및 가공을 위하여 만들어졌습니다. 코드를 공개하고자 했으나 과도한 수집으로 기상청에 발생할 부하를 고려하여 수집 및 가공된 데이터를 배포하는 것입니다. 따라서 코드는 배포하기 어렵습니다. 이해해 주셔서 감사합니다.