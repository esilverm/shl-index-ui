import { useMemo } from 'react';

import { useSeason } from '../hooks/useSeason';
import { assertUnreachable } from '../utils/assertUnreachable';
import { League } from '../utils/leagueHelpers';

const getLogoId = (
  teamAbbreviation: string,
  league: string,
  season: number,
) => {
  if (teamAbbreviation === 'UNKNOWN') {
    return '';
  }
  switch (league) {
    case 'iihf': {
      switch (teamAbbreviation) {
        case 'AUT':
        case 'AUS':
          return 'Austria';
        case 'CAN':
          return 'Canada';
        case 'CZH':
          return 'Czechia';
        case 'FIN':
          return 'Finland';
        case 'FRA':
          return 'France';
        case 'GER':
          return 'Germany';
        case 'GBR':
          return 'Great_Britain';
        case 'IRL':
          return 'Ireland';
        case 'JPN':
          return 'Japan';
        case 'LTV':
          return 'Latvia';
        case 'NOR':
          return 'Norway';
        case 'RUS':
          return 'Russia';
        case 'SWE':
          return 'Sweden';
        case 'SWI':
          return 'Switzerland';
        case 'USA':
          return 'United_States';
        default:
          return 'IIHF';
      }
    }
    case 'shl': {
      switch (teamAbbreviation) {
        case 'ATL':
          return 'Atlanta';
        case 'BAP':
          return 'Baltimore';
        case 'BUF':
          return 'Buffalo';
        case 'CGY':
          if (season < 58) {
            return 'CalgaryOld';
          }
          return 'Calgary';
        case 'CHI':
          return 'Chicago';
        case 'EDM':
          return 'Edmonton';
        case 'HAM':
          return 'Hamilton';
        case 'LAP':
          if (season < 64) {
            return 'Los_AngelesOld';
          }
          return 'Los_Angeles';
        case 'MAN':
          return 'Manhattan';
        case 'MIN':
          if (season < 56) {
            return 'MinnesotaPreS56';
          }
          if (season < 75) {
            return 'MinnesotaPreS75';
          }
          return 'Minnesota';
        case 'MTL':
          if (season < 66) {
            return 'MontrealOld';
          }
          return 'Montreal';
        case 'NEW':
          return 'New_England';
        case 'NOL':
          return 'New_Orleans';
        case 'PHI':
          if (season < 60) {
            return 'PhiladelphiaOld';
          }
          return 'Philadelphia';
        case 'SFP':
          return 'San_Francisco';
        case 'SEA':
          return 'Seattle';
        case 'TBB':
          if (season < 59) {
            return 'Tampa_BayOld';
          }
          return 'Tampa_Bay';
        case 'TEX':
          return 'Texas';
        case 'TOR':
          if (season < 70) {
            return 'TorontoOld';
          }
          return 'Toronto';
        case 'WKP':
          return 'West_Kendall';
        case 'WPG':
          if (season < 58) {
            return 'WinnipegOld';
          }
          if (season < 66) {
            return 'WinnipegPreS65';
          }
          return 'Winnipeg';
        default:
          return 'SHL';
      }
    }
    case 'smjhl': {
      switch (teamAbbreviation) {
        case 'ANA':
          if (season < 59) {
            return 'AnaheimOld';
          }
          return 'Anaheim';
        case 'ANC':
          if (season < 61) {
            return 'AnchorageOld';
          }
          return 'Anchorage';
        case 'CAR':
          return 'Carolina';
        case 'COL':
          if (season < 58) {
            return 'ColoradoOld';
          }
          return 'Colorado';
        case 'DET':
          return 'Detroit';
        case 'GFG':
          return 'Great_Falls';
        case 'KEL':
          return 'Kelowna';
        case 'MET':
          return 'Maine';
        case 'NBB':
          if (season < 60) {
            return 'NevadaOld';
          }
          return 'Nevada';
        case 'NL':
          return 'Newfoundland';
        case 'QCC':
          return 'Quebec_City';
        case 'REG':
          return 'Regina';
        case 'STL':
          if (season < 55) {
            return 'St_LouisOld';
          }
          return 'St_Louis';
        case 'VAN':
          if (season < 71) {
            return 'VancouverOld';
          }
          return 'Vancouver';
        case 'YUM':
          return 'Yukon';
        default:
          return 'SMJHL';
      }
    }
    case 'wjc': {
      switch (teamAbbreviation) {
        case 'BRI':
          return 'British_Isles';
        case 'CAN':
        case 'CNR':
          return 'Canada';
        case 'CNW':
        case 'CAR':
          return 'Canada_Red';
        case 'CAB':
          return 'Canada_Black';
        case 'DCH':
          return 'DACH';
        case 'FIN':
        case 'NDN':
          return 'Finland';
        case 'ICE':
          return 'Ice';
        case 'NA':
          return 'North_America';
        case 'RCL':
          return 'UCORCAL';
        case 'RHI':
          return 'Rhine';
        case 'SWE':
          return 'Sweden';
        case 'USA':
        case 'USB':
          return 'United_States';
        case 'USR':
        case 'USW':
          return 'United_States_Red';
        case 'WOR':
          return 'World';
        case 'YG':
          return 'Young_Guns';
        default:
          return 'WJC';
      }
    }
    default:
      return assertUnreachable(teamAbbreviation as never);
  }
};

export const TeamLogo = ({
  teamAbbreviation = 'UNKNOWN',
  league,
  className,
}: {
  teamAbbreviation: string | undefined;
  league: League;
  className?: string;
}) => {
  const { season } = useSeason();

  const spriteId = useMemo(
    () => getLogoId(teamAbbreviation, league, season ?? Infinity),
    [league, season, teamAbbreviation],
  );

  if (
    spriteId === 'IIHF' ||
    spriteId === 'WJC' ||
    spriteId === 'SHL' ||
    spriteId === 'SMJHL'
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={className} src={`/league_logos/${spriteId}.svg`} />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={`/stack/${league.toLowerCase()}.stack.svg#${spriteId}`}
    />
  );
};
