'use client';

import { useSensitivityStore } from '@/store/sensitivityStore';

export default function Step5AdjustmentSliders() {
  const { adjustments, setAdjustments } = useSensitivityStore();

  const handleAdjustmentChange = (
    key: keyof typeof adjustments,
    value: number,
  ) => {
    setAdjustments({ [key]: value });
  };

  const getValueText = (value: number): string => {
    if (value <= 20) return '매우 낮음';
    if (value <= 40) return '낮음';
    if (value <= 60) return '보통';
    if (value <= 80) return '높음';
    return '매우 높음';
  };

  const adjustmentItems = [
    {
      key: 'temp' as const,
      emoji: '🌡️',
      title: '기온 영향도',
      description: '온도가 조금만 달라져도 크게 신경 쓰이나요?',
      value: adjustments.temp,
    },
    {
      key: 'humidity' as const,
      emoji: '💧',
      title: '습도 영향도',
      description: '습한 날씨가 내 컨디션에 크게 영향을 주나요?',
      value: adjustments.humidity,
    },
    {
      key: 'uv' as const,
      emoji: '☀️',
      title: '자외선 영향도',
      description: '자외선이 있으면 꼭 차단하고 싶거나 신경 쓰이나요?',
      value: adjustments.uv,
    },
    {
      key: 'airquality' as const,
      emoji: '🌫️',
      title: '대기질 영향도',
      description: '미세먼지, 황사, 꽃가루가 외출 계획에 영향을 주나요?',
      value: adjustments.airquality,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-3">날씨 영향도 조정</h2>
        <p className="text-gray-600">
          더 정확한 날씨점수를 위한 세부 조정 (선택사항)
        </p>
      </div>

      {/* 설명 박스 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="text-center">
          <div className="text-orange-600 font-semibold mb-2">
            📊 날씨 요소별 영향도 설정
          </div>
          <div className="text-orange-800 text-sm">
            각 요소가 내 기분과 외출 의지에
            <br />
            얼마나 큰 영향을 주는지 설정해주세요
          </div>
        </div>
      </div>

      {/* 조정 슬라이더들 */}
      <div className="flex-1 space-y-6">
        {adjustmentItems.map(item => (
          <div key={item.key} className="space-y-3">
            {/* 라벨 */}
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            </div>

            {/* 슬라이더 */}
            <div className="px-2">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>별로 신경 안써요</span>
                <span>매우 중요해요</span>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                value={item.value}
                onChange={e =>
                  handleAdjustmentChange(item.key, parseInt(e.target.value))
                }
                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
              />

              <div className="text-center mt-2">
                <span className="text-sm font-semibold text-orange-600">
                  {getValueText(item.value)} ({item.value})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 text-center text-sm text-gray-500">
        💡 설정은 언제든지 변경할 수 있고, 사용할수록 더 정확해져요
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3);
        }
      `}</style>
    </div>
  );
}
