import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SensitivityState } from '@/types/sensitivity';

export const useSensitivityStore = create<SensitivityState>()(
  persist(
    (set, get) => ({
      // 상태
      currentStep: 1,
      priorities: [],
      comfortTemperature: 20,
      skinReaction: null,
      humidityReaction: null,
      adjustments: {
        temp: 50,
        humidity: 50,
        uv: 50,
        airquality: 50,
      },
      isCompleted: false,
      isLoading: false,
      error: null,

      // 액션들
      setCurrentStep: step => set({ currentStep: step }),

      setPriorities: priorities => set({ priorities }),

      setComfortTemperature: temp => set({ comfortTemperature: temp }),

      setSkinReaction: reaction => set({ skinReaction: reaction }),

      setHumidityReaction: reaction => set({ humidityReaction: reaction }),

      setAdjustments: newAdjustments =>
        set(state => ({
          adjustments: { ...state.adjustments, ...newAdjustments },
        })),

      completeSetup: () => {
        console.log('completeSetup 호출됨'); // 디버깅용
        set({ isCompleted: true });
      },

      resetSetup: () =>
        set({
          currentStep: 1,
          priorities: [],
          comfortTemperature: 20,
          skinReaction: null,
          humidityReaction: null,
          adjustments: {
            temp: 50,
            humidity: 50,
            uv: 50,
            airquality: 50,
          },
          isCompleted: false,
          isLoading: false,
          error: null,
        }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 5) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
    }),
    {
      name: 'sensitivity-settings',
      partialize: state => ({
        currentStep: state.currentStep,
        priorities: state.priorities,
        comfortTemperature: state.comfortTemperature,
        skinReaction: state.skinReaction,
        humidityReaction: state.humidityReaction,
        adjustments: state.adjustments,
        isCompleted: state.isCompleted,
      }),
    },
  ),
);
