import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스 병합 유틸리티
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 디바이스 ID 생성 (브라우저 기반)
 */
export function generateDeviceId(): string {
  const userAgent = navigator.userAgent;
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);

  return btoa(`${userAgent}-${timestamp}-${random}`).replace(
    /[^A-Za-z0-9]/g,
    '',
  );
}

/**
 * 로컬 스토리지 안전 접근
 */
export function safeLocalStorage() {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  }
  return localStorage;
}

/**
 * 딜레이 함수 (Promise 기반)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 숫자 포맷팅 (소수점, 천 단위 구분자)
 */
export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * 플랫폼 감지
 */
export function detectPlatform(): 'web' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'web';

  const userAgent = navigator.userAgent.toLowerCase();

  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }

  if (
    /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
      userAgent,
    )
  ) {
    return 'mobile';
  }

  return 'web';
}

/**
 * 랜덤 ID 생성
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `${prefix}${timestamp}${random}`;
}
