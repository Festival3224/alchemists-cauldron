import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '../data/difficulty';

export const calculateTimeLeft = (endsAt: number, now: number): number => {
  return Math.max(0, Math.ceil((endsAt - now) / MILLISECONDS_PER_SECOND));
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const remainingSeconds = seconds % SECONDS_PER_MINUTE;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};
