import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from './components/Utils/Context/index.jsx'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>
);
