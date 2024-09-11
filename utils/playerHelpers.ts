import {
  GoalieRatings,
  InternalPlayerRatings,
  PlayerRatings,
} from '../typings/api';

import { assertUnreachable } from './assertUnreachable';

// This converts names to First initial. (any middle initials) Last Name [titles]
export const getPlayerShortname = (name: string): string => {
  if (!name) return name;
  const splitName = name.split(' ').filter(Boolean);
  if (
    splitName.length === 1 ||
    (splitName.length === 2 && splitName[1].length === 1)
  ) {
    return name;
  } else if (
    splitName.length === 2 ||
    splitName[splitName.length - 1].toLowerCase().includes('jr') ||
    splitName[splitName.length - 1].toLowerCase().includes('sr') ||
    splitName[splitName.length - 1].match(
      /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
    )
  ) {
    if (splitName[0].match(/[a-zA-Z0-9]/) === null) {
      console.log(splitName);
    }
    //@ts-ignore
    const firstChar = splitName[0].match(/[a-zA-Z0-9\-]/)[0];

    // if ends with jr
    if (
      splitName[splitName.length - 1].toLowerCase().includes('jr') ||
      splitName[splitName.length - 1].toLowerCase().includes('sr') ||
      splitName[splitName.length - 1].match(
        /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
      )
    ) {
      return `${firstChar}. ${splitName[splitName.length - 2]} ${
        splitName[splitName.length - 1]
      }`;
    }

    return `${firstChar}. ${splitName[1]}`;
  }
  const shortName = splitName.slice(0, -1).reduce((acc, curr) => {
    const firstChar = curr.match(/[a-zA-Z0-9\-]/);
    if (firstChar) {
      return acc + `${firstChar[0]}. `;
    }
    return acc;
  }, '');
  return `${shortName}${splitName.slice(-1)}`;
};

export const calculateTimeOnIce = (toi: number, gamesPlayed: number) =>
  `${(toi / gamesPlayed / 60) >> 0}:${((toi / gamesPlayed) % 60 >> 0)
    .toString()
    .padStart(2, '0')}`;

const VALID_SKATER_ATTRIBUTES = [
  'screening',
  'gettingOpen',
  'passing',
  'puckhandling',
  'shootingAccuracy',
  'shootingRange',
  'offensiveRead',
  'checking',
  'hitting',
  'positioning',
  'stickchecking',
  'shotBlocking',
  'faceoffs',
  'defensiveRead',
  'acceleration',
  'agility',
  'balance',
  'speed',
  'stamina',
  'strength',
  'fighting',
  'aggression',
  'bravery',
];

const VALID_GOALIE_ATTRIBUTES = [
  'blocker',
  'glove',
  'passing',
  'pokeCheck',
  'positioning',
  'rebound',
  'recovery',
  'puckhandling',
  'lowShots',
  'reflexes',
  'skating',
  'mentalToughness',
  'goalieStamina',
];

const getSkaterTPECost = (attributeValue: number) => {
  switch (attributeValue) {
    case -5:
    case -4:
    case -3:
    case -2:
    case -1:
    case 0:
      return 0;
    case 1:
    case 2:
    case 3:
    case 4:
      return attributeValue;
    case 5:
      return 6;
    case 6:
      return 8;
    case 7:
      return 13;
    case 8:
      return 18;
    case 9:
      return 30;
    case 10:
      return 42;
    case 11:
      return 67;
    case 12:
      return 97;
    case 13:
      return 137;
    case 14:
      return 187;
    case 15:
      return 242;
    default:
      return assertUnreachable(attributeValue as never);
  }
};

const getGoalieTPECost = (attributeValue: number) => {
  switch (attributeValue) {
    case -5:
    case -4:
    case -3:
    case -2:
    case -1:
    case 0:
      return 0;
    case 1:
    case 2:
      return attributeValue;
    case 3:
      return 4;
    case 4:
      return 6;
    case 5:
      return 11;
    case 6:
      return 16;
    case 7:
      return 24;
    case 8:
      return 32;
    case 9:
      return 47;
    case 10:
      return 62;
    case 11:
      return 87;
    case 12:
      return 112;
    case 13:
      return 152;
    case 14:
      return 192;
    case 15:
      return 232;
    default:
      return assertUnreachable(attributeValue as never);
  }
};

export const calculateSkaterTPE = (
  players: PlayerRatings | InternalPlayerRatings,
): number =>
  Object.entries(players).reduce((totalTPE, [key, value]) => {
    if (!VALID_SKATER_ATTRIBUTES.includes(key)) {
      return totalTPE;
    }

    const currentValue = value as Extract<typeof value, number>;
    if (key === 'stamina') {
      return (
        totalTPE + getSkaterTPECost(currentValue - 5) - getSkaterTPECost(9)
      );
    } else {
      return totalTPE + getSkaterTPECost(currentValue - 5);
    }
  }, 0);

export const calculateGoalieTPE = (
  players: GoalieRatings | InternalPlayerRatings,
): number =>
  Object.entries(players).reduce((totalTPE, [key, value]) => {
    if (!VALID_GOALIE_ATTRIBUTES.includes(key)) {
      return totalTPE;
    }

    //@ts-ignore
    return totalTPE + getGoalieTPECost(value - 5);
  }, 0);
