import React from 'react';
import { ReactNode } from 'react';

// 기본 공통 타입들
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 위치 정보 타입
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  district?: string;
}

// 기기 정보 타입
export interface DeviceInfo {
  deviceId: string;
  userAgent: string;
  platform: 'web' | 'mobile' | 'tablet';
}

// 페이지 상태 타입
export interface PageState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// 네비게이션 타입
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

// 컴포넌트 기본 Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// 버튼 타입
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

// 카드 타입
export type CardVariant = 'default' | 'outlined' | 'elevated';

// 색상 테마
export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

// 반응형 크기
export type ResponsiveSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// 로딩 상태
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 유틸리티 타입들
export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type RequiredExcept<T, K extends keyof T> = Required<T> &
  Partial<Pick<T, K>>;

// 이벤트 핸들러 타입
export type EventHandler<T = HTMLElement> = (
  event: React.MouseEvent<T>,
) => void;
export type ChangeHandler<T = HTMLInputElement> = (
  event: React.ChangeEvent<T>,
) => void;
export type FormHandler = (event: React.FormEvent<HTMLFormElement>) => void;

// 사용자 타입
export interface User {
  id: string;
  deviceId: string;
  nickname?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// 앱 상태 타입
export interface AppState {
  isInitialized: boolean;
  currentUser: User | null;
  location: Location | null;
  theme: 'light' | 'dark' | 'system';
}
