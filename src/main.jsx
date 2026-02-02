import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import NewButton from './Components/NewButton.jsx'
import Options from './Components/Options.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* <App/> */}
      <Options></Options>
    </BrowserRouter>
  </StrictMode>,
)
