import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import { extendTheme } from "@chakra-ui/theme-utils";
import './index.css'

const styles = {
  global: {
    body: {
      bgGradient: 'linear(to-br, navy, blue.900, indigo.900)'
    },
  },
};

const theme = extendTheme({ styles });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
)
