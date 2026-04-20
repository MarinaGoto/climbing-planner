export const getAngleDifference = (a: number, b: number) => {
  let diff = Math.abs(a - b);
  return diff > 180 ? 360 - diff : diff;
}