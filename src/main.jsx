import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getDistanceMeters } from "./utils/geo";
import {regenerateDailyPIN,getTodayPIN} from "./utils/pin";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
