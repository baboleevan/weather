출력되는 파일의 타입이 변경되었습니다. 위치 정보 표준 이름 오기를 수정했습니다.

# 수정 전
- **도, 특별시, 광역시, 특별자치시** — *예: 서울특별시, 경기도*
    - **시, 군, 구** — *예: 강남구, 서초구, 수원시 권선구, 성남시 분당구, 과천시*
        - **동, 읍, 면** — *예: 신사동, 백현동, 부발읍, 청평면*
            - **weather** — 각 지역의 날씨 정보
                - Array
                    - **time** — 오늘/내일 O시 *24시간제*
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
            - **WG84** — WG84 기반 표준 위도, 경도 데이터
                - **n** — 위도(Latitude; N)
                - **e** — 경도(Longitude; E)

# 수정 후
- **도, 특별시, 광역시, 특별자치시** — *예: 서울특별시, 경기도*
    - **시, 군, 구** — *예: 강남구, 서초구, 수원시 권선구, 성남시 분당구, 과천시*
        - **동, 읍, 면** — *예: 신사동, 백현동, 부발읍, 청평면*
            - **weather** — 각 지역의 날씨 정보
                - Array
                    - **time** — 오늘/내일 O시 *24시간제*
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
            - **WGS84** — World Geodetic System(WGS84) 표준 위도, 경도 데이터
                - **n** — 위도(Latitude; N)
                - **e** — 경도(Longitude; E)