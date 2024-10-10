import { useLocation } from 'react-router-dom';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';

const Auth = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const login = queryParams.get('login');
  
  return (
    <div className='min-h-screen'>
      {login === 'true' && <Login />}
      {login === 'false' && <SignUp />}
    </div>
  );
};

export default Auth;