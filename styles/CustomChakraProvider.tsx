import { ChakraProvider, ChakraTheme, extendTheme } from '@chakra-ui/react';
import React from 'react';

const chakraTheme: Partial<ChakraTheme> = {
  components: {
    Menu: {
      baseStyle: {
        list: {
          maxHeight: '300px',
          overflowY: 'auto',
          minWidth: 'max-content',
          w: '100%',
          zIndex: 100,
        },
        item: {
          fontFamily: 'var(--font-montserrat)',
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
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'rgb(18, 18, 18)' : 'rgb(233, 236, 239)',
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
