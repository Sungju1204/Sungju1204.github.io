# 임성주 포트폴리오

> 누군가 실제로 쓰는 것을 만듭니다.

🔗 **https://sungju1204.github.io**

한밭대학교 컴퓨터공학과 임성주의 개인 포트폴리오 사이트입니다.
템플릿 없이 HTML, CSS, JavaScript만으로 직접 만들었습니다.

## 특징

- **프레임워크·빌드 없음**: 파일 3개(`index.html`, `style.css`, `main.js`)로 동작하고 GitHub Pages에 바로 배포됩니다.
- **다크 모드**: 시스템 설정을 따르고, 버튼으로 바꾼 설정은 다음 방문에도 유지됩니다.
- **반응형**: 375px 모바일부터 데스크톱까지 가로 스크롤 없이 보입니다.
- **기술 × 프로젝트 매트릭스**: 기술마다 실제로 쓴 프로젝트를 표시했습니다.
- **Homography 인터랙티브 데모**: 네 꼭짓점을 드래그하면 8원 1차 연립방정식을 가우스 소거법으로 풀어 3×3 행렬을 구하고, CSS `matrix3d`로 평면을 변환합니다. Image_Editor 원근 보정의 원리를 직접 체험할 수 있습니다.
- **구조도**: 인라인 SVG로 그려서 다크 모드에서도 색이 맞습니다.
- **접근성**: 키보드로 탭 전환(←/→)과 데모 조작이 가능하고, 움직임 줄이기 설정을 존중합니다.
- **인쇄 대응**: 브라우저에서 PDF로 저장하면 모든 탭 내용이 펼쳐져 출력됩니다.

## 구조

```
├── index.html        # 페이지 내용
├── style.css         # 디자인 (색상은 :root 변수로 관리)
├── main.js           # 다크 모드, 탭, 스크롤 효과, Homography 데모
├── .nojekyll         # GitHub Pages의 Jekyll 처리 끄기
└── assets/
    ├── favicon.svg
    └── (스크린샷 이미지)
```

## 스크린샷 추가하는 법

`assets/` 폴더에 아래 이름으로 PNG를 넣으면 프로젝트 카드에 자동으로 나타납니다.
파일이 없으면 해당 칸은 자동으로 숨겨집니다. 가로 16:10 비율을 권장합니다.

| 파일 이름 | 내용 |
|---|---|
| `tokyo-1.png` | Tokyo Collective 상품 목록 |
| `tokyo-3.png` | Tokyo Collective 관리자 대시보드 |
| `infomate-1.png` | InfoMate 링크 입력 화면 |
| `infomate-2.png` | InfoMate 분석 결과 화면 |
| `ded-1.png` | DED-SCANPATH 스캔 패턴 구성 화면 |
| `image-editor-1.png` | Image_Editor 이미지 업로드 화면 |
| `image-editor-2.png` | Image_Editor 선분 지정 화면 |
| `image-editor-3.png` | Image_Editor 보정 결과 화면 |

## 로컬에서 보기

`index.html`을 브라우저로 열면 됩니다.
