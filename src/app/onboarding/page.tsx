'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ONBOARDING_PAGES, ROUTES } from '@/lib/constants';
import { deviceUtils } from '@/lib/device-utils';
import { useMemberStore } from '@/store/memberStore';

export default function OnboardingPage() {
  const router = useRouter();
  const { initializeMember } = useMemberStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = ONBOARDING_PAGES.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      // 마지막 페이지에서 회원 생성 후 민감도 설정으로 이동
      handleOnboardingComplete();
    }
  };

  const handleOnboardingComplete = async () => {
    setIsLoading(true);

    try {
      console.log('온보딩 완료 → 회원 생성 시작');

      // deviceId 생성 (이미 생성되어 있을 수도 있음)
      const deviceId = deviceUtils.getDeviceId();
      console.log('생성된 deviceId:', deviceId);

      // 회원 생성
      const success = await initializeMember();

      if (success) {
        console.log('회원 생성 완료 → 민감도 설정으로 이동');
        router.push(ROUTES.sensitivitySetup);
      } else {
        console.error('회원 생성 실패');
        // 실패해도 민감도 설정으로 이동 (로컬에서라도 진행)
        router.push(ROUTES.sensitivitySetup);
      }
    } catch (error) {
      console.error('온보딩 완료 처리 오류:', error);
      // 오류 발생해도 민감도 설정으로 이동
      router.push(ROUTES.sensitivitySetup);
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-primary text-white relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-40 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentPage}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="text-center max-w-sm"
          >
            {/* 아이콘 */}
            <motion.div
              className="text-8xl mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
            >
              {ONBOARDING_PAGES[currentPage].icon}
            </motion.div>

            {/* 제목 */}
            <motion.h1
              className="text-3xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {ONBOARDING_PAGES[currentPage].title}
            </motion.h1>

            {/* 설명 */}
            <motion.p
              className="text-lg opacity-90 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {ONBOARDING_PAGES[currentPage].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 네비게이션 */}
      <div className="relative z-10 px-8 pb-8">
        {/* 페이지 인디케이터 */}
        <div className="flex justify-center items-center mb-8">
          {ONBOARDING_PAGES.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                index === currentPage
                  ? 'bg-white scale-125'
                  : 'bg-white/40 scale-100'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>

        {/* 다음 버튼 */}
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            variant="secondary"
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-50 font-bold"
            disabled={isLoading}
          >
            <span className="flex items-center justify-center">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  준비중...
                </>
              ) : (
                <>
                  {currentPage === totalPages - 1 ? '시작하기' : '다음'}
                  <ChevronRight size={20} className="ml-2" />
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
