import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Dashboard from './components/Dashboard';
import AddEvent from './components/AddEvent';
import Help from './components/Help';
import { AuthProvider } from './auth/AuthContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/addevent",
    element: <AddEvent />,
  },
  {
    path: "/help",
    element: <Help />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
