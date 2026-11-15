/** Science points → 0–5 stars. `starThresholds[i]` is the points needed for star i+1. */
export function starsFromScience(points: number, thresholds: readonly number[]): number {
  return thresholds.filter((t) => points >= t).length;
}
