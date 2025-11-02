# Law Firm - Park & Choi

법무법인 웹사이트 템플릿 (Next.js 14 + TypeScript + Tailwind CSS)

## 🚀 주요 기능

- ⚡ Next.js 14 App Router
- 💎 TypeScript 완전 지원
- 🎨 Tailwind CSS 스타일링
- 📱 완벽한 반응형 디자인
- 🔥 Firebase 통합 (선택사항)
- 📄 풀페이지 스크롤 효과
- ♿ 웹 접근성 최적화

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🌍 배포

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

또는 GitHub 연동 후 자동 배포

## 🔧 환경 설정

`.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Firebase 없이도 사이트는 정상 작동합니다 (익명 UUID 사용).

## 📁 프로젝트 구조

```
lawfirm-parkandchoi/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   ├── page.tsx      # 홈 페이지
│   │   └── globals.css   # 글로벌 스타일
│   └── components/       # React 컴포넌트
│       └── App.tsx       # 메인 앱 컴포넌트
├── public/               # 정적 파일
├── .env.local           # 환경 변수
└── vercel.json          # Vercel 설정
```

## 🎯 섹션 구성

1. **Hero Section** - 메인 배너 및 검색
2. **Insights Section** - 뉴스레터 및 인사이트
3. **Lexology Section** - 업적 및 수상 내역
4. **Award Section** - 추가 수상 정보
5. **Footer Section** - 연락처 및 정보

## 🔗 링크

- GitHub: https://github.com/letyouweb/lawfirm-parkandchoi
- Vercel: https://vercel.com/letyouweb/lawfirm-parkandchoi

## 📄 라이선스

MIT License - 자유롭게 사용 및 수정 가능

---

Made with ❤️ by LetYou Web
