'use client';

interface FeedbackOptionsProps {
  selectedFeedback: string | null;
  onFeedbackSelect: (feedbackType: string) => void;
}

export default function FeedbackOptions({
  selectedFeedback,
  onFeedbackSelect,
}: FeedbackOptionsProps) {
  const feedbackOptions = [
    {
      id: 'too_cold',
      emoji: '🥶',
      title: '너무 추웠어요',
      description: '더 두껍게 입을걸...',
      score: -2,
      color: 'blue',
    },
    {
      id: 'slightly_cold',
      emoji: '😐',
      title: '약간 추웠어요',
      description: '살짝 서늘했어요',
      score: -1,
      color: 'indigo',
    },
    {
      id: 'perfect',
      emoji: '😊',
      title: '딱 맞았어요',
      description: '완벽한 추천!',
      score: 0,
      color: 'green',
    },
    {
      id: 'slightly_hot',
      emoji: '😅',
      title: '약간 더웠어요',
      description: '좀 더 가볍게...',
      score: 1,
      color: 'orange',
    },
    {
      id: 'too_hot',
      emoji: '🔥',
      title: '너무 더웠어요',
      description: '땀이 났어요',
      score: 2,
      color: 'red',
    },
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      blue: {
        selected: 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105',
        unselected:
          'border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-300 hover:bg-blue-100',
      },
      indigo: {
        selected:
          'border-indigo-500 bg-indigo-500 text-white shadow-lg scale-105',
        unselected:
          'border-indigo-200 bg-indigo-50 text-indigo-800 hover:border-indigo-300 hover:bg-indigo-100',
      },
      green: {
        selected:
          'border-green-500 bg-green-500 text-white shadow-lg scale-105',
        unselected:
          'border-green-200 bg-green-50 text-green-800 hover:border-green-300 hover:bg-green-100',
      },
      orange: {
        selected:
          'border-orange-500 bg-orange-500 text-white shadow-lg scale-105',
        unselected:
          'border-orange-200 bg-orange-50 text-orange-800 hover:border-orange-300 hover:bg-orange-100',
      },
      red: {
        selected: 'border-red-500 bg-red-500 text-white shadow-lg scale-105',
        unselected:
          'border-red-200 bg-red-50 text-red-800 hover:border-red-300 hover:bg-red-100',
      },
    };

    const colors = colorMap[color as keyof typeof colorMap];
    return isSelected ? colors.selected : colors.unselected;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        체감 온도는 어떠셨나요?
      </h3>

      <div className="space-y-3">
        {feedbackOptions.map(option => {
          const isSelected = selectedFeedback === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onFeedbackSelect(option.id)}
              className={`
                w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${getColorClasses(option.color, isSelected)}
              `}
            >
              <div className="flex items-center gap-4">
                {/* 이모지와 점수 */}
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <div
                    className={`
                    text-xs font-bold px-2 py-1 rounded-full
                    ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-gray-600'
                    }
                  `}
                  >
                    {option.score > 0 ? '+' : ''}
                    {option.score}
                  </div>
                </div>

                {/* 텍스트 콘텐츠 */}
                <div className="flex-1">
                  <div className="font-semibold text-base mb-1">
                    {option.title}
                  </div>
                  <div
                    className={`text-sm ${isSelected ? 'text-white/90' : 'opacity-75'}`}
                  >
                    {option.description}
                  </div>
                </div>

                {/* 선택 표시 */}
                {isSelected && (
                  <div className="text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 도움말 텍스트 */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          선택하신 피드백은 내일 추천 개선에 반영됩니다
        </p>
      </div>
    </div>
  );
}
