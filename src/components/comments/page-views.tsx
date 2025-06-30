function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getMockPageViews(): number {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 6) {
    return getRandomNumber(1, 5);
  } else if (hour >= 6 && hour < 12) {
    return getRandomNumber(5, 10);
  } else if (hour >= 12 && hour < 18) {
    return getRandomNumber(10, 15);
  } else {
    return getRandomNumber(15, 30);
  }
}

export default function MonthlyPageViews() {
  return <span>viewing</span>;
}
