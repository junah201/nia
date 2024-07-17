import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { COOKIE } from '@/constants/cookie';
import { removeCookie } from '@/lib/Cookie';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    removeCookie(COOKIE.KEY.ACCESS_TOKEN);
    navigate('/');
  }, []);

  return (
    <div>
      <h1>Logout</h1>
    </div>
  );
};

export default Logout;
