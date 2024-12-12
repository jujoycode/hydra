import './global.css'
import { Provider } from '@components/ui/provider'
import { ColorModeProvider } from '@components/ui/color-mode'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </Provider>
  </React.StrictMode>
)
