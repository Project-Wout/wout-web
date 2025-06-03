'use client';

interface OutfitCategoryProps {
  icon: string;
  title: string;
  items: string[];
  reason: string;
}

export default function OutfitCategory({
  icon,
  title,
  items,
  reason,
}: OutfitCategoryProps) {
  return (
    <div className="bg-gray-50 border-l-4 border-blue-500 rounded-lg p-4">
      {/* 카테고리 헤더 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{icon}</span>
        <h4 className="text-base font-semibold text-gray-800">{title}</h4>
      </div>

      {/* 추천 아이템들 */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-default"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 추천 이유 */}
      <div className="flex items-start gap-2">
        <span className="text-sm text-blue-600 mt-0.5">💡</span>
        <p className="text-sm text-blue-700 font-medium leading-relaxed">
          {reason}
        </p>
      </div>
    </div>
  );
}
