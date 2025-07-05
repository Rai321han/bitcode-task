export default function getTimeString(timeUTC) {
  const now = new Date();
  const startTimeLocal = new Date(timeUTC);
  const elapsedTime = now.getTime() - startTimeLocal.getTime();

  let result = "";
  const seconds = elapsedTime / 1000;
  const minute = seconds / 60;
  const hours = minute / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const years = days / 365;

  if (seconds < 60)
    result = seconds <= 1 ? "just now" : `${Math.floor(seconds)}s`;
  else if (days > 365) result = `${Math.floor(years)}yr`;
  else if (minute < 60) result = `${Math.floor(minute)}m`;
  else if (hours < 24) result = `${Math.floor(hours)}hr`;
  else if (days < 7) result = `${Math.floor(days)}d`;
  else if (days > 6 && days < 365) result = `${Math.floor(weeks)}w`;
  else result = `${Math.floor(days / 365)}yr`;
  return result;
}
