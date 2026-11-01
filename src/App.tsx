import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout from './Layout/Layout';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import Notfound from './Pages/Notfound/Notfound';
import Profile from './Pages/Profile/Profile';
import AuthContextProvider from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import ProtectedAuth from './Components/ProtectedRoute/ProtectedAuth';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import PostDetails from './Pages/PostDetails/PostDetails';
import { Toaster } from 'react-hot-toast';
import { useNetworkState } from 'react-use';
import Offline from './Components/Offline/Offline';
import ChangePassword from './Pages/ChangePassword/ChangePassword';

const query = new QueryClient();

const routers = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: 'home',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <ProtectedAuth>
            <Login />
          </ProtectedAuth>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectedAuth>
            <Register />
          </ProtectedAuth>
        ),
      },
      {
        path: 'change-password',
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: 'postdetails/:id',
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'Profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Notfound /> },
    ],
  },
]);

function App() {
  // detect offline

  const { online } = useNetworkState();

  return (
    <>
      {!online && <Offline />}
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <Toaster />
          <RouterProvider router={routers}></RouterProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
