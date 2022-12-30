export const STANDINGS_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: true,
  showTableFooter: false,
  showCSVExportButton: false,
  enablePagination: false,
  enableFiltering: false,
};

export const TEAM_STATS_TABLE: TableBehavioralFlags = {
  stickyFirstColumn: false,
  showTableFooter: false,
  showCSVExportButton: true,
  enablePagination: false,
  enableFiltering: false,
};

export const SKATER_TABLE_FLAGS = ({
  type,
  data,
}: {
  type: 'league' | 'team' | 'player';
  data: 'scoring' | 'ratings' | 'adv';
}): TableBehavioralFlags => ({
  stickyFirstColumn: false,
  showTableFooter: data === 'scoring' && type === 'player',
  showCSVExportButton: true,
  enablePagination: type === 'league',
  enableFiltering: type === 'league',
});

export interface TableBehavioralFlags {
  stickyFirstColumn: boolean;
  showTableFooter: boolean;
  showCSVExportButton: boolean;
  enablePagination: boolean;
  enableFiltering: boolean;
}
