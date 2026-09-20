import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './lib/useAuth.jsx'
import './index.css'

// HashRouter is used instead of BrowserRouter so deep links work from the
// file:// origin inside the Android WebView (the APK) with no server rewrites.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)
