export const getQuerySeason = () => {
  if (typeof window === "undefined") return '';

  const urlParams = new URLSearchParams(window.location.search);
  const season = urlParams.get('season') || '';
  return season.match(/\d+/) ? season : '';
};
