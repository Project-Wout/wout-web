import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 피드백 타입 정의
export type FeedbackType =
  | 'TOO_COLD'
  | 'SLIGHTLY_COLD'
  | 'PERFECT'
  | 'SLIGHTLY_HOT'
  | 'TOO_HOT';

// 피드백 데이터 인터페이스
export interface FeedbackData {
  id: string;
  recommendationId: string;
  feedbackType: FeedbackType;
  comment?: string;
  weatherScore: number;
  submittedAt: string;
  weatherData: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
  };
  outfitRecommendation: {
    top: string;
    bottom: string;
    outer?: string;
    accessories?: string[];
  };
}

// 추천 데이터 인터페이스 (피드백 대상)
export interface RecommendationData {
  id: string;
  weatherScore: number;
  weatherData: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
  };
  outfitRecommendation: {
    top: string;
    bottom: string;
    outer?: string;
    accessories?: string[];
  };
  createdAt: string;
}

// 피드백 스토어 인터페이스
interface FeedbackStore {
  // 모달 상태
  isModalOpen: boolean;
  selectedFeedback: FeedbackType | null;
  currentRecommendation: RecommendationData | null;

  // 피드백 히스토리
  feedbackHistory: FeedbackData[];

  // 통계 데이터
  totalFeedbacks: number;
  averageAccuracy: number;

  // 액션 메서드들
  openModal: (recommendation: RecommendationData) => void;
  closeModal: () => void;
  selectFeedback: (feedbackType: FeedbackType) => void;
  submitFeedback: (comment?: string) => Promise<boolean>;

  // 히스토리 관리
  getFeedbackHistory: () => FeedbackData[];
  clearHistory: () => void;

  // 통계 계산
  calculateAccuracy: () => void;
  getRecentFeedbacks: (days: number) => FeedbackData[];
}

// Zustand 스토어 생성
export const useFeedbackStore = create<FeedbackStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isModalOpen: false,
      selectedFeedback: null,
      currentRecommendation: null,
      feedbackHistory: [],
      totalFeedbacks: 0,
      averageAccuracy: 0,

      // 피드백 모달 열기
      openModal: (recommendation: RecommendationData) => {
        set({
          isModalOpen: true,
          currentRecommendation: recommendation,
          selectedFeedback: null,
        });
      },

      // 피드백 모달 닫기
      closeModal: () => {
        set({
          isModalOpen: false,
          selectedFeedback: null,
          currentRecommendation: null,
        });
      },

      // 피드백 선택
      selectFeedback: (feedbackType: FeedbackType) => {
        set({ selectedFeedback: feedbackType });
      },

      // 피드백 제출
      submitFeedback: async (comment?: string): Promise<boolean> => {
        const { selectedFeedback, currentRecommendation, feedbackHistory } =
          get();

        if (!selectedFeedback || !currentRecommendation) {
          console.warn('피드백 또는 추천 데이터가 없습니다.');
          return false;
        }

        try {
          // 새 피드백 데이터 생성
          const newFeedback: FeedbackData = {
            id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            recommendationId: currentRecommendation.id,
            feedbackType: selectedFeedback,
            comment: comment?.trim() || undefined,
            weatherScore: currentRecommendation.weatherScore,
            submittedAt: new Date().toISOString(),
            weatherData: currentRecommendation.weatherData,
            outfitRecommendation: currentRecommendation.outfitRecommendation,
          };

          // 히스토리에 추가 (최신순으로 정렬)
          const updatedHistory = [newFeedback, ...feedbackHistory];

          // 상태 업데이트
          set({
            feedbackHistory: updatedHistory,
            totalFeedbacks: updatedHistory.length,
            isModalOpen: false,
            selectedFeedback: null,
            currentRecommendation: null,
          });

          // 정확도 재계산
          get().calculateAccuracy();

          console.log('피드백 제출 완료:', newFeedback);
          return true;
        } catch (error) {
          console.error('피드백 제출 오류:', error);
          return false;
        }
      },

      // 피드백 히스토리 조회
      getFeedbackHistory: () => {
        return get().feedbackHistory;
      },

      // 히스토리 초기화
      clearHistory: () => {
        set({
          feedbackHistory: [],
          totalFeedbacks: 0,
          averageAccuracy: 0,
        });
      },

      // 정확도 계산 (PERFECT 피드백 비율)
      calculateAccuracy: () => {
        const { feedbackHistory } = get();

        if (feedbackHistory.length === 0) {
          set({ averageAccuracy: 0 });
          return;
        }

        const perfectFeedbacks = feedbackHistory.filter(
          feedback => feedback.feedbackType === 'PERFECT',
        ).length;

        const accuracy = Math.round(
          (perfectFeedbacks / feedbackHistory.length) * 100,
        );

        set({ averageAccuracy: accuracy });
      },

      // 최근 N일간 피드백 조회
      getRecentFeedbacks: (days: number) => {
        const { feedbackHistory } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return feedbackHistory.filter(
          feedback => new Date(feedback.submittedAt) >= cutoffDate,
        );
      },
    }),
    {
      name: 'wout-feedback-store',
      partialize: state => ({
        // 모달 상태는 저장하지 않고, 히스토리와 통계만 영구 저장
        feedbackHistory: state.feedbackHistory,
        totalFeedbacks: state.totalFeedbacks,
        averageAccuracy: state.averageAccuracy,
      }),
    },
  ),
);

// 피드백 타입별 표시 정보
export const FEEDBACK_OPTIONS = {
  TOO_COLD: {
    emoji: '🥶',
    label: '너무 추웠어요',
    description: '더 두껍게 입을걸...',
    score: -2,
    color: 'text-blue-600',
  },
  SLIGHTLY_COLD: {
    emoji: '😐',
    label: '약간 추웠어요',
    description: '살짝 서늘했어요',
    score: -1,
    color: 'text-blue-400',
  },
  PERFECT: {
    emoji: '😊',
    label: '딱 맞았어요',
    description: '완벽한 추천!',
    score: 0,
    color: 'text-green-600',
  },
  SLIGHTLY_HOT: {
    emoji: '😅',
    label: '약간 더웠어요',
    description: '좀 더 가볍게...',
    score: 1,
    color: 'text-orange-400',
  },
  TOO_HOT: {
    emoji: '🔥',
    label: '너무 더웠어요',
    description: '땀이 났어요',
    score: 2,
    color: 'text-red-600',
  },
} as const;

// 피드백 유틸리티 함수들
export const feedbackUtils = {
  // 피드백 타입을 한글 레이블로 변환
  getFeedbackLabel: (type: FeedbackType): string => {
    return FEEDBACK_OPTIONS[type].label;
  },

  // 피드백 점수 계산
  getFeedbackScore: (type: FeedbackType): number => {
    return FEEDBACK_OPTIONS[type].score;
  },

  // 최근 피드백 트렌드 분석
  analyzeTrend: (
    feedbacks: FeedbackData[],
  ): 'IMPROVING' | 'STABLE' | 'DECLINING' => {
    if (feedbacks.length < 5) return 'STABLE';

    const recent = feedbacks.slice(0, 5);
    const older = feedbacks.slice(5, 10);

    const recentPerfect = recent.filter(
      f => f.feedbackType === 'PERFECT',
    ).length;
    const olderPerfect = older.filter(f => f.feedbackType === 'PERFECT').length;

    const recentAccuracy = recentPerfect / recent.length;
    const olderAccuracy = older.length > 0 ? olderPerfect / older.length : 0;

    if (recentAccuracy > olderAccuracy + 0.1) return 'IMPROVING';
    if (recentAccuracy < olderAccuracy - 0.1) return 'DECLINING';
    return 'STABLE';
  },
};
