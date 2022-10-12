import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme: Dict = extendTheme(
  {
    config,
  },
  {
    colors: {
      brand: {
        100: "#f7fafc",
        // ...
        900: "#1a202c",
      },
    },
    styles: {
      global: () => ({
        body: {},
      }),
    },
  }
);
