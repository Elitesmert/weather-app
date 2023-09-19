// main.tsx or main.jsx
import ReactDOM from 'react-dom/client'
import {NextUIProvider} from '@nextui-org/react'
import {inject} from '@vercel/analytics'
import App from './App'
import './index.css'

inject()
ReactDOM.createRoot(document.getElementById('root')).render(
  <NextUIProvider>
    <App />
  </NextUIProvider>
)
