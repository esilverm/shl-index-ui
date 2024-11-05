import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Divider,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

const STHSInfo = () => {
  const router = useRouter();

  return (
    <Container maxW="container.lg" py="8">
      <Heading as="h1" size="xl" mb="6">
        STHS FAQs and Historical Information
      </Heading>
      <Box>
        <Button colorScheme="blue" onClick={() => router.push('/')}>
          Back to Index
        </Button>
      </Box>
      <Stack spacing="6">
        <Box>
          <Heading as="h2" size="lg">
            Common FAQs
          </Heading>
        </Box>

        <Box>
          <Heading as="h3" size="md">
            What is STHS?
          </Heading>
          <Text>
            STHS stands for the SimonT Hockey Simulator. It was the original sim
            engine for this version of the SHL. Starting in 2010, we used STHS
            up until S52 when we decided to switch to the Franchise Hockey
            Manager engine after some game-breaking tactics were used in
            previous seasons.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h3" size="md">
            What were the different eras for the SHL?
          </Heading>
          <Text>
            There have been 5 distinct SHL eras during the time we used STHS:
          </Text>
          <Text>
            <strong>S1-S5 Dead Puck Era:</strong> Goalies were exceptionally
            good, with some of the highest save percentages in SHL history,
            reaching .945 and .941.
          </Text>
          <Text>
            <strong>S6-S8 Experimental Era:</strong> This era involved
            experimentation with the STHS sliders.
          </Text>
          <Text>
            <strong>S9-S11 Inflation Era:</strong> Scoring increased
            dramatically compared to the previous seasons and realism era.
          </Text>
          <Text>
            <strong>S12-S20 &amp; S25-S52 Realism Era:</strong> This was the
            most stable era, focusing on realism in player performance and game
            outcomes.
          </Text>
          <Text>
            <strong>S21-S25 52 Game Era:</strong> A brief period where teams
            played 52 games instead of 50.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h3" size="md">
            Where is the SHL playoff data from S6-S17?
          </Heading>
          <Text>
            Unfortunately, the earlier seasons of the SHL did not have their
            data saved or backed up properly. The data was hosted on platforms
            like Dropbox, which were eventually shut down or deleted, leaving us
            without the in-depth player stats for this period.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h3" size="md">
            Where is the early S1-S14 SMJHL data?
          </Heading>
          <Text>
            Like the SHL, no one preserved the data for the early SMJHL seasons.
            As a result, we only have limited information about those seasons.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h3" size="md">
            Why is there missing data?
          </Heading>
          <Text>
            Several pieces of data are missing from the records, such as player
            builds and schedules. Adding this information would require
            additional infrastructure, which would have delayed the release of
            the project.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h3" size="md">
            What if I find something in the data that&apos;s wrong?
          </Heading>
          <Text>
            If you find any incorrect data, feel free to reach out to any
            current Head Office member or contact Luke on the SHL site or
            Discord.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading as="h3" size="md">
            Where is the IIHF and WJC information?
          </Heading>
          <Text>
            IIHF and WJC information is difficult to find and often lost due to
            time. We&apos;re hopeful that some of the STHS data for IIHF and WJC
            will be available in the future, but it&apos;s currently missing.
          </Text>
        </Box>

        <Divider />
      </Stack>
    </Container>
  );
};

export default STHSInfo;
