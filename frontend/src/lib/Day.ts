import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('ko');

dayjs.updateLocale('ko', {
  relativeTime: {
    future: '방금',
    past: '%s 전',
    s: '방금',
    m: '1분',
    mm: '%d분',
    h: '1시간',
    hh: '%d시간',
    d: '1일',
    dd: '%d일',
    M: '1달',
    MM: '%d달',
    y: '1년',
    yy: '%d년',
  },
});

export const utcToKST = (date: string) => {
  const createdAtUTC = dayjs.utc(date);
  return createdAtUTC.tz('Asia/Seoul');
};

export const fromNow = (date: string | Date) => {
  return dayjs(date).fromNow();
};
