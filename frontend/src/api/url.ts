import { API } from '@/constants/api';
import { Axios } from '@/lib/Axios';

const axios = new Axios();

interface PostUrlParams {
  original_url: string;
  expired_at: '1 week' | '1 month' | '6 month' | '1 year' | '3 year';
}

export const postURL = async (data: PostUrlParams) => {
  const res = await axios.post(API.URL.POST, data);
  return res;
};
