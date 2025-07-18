'use client';

import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Step2State } from '@/types/sensitivity';
import { useSensitivityStore } from '@/store/sensitivityStore';

interface Props {
  onNext: (data: Step2State) => void;
  onPrev: () => void;
  initialValue?: number;
}

export default function SensitivityStep2({
  onNext,
  onPrev,
  initialValue = 19,
}: Props) {
  const { step2, setStep2 } = useSensitivityStore();

  // 온도별 설명
  const getTemperatureDescription = (temp: number) => {
    if (temp <= 12) return '매우 추움';
    if (temp <= 15) return '추움';
    if (temp <= 18) return '쌀쌀함';
    if (temp <= 21) return '선선함';
    if (temp <= 24) return '적당함';
    if (temp <= 27) return '따뜻함';
    return '더움';
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep2({ comfortTemperature: parseInt(e.target.value) });
  };

  const handleNext = () => {
    onNext(step2);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 메인 콘텐츠 */}
      <Card
        variant="elevated"
        padding="lg"
        className="mb-6 text-gray-900 flex-1"
      >
        <CardHeader className="text-center">
          <div className="text-5xl mb-4">🌡️</div>
          <h2 className="text-2xl font-bold mb-2">
            긴팔을 입기 시작하는 온도는?
          </h2>
          <p className="text-gray-600">개인별 쾌적 온도를 알려주세요</p>
        </CardHeader>

        <CardContent>
          {/* 상황 설명 */}
          <Card
            variant="outlined"
            padding="md"
            className="bg-blue-50 border-blue-200 text-center mb-8"
          >
            <div className="text-blue-600 font-semibold text-sm mb-2">
              🌤️ 상황
            </div>
            <div className="text-blue-800 text-xs leading-relaxed">
              봄이나 가을, 맑은 날씨에
              <br />
              이제 긴팔을 입어야 겠다고 느끼는 온도는?
            </div>
          </Card>

          {/* 온도 표시 */}
          <div className="text-center mb-10">
            <motion.div
              key={step2.comfortTemperature}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-6xl font-bold text-blue-500 mb-2 drop-shadow-lg"
            >
              {step2.comfortTemperature}°C
            </motion.div>
            <div className="text-xl text-gray-600 font-semibold">
              {getTemperatureDescription(step2.comfortTemperature)}
            </div>
          </div>

          {/* 슬라이더 */}
          <input
            type="range"
            min={10}
            max={30}
            value={step2.comfortTemperature}
            onChange={handleTemperatureChange}
            className="w-full accent-blue-500 mb-4"
          />

          <Card
            variant="outlined"
            padding="sm"
            className="bg-gray-50 border-l-4 border-blue-500"
          >
            <p className="text-gray-600 text-sm text-center">
              💡 보통은 18-20도 정도에서 선선하다고 느껴요
            </p>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
