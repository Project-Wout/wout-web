import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { deviceUtils } from '@/lib/device-utils';
import { memberApi } from '@/lib/api/member';
import {
  MemberResponse,
  MemberStatusResponse,
  WeatherPreferenceResponse,
  WeatherPreferenceSetupRequest,
  WeatherPreferenceUpdateRequest,
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
  checkMemberStatus: () => Promise<MemberStatusResponse | null>;

  setupWithPreference: (
    preferences: WeatherPreferenceSetupRequest,
  ) => Promise<boolean>;

  getMemberWithPreference: () => Promise<boolean>;

  updateWeatherPreference: (
    request: WeatherPreferenceUpdateRequest,
  ) => Promise<boolean>;

  updateNickname: (nickname: string) => Promise<boolean>;

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

      // 🆕 회원 상태 확인 (스플래시용)
      checkMemberStatus: async (): Promise<MemberStatusResponse | null> => {
        set({ isLoading: true, error: null });

        try {
          const deviceId = deviceUtils.getDeviceId();

          const response = await memberApi.checkMemberStatus(deviceId);

          if (!response.success || !response.data) {
            throw new Error(response.message);
          }

          set({ isLoading: false });

          return response.data;
        } catch (error) {
          console.error('회원 상태 확인 실패:', error);
          set({
            error:
              error instanceof Error
                ? error.message
                : '회원 상태 확인에 실패했습니다',
            isLoading: false,
          });
          return null;
        }
      },

      // 🆕 민감도 설정과 동시에 회원 생성 (신규 사용자용)
      setupWithPreference: async (
        preferences: WeatherPreferenceSetupRequest,
      ): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const deviceId = deviceUtils.getDeviceId();
          console.log('민감도 설정 + 회원 생성 시작:', preferences);

          const response = await memberApi.setupWithPreference(
            deviceId,
            preferences,
          );

          if (!response.success || !response.data) {
            throw new Error(response.message || '민감도 설정 + 회원 생성 실패');
          }

          set({
            weatherPreference: response.data,
            isSetupCompleted: true, // 날씨 선호도가 있으면 설정 완료로 간주
            isLoading: false,
          });

          console.log('민감도 설정 + 회원 생성 완료:', response.data);
          return true;
        } catch (error) {
          console.error('민감도 설정 + 회원 생성 실패:', error);
          console.error('에러 상세:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
          });

          set({
            error:
              error instanceof Error
                ? error.message
                : '민감도 설정 + 회원 생성에 실패했습니다',
            isLoading: false,
          });
          return false;
        }
      },

      // 🆕 기존 회원 정보 + 선호도 조회 (대시보드용)
      getMemberWithPreference: async (): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const deviceId = deviceUtils.getDeviceId();
          console.log('회원 정보 + 선호도 조회 시작:', deviceId);

          const response = await memberApi.getMemberWithPreference(deviceId);

          if (!response.success || !response.data) {
            throw new Error(response.message || '회원 정보 조회 실패');
          }

          const data = response.data;
          const isCompleted = !!data.weatherPreference;

          set({
            member: data.member,
            weatherPreference: data.weatherPreference || null,
            isSetupCompleted: isCompleted,
            isLoading: false,
          });

          console.log('회원 정보 + 선호도 조회 완료:', {
            member: data.member,
            isSetupCompleted: isCompleted,
          });

          return true;
        } catch (error) {
          console.error('회원 정보 + 선호도 조회 실패:', error);

          // 404 또는 500 에러인 경우 목업 데이터 사용 (백엔드 준비되지 않음)
          if (
            error instanceof Error &&
            (error.message.includes('404') || error.message.includes('500'))
          ) {
            console.log('백엔드 API가 준비되지 않음 → 목업 데이터 사용');

            const currentDeviceId = deviceUtils.getDeviceId();

            // 목업 회원 데이터
            const mockMember = {
              id: 1,
              deviceId: currentDeviceId,
              nickname: '사용자',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            const mockWeatherPreference = {
              id: 1,
              memberId: 1,
              reactionCold: 'medium' as const,
              reactionHeat: 'medium' as const,
              reactionHumidity: 'medium' as const,
              reactionUv: 'medium' as const,
              reactionAir: 'medium' as const,
              importanceCold: 20,
              importanceHeat: 20,
              importanceHumidity: 20,
              importanceUv: 20,
              importanceAir: 20,
              comfortTemperature: 22,
              personalTempCorrection: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            set({
              member: mockMember,
              weatherPreference: mockWeatherPreference,
              isSetupCompleted: true,
              isLoading: false,
              error: null,
            });

            return true;
          }

          set({
            error:
              error instanceof Error
                ? error.message
                : '회원 정보 조회에 실패했습니다',
            isLoading: false,
          });
          return false;
        }
      },

      // 🔧 날씨 선호도 수정 (기존 회원용)
      updateWeatherPreference: async (
        request: WeatherPreferenceUpdateRequest,
      ): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const deviceId = deviceUtils.getDeviceId();
          console.log('날씨 선호도 수정 시작:', request);

          const response = await memberApi.updateWeatherPreference(
            deviceId,
            request,
          );

          if (!response.success || !response.data) {
            throw new Error(response.message || '날씨 선호도 수정 실패');
          }

          set({
            weatherPreference: response.data,
            isSetupCompleted: true, // 날씨 선호도가 있으면 설정 완료로 간주
            isLoading: false,
          });

          console.log('날씨 선호도 수정 완료:', response.data);
          return true;
        } catch (error) {
          console.error('날씨 선호도 수정 실패:', error);
          set({
            error:
              error instanceof Error
                ? error.message
                : '날씨 선호도 수정에 실패했습니다',
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

          if (!response.success || !response.data) {
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
