import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AugMindPage from './pages/AugMindPage.jsx'
import FormaPage from './pages/FormaPage.jsx'

// Pages, chosen by path (vercel.json rewrites every path to index.html).
const pages = { '/augmind': AugMindPage, '/forma': FormaPage }
const Page = pages[window.location.pathname.replace(/\/$/, '')] ?? App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
