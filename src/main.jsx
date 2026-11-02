import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AugMindPage from './pages/AugMindPage.jsx'

// Two pages, chosen by path (vercel.json rewrites every path to index.html).
const Page = window.location.pathname.replace(/\/$/, '') === '/augmind' ? AugMindPage : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
