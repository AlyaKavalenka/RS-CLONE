import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import Form from './pages/Form/Form';
import Messenger from './pages/Messenger/Messenger';
import { firebaseConfig } from './firebase';
import AuthRoute from './auntification/AuthRoute/AuthRoute';

initializeApp(firebaseConfig);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute><Messenger /></AuthRoute>,
  },
  {
    path: '/login',
    element: <Form mode="login-phone" />,
  },
  {
    path: '/login-email',
    element: <Form mode="login-email" />,
  },
  {
    path: '/register-phone',
    element: <Form mode="register-phone" />,
  },
  {
    path: '/register-email',
    element: <Form mode="register-email" />,
  },
  {
    path: '/code',
    element: <Form mode="access-code" />,
  },
]);

function App() {
  return (
    <section className="container">
      <RouterProvider router={router} />
    </section>
  );
}

export default App;
