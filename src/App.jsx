import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root';




function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/bills'
        },
        {
          path: '/settings'
        }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router}>
        {router}
      </RouterProvider>
    </>
  );
}

export default App;
