import {
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

export const TeamStat = ({
  label,
  statValue,
  statHelpText,
  isLoading,
}: {
  label: string;
  statValue?: string | number;
  statHelpText?: string;
  isLoading: boolean;
}) => (
  <Stat>
    <StatLabel>{label}</StatLabel>
    <Skeleton isLoaded={!isLoading}>
      <StatNumber className="font-mont">{statValue}</StatNumber>
    </Skeleton>
    {statHelpText && (
      <Skeleton isLoaded={!isLoading}>
        <StatHelpText className="font-mont">{statHelpText}</StatHelpText>
      </Skeleton>
    )}
  </Stat>
);
