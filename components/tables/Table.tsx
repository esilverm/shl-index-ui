import { DownloadIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { flexRender, Table as ReactTableProps } from '@tanstack/react-table';
import classnames from 'classnames';

import { downloadTableAsCSV } from '../../utils/tableHelpers';

import { FilterControl } from './FilterControl';
import { PaginationControl } from './PaginationControl';
import { TableBehavioralFlags } from './tableBehavioralFlags';

export const Table = <T extends Record<string, unknown>>({
  table,
  tableBehavioralFlags,
  label,
}: {
  table: ReactTableProps<T>;
  tableBehavioralFlags: TableBehavioralFlags;
  label?: string;
}) => {
  return (
    <div className="relative">
      <div
        className={classnames(
          'space-x-2',
          tableBehavioralFlags.enableFiltering ||
            tableBehavioralFlags.showCSVExportButton
            ? 'mb-2 flex w-full'
            : 'hidden',
          tableBehavioralFlags.showCSVExportButton &&
            !tableBehavioralFlags.enableFiltering &&
            'justify-end',
        )}
      >
        {tableBehavioralFlags.enableFiltering && (
          <FilterControl
            table={table}
            tableBehavioralFlags={tableBehavioralFlags}
          />
        )}
        {tableBehavioralFlags.showCSVExportButton && (
          <Tooltip
            label={`Download ${
              tableBehavioralFlags.enableFiltering &&
              table.getState().globalFilter
                ? 'filtered '
                : ''
            }table as CSV`}
            placement="top"
          >
            <IconButton
              icon={<DownloadIcon />}
              variant="outline"
              aria-label="Download table as CSV"
              onClick={() => downloadTableAsCSV(table, label)}
            />
          </Tooltip>
        )}
      </div>
      <div
        className={classnames(
          'overflow-x-auto overflow-y-hidden border border-t-0 border-grey500 dark:border-globalBorderGrey',
          tableBehavioralFlags.enablePagination ? 'rounded-t-lg' : 'rounded-lg',
        )}
      >
        <table className="w-full border-separate border-spacing-0">
          <thead className="relative bg-grey900 text-grey100 dark:bg-LabelHeadingsDark dark:text-white">
            {table.getHeaderGroups().map((headerGroup, i) => (
              <tr key={headerGroup.id} className="table-row">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(event) => {
                        const toggleHandler =
                          header.column.getToggleSortingHandler();
                        if (event.key == 'Enter' && toggleHandler) {
                          toggleHandler(event);
                        }
                      }}
                      colSpan={header.colSpan}
                      className={classnames(
                        tableBehavioralFlags.stickyFirstColumn &&
                          'first:sticky first:left-0 first:z-10',
                        'relative h-[50px] bg-grey900 font-normal first:pl-2.5 first:text-left dark:bg-LabelHeadingsDark',
                        table.getHeaderGroups().length > 1
                          ? i === 1 && '[&:not(:first-child)]:cursor-pointer'
                          : '[&:not(:first-child)]:cursor-pointer',
                        header.column.getIsSorted()
                          ? header.column.getIsSorted() === 'desc'
                            ? "after:absolute after:bottom-[3px] after:left-[calc(100%_/_2_-_4px)] after:text-sm after:content-['v']"
                            : "after:absolute after:left-[calc(100%_/_2_-_4px)] after:top-[3px] after:text-sm after:content-['^']"
                          : '',
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="relative table-row-group bg-grey100 align-middle dark:bg-backgroundGrey100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-blue700/10 dark:hover:bg-backgroundBlueDark/10">
                {tableBehavioralFlags.stickyFirstColumn && (
                  <th className="sticky left-0 table-cell border-t border-t-grey500 bg-grey200 text-left font-mont font-normal dark:border-t-globalBorderGrey dark:bg-globalBackgroundGrey">
                    {flexRender(
                      row.getVisibleCells()[0].column.columnDef.cell,
                      row.getVisibleCells()[0].getContext(),
                    )}
                  </th>
                )}

                {row.getVisibleCells().map((cell, i) => {
                  if (tableBehavioralFlags.stickyFirstColumn && i === 0) return;

                  return (
                    <td
                      key={cell.id}
                      className={classnames(
                        'whitespace-nowrap border-t border-t-grey500 p-2 text-center font-mont dark:border-t-globalBorderGrey',
                        cell.column.getIsSorted() && 'bg-blue700/10 dark:bg-backgroundBlueDark/10',
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          {tableBehavioralFlags.showTableFooter && (
            <tfoot>
              {table.getFooterGroups().map(
                (footerGroup, i) =>
                  i === 0 && (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={classnames(
                            'border-t border-t-grey500 py-3 font-mont font-normal dark:border-t-globalBorderGrey',
                            header.column.getIsSorted() && 'bg-blue700/10 dark:bg-backgroundBlueDark/10',
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.footer,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  ),
              )}
            </tfoot>
          )}
        </table>
      </div>
      {/* TODO(UX improvements): Preserve pagination state in url */}
      {tableBehavioralFlags.enablePagination && (
        <PaginationControl table={table} />
      )}
    </div>
  );
};
