import IIHFLogo from '../public/league_logos/IIHF.svg';
import SHLLogo from '../public/league_logos/SHL.svg';
import SMJHLLogo from '../public/league_logos/SMJHL.svg';
import WJCLogo from '../public/league_logos/WJC.svg';

export const LeagueLogo = ({
  league,
  ...props
}: React.SVGProps<SVGSVGElement> & { league: string }) => {
  switch (league) {
    case 'iihf':
      return <IIHFLogo {...props} />;
    case 'shl':
      return <SHLLogo {...props} />;
    case 'smjhl':
      return <SMJHLLogo {...props} />;
    case 'wjc':
      return <WJCLogo {...props} />;
    default:
      return <div />;
  }
};
