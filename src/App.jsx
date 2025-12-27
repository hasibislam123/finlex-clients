import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '../public/logo1.png'
import './App.css'
import { RouterProvider } from 'react-router';
import { router } from './routers/router';

function App() {
  return <RouterProvider router={router} />;
}

 export default App
