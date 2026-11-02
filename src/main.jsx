import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AugMindPage from './pages/AugMindPage.jsx'
import FormaPage from './pages/FormaPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CareersPage from './pages/CareersPage.jsx'

// Pages, chosen by path (vercel.json rewrites every path to index.html).
const pages = { '/augmind': AugMindPage, '/forma': FormaPage, '/contact': ContactPage, '/about': AboutPage, '/careers': CareersPage }
const Page = pages[window.location.pathname.replace(/\/$/, '')] ?? App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
