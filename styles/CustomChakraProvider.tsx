import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { colors } from 'utils/theme/colors';

export const chakraTheme: Partial<ChakraTheme> = {
  components: {
    Menu: {
      baseStyle: {
        list: {
          maxHeight: '300px',
          overflowY: 'auto',
          minWidth: 'max-content',
          w: '100%',
          zIndex: 100,
          bg: colors.background.primary,
          borderColor: colors.border.primary,
        },
        item: {
          fontFamily: 'var(--font-montserrat)',
          color: colors.text.primary,
          bg: colors.background.primary,
        },
      },
    },
    Tabs: {
      variants: {
        line: {
          tab: {
            _selected: {
              borderColor: '#ADB5BD',
              color: 'black',
            },
          },
        },
      },
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: '',
        color: '',
      },
    }),
  },
};

const theme = extendTheme(chakraTheme);

export const CustomChakraProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => (
  <ChakraProvider resetCSS={false} theme={theme}>
    {children}
  </ChakraProvider>
);
