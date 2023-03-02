import { ParsedUrlQuery } from 'querystring';
import { ParsedUrlQueryInput } from 'querystring';

import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';

export const useRouterPageState = <
  T extends Record<string, keyof ParsedUrlQuery>,
>({
  keys,
  initialState,
}: {
  keys: (keyof T)[];
  initialState?: Partial<T>;
}): T & {
  setRouterPageState: (
    key: keyof T,
    newValue: keyof ParsedUrlQueryInput,
  ) => Promise<boolean>;
} => {
  const router = useRouter();
  const query = router.query;

  // inject initial state into url if it doesn't exist
  useEffect(() => {
    if (
      !initialState ||
      // wait until router has fully loaded its data
      (/type/.test(router.asPath) && !('type' in query)) ||
      (/season/.test(router.asPath) && !('season' in query))
    )
      return;
    const keysToPush = keys.reduce((acc, key) => {
      if (key in query) return acc;
      return {
        ...acc,
        [key]: initialState[key],
      };
    }, {});

    if (isEmpty(keysToPush)) return;

    router.push(
      {
        query: {
          ...router.query,
          ...keysToPush,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  }, [initialState, keys, query, router]);

  const currentValues: T = useMemo(() => {
    return keys.reduce((acc, key) => {
      if (key in query) {
        return {
          ...acc,
          //@ts-ignore
          [key]: query[key],
        };
      }

      if (
        !new RegExp('tab' as string).test(router.asPath) &&
        initialState &&
        key in initialState
      ) {
        return {
          ...acc,
          [key]: initialState[key],
        };
      }
      return {
        ...acc,
        [key]: undefined,
      };
    }, {} as T);
  }, [initialState, keys, query, router.asPath]);

  const setRouterPageState = useCallback(
    (key: keyof T, newValue: keyof ParsedUrlQueryInput) =>
      router.push(
        {
          query: {
            ...router.query,
            [key]: newValue,
          },
        },
        undefined,
        {
          shallow: true,
        },
      ),
    [router],
  );

  return {
    ...currentValues,
    setRouterPageState,
  };
};
