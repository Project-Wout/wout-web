'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { SensitivityData, Step1State } from '@/types/sensitivity';
import { ReactionLevel } from '@/types/common';
import { useSensitivityStore } from '@/store/sensitivityStore';

interface SensitivityCardData {
  element: keyof Step1State;
  title: string;
  description: string;
  emoji: string;
  options: {
    value: ReactionLevel;
    label: string;
    emoji: string;
  }[];
}

interface Props {
  onNext: (data: Step1State) => void; // SensitivityData → Step1State
  onPrev: () => void;
}

// 카드 데이터 정의
const sensitivityCards: SensitivityCardData[] = [
  {
    element: 'reactionCold',
    title: '추위를 얼마나 타시나요?',
    description: '겨울철 체감온도나 냉방 환경에서의 반응',
    emoji: '🧊',
    options: [
      { value: 'low', label: '잘 안타요', emoji: '😎' },
      { value: 'medium', label: '보통', emoji: '😐' },
      { value: 'high', label: '많이 타요', emoji: '🥶' },
    ],
  },
  {
    element: 'reactionHeat',
    title: '더위를 얼마나 타시나요?',
    description: '여름철 무더위나 사우나 같은 환경에서의 반응',
    emoji: '🔥',
    options: [
      { value: 'low', label: '잘 안타요', emoji: '😎' },
      { value: 'medium', label: '보통', emoji: '😐' },
      { value: 'high', label: '많이 타요', emoji: '🥵' },
    ],
  },
  {
    element: 'reactionHumidity',
    title: '습한 날씨는 어떠세요?',
    description: '장마철이나 비 온 후의 끈적한 느낌',
    emoji: '💧',
    options: [
      { value: 'low', label: '괜찮아요', emoji: '😊' },
      { value: 'medium', label: '보통', emoji: '😐' },
      { value: 'high', label: '싫어해요', emoji: '😣' },
    ],
  },
  {
    element: 'reactionUv',
    title: '햇볕은 어떠세요?',
    description: '자외선에 대한 피부 반응이나 따가움',
    emoji: '☀️',
    options: [
      { value: 'low', label: '괜찮아요', emoji: '😊' },
      { value: 'medium', label: '보통', emoji: '😐' },
      { value: 'high', label: '예민해요', emoji: '😵' },
    ],
  },
  {
    element: 'reactionAir',
    title: '미세먼지는 어떠세요?',
    description: '공기질 나쁜 날의 호흡기 불편함',
    emoji: '🌫️',
    options: [
      { value: 'low', label: '둔감해요', emoji: '😊' },
      { value: 'medium', label: '보통', emoji: '😐' },
      { value: 'high', label: '민감해요', emoji: '😷' },
    ],
  },
];

export default function SensitivityStep1({ onNext, onPrev }: Props) {
  const { step1, setStep1 } = useSensitivityStore();

  const isComplete = Object.values(step1).every(value => value !== null);

  const getSelectedSummary = () => {
    return Object.entries(step1)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => {
        const card = sensitivityCards.find(c => c.element === key);
        const option = card?.options.find(o => o.value === value);
        return option ? `${card?.emoji} ${option.label}` : '';
      })
      .filter(Boolean);
  };

  const handleOptionSelect = (
    element: keyof Step1State,
    value: ReactionLevel,
  ) => {
    setStep1({ ...step1, [element]: value });
  };

  const handleNext = () => {
    if (isComplete) {
      onNext(step1);
    }
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
          <h2 className="text-xl font-bold mb-2">날씨 민감도를 알려주세요</h2>
          <p className="text-gray-600 text-sm">
            각 요소별로 얼마나 민감하신지 선택해주세요
          </p>
        </CardHeader>

        <CardContent>
          {/* 완료 상태 표시 */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-6"
            >
              <div className="text-green-700 font-semibold text-sm mb-2">
                ✅ 설정 완료!
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {getSelectedSummary().map((item, index) => (
                  <span
                    key={index}
                    className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* 민감도 카드들 */}
          <div className="space-y-5">
            {sensitivityCards.map((card, index) => (
              <motion.div
                key={card.element}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant="outlined"
                  padding="md"
                  hover
                  className="transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{card.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">
                          {card.title}
                        </h3>
                        <p className="text-gray-500 text-xs">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex gap-2">
                      {card.options.map(option => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleOptionSelect(card.element, option.value)
                          }
                          className={cn(
                            'flex-1 p-3 border-2 rounded-xl text-center transition-all',
                            step1[card.element] === option.value
                              ? 'border-blue-500 bg-blue-500 text-white scale-105'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:-translate-y-1',
                          )}
                        >
                          <div className="text-lg mb-1">{option.emoji}</div>
                          <div className="text-xs font-semibold">
                            {option.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
