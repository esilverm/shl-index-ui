export const getQuerySeasonType = (): string => {
  if (typeof window === 'undefined') return '';

  const urlParams = new URLSearchParams(window.location.search);
  const seasonType = urlParams.get('type') || '';
  return seasonType.match(/\w+/) ? seasonType : 'regular';
};
