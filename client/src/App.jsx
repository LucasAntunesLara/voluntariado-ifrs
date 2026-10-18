import './App.css'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import EventsList from './pages/events'
import CreateEvent from './pages/events/create'
import Dashboard from './pages/dashboard'
import Home from './pages/home'
import Profile from './pages/profile'
import {useAuth} from './contexts/useAuth'
import Volunteers from './pages/volunteers'

function App() {
  const {user} = useAuth()

  const router = createBrowserRouter([
    {
      path: '/',
      element: user ? <Dashboard /> : <Home />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/cadastro',
      element: <Register />,
    },
    {
      path: '/eventos',
      element: <EventsList />,
    },
    {
      path: '/eventos/novo',
      element: <CreateEvent />,
    },
    {
      path: '/eventos/:id/editar',
      element: <CreateEvent />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/perfil',
      element: user ? <Profile /> : <Navigate to="/login" replace />,
    },
    {
      path: '/voluntarios',
      element:
        user?.role === 'admin' ? <Volunteers /> : <Navigate to="/" replace />,
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
