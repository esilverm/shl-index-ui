import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { SHOT_QUALITY_MODAL_NAME } from './ShotQualityModal';

export const ShotQualityHeader = () => {
  const router = useRouter();

  const openSQModal = () => {
    router.replace(
      {
        pathname: router.pathname,
        query: { overlay: SHOT_QUALITY_MODAL_NAME, ...router.query },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Box>
      Shot Quality{' '}
      <Text
        as="button"
        onClick={openSQModal}
        fontWeight="semibold"
        textDecoration="underline"
        cursor="pointer"
        className="!text-sm"
      >
        Learn more about Shot Quality
      </Text>
    </Box>
  );
};
