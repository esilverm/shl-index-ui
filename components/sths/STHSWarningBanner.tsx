import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  CloseButton,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { Link } from '../common/Link';

import { STHS_INFO_MODAL_NAME } from './STHSInfoModal';

export const STHSWarningBanner = () => {
  const route = useRouter();
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  return isVisible ? (
    <Alert status="info">
      <AlertIcon alignSelf="flex-start" />
      <div className="flex-col">
        <AlertTitle>Current results are from the STHS Game Engine</AlertTitle>
        <AlertDescription>
          As a result, the index may be missing certain stats and results
          present in seasons simmed by the FHM game engine.{' '}
          <Link
            href={{
              pathname: route.pathname,
              query: { overlay: STHS_INFO_MODAL_NAME, ...route.query },
            }}
            className="font-semibold hover:underline"
          >
            Learn more about STHS
          </Link>
        </AlertDescription>
      </div>
      <CloseButton
        onClick={onClose}
        position="relative"
        right={-1}
        top={-1}
        alignSelf="flex-start"
      />
    </Alert>
  ) : null;
};
