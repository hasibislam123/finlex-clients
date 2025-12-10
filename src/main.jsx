import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider } from 'react-router'; 
import { router } from './routers/router.jsx';
import AuthProvider from './context/AuthProvider/AuthProvider.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

// Remove transition prevention class after page load
window.addEventListener('load', () => {
  document.body.classList.remove('onload-transition');
});

document.body.classList.add('onload-transition');

createRoot(document.getElementById('root')).render(
   <StrictMode>
      <ThemeProvider>
         <QueryClientProvider client={queryClient}>
            <AuthProvider>
            <RouterProvider router={router} />
         </AuthProvider>
         </QueryClientProvider>
      </ThemeProvider>
   </StrictMode>
);
