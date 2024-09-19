import { CloseIcon } from '@chakra-ui/icons';
import { Box, Container, IconButton, Stack, Text, Link } from '@chakra-ui/react';
import { useState } from 'react';

export const STHSBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Box as="section" pb={{ base: '12', md: '24' }} width="100%">
      <Box borderBottomWidth="1px" bg="bg.surface" width="100%">
        <Container maxW="100%" py={{ base: '4', md: '3.5' }}>
          <Stack
            direction="row"
            spacing={{ base: '3', md: '4' }}
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
          >
            <Box>
              <Text fontWeight="medium">Results are in STHS</Text>
              <Text color="fg.muted">
                Index may be missing certain stats and results in STHS seasons.
              </Text>
              <Link href="/sths-info" color="blue.500" fontWeight="bold">
                Learn more about STHS
              </Link>
            </Box>
            <IconButton
              icon={<CloseIcon />}
              variant="ghost"
              aria-label="Close banner"
              onClick={() => setIsVisible(false)}
            />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default STHSBanner;
