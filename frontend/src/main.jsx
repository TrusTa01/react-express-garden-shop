import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces/opsz.css';
import './styles/global.css';
import App from './App';
import store from './store';

// BASE_URL is "/" locally and e.g. "/garden-shop/" on GitHub Pages (VITE_BASE).
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
