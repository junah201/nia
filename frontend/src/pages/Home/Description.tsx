import { ShieldCheck, BarChart3, Smartphone, LucideIcon } from 'lucide-react';

const Description = () => {
  return (
    <div className="grid grid-cols-3 gap-4 break-keep">
      <Benefit
        Icon={ShieldCheck}
        title="HTTPS 보안"
        description="Https 보안프로토콜을 사용하여 안전한 서비스를 제공합니다."
      />
      <Benefit
        Icon={Smartphone}
        title="인앱 브라우저 우회"
        description="카톡 인스타 틱톡 라인 등의 인앱 브라우저 우회 기능을 제공합니다."
      />
      <Benefit
        Icon={BarChart3}
        title="단축 URL별 통계"
        description="날짜별, 플랫폼별 통계를 제공합니다."
      />
    </div>
  );
};

interface BenefitProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const Benefit = ({ Icon, title, description }: BenefitProps) => {
  return (
    <div className="flex flex-col items-center px-4 py-4 sm:py-8 border shadow-sm rounded-lg">
      <Icon size={52} className="stroke-primary" />
      <h4 className="text-sm sm:text-lg font-bold text-center">{title}</h4>
      <p className="text-center text-xs antialiased">{description}</p>
    </div>
  );
};

export default Description;
