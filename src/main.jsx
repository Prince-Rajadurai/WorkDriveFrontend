import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import NewButton from './Components/NewButton.jsx'
// import 'primereact/resources/themes/saga-blue/theme.css'; // theme
// import 'primereact/resources/primereact.min.css';         // core styles
// import 'primeicons/primeicons.css';                       // icons

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}>
      <App/>
    </BrowserRouter>
  </StrictMode>
)
