import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { colors } from 'utils/theme/colors';

export const chakraTheme: Partial<ChakraTheme> = {
  components: {
    Button: {
      variants: {
        outline: {
          color: colors.text.primary,
          borderColor: colors.border.secondary,
          _hover: {
            bg: colors.background.secondary,
          },
        },
      },
    },
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
          tablist: {
            borderColor: colors.border.secondary,
          },
          tab: {
            color: colors.text.tertiary,
            _selected: {
              borderColor: colors.border.primary,
              color: colors.text.primary,
              fontWeight: 600,
            },
          },
        },
      },
    },
    Code: {
      baseStyle: {
        background: colors.background.secondary,
        color: colors.text.primary,
      },
    },
    Alert: {
      parts: ['container', 'icon'],
      baseStyle: {
        container: {
          display: 'flex',
          alignItems: 'center',
          py: '3',
          gap: '2',
          '&[data-status="info"]': {
            backgroundColor: colors.background.info,
          },
        },
        icon: {
          '&[data-status="info"]': {
            color: colors.text['info-icon'],
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: colors.background.primary,
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
