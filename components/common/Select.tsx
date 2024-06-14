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
          dark ? 'border-grey100  text-grey100 dark:bg-grey100Dark dark:text-grey100TextDark' : 'border-grey900 text-grey900 dark:border-grey900Dark dark:text-grey900Dark',
          '!h-auto rounded-md border !bg-[transparent] !px-2 !py-1.5 font-mont !text-sm  hover:text-hyperlink active:!bg-blue700 dark:hover:text-hyperlink sm:!px-4',
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
              'hover:!bg-grey400',
              selectedOption === option && '!bg-grey300 dark:!bg-grey300Dark',
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
