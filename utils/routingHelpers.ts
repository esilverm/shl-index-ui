import { ParsedUrlQuery } from 'querystring';

export const onlyIncludeSeasonAndTypeInQuery = (query: ParsedUrlQuery) => {
  const { league, season, type } = query;
  return {
    league,
    ...(season ? { season } : {}),
    ...(type ? { type } : {}),
  };
};
