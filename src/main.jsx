import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexto/AuthContexto.jsx'
import { PoemasProvider } from './contexto/PoemasContexto.jsx'
import { CadaverProvider } from './contexto/CadaverContexto.jsx'

createRoot(document.getElementById('root')).render(
<BrowserRouter>
  <StrictMode>
    <CadaverProvider>
    <AuthProvider>
      <PoemasProvider>
        <App />
      </PoemasProvider>
    </AuthProvider>
    </CadaverProvider>
  </StrictMode>
</BrowserRouter>  
)
