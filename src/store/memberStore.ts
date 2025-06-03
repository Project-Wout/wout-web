import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { memberApi } from '@/lib/api/member';
import { deviceUtils } from '@/lib/device-utils';
import type {
  MemberWithPreferenceResponse,
  WeatherPreferenceSetupRequest,
  MemberResponse,
  WeatherPreferenceResponse,
} from '@/types/member';

interface MemberState {
  // 회원 정보
  member: MemberResponse | null;
  weatherPreference: WeatherPreferenceResponse | null;
  isSetupCompleted: boolean;

  // UI 상태
  isLoading: boolean;
  error: string | null;

  // 액션들
  initializeMember: () => Promise<boolean>;
  saveWeatherPreference: (
    preferences: WeatherPreferenceSetupRequest,
  ) => Promise<boolean>;
  updateNickname: (nickname: string) => Promise<boolean>;
  checkSetupStatus: () => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      member: null,
      weatherPreference: null,
      isSetupCompleted: false,
      isLoading: false,
      error: null,

      // 앱 초기화 (회원 확인/생성)
      initializeMember: async (): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const deviceId = deviceUtils.getDeviceId();
          console.log('회원 초기화 시작:', deviceId);

          const response = await memberApi.initializeMember(deviceId);

          if (!response.success) {
            throw new Error(response.message || '회원 초기화 실패');
          }

          const data = response.data;
          const isCompleted = data.weatherPreference?.isSetupCompleted || false;

          set({
            member: data.member,
            weatherPreference: data.weatherPreference || null,
            isSetupCompleted: isCompleted,
            isLoading: false,
          });

          console.log('회원 초기화 완료:', {
            member: data.member,
            isSetupCompleted: isCompleted,
          });

          return true;
        } catch (error) {
          console.error('회원 초기화 실패:', error);
          set({
            error:
              error instanceof Error
                ? error.message
                : '회원 초기화에 실패했습니다',
            isLoading: false,
          });
          return false;
        }
      },

      // 날씨 선호도 저장
      saveWeatherPreference: async (
        preferences: WeatherPreferenceSetupRequest,
      ): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const deviceId = deviceUtils.getDeviceId();
          console.log('날씨 선호도 저장 시작:', preferences);

          const response = await memberApi.setupWeatherPreference(
            deviceId,
            preferences,
          );

          if (!response.success) {
            throw new Error(response.message || '날씨 선호도 저장 실패');
          }

          set({
            weatherPreference: response.data,
            isSetupCompleted: response.data.isSetupCompleted,
            isLoading: false,
          });

          console.log('날씨 선호도 저장 완료:', response.data);
          return true;
        } catch (error) {
          console.error('날씨 선호도 저장 실패:', error);
          set({
            error:
              error instanceof Error
                ? error.message
                : '날씨 선호도 저장에 실패했습니다',
            isLoading: false,
          });
          return false;
        }
      },

      // 닉네임 수정
      updateNickname: async (nickname: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const deviceId = deviceUtils.getDeviceId();
          const response = await memberApi.updateNickname(deviceId, nickname);

          if (!response.success) {
            throw new Error(response.message || '닉네임 수정 실패');
          }

          set({
            member: response.data,
            isLoading: false,
          });

          return true;
        } catch (error) {
          console.error('닉네임 수정 실패:', error);
          set({
            error:
              error instanceof Error
                ? error.message
                : '닉네임 수정에 실패했습니다',
            isLoading: false,
          });
          return false;
        }
      },

      // 설정 완료 상태 확인
      checkSetupStatus: async (): Promise<boolean> => {
        try {
          const deviceId = deviceUtils.getDeviceId();
          const response = await memberApi.checkSetupStatus(deviceId);

          if (response.success) {
            const isCompleted = response.data.isSetupCompleted;
            set({ isSetupCompleted: isCompleted });
            return isCompleted;
          }

          return false;
        } catch (error) {
          console.error('설정 상태 확인 실패:', error);
          return false;
        }
      },

      // 에러 클리어
      clearError: () => {
        set({ error: null });
      },

      // 스토어 초기화
      reset: () => {
        set({
          member: null,
          weatherPreference: null,
          isSetupCompleted: false,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'wout-member-store',
      partialize: state => ({
        // 회원 정보와 설정 완료 상태만 영구 저장
        member: state.member,
        weatherPreference: state.weatherPreference,
        isSetupCompleted: state.isSetupCompleted,
      }),
    },
  ),
);
