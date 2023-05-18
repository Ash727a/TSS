// HELPER FUNCTIONS
export function secondsToHms(dt: number): string {
  dt = Number(dt);
  const h = Math.floor(dt / 3600);
  const m = Math.floor((dt % 3600) / 60);
  const s = Math.floor((dt % 3600) % 60);

  const time = padValues(h, 2) + ':' + padValues(m, 2) + ':' + padValues(s, 2);
  return time;
}

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function round(num: number, round: number = 2): number {
  return parseFloat(num.toFixed(round));
}

export function generateRandomValueInBounds(
  dataBounds: any,
  isErroring: boolean,
  decimalPlaces: number | undefined
): number {
  const max = isErroring ? dataBounds.ERROR_MAX : dataBounds.NOMINAL_MAX;
  const min = isErroring ? dataBounds.ERROR_MIN : dataBounds.NOMINAL_MIN;
  const value: number = Math.random() * (max - min) + min;
  return round(value, decimalPlaces);
}

export function decreaseTimeDisplay(hoursOfLife: number, percentage: number): string {
  const translatedLifetime = 100 / (hoursOfLife * 60 * 60);
  return secondsToHms(percentage / translatedLifetime);
}

function padValues(n: string | number | any[], width: number, z = '0'): string {
  n = n.toString();
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
