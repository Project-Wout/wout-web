import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SensitivityState } from '@/types/sensitivity';

export const useSensitivityStore = create<
  SensitivityState & {
    setCurrentStep: (step: 1 | 2 | 3) => void;
    nextStep: () => void;
    prevStep: () => void;
    completeSetup: () => void;
    setStep1: (data: SensitivityState['step1']) => void;
    setStep2: (data: SensitivityState['step2']) => void;
    setStep3: (data: SensitivityState['step3']) => void;
  }
>()(
  persist(
    (set, get) => ({
      step1: {
        reactionCold: null,
        reactionHeat: null,
        reactionHumidity: null,
        reactionUv: null,
        reactionAir: null,
      },
      step2: { comfortTemperature: 19 },
      step3: {
        importanceCold: 0.2,
        importanceHeat: 0.2,
        importanceHumidity: 0.2,
        importanceUv: 0.2,
        importanceAir: 0.2,
      },
      currentStep: 1,
      isLoading: false,
      error: null,
      isCompleted: false,
      setCurrentStep: step => set({ currentStep: step }),
      setStep1: data => set({ step1: data }),
      setStep2: data => set({ step2: data }),
      setStep3: data => set({ step3: data }),
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: (currentStep + 1) as 1 | 2 | 3 });
        }
      },
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as 1 | 2 | 3 });
        }
      },
      completeSetup: () => set({ isCompleted: true }),
    }),
    {
      name: 'sensitivity-settings',
      partialize: state => ({
        step1: state.step1,
        step2: state.step2,
        step3: state.step3,
        currentStep: state.currentStep,
        isLoading: state.isLoading,
        error: state.error,
        isCompleted: state.isCompleted,
      }),
    },
  ),
);
