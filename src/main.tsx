import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { ColorModeScript } from "@chakra-ui/react"
import App from "./App.tsx"
import customTheme from "./customTheme.ts"

const rootElement = document.getElementById("root")!
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
    <App />
  </React.StrictMode>,
)
