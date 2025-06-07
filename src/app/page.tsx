'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { APP_INFO, ROUTES } from '@/lib/constants';
import { deviceUtils } from '@/lib/device-utils';
import { useMemberStore } from '@/store/memberStore';

export default function HomePage() {
  const router = useRouter();
  const { checkMemberStatus } = useMemberStore();
  const [loading, setLoading] = useState(true);
  const [initializingText, setInitializingText] =
    useState('앱을 준비하는 중...');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 2.5초 스플래시 표시
        await new Promise(resolve => setTimeout(resolve, 2500));

        // 초기화 텍스트 변경
        setInitializingText('사용자 정보를 확인하는 중...');

        // deviceId 확인
        const hasDeviceId = deviceUtils.hasDeviceId();
        console.log('deviceId 존재 여부:', hasDeviceId);

        if (!hasDeviceId) {
          // 신규 사용자 → 온보딩
          console.log('신규 사용자 → 온보딩 페이지로 이동');
          router.push(ROUTES.onboarding);
          return;
        }

        // 기존 사용자 → 회원 상태 확인
        const deviceId = deviceUtils.getDeviceId();
        console.log('기존 사용자 → 회원 상태 확인:', deviceId);
        setInitializingText('회원 정보를 확인하는 중...');

        const status = await checkMemberStatus();

        if (!status) {
          // API 호출 실패 → 온보딩으로 이동 (안전장치)
          console.log('회원 상태 확인 실패 → 온보딩 페이지로 이동');
          router.push(ROUTES.onboarding);
          return;
        }

        console.log('회원 상태:', status);

        // 상태에 따른 페이지 이동
        if (!status.memberExists) {
          // 회원 없음 → 온보딩
          console.log('회원 없음 → 온보딩 페이지로 이동');
          router.push(ROUTES.onboarding);
        } else if (!status.isSetupCompleted) {
          // 회원 있지만 설정 미완료 → 민감도 설정
          console.log('설정 미완료 → 민감도 설정으로 이동');
          router.push('/sensitivity-setup');
        } else {
          // 회원 있고 설정 완료 → 메인 대시보드
          console.log('설정 완료 → 메인 대시보드로 이동');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('앱 초기화 오류:', error);
        // 오류 시 온보딩으로 이동 (안전장치)
        router.push(ROUTES.onboarding);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [router, checkMemberStatus]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-primary text-white relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 로고 아이콘 */}
        <motion.div
          className="w-32 h-32 bg-white/15 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 1,
          }}
        >
          <motion.span
            className="text-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            🌤️
          </motion.span>
        </motion.div>

        {/* 앱 이름 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            {APP_INFO.name}
          </h1>
          <p className="text-xl font-light opacity-90 tracking-wide">
            {APP_INFO.nameEn}
          </p>
        </motion.div>

        {/* 슬로건 */}
        <motion.p
          className="text-lg text-center opacity-90 mb-12 px-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {APP_INFO.description}
        </motion.p>

        {/* 로딩 애니메이션 */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="flex space-x-2 mb-4">
            {[0, 1, 2].map(index => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            ))}
          </div>
          <p className="text-sm opacity-70">{initializingText}</p>
        </motion.div>
      </div>

      {/* 하단 정보 */}
      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <p className="text-xs opacity-60">버전 {APP_INFO.version}</p>
      </motion.div>
    </div>
  );
}
