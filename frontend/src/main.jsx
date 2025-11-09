import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

try {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  root.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 20px;
    ">
      <h1 style="color: #e20074; margin-bottom: 20px;">Something went wrong</h1>
      <p style="color: #666;">Please try refreshing the page</p>
      <pre style="
        margin-top: 20px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
        max-width: 800px;
        overflow-x: auto;
      ">${error.message}</pre>
    </div>
  `;
}
