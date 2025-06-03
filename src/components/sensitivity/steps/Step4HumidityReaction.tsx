'use client';

import { useSensitivityStore } from '@/store/sensitivityStore';

export default function Step4HumidityReaction() {
  const { humidityReaction, setHumidityReaction } = useSensitivityStore();

  const reactionOptions = [
    {
      value: 'high' as const,
      emoji: '🔴',
      title: '매우 끈적이고 답답함',
      description: '습도에 예민해요',
      color: 'red',
    },
    {
      value: 'medium' as const,
      emoji: '🟡',
      title: '약간 불편하지만 견딜만함',
      description: '보통 수준이에요',
      color: 'yellow',
    },
    {
      value: 'low' as const,
      emoji: '🟢',
      title: '별로 신경 쓰이지 않음',
      description: '습도에 둔감해요',
      color: 'green',
    },
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      red: isSelected
        ? 'border-red-500 bg-red-500 text-white'
        : 'border-red-200 bg-red-50 text-red-800 hover:border-red-300',
      yellow: isSelected
        ? 'border-yellow-500 bg-yellow-500 text-white'
        : 'border-yellow-200 bg-yellow-50 text-yellow-800 hover:border-yellow-300',
      green: isSelected
        ? 'border-green-500 bg-green-500 text-white'
        : 'border-green-200 bg-green-50 text-green-800 hover:border-green-300',
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">💧</div>
        <h2 className="text-2xl font-bold mb-3">습한 날씨의 불편함은?</h2>
        <p className="text-gray-600">비 오는 날이나 장마철 느낌을 알려주세요</p>
      </div>

      {/* 반응 옵션 */}
      <div className="flex-1 flex flex-col gap-4">
        {reactionOptions.map(option => {
          const isSelected = humidityReaction === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setHumidityReaction(option.value)}
              className={`
                p-5 rounded-xl border-2 transition-all text-left
                ${getColorClasses(option.color, isSelected)}
                ${isSelected ? 'scale-105 shadow-lg' : 'hover:shadow-md'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{option.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-base mb-1">
                    {option.title}
                  </div>
                  <div
                    className={`text-sm ${isSelected ? 'opacity-90' : 'opacity-75'}`}
                  >
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
