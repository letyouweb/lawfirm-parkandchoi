'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, Search, MapPin, Phone, ChevronUp, ChevronDown } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- Placeholder Data ---

interface InsightItem {
  category: string;
  title: string;
  date: string;
  summary: string;
  highlight: boolean;
}

const insightsData: InsightItem[] = [
  {
    category: '뉴스레터',
    title: '\'노란봉투법\' 국회 본회의 통과',
    date: '2025.08.25',
    summary: "법안 통과 현황 국회는 2025년 8월 24일 본회의를 열어 출석 의원 186명 중 찬성 183명, 반대 3명으로 이른바 \'노란봉투법\'이라 불리는 \'노동조합 및 노동관계조정법\'...",
    highlight: true,
  },
  {
    category: '뉴스레터',
    title: '인공지능기본법 시행령 초안 발표',
    date: '2025.09.10',
    summary: '국가인공지능전략위원회 출범, 대한민국 AI 액션플랜 및 국가 AI 정책...',
    highlight: false,
  },
  {
    category: '뉴스레터',
    title: '2차 개정 상법 시행 및 배임죄 등 제도 개선...',
    date: '2025.09.09',
    summary: '지난 뉴스레터에서 안내 드린 바와 같이, 대규모 상장회사 집중투표제의...',
    highlight: false,
  },
  {
    category: '뉴스레터',
    title: 'AI 워싱(AI Washing) 유형 및 규제 동향 (1)',
    date: '2025.08.19',
    summary: "\'AI 워싱(AI Washing)\'이라고 들어보셨나요? 최근 휴먼뿐만 아니라 금...",
    highlight: false,
  },
];

// --- Constants ---

const ACCENT_RED = '#931f1d';
// 모든 풀페이지 섹션의 목록
const SECTIONS = [
  'HeroSection',
  'InsightsSection',
  'LexologySection',
  // Award Section 추가 (첨부 이미지 333.PNG 반영)
  'AwardSection', 
] as const;
const SCROLL_DELAY = 1000; // 스크롤 이벤트 디바운스 시간 (ms)

type SectionName = typeof SECTIONS[number];

// --- Utility Hooks ---

/**
 * 스크롤 속도 제한을 위한 디바운스 기능을 제공하는 Hook
 */
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

// --- Components ---

/**
 * 1. Hero Section
 */
const HeroSection = () => {
  // 첨부된 이미지 screencapture-kimchang-ko-main-kc-2025-09-30-12_13_28.png 반영
  const BG_IMAGE_URL = 'https://placehold.co/1920x1080/0d0c0c/ffffff?text=KOREAN+TRADITIONAL+ROOF';
  
  return (
    <div 
      className="relative w-screen h-screen bg-cover bg-center text-white flex flex-col"
      style={{ backgroundImage: `url(${BG_IMAGE_URL})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      {/* Header Bar */}
      <header className="relative z-10 flex justify-between items-center px-4 md:px-10 py-5">
        
        {/* Left: Menu & Language Switch */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Menu className="w-6 h-6 cursor-pointer" />
          <div className="hidden sm:flex space-x-3">
            <span className="font-bold">KO</span>
            <span className="opacity-70">EN</span>
            <span className="opacity-70">JP</span>
            <span className="opacity-70">CN</span>
          </div>
        </div>

        {/* Center: Main Logo/Title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-4xl tracking-widest font-light text-center">
          KIM & CHANG
        </h1>

        {/* Right: Utility Links */}
        <div className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
          <span>지식재산권</span>
          <span>인재채용</span>
          <Search className="w-5 h-5 opacity-70 cursor-pointer" />
        </div>
      </header>

      {/* Main Content (Centered Title and Search Box) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl md:text-7xl font-light tracking-wider mb-10">
          KIM & CHANG
        </h2>
        
        {/* Search Input Mockup */}
        <div className="flex items-center justify-between w-full max-w-lg mx-auto bg-white/10 border border-white/50 p-4 rounded-lg transition-all duration-300">
          <input 
            type="text" 
            placeholder="Search Law Firm" 
            className="flex-grow bg-transparent text-lg text-white placeholder-white/80 focus:outline-none"
          />
          <Search className="w-6 h-6 ml-4 cursor-pointer" />
        </div>
      </div>
      
      {/* Footer link mock (SCHOLEOMN in the image) */}
      <div className="relative z-10 flex justify-center pb-6">
        <div className="text-xs opacity-70">
          SCHOLEOMN
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Insights Section
 */
interface InsightsSectionProps {
  data: InsightItem[];
}

const InsightsSection = ({ data }: InsightsSectionProps) => {
  // 첨부된 이미지 www.kimchang.com_ko_main.kc (1).png 반영
  return (
    <section className="w-screen h-screen py-20 px-4 md:px-10 bg-white relative flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-5xl font-light text-center mb-16 tracking-widest">
          INSIGHTS
        </h2>
        
        {/* Insights Grid (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((item, index) => (
            <div 
              key={index} 
              className={`p-6 border rounded-lg transition-all duration-700 ${item.highlight ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-zinc-800 border-gray-200'} shadow-md hover:shadow-xl`}
              style={{ minHeight: '350px' }}
            >
              <span 
                className={`text-xs font-semibold ${item.highlight ? 'text-white/70' : 'text-zinc-600'}`}
              >
                {item.category}
              </span>
              <h3 className={`mt-3 text-xl font-bold leading-normal ${item.highlight ? 'text-white' : 'text-zinc-800'}`}>
                {item.title}
              </h3>
              <p 
                className={`mt-4 text-sm leading-relaxed ${item.highlight ? 'text-white/70' : 'text-zinc-600'}`}
              >
                {item.summary.substring(0, 100)}...
              </p>
              <p className={`mt-8 text-xs font-medium ${item.highlight ? 'text-white/50' : 'text-zinc-500'}`}>
                {item.date}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll Arrows Mockup */}
      <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 md:mr-10">
        <button 
          className="block p-3 mb-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full shadow-lg"
          aria-label="Scroll Up"
        >
          <ChevronUp className="w-5 h-5 text-zinc-700" />
        </button>
        <button 
          className="block p-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full shadow-lg"
          aria-label="Scroll Down"
        >
          <ChevronDown className="w-5 h-5 text-zinc-700" />
        </button>
      </div>
    </section>
  );
};


/**
 * 3. Lexology Index Section
 */
const LexologySection = () => {
  // 첨부된 이미지 www.kimchang.com_ko_main.kc.png 반영
  const MOUNTAIN_IMAGE_URL = 'https://placehold.co/800x600/3c4043/ffffff?text=SNOWY+MOUNTAIN';
  
  return (
    <section className="w-screen h-screen py-20 px-4 md:px-10 bg-gray-50 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full p-8 md:p-12 bg-white shadow-xl rounded-lg">
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 relative">
            <div className="relative z-10 p-4 pt-12">
              <p className="text-white text-xs tracking-wider absolute top-4 left-4 bg-zinc-700 px-2 py-1 rounded-sm">
                Lexology Index: South Korea 2025
              </p>
              <img 
                src={MOUNTAIN_IMAGE_URL} 
                alt="Snowy mountains placeholder" 
                className="w-full h-auto object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/10 rounded-md"></div>
              
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xl md:text-3xl font-bold tracking-tight">147명, 분야별</p>
                <p className="text-xl md:text-3xl font-bold tracking-tight">'Recommended' 선정</p>
              </div>
              
              <div className="absolute -top-4 -left-4 w-full h-full border-t-2 border-l-2" style={{ borderColor: ACCENT_RED }}></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-b-2 border-r-2" style={{ borderColor: ACCENT_RED }}></div>
            </div>
          </div>
          
          <div className="flex-1 pt-10 relative">
            <div className="absolute top-0 left-0 h-1 w-20" style={{ backgroundColor: ACCENT_RED }}></div>

            <h3 className="text-3xl md:text-5xl font-light mt-4 leading-snug">
              147명, 분야별 'Recomm<span className="opacity-0">ended' 선정</span>
            </h3>
            <p className="text-sm text-gray-600 mt-6 leading-relaxed max-w-md">
              김·장 법률사무소 147명의 변호사·변리사·회계사 등이 각 업무 분야별 'Recommended' Individuals로 등재되며 구성원들의 전문성과...<br/>
              *위 텍스트는 이미지와 동일하게 일부러 잘림 (The text is intentionally cut off to match the image).
            </p>
            
            <button 
              className="mt-10 px-8 py-3 border border-gray-400 text-sm font-medium tracking-widest text-zinc-800 hover:bg-gray-100 transition-colors rounded"
            >
              VIEW MORE
            </button>
          </div>
        </div>
        
        {/* Pagination Dots/Lines */}
        <div className="flex justify-center mt-16 space-x-3">
          <div className="h-1 w-10 rounded-full" style={{ backgroundColor: ACCENT_RED }}></div>
          <div className="h-1 w-10 bg-gray-300 rounded-full"></div>
          <div className="h-1 w-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

/**
 * 4. Award Section (New, based on 333.PNG)
 */
const AwardSection = () => {
    // 첨부된 이미지 333.PNG 반영
    const BG_IMAGE_URL = 'https://placehold.co/1920x1080/ff9900/ffffff?text=ROAD+WITH+SUNSET';

    return (
        <section 
            className="w-screen h-screen px-4 md:px-10 bg-gray-50 flex flex-col justify-center overflow-hidden"
            style={{ 
                backgroundImage: `url(${BG_IMAGE_URL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-black opacity-30"></div>
            
            <div className="relative max-w-7xl mx-auto w-full p-8 md:p-12 bg-white/90 shadow-xl rounded-lg">
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                    
                    {/* Left Block: Image/Award Badge */}
                    <div className="flex-1 relative order-2 lg:order-1">
                        <img 
                            src="https://placehold.co/500x300/4a4e69/ffffff?text=Award+Badge+Image" 
                            alt="Award badge placeholder" 
                            className="w-full h-auto object-cover rounded-md shadow-lg"
                        />
                         <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/10">
                            <div className="bg-white p-6 rounded-full shadow-2xl text-center">
                                <span className="text-xs font-semibold text-zinc-600 block">WINNER</span>
                                <p className="text-xl font-bold text-zinc-800 mt-1">ASIA-PACIFIC & GREATER CHINA REGION AWARDS 2025</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Block: Text and Button */}
                    <div className="flex-1 pt-10 relative order-1 lg:order-2">
                        {/* Red Accent Line */}
                        <div className="absolute top-0 left-0 h-1 w-20" style={{ backgroundColor: ACCENT_RED }}></div>

                        <h3 className="text-3xl md:text-5xl font-light mt-4 leading-snug text-zinc-800">
                            'South Korea National Law Firm of the Year' 수상
                        </h3>
                        <p className="text-sm text-gray-600 mt-6 leading-relaxed max-w-md">
                            김·장 법률사무소가 Chambers Asia-Pacific & Greater China Region Awards 2025에서 'South Korea National Law Firm of the Year' (올해의 한국 로펌 상)을 수상하였습니다. 2010년 첫 시상식을 시작한 이래로, 저희 사무소는 누적 10회 수상 기록을 세우며 역량을 인정받고 있습니다.
                        </p>
                        
                        <button 
                            className="mt-10 px-8 py-3 border border-gray-400 text-sm font-medium tracking-widest text-zinc-800 hover:bg-gray-100 transition-colors rounded"
                        >
                            VIEW MORE
                        </button>
                        
                        {/* Pagination Dots Mockup */}
                        <div className="flex space-x-3 mt-8">
                            <div className="h-1 w-10" style={{ backgroundColor: ACCENT_RED }}></div>
                            <div className="h-1 w-10 bg-gray-300"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/**
 * 5. Contact & Footer Section (Normal scroll, placed outside the main full-page container)
 */
const FooterSection = () => {
  // 첨부된 이미지 www.kimchang.com_ko_main.kc.png 하단 푸터 반영
  return (
    <footer className="bg-white">
      
      {/* Contact Bar */}
      <div className="flex flex-col md:flex-row justify-center items-center py-12 border-b border-gray-200 max-w-7xl mx-auto">
        
        {/* Office Location */}
        <div className="flex items-center space-x-3 p-4 md:border-r md:pr-12 border-gray-300 cursor-pointer mb-6 md:mb-0">
          <MapPin className="w-6 h-6" style={{ color: ACCENT_RED }} />
          <span className="text-lg font-medium text-zinc-800">사무소 위치</span>
        </div>
        
        {/* Contact */}
        <div className="flex items-center space-x-3 p-4 md:pl-12 cursor-pointer">
          <Phone className="w-6 h-6" style={{ color: ACCENT_RED }} />
          <span className="text-lg font-medium text-zinc-800">연락처</span>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-zinc-800 text-white py-6 px-4 md:px-10 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-4 mb-4 md:mb-0">
            <a href="#" className="hover:text-gray-400">사무소위치</a>
            <a href="#" className="hover:text-gray-400">연락처</a>
            <a href="#" className="hover:text-gray-400">법적고지</a>
            <a href="#" className="hover:text-gray-400 font-bold">개인정보처리방침</a>
            <a href="#" className="hover:text-gray-400">웹접근성</a>
            <span className="text-gray-400">광고책임변호사 : 황광연</span>
          </div>

          {/* Copyright */}
          <p className="text-gray-400">
            © 2019-2025 Kim & Chang. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};


/**
 * Main Application Component (Full-page Scroll Logic Included)
 */
const App = () => {
  
  // --- Firebase Setup (For environment compliance) ---
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof initializeApp !== 'undefined' && typeof getAuth !== 'undefined' && typeof getFirestore !== 'undefined') {
        const appId = typeof (window as any).__app_id !== 'undefined' ? (window as any).__app_id : 'default-app-id';
        const firebaseConfig = typeof (window as any).__firebase_config !== 'undefined' ? JSON.parse((window as any).__firebase_config) : {};
        
        try {
            const app = initializeApp(firebaseConfig);
            const authInstance = getAuth(app);
            const dbInstance = getFirestore(app);
            setDb(dbInstance);
            setAuth(authInstance);

            const signIn = async () => {
                try {
                    if (typeof (window as any).__initial_auth_token !== 'undefined' && (window as any).__initial_auth_token) {
                        // eslint-disable-next-line
                        await signInWithCustomToken(authInstance, (window as any).__initial_auth_token);
                    } else {
                        // eslint-disable-next-line
                        await signInAnonymously(authInstance);
                    }
                } catch (error) {
                    console.error("Firebase Auth Error:", error);
                    // Fallback to anonymous UUID if sign-in fails
                    setUserId(crypto.randomUUID());
                }
            };
            
            // eslint-disable-next-line
            onAuthStateChanged(authInstance, (user) => {
                setUserId(user?.uid || crypto.randomUUID());
            });

            signIn();
        } catch (error) {
            console.error("Firebase initialization failed:", error);
            setUserId(crypto.randomUUID());
        }
    } else {
        // Fallback for when Firebase libraries are not available in the context
        setUserId(crypto.randomUUID());
    }
  }, []);
  // --- End Firebase Setup ---

  // --- Full-page Scroll Logic ---
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const isScrollingRef = useRef(false);

  // 섹션 인덱스를 안전하게 업데이트하는 함수
  const goToSection = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < SECTIONS.length) {
      setCurrentSectionIndex(newIndex);
      isScrollingRef.current = true;
      
      // 스크롤 딜레이 후 잠금 해제
      setTimeout(() => {
        isScrollingRef.current = false;
      }, SCROLL_DELAY);
    }
  }, []);

  // 마우스 휠 이벤트 핸들러
  const handleWheel = useCallback((e: WheelEvent) => {
    if (isScrollingRef.current) return;
    
    // 모바일 터치 스크롤 방지
    if (e.deltaY === 0) return;

    if (e.deltaY > 0) { // 아래로 스크롤
      goToSection(currentSectionIndex + 1);
    } else { // 위로 스크롤
      goToSection(currentSectionIndex - 1);
    }
  }, [currentSectionIndex, goToSection]);

  // 디바운스된 휠 이벤트 핸들러
  const debouncedHandleWheel = useDebounce(handleWheel, 100);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('wheel', debouncedHandleWheel);
    
    // 클린업 함수
    return () => {
      window.removeEventListener('wheel', debouncedHandleWheel);
    };
  }, [debouncedHandleWheel]);
  
  // 키보드 방향키 이벤트 핸들러 (접근성 향상)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isScrollingRef.current) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goToSection(currentSectionIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToSection(currentSectionIndex - 1);
    }
  }, [currentSectionIndex, goToSection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // 섹션 컴포넌트 맵
  const sectionComponents: Record<SectionName, React.ReactElement> = {
    HeroSection: <HeroSection key="hero" />,
    InsightsSection: <InsightsSection data={insightsData} key="insights" />,
    LexologySection: <LexologySection key="lexology" />,
    AwardSection: <AwardSection key="award" />,
  };

  return (
    // 전체 컨테이너에 overflow: hidden을 적용하여 브라우저 기본 스크롤을 막습니다.
    <div 
      className="min-h-screen font-sans overflow-hidden" 
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      
      {/* 풀페이지 스크롤 컨테이너 */}
      <div 
        className="w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${currentSectionIndex * 100}vh)` }}
      >
        {SECTIONS.map(sectionName => sectionComponents[sectionName])}
      </div>

      {/* Footer는 마지막 섹션 아래에 일반 스크롤 영역으로 배치됩니다. */}
      {currentSectionIndex === SECTIONS.length - 1 && (
        <FooterSection />
      )}
      
      {/* 섹션 표시기 (점/Dot) */}
      <div className="fixed right-5 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-50 hidden md:flex">
        {SECTIONS.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
              currentSectionIndex === index ? 'w-4 h-4' : 'bg-gray-400'
            }`}
            style={{ 
              backgroundColor: currentSectionIndex === index ? ACCENT_RED : undefined 
            }}
            onClick={() => goToSection(index)}
          ></div>
        ))}
      </div>
      
      {/* Show User ID for compliance */}
      <div className="fixed bottom-0 left-0 bg-black text-white text-[10px] p-1 z-50 opacity-50">
        User ID: {userId}
      </div>
      
    </div>
  );
};

export default App;

