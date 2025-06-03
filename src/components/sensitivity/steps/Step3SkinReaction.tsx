'use client';

import { useSensitivityStore } from '@/store/sensitivityStore';

export default function Step3SkinReaction() {
  const { skinReaction, setSkinReaction } = useSensitivityStore();

  const reactionOptions = [
    {
      value: 'high' as const,
      emoji: '🔴',
      title: '민감하게 반응함',
      description: '자외선과 더위에 민감해요',
      color: 'red',
    },
    {
      value: 'medium' as const,
      emoji: '🟡',
      title: '가끔 붉어지거나 따가움',
      description: '평균적인 반응이에요',
      color: 'yellow',
    },
    {
      value: 'low' as const,
      emoji: '🟢',
      title: '거의 변화 없음',
      description: '둔감한 편이에요',
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
        <div className="text-4xl mb-4">☀️</div>
        <h2 className="text-2xl font-bold mb-3">여름 외출 후 피부 반응은?</h2>
        <p className="text-gray-600">자외선과 기온에 대한 민감도를 확인해요</p>
      </div>

      {/* 반응 옵션 */}
      <div className="flex-1 flex flex-col gap-4">
        {reactionOptions.map(option => {
          const isSelected = skinReaction === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setSkinReaction(option.value)}
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
