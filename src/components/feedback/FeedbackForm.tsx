'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';

interface FeedbackFormProps {
  comment: string;
  onCommentChange: (comment: string) => void;
}

export default function FeedbackForm({
  comment,
  onCommentChange,
}: FeedbackFormProps) {
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCommentChange(e.target.value);
  };

  const suggestedComments = [
    '바람이 생각보다 강했어요',
    '실내외 온도차가 컸어요',
    '습도 때문에 끈적했어요',
    '아침에는 추웠는데 점심에는 더워졌어요',
    '다리가 춥더라고요',
    '목 부분이 시원했으면 좋겠어요',
  ];

  const handleSuggestedClick = (suggestion: string) => {
    const currentComment = comment.trim();
    if (
      currentComment &&
      !currentComment.endsWith('.') &&
      !currentComment.endsWith('요')
    ) {
      onCommentChange(currentComment + '. ' + suggestion);
    } else {
      onCommentChange(
        currentComment ? currentComment + ' ' + suggestion : suggestion,
      );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        추가 의견 (선택사항)
      </h3>

      <div className="space-y-3">
        {/* 텍스트 영역 */}
        <div className="relative">
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="더 구체적인 피드백이 있다면 알려주세요..."
            className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={4}
            maxLength={500}
          />

          {/* 글자 수 표시 */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {comment.length}/500
          </div>
        </div>

        {/* 추천 댓글 */}
        {comment.length === 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-600">
              💡 이런 의견은 어떠세요?
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestedComments.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedClick(suggestion)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-800 transition-colors border border-transparent hover:border-blue-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 입력 가이드 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-2">📝 이런 정보가 도움돼요:</div>
            <ul className="space-y-1 text-xs">
              <li>• 특정 시간대의 체감 (아침/점심/저녁)</li>
              <li>• 특정 부위의 온도감 (목, 손, 발 등)</li>
              <li>• 실내외 온도차 경험</li>
              <li>• 바람, 습도, 햇빛에 대한 느낌</li>
              <li>• 옷차림 중 특히 좋았거나 아쉬웠던 부분</li>
            </ul>
          </div>
        </div>

        {/* 익명성 안내 */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>🔒</span>
          <span>모든 피드백은 개인화 추천 개선 목적으로만 사용됩니다</span>
        </div>
      </div>
    </div>
  );
}
