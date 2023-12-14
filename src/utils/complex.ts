const { cos, sin, sqrt } = Math

export type Complex = [number, number]
export const ZERO: Complex = [0, 0]
export const ONE: Complex = [1, 0]

export const add = ([a, b]: Complex, [c, d]: Complex): Complex => [a + c, b + d]
export const subtract = ([a, b]: Complex, [c, d]: Complex): Complex => [
  a - c,
  b - d,
]
export const sum = (xs: Complex[]) => xs.reduce(add, ZERO)
export const scale = (c: number, [a, b]: Complex): Complex => [c * a, c * b]
export const multiply = ([a, b]: Complex, [c, d]: Complex): Complex => [
  a * c - b * d,
  a * d + b * c,
]
export const product = (xs: Complex[]) => xs.reduce(multiply, ONE)
export const cis = (x: number): Complex => [cos(x), sin(x)]
export const magnitude = ([a, b]: Complex) => sqrt(a ** 2 + b ** 2)
export const fromReal = (a: number): Complex => [a, 0]
export const conjugate = ([a, b]: Complex): Complex => [a, -b]
