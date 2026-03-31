import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './themes/ThemeContext'
import App from './App.jsx'

// 레트로 픽셀 테마 CSS
import './themes/pixel/pixel-base.css'
import './themes/pixel/pixel-hamster.css'
import './themes/pixel/pixel-guinea.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
