'use client';
import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { useSensitivityStore } from '@/store/sensitivityStore';

export default function Step2TemperatureSlider() {
  const { comfortTemperature, setComfortTemperature } = useSensitivityStore();

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComfortTemperature(parseInt(e.target.value));
  };

  const getTemperatureDescription = (temp: number): string => {
    if (temp <= 12) return '매우 추움';
    if (temp <= 15) return '추움';
    if (temp <= 18) return '쌀쌀함';
    if (temp <= 21) return '선선함';
    if (temp <= 24) return '적당함';
    if (temp <= 27) return '따뜻함';
    return '더움';
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🌡️</div>
        <h2 className="text-2xl font-bold mb-3">
          긴팔을 입기 시작하는 온도는?
        </h2>
        <p className="text-gray-600">개인별 쾌적 온도를 알려주세요</p>
      </div>

      {/* 시나리오 설명 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="text-center">
          <div className="text-blue-600 font-semibold mb-2">🌤️ 상황</div>
          <div className="text-blue-800 text-sm">
            봄이나 가을, 맑은 날씨에
            <br />
            이제 긴팔을 입어야 겠다고 느끼는 온도는?
          </div>
        </div>
      </div>

      {/* 온도 슬라이더 */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          {/* 온도 표시 */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {comfortTemperature}°C
            </div>
            <div className="text-lg text-gray-600">
              {getTemperatureDescription(comfortTemperature)}
            </div>
          </div>

          {/* 슬라이더 */}
          <div className="px-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>10°C</span>
              <span>20°C</span>
              <span>30°C</span>
            </div>

            <input
              type="range"
              min="10"
              max="30"
              value={comfortTemperature}
              onChange={handleTemperatureChange}
              className="w-full h-2 bg-gradient-to-r from-blue-400 via-green-400 to-red-400 rounded-lg appearance-none cursor-pointer slider"
            />

            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: 3px solid #3b82f6;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
              }
              .slider::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: 3px solid #3b82f6;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
              }
            `}</style>
          </div>
        </div>

        {/* 가이드 텍스트 */}
        <div className="text-center text-sm text-gray-500">
          💡 보통은 18-20도 정도에서 선선하다고 느껴요
        </div>
      </div>
    </div>
  );
}
