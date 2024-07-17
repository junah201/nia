import { Auth } from 'aws-amplify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/components/ui/use-toast';
import { COOKIE } from '@/constants/cookie';
import { setCookie } from '@/lib/Cookie';

const Token = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchToken = async () => {
      const currentSession = await Auth.currentSession();
      const accessToken = currentSession.getIdToken().getJwtToken();

      if (!accessToken) {
        toast({
          variant: 'destructive',
          description: '로그인 정보를 가져오는데 실패했습니다.',
        });
        navigate('/login');
        return;
      }

      const oneDayLater = new Date();
      oneDayLater.setDate(oneDayLater.getDate() + 1);
      setCookie(COOKIE.KEY.ACCESS_TOKEN, accessToken, {
        path: '/',
        maxAge: 60 * 60 * 24,
        expires: oneDayLater,
      });
      toast({
        variant: 'default',
        description: '로그인 성공',
      });
      navigate('/');
    };

    fetchToken();
  }, []);

  return <>로그인 중..</>;
};

export default Token;
