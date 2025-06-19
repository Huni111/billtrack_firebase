import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root';
import Bills from './Bills';
import Board from './Board';
import Settings from './Setting';
import Nou from './Nou'
import { AuthProvider } from "./AuthContext";




function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/bills',
          element: <Bills />
        },
        {
          path: '/settings',
          element: <Settings />
        },
        {
          path: '/',
          element: <Board />
        },
        {
          path: '/nou',
          element: <Nou />
        }
      ]
    }
  ]);

  return (
    <>
    <AuthProvider>
      <RouterProvider router={router}>
        {router}
      </RouterProvider>
      </AuthProvider>
    </>
  );
}

export default App;
