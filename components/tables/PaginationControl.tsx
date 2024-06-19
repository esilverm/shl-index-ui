import {
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tooltip,
} from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';

export const PaginationControl = <T extends Record<string, unknown>>({
  table,
}: {
  table: Table<T>;
}) => {
  return (
    <div className="flex w-full items-center justify-between space-x-3 rounded-b-lg border border-t-0 border-grey500 py-2 px-4 dark:border-globalBorderGrey lg:space-x-10">
      <Tooltip
        label="Jump to first page"
        isDisabled={!table.getCanPreviousPage()}
      >
        <Button
          size="sm"
          onClick={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
          className="flex-1"
          colorScheme="blue"
        >
          &lt;&lt;
        </Button>
      </Tooltip>
      <Tooltip label="Previous page" isDisabled={!table.getCanPreviousPage()}>
        <Button
          size="sm"
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
          className="flex-1"
          colorScheme="blue"
        >
          &lt;
        </Button>
      </Tooltip>
      <div>
        <span className="font-mont">
          Page{' '}
          <span className="font-semibold">
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
        </span>
        <span className="ml-1 hidden md:inline-flex">
          | Go to page:{' '}
          <NumberInput
            size="xs"
            defaultValue={table.getState().pagination.pageIndex + 1}
            min={1}
            max={table.getPageCount()}
            onChange={(value) => {
              if (!isNaN(parseInt(value))) {
                table.setPageIndex(parseInt(value) - 1);
              }
            }}
            className="ml-2 w-16 font-mont"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </span>
      </div>
      <Tooltip label="Next page" isDisabled={!table.getCanNextPage()}>
        <Button
          size="sm"
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
          className="flex-1"
          colorScheme="blue"
        >
          &gt;
        </Button>
      </Tooltip>
      <Tooltip label="Jump to last page" isDisabled={!table.getCanNextPage()}>
        <Button
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          isDisabled={!table.getCanNextPage()}
          className="flex-1"
          colorScheme="blue"
        >
          &gt;&gt;
        </Button>
      </Tooltip>
    </div>
  );
};
