import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const SHOT_QUALITY_MODAL_NAME = 'shot-quality-info';

export const ShotQualityModal = () => {
  const router = useRouter();

  const isOpen =
    'overlay' in router.query &&
    router.query.overlay === SHOT_QUALITY_MODAL_NAME;

  const closeModal = useCallback(() => {
    const { pathname, query } = router;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { overlay, ...rest } = query;

    router.replace(
      {
        pathname,
        query: rest,
      },
      undefined,
      { shallow: true },
    );
  }, [router]);

  const qualityInfo = [
    {
      title: 'Basic Information',
      description:
        'Attempts from the low danger areas are assigned a value of 1, attempts from the medium danger areas are assigned a value of 2, and attempts in the high danger area are assigned a value of 3. Add 1 to this value if the attempt is considered a rush shot or a rebound. A rebound is any attempt made within 3 seconds of another blocked, missed or saved attempt without a stoppage in play in between. A rush shot is any attempt within 4 seconds of any event in the neutral or defensive zone without a stoppage in play in between.',
    },
    {
      title: 'Shot Quality 0',
      description:
        "It is the low danger area's that also got their shot blocked.",
    },
    {
      title: 'Shot Quality 1',
      description:
        'It could be a Low Quality of Shot or a Medium Quality of Shot that was a blocked shot.',
    },
    {
      title: 'Shot Quality 2',
      description:
        'It could be a Low Quality of Shot that was off the rush or a rebound shot, a Medium Quality of Shot, or a High Quality of Shot that was blocked.',
    },
    {
      title: 'Shot Quality 3',
      description:
        'It could be a Medium Quality of Shot that was off the rush or a rebound shot, or a High Quality of Shot.',
    },
    {
      title: 'Shot Quality 4',
      description:
        'It is a High Quality of Shot that was off the rush or a rebound shot.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Shot Quality Information</ModalHeader>
        <ModalBody>
          <Heading size="md" mb={4}>
            Common FAQs
          </Heading>
          <VStack spacing={4} align="stretch">
            {qualityInfo.map((item, index) => (
              <Box key={index} p={4} rounded="md" shadow="sm">
                <Text fontWeight="bold" mb={1}>
                  {item.title}
                </Text>
                <Text>{item.description}</Text>
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
