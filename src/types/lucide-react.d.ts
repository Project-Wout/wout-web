declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  // 필요한 아이콘들을 명시적으로 선언
  export const Clock: React.FC<LucideProps>;
  export const MapPin: React.FC<LucideProps>;
  export const Settings: React.FC<LucideProps>;
  export const RefreshCw: React.FC<LucideProps>;
  export const ArrowLeft: React.FC<LucideProps>;

  // 혹은 전체 export 허용 (비권장, 하지만 빠르게 해결 가능)
  const content: any;
  export default content;
}
