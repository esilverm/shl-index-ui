import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const STHS_INFO_MODAL_NAME = 'sths-info';

// Modal is opened when 'sths-info' is passed in the overlay query param
export const STHSInfoModal = () => {
  const router = useRouter();

  const isOpen =
    'overlay' in router.query && router.query.overlay === STHS_INFO_MODAL_NAME;
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>STHS FAQs and Historical Information</ModalHeader>
        <ModalBody>
          <h2 className="mb-4 text-lg font-semibold">Common FAQs</h2>
          <Accordion allowMultiple allowToggle>
            <AccordionItem>
              <h3 className="font-semibold">
                <AccordionButton>
                  <span className="inline-block flex-1 text-left">
                    What is STHS?
                  </span>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel>
                STHS stands for the SimonT Hockey Simulator, which was the used
                as the original sim engine for the SHL. We used STHS from our
                inaugaural season in 2010 until Season 52. In that season, we
                made the decision to switch to the Franchise Hockey Manager
                engine. This change was prompted by the emergence of
                game-breaking tactics that had been exploited in previous
                seasons, which led us to seek a more balanced and reliable
                simulation engine.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h3 className="font-semibold">
                <AccordionButton>
                  <span className="inline-block flex-1 text-left">
                    What were the different SHL eras under the STHS engine?
                  </span>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel>
                Over the first 52 seasons of the SHL while simming under STHS,
                we saw a variety of distinct eras that shaped the league, these
                have been broken down as follows:
                <div className="mt-3 space-y-2">
                  <p>
                    <span className="font-semibold">S1-S5 Dead Puck Era:</span>{' '}
                    As the name suggests, this era was characterized by low goal
                    scoring. In this era, goalies were exceptionally good, with
                    some of the highest save percentages in SHL history,
                    reaching .945 and .941.
                  </p>
                  <p>
                    <span className="font-semibold">
                      S6-S8 Experimental Era:
                    </span>{' '}
                    During this era, the league experimented with the STHS
                    sliders to find the right balance for the sim engine.
                  </p>
                  <p>
                    <span className="font-semibold">S9-S11 Inflation Era:</span>{' '}
                    Scoring increased during this era, with players putting up
                    more points than in previous seasons as the league adjusted
                    to the new settings.
                  </p>
                  <p>
                    <span className="font-semibold">
                      S12-S20 &amp; S25-S52 Realism Era:
                    </span>{' '}
                    During these seasons the league dialed in on settings that
                    obtained more realistic results, resulting in realism in
                    player performance and game outcomes. This was the most
                    stable era in terms of sim settings.
                  </p>
                  <p>
                    <span className="font-semibold">S21-S25 52 Game Era:</span>{' '}
                    For a brief period, teams played 52 games instead of the
                    usual 50.
                  </p>
                </div>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h3 className="font-semibold">
                <AccordionButton>
                  <span className="inline-block flex-1 text-left">
                    Where is the SHL playoff data from S6-S17?
                  </span>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel>
                The playoff data for Seasons 6 through 17 of the SHL is
                unfortunately unavailable. During these early years, the league
                was less structured, and as a result, the playoff data was not
                consistently recorded or preserved.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h3 className="font-semibold">
                <AccordionButton>
                  <span className="inline-block flex-1 text-left">
                    Where is the early S1-S14 SMJHL data?
                  </span>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel>
                The data for the early SMJHL seasons (S1-S14) was not preserved,
                much like the SHL during its early years. As a result, only
                limited information is available for these seasons.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h3 className="font-semibold">
                <AccordionButton>
                  <span className="inline-block flex-1 text-left">
                    Why is there missing data?
                  </span>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel>
                Missing data, such as player builds and schedules, is a result
                of the limitations in the current index. Adding and preserving
                this information would have required significant infrastructure
                development, which would have delayed the release. As a result,
                certain data was not included.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h3 className="font-semibold">
                <AccordionButton>
                  <span className="inline-block flex-1 text-left">
                    What if I find something in the data that&apos;s wrong?
                  </span>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel>
                If you find any inaccuracies or incorrect data, feel free to
                reach out to any current Head Office member or contact Luke on
                the SHL site or on Discord.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h3 className="font-semibold">
                <AccordionButton>
                  <span className="inline-block flex-1 text-left">
                    Where is the IIHF and WJC information?
                  </span>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel>
                IIHF and WJC information is difficult to find and has mostly
                been lost due to time. We&apos;re hopeful that some of the STHS
                data for IIHF and WJC will be available in the future, but
                it&apos;s currently missing.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
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
