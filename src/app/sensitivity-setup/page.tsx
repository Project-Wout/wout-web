'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSensitivityStore } from '@/store/sensitivityStore';
import SensitivitySetup from '@/components/sensitivity/SensitivitySetup';

export default function SensitivitySetupPage() {
  const router = useRouter();
  const { isCompleted } = useSensitivityStore();

  // 설정 완료 시 대시보드로 자동 이동
  useEffect(() => {
    if (isCompleted) {
      console.log('페이지에서 완료 감지, 대시보드로 이동'); // 디버깅용
      router.push('/dashboard');
    }
  }, [isCompleted, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <SensitivitySetup />
    </div>
  );
}
