import { useMemo } from 'react';

import { useSeason } from '../hooks/useSeason';
import { assertUnreachable } from '../utils/assertUnreachable';
import { League } from '../utils/leagueHelpers';

const getLogoId = (
  teamAbbreviation: string,
  league: string,
  season: number,
): string | { spriteId: string; isHistorical: true } => {
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
          if (season < 3) {
            return { spriteId: 'CalgaryPreS3', isHistorical: true };
          }
          if (season < 58) {
            return { spriteId: 'CalgaryPreS58', isHistorical: true };
          }
          return 'Calgary';
        case 'CHI':
          if (season < 54) {
            return { spriteId: 'ChicagoPreS54', isHistorical: true };
          }
          return 'Chicago';
        case 'EDM':
          if (season < 10) {
            return { spriteId: 'EdmontonPreS10', isHistorical: true };
          }
          if (season < 41) {
            return { spriteId: 'EdmontonPreS41', isHistorical: true };
          }
          return 'Edmonton';
        case 'HAM':
          if (season < 3) {
            return { spriteId: 'HamiltonPreS3', isHistorical: true };
          }
          if (season < 21) {
            return { spriteId: 'HamiltonPreS21', isHistorical: true };
          }
          if (season < 32) {
            return { spriteId: 'HamiltonPreS32', isHistorical: true };
          }
          if (season < 37) {
            return { spriteId: 'HamiltonPreS37', isHistorical: true };
          }
          return 'Hamilton';
        case 'LAP':
          if (season < 11) {
            return { spriteId: 'Los_AngelesPreS11', isHistorical: true };
          }
          if (season < 13) {
            return { spriteId: 'Los_AngelesPreS13', isHistorical: true };
          }
          if (season < 15) {
            return { spriteId: 'Los_AngelesPreS15', isHistorical: true };
          }
          if (season < 64) {
            return { spriteId: 'Los_AngelesPreS64', isHistorical: true };
          }
          return 'Los_Angeles';
        case 'MAN':
          if (season < 6) {
            return { spriteId: 'ManhattanPreS6', isHistorical: true };
          }
          if (season < 21) {
            return { spriteId: 'ManhattanPreS21', isHistorical: true };
          }
          if (season < 42) {
            return { spriteId: 'ManhattanPreS42', isHistorical: true };
          }
          return 'Manhattan';
        case 'MIN':
          if (season < 11) {
            return { spriteId: 'MinnesotaPreS11', isHistorical: true };
          }
          if (season < 24) {
            return { spriteId: 'MinnesotaPreS24', isHistorical: true };
          }
          if (season < 56) {
            return { spriteId: 'MinnesotaPreS56', isHistorical: true };
          }
          if (season < 75) {
            return { spriteId: 'MinnesotaPreS75', isHistorical: true };
          }
          return 'Minnesota';
        case 'MTL':
          if (season < 66) {
            return { spriteId: 'MontrealPreS66', isHistorical: true };
          }
          return 'Montreal';
        case 'NEW':
          if (season < 43) {
            return { spriteId: 'New_EnglandPreS43', isHistorical: true };
          }
          if (season < 53) {
            return { spriteId: 'New_EnglandPreS53', isHistorical: true };
          }
          return 'New_England';
        case 'NOL':
          return 'New_Orleans';
        case 'PHI':
          if (season < 60) {
            return { spriteId: 'PhiladelphiaPreS60', isHistorical: true };
          }
          return 'Philadelphia';
        case 'SFP':
          if (season < 45) {
            return { spriteId: 'San_FranciscoPreS45', isHistorical: true };
          }
          return 'San_Francisco';
        case 'SEA':
          if (season < 37) {
            return { spriteId: 'SeattlePreS37', isHistorical: true };
          }
          if (season < 46) {
            return { spriteId: 'SeattlePreS46', isHistorical: true };
          }
          return 'Seattle';
        case 'TBB':
          if (season < 59) {
            return { spriteId: 'Tampa_BayPreS59', isHistorical: true };
          }
          return 'Tampa_Bay';
        case 'TEX':
          if (season < 41) {
            return { spriteId: 'TexasPreS41', isHistorical: true };
          }
          return 'Texas';
        case 'TOR':
          if (season < 3) {
            return { spriteId: 'TorontoPreS3', isHistorical: true };
          }
          if (season < 8) {
            return { spriteId: 'TorontoPreS8', isHistorical: true };
          }
          if (season < 25) {
            return { spriteId: 'TorontoPreS25', isHistorical: true };
          }
          if (season < 70) {
            return { spriteId: 'TorontoPreS70', isHistorical: true };
          }
          return 'Toronto';
        case 'WPG':
          if (season < 3) {
            return { spriteId: 'WinnipegPreS3', isHistorical: true };
          }
          if (season < 58) {
            return { spriteId: 'WinnipegPreS58', isHistorical: true };
          }
          if (season < 66) {
            return { spriteId: 'WinnipegPreS66', isHistorical: true };
          }
          return 'Winnipeg';
        // defunct teams
        case 'HAR':
          if (season < 13) {
            return { spriteId: 'HartfordHydras', isHistorical: true };
          }
        case 'LVK':
          if (season < 16) {
            return { spriteId: 'LasVegasKings', isHistorical: true };
          }
        case 'POR':
          if (season < 36) {
            return { spriteId: 'PortlandAdmirals', isHistorical: true };
          }
        case 'TBH':
          if (season < 11) {
            return { spriteId: 'TampaBayHydras', isHistorical: true };
          }
        case 'WIS':
          if (season < 3) {
            return { spriteId: 'WisconsinMonarchs', isHistorical: true };
          }
        case 'WKP':
          if (season < 3) {
            return { spriteId: 'West_KendallPreS3', isHistorical: true };
          }
          if (season < 6) {
            return { spriteId: 'WestKendallPreS6', isHistorical: true };
          }
          if (season < 25) {
            return { spriteId: 'WestKendallPreS25', isHistorical: true };
          }
          return { spriteId: 'West_Kendall', isHistorical: true };
        case 'VAN':
          if (season < 6) {
            return { spriteId: 'VancouverIceWolves', isHistorical: true };
          }
          if (season < 8) {
            return { spriteId: 'VancouverNightmare', isHistorical: true };
          }
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
        case 'OTT':
          return 'Ottawa';
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
        case 'CZH':
          return 'Czechia';
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

  const spriteMetadata = useMemo(
    () => getLogoId(teamAbbreviation, league, season ?? Infinity),
    [league, season, teamAbbreviation],
  );

  const { spriteId, isHistorical } = useMemo(() => {
    if (typeof spriteMetadata === 'string') {
      return { spriteId: spriteMetadata, isHistorical: false };
    }
    return spriteMetadata;
  }, [spriteMetadata]);

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
      src={`/stack/${
        isHistorical ? 'historical' : ''
      }${league.toLowerCase()}.stack.svg#${spriteId}`}
    />
  );
};
