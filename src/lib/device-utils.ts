const DEVICE_ID_KEY = 'wout-device-id';

export const deviceUtils = {
  // deviceId 생성 또는 조회
  getDeviceId(): string {
    if (typeof window === 'undefined') {
      // SSR 환경에서는 임시 ID 반환
      return `temp_${Date.now()}`;
    }

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  },

  // deviceId 초기화
  resetDeviceId(): string {
    const newDeviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (typeof window !== 'undefined') {
      localStorage.setItem(DEVICE_ID_KEY, newDeviceId);
    }

    return newDeviceId;
  },

  // deviceId 존재 여부 확인
  hasDeviceId(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem(DEVICE_ID_KEY) !== null;
  },

  // deviceId 삭제
  clearDeviceId(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEVICE_ID_KEY);
    }
  },
};
