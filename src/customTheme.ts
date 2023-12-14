import { ThemeConfig, extendTheme } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "dark",
}

const customTheme = extendTheme({ config })

export default customTheme
