import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root';
import Bills from './Bills';
import Board from './Board';
import Setting from './Setting';
import Nou from './Nou'
import { AuthProvider } from "./AuthContext";
import { BillsProvider } from "./BillsContext";




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
          element: <Setting />
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
      <BillsProvider>
        <RouterProvider router={router}>
          {router}
        </RouterProvider>
      </BillsProvider>
      </AuthProvider>
    </>
  );
}

export default App;
