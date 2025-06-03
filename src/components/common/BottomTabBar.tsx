'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Cloud, Shirt, User, LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string | number;
}

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  // ⭐ 탭바를 숨길 페이지들
  const hiddenPages = [
    '/', // 스플래시
    '/onboarding', // 온보딩
    '/sensitivity-setup', // 민감도 설정
  ];

  // ⭐ 현재 페이지가 숨김 목록에 있으면 렌더링 안함
  if (hiddenPages.includes(pathname)) {
    return null;
  }

  const tabs: TabItem[] = [
    {
      id: 'home',
      label: '홈',
      icon: Home,
      path: '/dashboard',
      badge: undefined,
    },
    {
      id: 'weather',
      label: '날씨',
      icon: Cloud,
      path: '/weather',
      badge: undefined,
    },
    {
      id: 'closet',
      label: '옷장',
      icon: Shirt,
      path: '/closet',
      badge: 'NEW',
    },
    {
      id: 'profile',
      label: '마이',
      icon: User,
      path: '/profile',
      badge: undefined,
    },
  ];

  const handleTabClick = (tab: TabItem) => {
    if (tab.path === '/closet') {
      alert(`${tab.label} 기능은 준비 중입니다! 🚀`);
      return;
    }

    router.push(tab.path);
  };

  const isActive = (tabPath: string): boolean => {
    if (tabPath === '/dashboard') {
      return pathname === '/' || pathname.includes('/dashboard');
    }
    if (tabPath === '/weather') {
      return pathname.includes('/weather');
    }
    if (tabPath === '/profile') {
      return pathname.includes('/profile');
    }
    return pathname === tabPath;
  };

  return (
    <>
      {/* 콘텐츠 여백을 위한 스페이서 - 모든 페이지에서 자동 적용 */}
      <div className="h-20" aria-hidden="true" />

      {/* 하단 탭바 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        {/* 그라데이션 페이드 효과 */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

        {/* 실제 탭바 */}
        <div className="relative bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg pointer-events-auto">
          <div className="flex items-center justify-around px-2 py-3 pb-safe">
            {tabs.map(tab => {
              const isTabActive = isActive(tab.path);
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    relative flex flex-col items-center justify-center min-w-0 flex-1 px-3 py-2 rounded-xl transition-all duration-300 active:scale-95
                    ${
                      isTabActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/80'
                    }
                  `}
                >
                  {/* 아이콘 영역 */}
                  <div className="relative">
                    <Icon
                      size={22}
                      className={`transition-all duration-300 ${
                        isTabActive ? 'scale-110' : 'scale-100'
                      }`}
                      strokeWidth={isTabActive ? 2.5 : 2}
                    />

                    {/* 배지 */}
                    {tab.badge && (
                      <div className="absolute -top-2 -right-2 animate-pulse">
                        {typeof tab.badge === 'string' ? (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium min-w-[18px] text-center shadow-sm">
                            {tab.badge}
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-sm">
                            {tab.badge > 99 ? '99+' : tab.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 라벨 */}
                  <span
                    className={`
                      text-xs font-medium mt-1.5 transition-all duration-300 leading-tight
                      ${isTabActive ? 'text-blue-600' : 'text-gray-600'}
                    `}
                  >
                    {tab.label}
                  </span>

                  {/* 활성 상태 인디케이터 - 더 눈에 띄게 */}
                  {isTabActive && (
                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 안전 영역을 위한 추가 패딩 (iPhone 홈 인디케이터) */}
          <div className="h-safe bg-white/95" />
        </div>
      </div>
    </>
  );
}
