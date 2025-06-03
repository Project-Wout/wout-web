'use client';

import { useSensitivityStore } from '@/store/sensitivityStore';
import { PRIORITY_OPTIONS } from '@/lib/constants';

export default function Step1PrioritySelection() {
  const { priorities, setPriorities } = useSensitivityStore();

  const handlePriorityToggle = (id: string) => {
    const newPriorities = [...priorities];
    const index = newPriorities.indexOf(id);

    if (index > -1) {
      // 이미 선택된 것을 제거
      newPriorities.splice(index, 1);
    } else if (newPriorities.length < 2) {
      // 2개 미만이면 추가
      newPriorities.push(id);
    } else {
      // 2개 선택된 상태에서 새로운 것 선택하면 첫 번째 제거하고 새것 추가
      newPriorities.shift();
      newPriorities.push(id);
    }

    setPriorities(newPriorities);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold mb-3">가장 괴로운 날씨 조합은?</h2>
        <p className="text-gray-600">외출하기 싫은 날씨를 2개 선택해주세요</p>
      </div>

      {/* 선택 상태 표시 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="text-center text-green-800 font-medium text-sm">
          {priorities.length === 0 && '2개를 선택해주세요 (0/2)'}
          {priorities.length === 1 && '1개 더 선택해주세요 (1/2)'}
          {priorities.length === 2 && '선택 완료! (2/2)'}
        </div>
        {priorities.length > 0 && (
          <div className="flex justify-center gap-2 mt-2">
            {priorities.map(priority => {
              const option = PRIORITY_OPTIONS.find(opt => opt.id === priority); // ⭐ value → id
              return (
                <span
                  key={priority}
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium"
                >
                  {option?.title} {/* ⭐ label → title */}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* 우선순위 선택 그리드 */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {PRIORITY_OPTIONS.map(option => {
          const isSelected = priorities.includes(option.id); // ⭐ value → id

          return (
            <button
              key={option.id} // ⭐ value → id
              onClick={() => handlePriorityToggle(option.id)} // ⭐ value → id
              className={`
                p-4 rounded-xl border-2 transition-all text-center
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500 text-white scale-105 shadow-lg'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              <div className="text-2xl mb-2">{option.emoji}</div>
              <div className="font-semibold text-sm mb-1">
                {option.title}
              </div>{' '}
              {/* ⭐ label → title */}
              <div className="text-xs opacity-75">{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
