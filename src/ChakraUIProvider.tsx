import { ChakraProvider } from "@chakra-ui/react"
import customTheme from "./customTheme"

const ChakraUIProvider = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
)

export default ChakraUIProvider
