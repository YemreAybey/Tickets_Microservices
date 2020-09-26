import 'bootstrap/dist/css/bootstrap.css';
import request from '../api/build-client';
import { ToastProvider } from 'react-toast-notifications';
import Header from '../components/header';

const Generic = ({ Component, pageProps, currentUser }) => {
  return (
    <ToastProvider autoDismiss autoDismissTimeout={3000} placement='top-center'>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </ToastProvider>
  );
};

// For custom app req, res is inside this ctx
Generic.getInitialProps = async ({ ctx, Component }) => {
  const req = request(ctx);
  const { data } = await req.get('/api/users/currentuser');
  let pageProps;

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, req, data.currentUser);
  }

  return { pageProps, ...data };
};

export default Generic;
