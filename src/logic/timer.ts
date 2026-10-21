import { MILLISECONDS_PER_SECOND } from '../data/difficulty';

export const calculateTimeLeft = (endsAt: number, now: number): number => {
  return Math.max(0, Math.ceil((endsAt - now) / MILLISECONDS_PER_SECOND));
};
