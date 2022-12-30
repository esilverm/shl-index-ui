import { Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { LivestreamData } from '../pages/api/v1/livestreams';
import { query } from '../utils/query';

export const Livestream = ({ league }: { league: string }) => {
  const [isLive, setIsLive] = useState(false);

  const { data, isLoading, isError } = useQuery<LivestreamData[], Error>({
    queryKey: ['livestream', league],
    queryFn: () => query(`api/v1/livestreams?league=${league}`),
  });

  const videoID = useMemo(() => (data ? data[0]?.videoId : ''), [data]);

  useEffect(() => {
    if (data && data[0]?.isLive === 'live') {
      setIsLive(true);
    }
  }, [data]);

  return (
    <>
      <h2 className="pb-4 text-3xl font-bold">
        {isLive ? 'Current' : 'Most Recent'} Livestream
      </h2>
      <div className="relative before:block before:aspect-video before:content-['']">
        {isLoading || isError ? (
          <div className="mt-4 grid w-full place-items-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoID}?autoplay=1&mute=1&color=white&rel=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 h-full w-full rounded-xl"
          />
        )}
      </div>
    </>
  );
};
