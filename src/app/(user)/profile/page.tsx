'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSensitivityStore } from '@/store/sensitivityStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Settings,
  MapPin,
  Bell,
  History,
  MessageCircle,
  HelpCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const {
    priorities,
    comfortTemperature,
    skinReaction,
    humidityReaction,
    isCompleted,
    resetSetup,
  } = useSensitivityStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 사용자 타입 결정
  const getUserType = () => {
    if (priorities.includes('cold') || comfortTemperature > 22) {
      return { type: '추위를 많이 타는 타입', emoji: '🥶', color: 'blue' };
    }
    if (priorities.includes('heat')) {
      return { type: '더위를 많이 타는 타입', emoji: '🔥', color: 'red' };
    }
    if (priorities.includes('humidity')) {
      return { type: '습도에 민감한 타입', emoji: '💦', color: 'cyan' };
    }
    if (priorities.includes('uv')) {
      return { type: '자외선에 민감한 타입', emoji: '☀️', color: 'yellow' };
    }
    return { type: '일반적인 타입', emoji: '😊', color: 'green' };
  };

  const userType = getUserType();

  const handleResetSettings = () => {
    if (showResetConfirm) {
      resetSetup();
      router.push('/sensitivity-setup');
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  const menuItems = [
    {
      icon: Settings,
      title: '민감도 재조정',
      description: '날씨 체감 민감도 수정',
      onClick: () => router.push('/sensitivity-setup'),
      badge: null,
    },
    {
      icon: MapPin,
      title: '지역 설정',
      description: '기본 지역 변경',
      onClick: () => alert('지역 설정 기능 준비 중입니다'),
      badge: null,
    },
    {
      icon: Bell,
      title: '알림 설정',
      description: '푸시 알림 시간 설정',
      onClick: () => alert('알림 설정 기능 준비 중입니다'),
      badge: null,
    },
    {
      icon: History,
      title: '옷차림 히스토리',
      description: '지난 추천 기록',
      onClick: () => alert('히스토리 기능 준비 중입니다'),
      badge: null,
    },
    {
      icon: MessageCircle,
      title: '피드백 내역',
      description: '제공한 피드백 확인',
      onClick: () => alert('피드백 내역 기능 준비 중입니다'),
      badge: 'new',
    },
    {
      icon: HelpCircle,
      title: '도움말',
      description: '사용법 및 FAQ',
      onClick: () => alert('도움말 기능 준비 중입니다'),
      badge: null,
    },
    {
      icon: FileText,
      title: '이용약관',
      description: '서비스 약관 및 정책',
      onClick: () => alert('이용약관 기능 준비 중입니다'),
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* 프로필 정보 */}
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
              <span className="text-3xl">{userType.emoji}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">사용자님</h1>
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {userType.type}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* 현재 설정 */}
        {isCompleted && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-blue-200">
            <h2 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
              <Settings className="mr-2" size={20} />
              현재 설정
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">쾌적 온도</span>
                <span className="font-medium text-blue-800">
                  {comfortTemperature}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">주요 민감 요소</span>
                <span className="font-medium text-blue-800">
                  {priorities
                    .slice(0, 2)
                    .map(p => {
                      const labels = {
                        heat: '더위',
                        cold: '추위',
                        humidity: '습도',
                        wind: '바람',
                        uv: '자외선',
                        pollution: '공기질',
                      };
                      return labels[p as keyof typeof labels];
                    })
                    .join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">피부 민감도</span>
                <span className="font-medium text-blue-800">
                  {skinReaction === 'high'
                    ? '높음'
                    : skinReaction === 'medium'
                      ? '보통'
                      : '낮음'}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* 설정 메뉴 */}
        <Card className="mb-6 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-bold text-gray-800">설정</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {menuItems.slice(0, 3).map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full p-4 flex items-center text-left hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <item.icon size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    {item.description}
                  </div>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>
        </Card>

        {/* 내 데이터 메뉴 */}
        <Card className="mb-6 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-bold text-gray-800">내 데이터</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {menuItems.slice(3, 5).map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full p-4 flex items-center text-left hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <item.icon size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    {item.description}
                  </div>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>
        </Card>

        {/* 앱 정보 메뉴 */}
        <Card className="mb-6 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-bold text-gray-800">앱 정보</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {menuItems.slice(5, 7).map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full p-4 flex items-center text-left hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <item.icon size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    {item.description}
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>
        </Card>

        {/* 설정 초기화 */}
        <Card className="mb-8">
          <div className="p-4">
            <h3 className="font-medium text-gray-800 mb-3">위험 구역</h3>
            <Button
              variant={showResetConfirm ? 'primary' : 'outline'}
              onClick={handleResetSettings}
              className={`w-full ${showResetConfirm ? 'bg-red-500 hover:bg-red-600' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
            >
              {showResetConfirm ? '정말 초기화하시겠습니까?' : '설정 초기화'}
            </Button>
            {showResetConfirm && (
              <p className="text-xs text-red-500 mt-2 text-center">
                5초 후 자동으로 취소됩니다
              </p>
            )}
          </div>
        </Card>

        {/* 앱 정보 */}
        <div className="text-center text-gray-500 space-y-2">
          <div className="text-sm">와웃 v1.0.0</div>
          <div className="flex justify-center gap-4 text-xs">
            <button className="text-blue-500 hover:underline">
              개발자 문의
            </button>
            <button className="text-blue-500 hover:underline">
              리뷰 남기기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
