'use client';

import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Step2State } from '@/types/sensitivity';

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
  const [temperature, setTemperature] = useState(initialValue);

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
    setTemperature(parseInt(e.target.value));
  };

  const handleNext = () => {
    onNext({ comfortTemperature: temperature });
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
              key={temperature}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-6xl font-bold text-blue-500 mb-2 drop-shadow-lg"
            >
              {temperature}°C
            </motion.div>
            <div className="text-xl text-gray-600 font-semibold">
              {getTemperatureDescription(temperature)}
            </div>
          </div>

          {/* 슬라이더 */}
          <div className="mb-10 px-2">
            <div className="flex justify-between text-gray-600 text-sm font-semibold mb-3">
              <span>10°C</span>
              <span>20°C</span>
              <span>30°C</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="10"
                max="30"
                value={temperature}
                onChange={handleTemperatureChange}
                className="w-full h-3 bg-gradient-to-r from-blue-400 via-green-400 to-red-400 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background:
                    'linear-gradient(90deg, #60a5fa 0%, #34d399 50%, #f87171 100%)',
                }}
              />
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  background: white;
                  border: 4px solid #3b82f6;
                  cursor: pointer;
                  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                  transition: all 0.2s ease;
                }

                .slider::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
                }

                .slider::-moz-range-thumb {
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  background: white;
                  cursor: pointer;
                  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                  border: none;
                }
              `}</style>
            </div>
          </div>

          {/* 가이드 텍스트 */}
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

      {/* 네비게이션 버튼 */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={onPrev}
          className="flex-1 py-4 bg-transparent border-2 border-white/50 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
        >
          이전
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
        >
          다음
        </button>
      </div>
    </div>
  );
}
