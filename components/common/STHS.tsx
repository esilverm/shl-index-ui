import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  IconButton,
  Stack,
  Text,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';

export const STHSBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Box as="section" pb={{ base: '3', md: '6' }} width="100%">
      <Box borderBottomWidth="1px" bg="bg.surface" width="100%">
        <Container maxW="100%" py={{ base: '4', md: '3.5' }}>
          <Stack
            direction="row"
            spacing={{ base: '3', md: '4' }}
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
          >
            <Box>
              <Text fontWeight="medium">Results were in the STHS Game Engine</Text>
              <Text color="fg.muted">
                Index may be missing certain stats and results in STHS seasons. {' '}
                <Link
                  href="/sths-info"
                  target="_blank"
                  color="blue.500"
                  fontWeight="bold"
                >
                  Learn more about STHS
                </Link>
              </Text>
            </Box>
            <IconButton
              icon={<CloseIcon />}
              variant="outline"
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
