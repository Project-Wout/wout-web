'use client';

import { Card } from '@/components/ui/Card';
import { useWeatherStore } from '@/store/weatherStore';
import { useSensitivityStore } from '@/store/sensitivityStore';
import { RefreshCw, Star } from 'lucide-react';
import { useState } from 'react';
import OutfitCategory from './OutfitCategory';
import PersonalTip from './PersonalTip';

export default function OutfitRecommendation() {
  const { currentWeather, personalScore, personalFeelsLike, isLoading } =
    useWeatherStore();
  const { priorities, comfortTemperature, isCompleted } = useSensitivityStore();
  const [currentRecommendation, setCurrentRecommendation] = useState(0);

  if (!isCompleted) {
    return (
      <Card className="p-6 text-center">
        <div className="text-4xl mb-4">👕</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          개인 맞춤 옷차림 추천
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          민감도 설정을 완료하면
          <br />
          개인화된 옷차림을 추천해드려요
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          민감도 설정하기
        </button>
      </Card>
    );
  }

  if (isLoading || !currentWeather) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // 옷차림 추천 데이터 생성
  // generateOutfitRecommendations 함수 수정
  const generateOutfitRecommendations = () => {
    const feelsLike =
      personalFeelsLike?.calculated || currentWeather.current.feelsLike;
    const humidity = currentWeather.current.humidity;
    const windSpeed = currentWeather.current.windSpeed;
    const isColdSensitive =
      priorities.includes('cold') || comfortTemperature > 22;
    const isHeatSensitive = priorities.includes('heat');
    const isHumiditySensitive = priorities.includes('humidity');

    const recommendations = [];

    if (feelsLike <= 5) {
      // 매우 추운 날씨
      recommendations.push({
        id: 1,
        name: '한겨울 완전방한 스타일',
        categories: {
          top: {
            items: ['두꺼운 니트', '목폴라', '기모 후드티'],
            reason: '극한 추위 대비 두꺼운 상의 필수',
          },
          bottom: {
            items: ['기모 청바지', '패딩 바지', '털안감 슬랙스'],
            reason: '보온성 최우선, 두꺼운 소재 필수',
          },
          outer: {
            items: ['롱패딩', '무스탕', '두꺼운 코트'],
            reason: '바깥 활동 시 필수 아우터',
          },
          accessories: {
            items: ['목도리', '장갑', '모자', '마스크'],
            reason: '노출 부위 최소화 필요',
          },
        },
      });

      if (isColdSensitive) {
        recommendations.push({
          id: 2,
          name: '추위 민감형 레이어드',
          categories: {
            top: {
              items: ['히트텍 + 니트', '목폴라 + 베스트'],
              reason: '추위 많이 타시니 레이어드 필수',
            },
            bottom: {
              items: ['히트텍 레깅스 + 두꺼운 청바지', '기모 바지'],
              reason: '속옷부터 보온에 신경써야 해요',
            },
            outer: {
              items: ['두꺼운 패딩', '퍼 코트'],
              reason: '최고 보온성 아우터',
            },
            accessories: {
              items: ['털모자', '터치장갑', '목도리', '핫팩'],
              reason: '소품으로 보온 효과 극대화',
            },
          },
        });
      }
    } else if (feelsLike <= 10) {
      // 추운 날씨
      recommendations.push({
        id: 1,
        name: '겨울 데일리 스타일',
        categories: {
          top: {
            items: ['니트', '기모 후드티', '두꺼운 맨투맨'],
            reason: '적당한 보온성으로 활동성 확보',
          },
          bottom: {
            items: ['일반 청바지', '기모 없는 면바지', '울 팬츠'],
            reason: '기본 보온성만 있어도 충분',
          },
          outer: {
            items: ['패딩 조끼', '자켓', '코트'],
            reason:
              windSpeed > 3 ? '바람 때문에 외투 필수' : '외출 시 가벼운 외투',
          },
          accessories: {
            items: ['얇은 스카프', '장갑'],
            reason: '필요에 따라 소품 추가',
          },
        },
      });
    } else if (feelsLike <= 15) {
      // 쌀쌀한 날씨
      recommendations.push({
        id: 1,
        name: '가을/봄 쾌적 스타일',
        categories: {
          top: {
            items: ['얇은 니트', '맨투맨', '긴팔 티셔츠'],
            reason: '적당한 두께로 편안함',
          },
          bottom: {
            items: ['청바지', '면 치노팬츠', '얇은 슬랙스'],
            reason: '가벼운 소재로 활동성 좋게',
          },
          outer: {
            items: ['가디건', '얇은 자켓', '바람막이'],
            reason: '체온 조절용 겉옷',
          },
          accessories: {
            items: ['가벼운 스카프'],
            reason: '포인트 액세서리로 활용',
          },
        },
      });
    } else if (feelsLike <= 20) {
      // 선선한 날씨 (80점대 구간)
      recommendations.push({
        id: 1,
        name: '완벽한 날씨 캐주얼',
        categories: {
          top: {
            items: ['얇은 긴팔 티셔츠', '가벼운 셔츠', '얇은 블라우스'],
            reason: '가장 쾌적한 온도, 얇은 긴팔이 최적',
          },
          bottom: {
            items: ['청바지', '코튼 팬츠', '얇은 치노팬츠'],
            reason: '가벼운 소재의 긴바지로 적당한 보온성',
          },
          outer: {
            items: ['얇은 가디건', '셔츠 (겉옷용)'],
            reason: '선택사항 (실내외 온도차 대비)',
          },
          accessories: {
            items: ['선글라스'],
            reason: '햇빛 차단용',
          },
        },
      });

      recommendations.push({
        id: 2,
        name: '완벽한 날씨 세미정장',
        categories: {
          top: {
            items: ['얇은 니트', '블라우스', '셔츠'],
            reason: '조금 더 단정한 스타일로',
          },
          bottom: {
            items: ['슬랙스', '정장 팬츠', 'A라인 스커트'],
            reason: '세미 정장용 하의로 깔끔하게',
          },
          outer: {
            items: ['블레이저', '얇은 자켓'],
            reason: '정장 느낌의 겉옷',
          },
          accessories: {
            items: ['시계', '간단한 스카프'],
            reason: '포인트 액세서리',
          },
        },
      });
    } else if (feelsLike <= 25) {
      // 따뜻한 날씨
      recommendations.push({
        id: 1,
        name: '초여름 시원 스타일',
        categories: {
          top: {
            items: ['반팔 티셔츠', '얇은 반팔 셔츠', '민소매 블라우스'],
            reason: '시원한 반팔로 전환',
          },
          bottom: {
            items: ['얇은 면바지', '7부 팬츠', '무릎길이 스커트'],
            reason: '통풍 되는 긴바지나 적당한 길이 스커트',
          },
          outer: {
            items: ['얇은 가디건', '자외선 차단 셔츠'],
            reason: '실내 에어컨 대비용',
          },
          accessories: {
            items: ['모자', '선글라스', '가벼운 백'],
            reason: '자외선 차단 + 실용성',
          },
        },
      });

      if (humidity > 70 && isHumiditySensitive) {
        recommendations.push({
          id: 2,
          name: '습도 민감형 드라이 스타일',
          categories: {
            top: {
              items: ['속건 반팔', '메시 티셔츠', '린넨 셔츠'],
              reason: '습함을 싫어하시니 빠른 건조 소재로',
            },
            bottom: {
              items: ['속건 7부 팬츠', '린넨 바지', '쿨맥스 레깅스'],
              reason: '습기 배출 잘 되는 소재 중심',
            },
            outer: {
              items: ['통풍 자켓'],
              reason: '최소한의 겉옷, 통풍 중시',
            },
            accessories: {
              items: ['메시 모자', '쿨타월'],
              reason: '습도 대응 전용 아이템',
            },
          },
        });
      }
    } else {
      // 더운 날씨 (30도 이상)
      recommendations.push({
        id: 1,
        name: '한여름 극시원 스타일',
        categories: {
          top: {
            items: ['민소매', '쿨링 반팔', '얇은 나시'],
            reason: '최대한 시원하게, 소매 최소화',
          },
          bottom: {
            items: ['반바지', '쿨링 쇼츠', '짧은 원피스'],
            reason: '다리 시원함 우선, 짧은 길이',
          },
          outer: {
            items: ['자외선 차단복'],
            reason: '자외선 차단용으로만 필요시',
          },
          accessories: {
            items: ['넓은 모자', '선글라스', '쿨토시', '휴대용 선풍기'],
            reason: '강한 더위 대응 필수템',
          },
        },
      });

      if (isHeatSensitive) {
        recommendations.push({
          id: 2,
          name: '더위 민감형 극한 쿨링',
          categories: {
            top: {
              items: ['쿨링 민소매', 'UV차단 얇은 나시'],
              reason: '더위 많이 타시니 노출 최대화',
            },
            bottom: {
              items: ['쿨링 쇼츠', '린넨 반바지'],
              reason: '체온 낮춤 우선, 시원한 소재만',
            },
            outer: {
              items: ['에어컨 대비 얇은 가디건'],
              reason: '실내외 급격한 온도차만 고려',
            },
            accessories: {
              items: ['쿨링 타월', '아이스팩', 'UV차단 팔토시'],
              reason: '적극적인 체온 관리 도구',
            },
          },
        });
      }
    }

    return recommendations;
  };

  const recommendations = generateOutfitRecommendations();
  const currentOutfit =
    recommendations[currentRecommendation] || recommendations[0];

  const handleRefreshRecommendation = () => {
    setCurrentRecommendation(prev => (prev + 1) % recommendations.length);
  };

  return (
    <Card className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Star size={20} className="mr-2 text-yellow-500" />
          오늘의 옷차림 추천
        </h3>
        {recommendations.length > 1 && (
          <button
            onClick={handleRefreshRecommendation}
            className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <RefreshCw size={14} />
            다른 추천
          </button>
        )}
      </div>

      {/* 추천 이름 */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-blue-800 mb-1">
            {currentOutfit.name}
          </h4>
          {personalScore && (
            <p className="text-sm text-blue-600">
              날씨 점수 {personalScore.total}점에 최적화된 추천이에요
            </p>
          )}
        </div>
      </div>

      {/* 카테고리별 추천 */}
      <div className="space-y-4 mb-6">
        <OutfitCategory
          icon="👔"
          title="상의"
          items={currentOutfit.categories.top.items}
          reason={currentOutfit.categories.top.reason}
        />

        <OutfitCategory
          icon="👖"
          title="하의"
          items={currentOutfit.categories.bottom.items}
          reason={currentOutfit.categories.bottom.reason}
        />

        <OutfitCategory
          icon="🧥"
          title="외투"
          items={currentOutfit.categories.outer.items}
          reason={currentOutfit.categories.outer.reason}
        />

        <OutfitCategory
          icon="🎒"
          title="소품"
          items={currentOutfit.categories.accessories.items}
          reason={currentOutfit.categories.accessories.reason}
        />
      </div>

      {/* 개인 맞춤 팁 */}
      <PersonalTip
        weatherData={currentWeather}
        personalScore={personalScore}
        priorities={priorities}
        comfortTemperature={comfortTemperature}
      />

      {/* 추천 개수 표시 */}
      {recommendations.length > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentRecommendation(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentRecommendation
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
