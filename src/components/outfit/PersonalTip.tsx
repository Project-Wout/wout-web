'use client';

import { WeatherData, WeatherScore } from '@/types/weather';

interface PersonalTipProps {
  weatherData: WeatherData;
  personalScore: WeatherScore | null;
  comfortTemperature: number;
}

export default function PersonalTip({
  weatherData,
  personalScore,
  comfortTemperature,
}: PersonalTipProps) {
  const generatePersonalTip = (): {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';
  } => {
    const { current, airQuality } = weatherData;
    const isColdSensitive = comfortTemperature > 22;
    const isHeatSensitive = comfortTemperature > 22;
    const isHumiditySensitive = comfortTemperature > 22;

    // 우선순위에 따른 개인화 팁 생성
    if (isColdSensitive && current.temperature <= 10) {
      return {
        title: '추위 주의',
        message: '평소 추위를 많이 타시는 편이라 한 겹 더 입는 걸 추천해요!',
        type: 'warning',
      };
    }

    if (isHeatSensitive && current.temperature >= 25) {
      return {
        title: '더위 주의',
        message:
          '더위를 많이 타시니까 시원한 소재 위주로 입고, 에어컨 있는 곳 이동 시 얇은 겉옷 챙기세요!',
        type: 'warning',
      };
    }

    if (isHumiditySensitive && current.humidity >= 75) {
      return {
        title: '습도 높음',
        message:
          '습한 날씨를 특히 싫어하시는데 습도가 높아서 통풍 잘 되는 옷을 추천해요!',
        type: 'warning',
      };
    }

    // 긍정적인 팁들
    if (personalScore && personalScore.total >= 80) {
      if (isColdSensitive && current.temperature >= 20) {
        return {
          title: '완벽한 날씨',
          message:
            '평소 추위 타시는 분에게 딱 좋은 온도네요! 원하는 스타일로 자유롭게 입으세요 😊',
          type: 'success',
        };
      }

      if (isHeatSensitive && current.temperature <= 22) {
        return {
          title: '쾌적한 날씨',
          message:
            '더위 타시는 분에게 최적의 온도예요! 편안하게 입고 나가세요 😊',
          type: 'success',
        };
      }

      return {
        title: '좋은 날씨',
        message:
          '오늘은 날씨가 정말 좋네요! 편안하게 입고 즐거운 하루 보내세요 😊',
        type: 'success',
      };
    }

    // 일반적인 조언들
    if (current.windSpeed >= 4) {
      return {
        title: '바람 주의',
        message:
          '바람이 있어서 체감온도가 낮아요. 바람막이 자켓이나 후드를 챙기세요!',
        type: 'info',
      };
    }

    if (Math.abs(current.temperature - current.feelsLike) >= 3) {
      const diff = current.feelsLike - current.temperature;
      return {
        title: '체감온도 차이',
        message:
          diff > 0
            ? '습도 때문에 실제보다 더 덥게 느껴져요. 시원한 소재로 입으세요!'
            : '바람 때문에 실제보다 춥게 느껴져요. 한 겹 더 입으세요!',
        type: 'info',
      };
    }

    if (comfortTemperature >= 24) {
      return {
        title: '개인 맞춤 조언',
        message:
          '평소 따뜻한 온도를 선호하시니까 조금 더 따뜻하게 입는 걸 추천해요!',
        type: 'info',
      };
    }

    if (comfortTemperature <= 16) {
      return {
        title: '개인 맞춤 조언',
        message:
          '평소 시원한 온도를 선호하시니까 가볍게 입어도 괜찮을 것 같아요!',
        type: 'info',
      };
    }

    // 기본 팁
    return {
      title: '오늘의 포인트',
      message: '레이어드 스타일로 입으면 온도 변화에 쉽게 대응할 수 있어요!',
      type: 'info',
    };
  };

  const tip = generatePersonalTip();

  const getBackgroundStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      default:
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200';
    }
  };

  const getTextStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-orange-800';
      case 'success':
        return 'text-green-800';
      default:
        return 'text-blue-800';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✨';
      default:
        return '💡';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getBackgroundStyle(tip.type)}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">
          {getIcon(tip.type)}
        </span>
        <div className="flex-1">
          <h4 className={`font-semibold mb-2 ${getTextStyle(tip.type)}`}>
            {tip.title}
          </h4>
          <p className={`text-sm leading-relaxed ${getTextStyle(tip.type)}`}>
            {tip.message}
          </p>
        </div>
      </div>

      {/* 추가 정보 (필요시) */}
      {tip.type === 'warning' && (
        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
          <div className="flex items-center gap-2 text-xs opacity-75">
            <span>📱</span>
            <span>실시간 날씨 변화를 확인해보세요</span>
          </div>
        </div>
      )}
    </div>
  );
}
