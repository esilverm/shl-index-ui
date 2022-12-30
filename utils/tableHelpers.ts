import { Table } from '@tanstack/react-table';
import { stringify } from 'csv-stringify/sync';
import { saveAs } from 'file-saver';

export const downloadTableAsCSV = <T extends Record<string, unknown>>(
  table: Table<T>,
  label?: string,
): void => {
  const tableRowData = table
    .getFilteredRowModel()
    .rows.map(({ original }) => original);

  const tableRowHeaders = Object.keys(tableRowData[0] ?? {});

  const contents = stringify([
    tableRowHeaders,
    ...tableRowData.map((row) => Object.values(row ?? {})),
  ]);

  saveAs(
    new Blob([contents], {
      type: 'text/csv;charset=utf-8',
    }),
    `${label ?? 'shl-data'}.csv`,
  );
};
