import { FilterFn, Table } from '@tanstack/react-table';
import fuzzysort from 'fuzzysort';
import { mean, sum } from 'lodash';

import { calculateTimeOnIce } from '../../utils/playerHelpers';

export const calculateColumnSumForColumnID = <
  T extends Record<string, unknown>,
>(
  table: Table<T>,
  columnID: string,
) =>
  sum(
    table.getFilteredRowModel().rows.flatMap((row) => {
      const val = row.getValue(columnID);
      if (val === '-') return [];
      return parseInt(val as string);
    }),
  );

export const calculateColumnAverageForColumnID = <
  T extends Record<string, unknown>,
>(
  table: Table<T>,
  columnID: string,
) =>
  mean(
    table.getFilteredRowModel().rows.flatMap((row) => {
      const val = row.getValue(columnID);
      if (val === '-') return []; // if we have a dash we should ignore this
      return parseFloat(val as string);
    }),
  );

export const calculateTimeColumnAverageForColumnID = <
  T extends Record<string, unknown>,
>(
  table: Table<T>,
  columnID: string,
) =>
  calculateTimeOnIce(
    sum(table.getFilteredRowModel().rows.map((row) => row.original[columnID])),
    sum(
      table
        .getFilteredRowModel()
        .rows.map((row) => row.getValue('gamesPlayed')),
    ),
  );

const validPositions = ['C', 'LW', 'RW', 'LD', 'RD'];
type FilterPart =
  | {
      type: 'text';
      values: string;
    }
  | {
      type: 'position';
      values: string[];
    };

const parseFilters = (filter: string): FilterPart[] => {
  let textFilter = '';

  const filterParts: FilterPart[] = filter
    .split(' ')
    .flatMap((currFilterPart) => {
      const splitPart = currFilterPart.split(':');

      if (splitPart.length > 1) {
        const [type, values] = splitPart;
        const filterValues = values.split(',');
        if (filterValues.join('').length === 0) return [];

        if (type !== 'position') {
          return [];
        } else if (
          type === 'position' &&
          filterValues.every((val) =>
            validPositions.includes(val.toUpperCase()),
          )
        ) {
          return {
            type,
            values: filterValues.map((val) => val.toUpperCase()),
          };
        }
      } else {
        textFilter = `${textFilter} ${currFilterPart}`.trim();
      }
      return [];
    });
  if (textFilter) {
    filterParts.unshift({
      type: 'text',
      values: textFilter,
    });
  }
  return filterParts;
};

const THRESHOLD = -1000;

export const playerTableGlobalFilterFn: FilterFn<any> = (
  row,
  columnId,
  value,
) => {
  const parsedFilters = parseFilters(value);

  const textFilter = parsedFilters.find(
    (filter) => filter.type === 'text',
  ) as Extract<FilterPart, { type: 'text' }>;

  const nameResult = textFilter
    ? fuzzysort.single(textFilter.values, row.original.name) ?? {
        score: -Infinity,
      }
    : {
        // If we don't have a text filter we should still return all
        score: THRESHOLD + 1,
      };

  if (columnId === 'position') {
    const position = parsedFilters.find(
      (filter) => filter.type === 'position',
    ) as Extract<FilterPart, { type: 'position' }>;

    const positionResult = position
      ? position.values.includes(row.getValue(columnId) as string)
      : true;

    return positionResult && nameResult.score > THRESHOLD;
  }

  return nameResult.score > THRESHOLD;
};
