'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFeedbackStore } from '@/store/feedbackStore';
import FeedbackOptions from './FeedbackOptions';
import FeedbackForm from './FeedbackForm';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData?: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
  };
  recommendedOutfit?: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  weatherData,
  recommendedOutfit,
}: FeedbackModalProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  const { submitFeedback } = useFeedbackStore();

  // viewport 높이 감지
  useEffect(() => {
    const updateViewportHeight = () => {
      const actualHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight,
      );
      setViewportHeight(actualHeight);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewportHeight, 150);
    });

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  // 모달 크기 계산 - 단순하고 명확하게
  const calculateModalDimensions = () => {
    const safeViewportHeight = viewportHeight || 800; // fallback
    const modalHeight = Math.min(safeViewportHeight * 0.88, 680);
    const contentHeight = modalHeight - 170; // 헤더(100px) + 버튼(70px) 고정

    return {
      modalHeight,
      contentHeight,
      minModalHeight: Math.min(480, modalHeight),
    };
  };

  const { modalHeight, contentHeight, minModalHeight } =
    calculateModalDimensions();

  const handleFeedbackSelect = (feedbackType: string) => {
    setSelectedFeedback(feedbackType);
  };

  const handleSubmit = async () => {
    if (!selectedFeedback || !weatherData) return;

    setIsSubmitting(true);

    try {
      // 기존 로직 유지
      const feedbackData = {
        feedbackType: selectedFeedback,
        comment: comment.trim(),
        weatherConditions: weatherData,
        recommendedOutfit,
        timestamp: new Date().toISOString(),
      };
      console.log('피드백 데이터:', feedbackData);

      // feedbackStore에 저장
      await saveFeedbackToStore(selectedFeedback, weatherData, comment);

      // 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      setTimeout(handleClose, 2000);
    } catch (error) {
      console.error('피드백 전송 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // feedbackStore 저장 로직 분리
  const saveFeedbackToStore = async (
    feedbackType: string,
    weatherData: NonNullable<FeedbackModalProps['weatherData']>,
    comment: string,
  ) => {
    const feedbackTypeMap: Record<string, any> = {
      too_cold: 'TOO_COLD',
      slightly_cold: 'SLIGHTLY_COLD',
      perfect: 'PERFECT',
      slightly_hot: 'SLIGHTLY_HOT',
      too_hot: 'TOO_HOT',
    };

    const mappedFeedbackType = feedbackTypeMap[feedbackType];
    if (!mappedFeedbackType) return;

    const recommendationData = {
      id: `rec_${Date.now()}`,
      weatherScore: 70, // 임시값
      weatherData: {
        temperature: weatherData.temperature,
        feelsLike: weatherData.feelsLike,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
      },
      outfitRecommendation: {
        top: '니트',
        bottom: '긴바지',
        outer: '바람막이',
        accessories: ['목도리'],
      },
      createdAt: new Date().toISOString(),
    };

    const store = useFeedbackStore.getState();
    store.openModal(recommendationData);
    store.selectFeedback(mappedFeedbackType);
    await store.submitFeedback(comment.trim() || undefined);
  };

  const handleClose = () => {
    setSelectedFeedback(null);
    setComment('');
    setIsSubmitting(false);
    setIsSubmitted(false);
    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 pb-4 px-4">
        {/* 배경 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* 모달 콘텐츠 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
          style={{
            maxHeight: `${modalHeight}px`,
            minHeight: `${minModalHeight}px`,
          }}
        >
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 relative flex-shrink-0">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <h2 className="text-lg font-bold mb-1">오늘 추천 어땠나요?</h2>
              <p className="text-sm opacity-90">
                실제로 입고 나가보니 어떠셨나요?
              </p>
            </div>
          </div>

          {/* 콘텐츠 영역 - 버튼까지 포함해서 스크롤 가능 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {!isSubmitted ? (
                <>
                  {/* 오늘의 추천 요약 */}
                  {(weatherData || recommendedOutfit) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-800 mb-2">
                          📋 오늘의 추천
                        </div>
                        <div className="space-y-1 text-sm text-blue-700">
                          {weatherData && (
                            <div>
                              {weatherData.temperature}°C (체감{' '}
                              {weatherData.feelsLike}°C) • 바람{' '}
                              {weatherData.windSpeed}m/s • 습도{' '}
                              {weatherData.humidity}%
                            </div>
                          )}
                          {recommendedOutfit && (
                            <div className="font-medium text-blue-800">
                              {recommendedOutfit}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 피드백 옵션 */}
                  <div>
                    <FeedbackOptions
                      selectedFeedback={selectedFeedback}
                      onFeedbackSelect={handleFeedbackSelect}
                    />
                  </div>

                  {/* 추가 의견 */}
                  <div className="border-t pt-3">
                    <FeedbackForm
                      comment={comment}
                      onCommentChange={setComment}
                    />
                  </div>

                  {/* 정보 박스 */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">💡</span>
                      <div>
                        <div className="text-sm font-semibold text-green-800 mb-1">
                          피드백의 힘!
                        </div>
                        <div className="text-xs text-green-700 leading-relaxed">
                          피드백을 주시면 내일부터 더 정확한 추천을 받을 수
                          있어요.
                          <br />
                          <strong>
                            3일간 학습하면 90% 정확도까지 향상됩니다.
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 버튼 영역 - 이제 스크롤 영역 안에 포함 */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSkip}
                        disabled={isSubmitting}
                        className="flex-1 py-3"
                      >
                        다음에 할게요
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={!selectedFeedback || isSubmitting}
                        className="flex-1 py-3"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            전송 중...
                          </div>
                        ) : (
                          '피드백 보내기'
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* 완료 메시지 */
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    피드백이 전송되었습니다!
                  </h3>
                  <p className="text-gray-600">
                    내일 더 정확한 추천을 받으실 수 있어요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
