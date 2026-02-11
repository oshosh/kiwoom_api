# 키움증권 REST API 이벤트 데모 (정적 페이지)

## 배포(VERCEL)

이 프로젝트는 정적 HTML을 Vercel에 배포합니다.

- 소스 템플릿: `api.template.html`
- 빌드 산출물(배포 대상): `public/api.html`, `public/ads.txt`
- Vercel은 `public/` 폴더가 존재하면 해당 폴더를 정적 출력으로 사용합니다.

### 로컬 빌드

```bash
npm run build
```

## Google AdSense 붙이는 절차(전체)

### 1) AdSense 계정/사이트 등록
- Google AdSense 가입
- **사이트 추가** 후 **검토/승인** 진행

### 2) 광고 코드 준비
AdSense에서 아래 2가지 값을 준비합니다.
- **게시자(클라이언트) ID**: `ca-pub-...`
- **광고 단위 슬롯 ID**: 숫자

### 3) ads.txt 준비
AdSense에서 제공하는 ads.txt 가이드에 맞게 설정합니다.
이 프로젝트는 기본적으로 아래 형태로 생성합니다.

`google.com, pub-XXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`

AdSense 화면에서 **정확한 ads.txt 라인**을 제공하는 경우, 그 값을 그대로 쓰는 것을 권장합니다.

## ENV(숨김/관리) 방식

이 프로젝트는 **정적 HTML**이라 런타임에서 서버 ENV를 읽을 수 없습니다.
대신, **Vercel 빌드 시점에 ENV 값을 HTML/ads.txt에 주입**합니다.

`.env.example` 참고.

필수 ENV:
- `ADSENSE_ENABLE`: `true`로 설정 시 광고 삽입 활성화
- `ADSENSE_CLIENT`: `ca-pub-...`
- `ADSENSE_SLOT`: 광고 단위 슬롯 ID
- `ADSENSE_PUB_ID` 또는 `ADS_TXT_LINE`: `ads.txt` 생성용

