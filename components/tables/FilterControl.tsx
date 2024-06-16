import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import {
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Code,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';

import { TableBehavioralFlags } from './tableBehavioralFlags';

export const FilterControl = <T extends Record<string, unknown>>({
  table,
  tableBehavioralFlags,
}: {
  table: Table<T>;
  tableBehavioralFlags: TableBehavioralFlags;
}) => {
  const [filterLoading, setFilterLoading] = useState(false);
  const [filter, setFilter] = useState(table.getState().globalFilter);

  const onFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilterLoading(true);
      setFilter(event.target.value);
      debounce(
        (value) => {
          table.setGlobalFilter(value);
          setFilterLoading(false);
        },
        1000,
        {
          leading: false,
          trailing: true,
        },
      )(event.target.value);
    },

    [table],
  );

  return (
    <div className="flex w-full flex-col">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon className="!text-grey500 dark:!text-grey500Dark" />
        </InputLeftElement>
        <Input
          value={filter}
          placeholder="Search all players..."
          onChange={onFilterChange}
        />
        <InputRightElement>
          {filterLoading ? (
            <Spinner size="sm" />
          ) : (
            table.getState().globalFilter && (
              <IconButton
                aria-label="Clear filter"
                icon={<CloseIcon className="!text-grey500 dark:!text-grey500Dark" />}
                size="sm"
                variant="ghost"
                onClick={() => {
                  table.resetGlobalFilter();
                  setFilter('');
                }}
              />
            )
          )}
        </InputRightElement>
      </InputGroup>
      <div
        className={classnames(
          'ml-3 mt-2 text-sm text-grey600 dark:text-grey100TextDark',
          !tableBehavioralFlags.showTableFilterOptions && 'hidden',
        )}
      >
        Options: <Code>position:[C,LW,RW,LD,RD]</Code>
      </div>
    </div>
  );
};
