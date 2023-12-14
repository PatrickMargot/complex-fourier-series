import { range } from "ramda"
import { Complex, cis, multiply, sum } from "./complex"
const { PI } = Math

export type FourierCoefficient = {
  n: number
  c: Complex
}

export const getFourierPoints = (
  numberOfPoints: number,
  coefficients: FourierCoefficient[],
) =>
  range(0, numberOfPoints).map(n => {
    const t = n / numberOfPoints
    const point = sum(
      coefficients.map(({ n, c }) => multiply(c, cis(n * 2 * PI * t))),
    )
    return point
  })
