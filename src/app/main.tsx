import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './index';
import { appStarted } from './model/init';
import './styles/global';

appStarted();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
