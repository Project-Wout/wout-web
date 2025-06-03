// 앱 기본 정보
export const APP_INFO = {
  name: '와웃',
  nameEn: 'WOUT',
  version: '1.0.0',
  description: '오늘, 뭘 입을지 고민될 때',
  slogan: '날씨에 맞는 아웃핏을 추천해드려요',
} as const;

// API 엔드포인트
export const API_ENDPOINTS = {
  base: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  weather: '/weather',
  sensitivity: '/sensitivity',
  outfit: '/outfit',
  feedback: '/feedback',
  user: '/users',
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  deviceId: 'wout_device_id',
  userPreferences: 'wout_user_preferences',
  sensitivityData: 'wout_sensitivity_data',
  lastLocation: 'wout_last_location',
  onboardingCompleted: 'wout_onboarding_completed',
  theme: 'wout_theme',
} as const;

// 라우트 경로
export const ROUTES = {
  splash: '/',
  onboarding: '/onboarding',
  sensitivitySetup: '/sensitivity-setup',
  dashboard: '/dashboard',
  profile: '/profile',
  feedback: '/feedback',
} as const;

// 우선순위 선택 옵션
export const PRIORITY_OPTIONS = [
  {
    id: 'heat',
    emoji: '🔥',
    title: '찜통더위',
    description: '30도 이상',
  },
  {
    id: 'cold',
    emoji: '❄️',
    title: '꽁꽁추위',
    description: '5도 이하',
  },
  {
    id: 'humidity',
    emoji: '💦',
    title: '눅눅습함',
    description: '장마철 같은 날씨',
  },
  {
    id: 'wind',
    emoji: '💨',
    title: '바람쌩쌩',
    description: '풍속 5m/s',
  },
  {
    id: 'uv',
    emoji: '☀️',
    title: '따가운햇빛',
    description: '자외선 높음',
  },
  {
    id: 'pollution',
    emoji: '🌫️',
    title: '뿌연공기',
    description: '미세먼지 나쁨',
  },
] as const;

// 온보딩 페이지 정보
export const ONBOARDING_PAGES = [
  {
    id: 1,
    icon: '🎯',
    title: '개인 맞춤\n날씨 분석',
    description: '당신의 체감온도를 분석해서\n정확한 옷차림을 추천해드려요',
  },
  {
    id: 2,
    icon: '👕',
    title: '스마트한\n옷차림 추천',
    description: '기온, 습도, 바람까지 고려한\n완벽한 옷차림을 제안해요',
  },
  {
    id: 3,
    icon: '📈',
    title: '매일 더 정확하게\n업데이트',
    description: '피드백을 통해 학습하면서\n정확도가 계속 향상돼요',
  },
] as const;
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
  ease: {
    default: [0.4, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
  },
} as const;

// 브레이크포인트
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// 디바이스 타입
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
} as const;

// 색상 시스템
export const COLORS = {
  primary: {
    50: '#f0f4ff',
    100: '#e6fffa',
    500: '#667eea',
    600: '#5a67d8',
    700: '#4c51bf',
    900: '#764ba2',
  },
  gray: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748',
    800: '#1a202c',
    900: '#171923',
  },
} as const;
