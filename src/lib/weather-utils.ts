import {
  WeatherCondition,
  WeatherScore,
  PersonalFeelsLike,
} from '@/types/weather';
import { SensitivityData } from '@/types/sensitivity';
import { WEATHER_ICONS, SCORE_EMOJIS } from '@/types/weather';

/**
 * 체감온도 계산 (Wind Chill & Heat Index 고려)
 */
export function calculateFeelsLike(
  temperature: number,
  windSpeed: number,
  humidity: number,
): number {
  // Wind Chill (추위 체감온도) - 10도 이하 + 바람 있을 때
  if (temperature <= 10 && windSpeed > 1.6) {
    return (
      13.12 +
      0.6215 * temperature -
      11.37 * Math.pow(windSpeed, 0.16) +
      0.3965 * Math.pow(windSpeed, 0.16) * temperature
    );
  }

  // Heat Index (더위 체감온도) - 27도 이상 + 습도 40% 이상
  if (temperature >= 27 && humidity >= 40) {
    const T = temperature;
    const H = humidity;
    return (
      -8.78469475556 +
      1.61139411 * T +
      2.33854883889 * H +
      -0.14611605 * T * H +
      -0.012308094 * T * T +
      -0.0164248277778 * H * H +
      0.002211732 * T * T * H +
      0.00072546 * T * H * H +
      -0.000003582 * T * T * H * H
    );
  }

  // 일반적인 경우 - 기본 온도 반환
  return temperature;
}

/**
 * 개인별 체감온도 계산 (사용자 민감도 반영)
 */
export function calculatePersonalFeelsLike(
  actualTemp: number,
  windSpeed: number,
  humidity: number,
  sensitivityData: SensitivityData,
): PersonalFeelsLike {
  // 기본 체감온도 계산
  let feelsLike = calculateFeelsLike(actualTemp, windSpeed, humidity);

  // 개인 온도 보정 (쾌적온도 기준)
  const personalCorrection = (sensitivityData.comfortTemperature - 20) * 0.5;

  // 습도 보정 (습도 민감도에 따라)
  let humidityCorrection = 0;
  if (humidity > 70) {
    switch (sensitivityData.reactionHumidity) {
      case 'high':
        humidityCorrection = 3;
        break;
      case 'medium':
        humidityCorrection = 2;
        break;
      case 'low':
        humidityCorrection = 1;
        break;
    }
  }

  const totalAdjustment = personalCorrection + humidityCorrection;
  const finalFeelsLike = feelsLike + totalAdjustment;

  return {
    calculated: Math.round(finalFeelsLike * 10) / 10,
    adjustment: Math.round(totalAdjustment * 10) / 10,
    reason: generateFeelsLikeReason(personalCorrection, humidityCorrection),
  };
}

/**
 * 날씨 점수 계산 (개인 민감도 기반)
 */
export function calculateWeatherScore(
  temperature: number,
  humidity: number,
  windSpeed: number,
  airQuality: number,
  uvIndex: number,
  sensitivityData: SensitivityData,
) {
  // 각 요소별 점수 계산 (0-100)
  const tempScore = calculateTemperatureScore(temperature, sensitivityData);
  const humidityScore = calculateHumidityScore(humidity, sensitivityData);
  const windScore = calculateWindScore(windSpeed);
  const airScore = calculateAirQualityScore(airQuality);
  const uvScore = calculateUVScore(uvIndex, sensitivityData);

  // 가중치 적용 (사용자 설정 반영)
  const weights = {
    temperature: sensitivityData.adjustments?.temp || 50,
    humidity: sensitivityData.adjustments?.humidity || 50,
    wind: 30, // 고정값
    air: sensitivityData.adjustments?.airquality || 50,
    uv: sensitivityData.adjustments?.uv || 50,
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  // 가중 평균 계산
  const weightedScore =
    (tempScore * weights.temperature +
      humidityScore * weights.humidity +
      windScore * weights.wind +
      airScore * weights.air +
      uvScore * weights.uv) /
    totalWeight;

  // 우선순위 패널티 적용
  const penalizedScore = applyPriorityPenalties(
    weightedScore,
    { temperature, humidity, windSpeed, airQuality, uvIndex },
    sensitivityData.importanceCold,
    sensitivityData.importanceHeat,
    sensitivityData.importanceHumidity,
    sensitivityData.importanceUv,
    sensitivityData.importanceAir,
  );

  const finalScore = Math.max(0, Math.min(100, Math.round(penalizedScore)));

  return {
    total: finalScore,
    emoji: getScoreEmoji(finalScore),
    grade: getScoreGrade(finalScore),
    message: generateScoreMessage(finalScore, sensitivityData),
    breakdown: {
      temperature: Math.round(tempScore),
      humidity: Math.round(humidityScore),
      windSpeed: Math.round(windScore),
      airQuality: Math.round(airScore),
      uvIndex: Math.round(uvScore),
    },
  };
}

/**
 * 온도 점수 계산 (22도 기준 가우시안 분포)
 */
function calculateTemperatureScore(
  temp: number,
  sensitivity: SensitivityData,
): number {
  const optimal = 22;
  const userOptimal = sensitivity.comfortTemperature;
  const adjustedOptimal = (optimal + userOptimal) / 2;

  const deviation = Math.abs(temp - adjustedOptimal);
  const score = 100 * Math.exp(-Math.pow(deviation / 8, 2));

  return Math.max(0, score);
}

/**
 * 습도 점수 계산 (50-60% 최적)
 */
function calculateHumidityScore(
  humidity: number,
  sensitivity: SensitivityData,
): number {
  const optimal = 55;
  const deviation = Math.abs(humidity - optimal);
  let score = 100 - deviation * 2;

  // 습도 민감도 반영
  if (sensitivity.reactionHumidity === 'high' && humidity > 70) {
    score *= 0.7; // 30% 감점
  }

  return Math.max(0, score);
}

/**
 * 바람 점수 계산 (2-3m/s 적당)
 */
function calculateWindScore(windSpeed: number): number {
  if (windSpeed >= 2 && windSpeed <= 3) return 100;
  if (windSpeed < 1) return 80; // 무풍
  if (windSpeed > 7) return 20; // 강풍

  const deviation = windSpeed < 2 ? 2 - windSpeed : windSpeed - 3;
  return Math.max(20, 100 - deviation * 15);
}

/**
 * 대기질 점수 계산
 */
function calculateAirQualityScore(pm25: number): number {
  if (pm25 <= 15) return 100; // 좋음
  if (pm25 <= 35) return 80; // 보통
  if (pm25 <= 75) return 50; // 나쁨
  return 20; // 매우 나쁨
}

/**
 * 자외선 점수 계산
 */
function calculateUVScore(
  uvIndex: number,
  sensitivity: SensitivityData,
): number {
  let score = Math.max(0, 100 - uvIndex * 10);

  // 자외선 민감도 반영
  if (sensitivity.reactionUv === 'high' && uvIndex > 5) {
    score *= 0.6; // 40% 감점
  }

  return score;
}

/**
 * 우선순위 패널티 적용
 */
function applyPriorityPenalties(
  baseScore: number,
  weather: any,
  importanceCold: number,
  importanceHeat: number,
  importanceHumidity: number,
  importanceUv: number,
  importanceAir: number,
): number {
  let penalizedScore = baseScore;

  if (importanceCold > 0) {
    if (weather.temperature > 28) penalizedScore *= 0.3;
  }
  if (importanceHeat > 0) {
    if (weather.temperature < 8) penalizedScore *= 0.3;
  }
  if (importanceHumidity > 0) {
    if (weather.humidity > 80) penalizedScore *= 0.3;
  }
  if (importanceUv > 0) {
    if (weather.uvIndex > 8) penalizedScore *= 0.3;
  }
  if (importanceAir > 0) {
    if (weather.airQuality > 50) penalizedScore *= 0.3;
  }

  return penalizedScore;
}

/**
 * 점수에 따른 이모지 반환
 */
function getScoreEmoji(score: number): string {
  if (score >= 90) return '😊';
  if (score >= 70) return '🙂';
  if (score >= 50) return '😐';
  if (score >= 30) return '😰';
  return '😵';
}

/**
 * 점수에 따른 등급 반환
 */
function getScoreGrade(score: number): WeatherScore['grade'] {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 30) return 'poor';
  return 'terrible';
}

/**
 * 개인화된 점수 메시지 생성
 */
function generateScoreMessage(
  score: number,
  sensitivity: SensitivityData,
): string {
  const userType = getUserType(sensitivity);

  if (score >= 90) return `${userType}에게 완벽한 날씨예요!`;
  if (score >= 70) return `${userType}에게 좋은 날씨입니다`;
  if (score >= 50) return `${userType}에게 보통 날씨네요`;
  if (score >= 30) return `${userType}에게 조금 힘든 날씨예요`;
  return `${userType}에게 매우 힘든 날씨입니다`;
}

/**
 * 사용자 타입 추출
 */
function getUserType(sensitivity: SensitivityData): string {
  if (sensitivity.importanceCold > 0 || sensitivity.comfortTemperature > 22) {
    return '추위를 많이 타시는 분';
  }
  if (sensitivity.importanceHeat > 0) {
    return '더위를 많이 타시는 분';
  }
  if (sensitivity.importanceHumidity > 0) {
    return '습한 날씨를 싫어하시는 분';
  }
  return '일반적인 분';
}

/**
 * 체감온도 이유 생성
 */
function generateFeelsLikeReason(
  personalCorrection: number,
  humidityCorrection: number,
): string {
  const reasons = [];

  if (Math.abs(personalCorrection) > 1) {
    reasons.push(
      personalCorrection > 0 ? '더위를 많이 타셔서' : '추위를 많이 타셔서',
    );
  }

  if (humidityCorrection > 1) {
    reasons.push('습도 때문에');
  }

  return reasons.length > 0 ? `${reasons.join(', ')} 조정됨` : '표준 계산';
}

/**
 * 날씨 상태에 따른 아이콘 반환
 */
export function getWeatherIcon(condition: WeatherCondition): string {
  return WEATHER_ICONS[condition] || '🌤️';
}

/**
 * 시간 포맷팅 (24시간 → 12시간)
 */
export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  const hours = date.getHours();
  const ampm = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;
  return `${ampm} ${displayHours}시`;
}

/**
 * 온도 포맷팅
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}
