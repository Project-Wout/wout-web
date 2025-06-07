// 🔧 백엔드 ApiResponse 구조에 맞춘 공통 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  code?: string;
  message?: string;
  data?: T;
}

// 페이지네이션 관련
export interface PaginationRequest {
  page: number;
  size: number;
}

export interface PaginationResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
