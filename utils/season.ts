export const getQuerySeason = (): string => {
  if (typeof window === 'undefined') return '';

  const urlParams = new URLSearchParams(window.location.search);
  const season = urlParams.get('season') || '';
  return season.match(/\d+/) ? season : '';
};

export const getLatestSeason = (seasons: number[]): string => {
  if (seasons) {
    const numericSeasons = seasons.map((season) => season);
    const currentSeason = seasons.length > 0 ? Math.max(...numericSeasons) : '';
    return currentSeason.toString();
  }

  return '';
};
