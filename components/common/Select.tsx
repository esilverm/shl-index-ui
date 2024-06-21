import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import classnames from 'classnames';

export const Select = <T extends string | number>({
  options,
  selectedOption,
  onSelection,
  className,
  optionsMap,
  optionClassName,
  dark = false,
}: {
  options: Array<T> | Readonly<Array<T>>;
  selectedOption: T;
  onSelection: (option: T) => void;
  className?: string;
  optionsMap?: Map<T, string>;
  optionClassName?: string;
  dark?: boolean;
}) => {
  return (
    <Menu matchWidth>
      <MenuButton
        as={Button}
        className={classnames(
          dark ? 'border-grey100 !text-grey100' : 'border-grey900 text-grey900',
          '!h-auto rounded-md border !bg-[transparent] !px-2 !py-1.5 font-mont !text-sm  hover:!bg-blue600 active:!bg-blue700 sm:!px-4',
          className,
          optionClassName,
        )}
        rightIcon={<ChevronDownIcon />}
      >
        {optionsMap ? optionsMap.get(selectedOption) : selectedOption}
      </MenuButton>
      <MenuList>
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => onSelection(option)}
            className={classnames(
              'hover:!bg-highlighted/40 hover:!text-primary',
              selectedOption === option && '!bg-highlighted !text-grey100',
              optionClassName,
            )}
          >
            {optionsMap ? optionsMap.get(option) : option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
