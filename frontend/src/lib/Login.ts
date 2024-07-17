import { COOKIE } from '@/constants/cookie';
import { getCookie } from '@/lib/Cookie';

export const isLogin = () => {
  const token = getCookie(COOKIE.KEY.ACCESS_TOKEN);
  return !!token;
};
