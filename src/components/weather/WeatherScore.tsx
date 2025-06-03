'use client';

import { Card } from '@/components/ui/Card';
import { useWeatherStore } from '@/store/weatherStore';
import { useSensitivityStore } from '@/store/sensitivityStore';
import { Info } from 'lucide-react';
import { useState } from 'react';

export default function WeatherScore() {
  const { personalScore, isLoading } = useWeatherStore();
  const { isCompleted } = useSensitivityStore();
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!isCompleted) {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          개인 맞춤 날씨 점수
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          민감도 설정을 완료하면
          <br />
          개인화된 날씨 점수를 확인할 수 있어요
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          민감도 설정하기
        </button>
      </Card>
    );
  }

  if (isLoading || !personalScore) {
    return (
      <Card className="p-6">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-blue-500 to-cyan-600';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    if (score >= 30) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-red-700';
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return '완벽한 날씨';
    if (score >= 70) return '좋은 날씨';
    if (score >= 50) return '보통 날씨';
    if (score >= 30) return '아쉬운 날씨';
    return '힘든 날씨';
  };

  const scoreColor = getScoreColor(personalScore.total);
  const scoreText = getScoreText(personalScore.total);

  return (
    <Card className="p-6 relative overflow-hidden">
      {/* 배경 그라데이션 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${scoreColor} opacity-10`}
      ></div>

      <div className="relative z-10">
        {/* 메인 점수 표시 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`text-6xl p-4 rounded-full bg-gradient-to-br ${scoreColor} text-white shadow-lg`}
            >
              {personalScore.emoji}
            </div>
          </div>

          <div className="mb-2">
            <span
              className={`text-4xl font-bold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}
            >
              {personalScore.total}점
            </span>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {scoreText}
          </h3>

          <p className="text-sm text-gray-600">{personalScore.message}</p>
        </div>

        {/* 상세 분석 토글 */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              상세 분석 보기
            </span>
            <div className="flex items-center">
              <Info size={16} className="text-gray-500 mr-2" />
              <span
                className={`transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
              >
                ▼
              </span>
            </div>
          </button>

          {/* 상세 분석 내용 */}
          {showBreakdown && (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {/* 온도 점수 */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🌡️</span>
                    <span className="text-sm font-medium">온도</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${personalScore.breakdown.temperature}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {personalScore.breakdown.temperature}
                    </span>
                  </div>
                </div>

                {/* 습도 점수 */}
                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">💧</span>
                    <span className="text-sm font-medium">습도</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{
                          width: `${personalScore.breakdown.humidity}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {personalScore.breakdown.humidity}
                    </span>
                  </div>
                </div>

                {/* 바람 점수 */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">💨</span>
                    <span className="text-sm font-medium">바람</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        className="h-full bg-gray-500 rounded-full"
                        style={{
                          width: `${personalScore.breakdown.windSpeed}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {personalScore.breakdown.windSpeed}
                    </span>
                  </div>
                </div>

                {/* 공기질 점수 */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🌫️</span>
                    <span className="text-sm font-medium">공기질</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${personalScore.breakdown.airQuality}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {personalScore.breakdown.airQuality}
                    </span>
                  </div>
                </div>

                {/* 자외선 점수 */}
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">☀️</span>
                    <span className="text-sm font-medium">자외선</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${personalScore.breakdown.uvIndex}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">
                      {personalScore.breakdown.uvIndex}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center mt-4">
                개인 민감도 설정에 따라 점수가 조정됩니다
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
