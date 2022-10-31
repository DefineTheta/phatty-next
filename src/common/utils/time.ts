import { DateTime } from 'luxon';

export const howLongAgo = (time: number) => {
  if (!time) {
    console.warn('An invalid input was passed to calculate how long ago');
    return '';
  }

  const luxonTime = DateTime.fromSeconds(time);
  const duration = luxonTime
    .diffNow()
    .negate()
    .shiftTo('months', 'days', 'hours', 'minutes', 'seconds')
    .normalize();

  if (duration.days > 0) {
    return luxonTime.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  }

  return `${duration.hours ? `${duration.hours} hours ` : ''}${
    duration.minutes ? `${duration.minutes} minutes ago` : 'ago'
  }`;
};
