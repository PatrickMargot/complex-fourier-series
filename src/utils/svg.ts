import { Complex, add, scale, sum } from "./complex"
import { parseSVG, makeAbsolute, CommandMadeAbsolute } from "svg-path-parser"

export const parseSvgPath = (svgPathString: string) =>
  makeAbsolute(parseSVG(svgPathString))

const linearBezier = (p0: Complex, p1: Complex) => (t: number) =>
  add(scale(1 - t, p0), scale(t, p1))
const quadraticBezier =
  (p0: Complex, p1: Complex, p2: Complex) => (t: number) =>
    sum([
      scale((1 - t) ** 2, p0),
      scale(2 * (1 - t) * t, p1),
      scale(t ** 2, p2),
    ])
const cubicBezier =
  (p0: Complex, p1: Complex, p2: Complex, p3: Complex) => (t: number) =>
    sum([
      scale((1 - t) ** 3, p0),
      scale(3 * (1 - t) ** 2 * t, p1),
      scale(3 * (1 - t) * t ** 2, p2),
      scale(t ** 3, p3),
    ])

export const parametricSvg =
  (path: CommandMadeAbsolute[]) =>
  (t: number): Complex => {
    if (t === 0) return [path[0].x, path[0].y]

    const sections = path.slice(1)
    const sectionIndex = Math.ceil(t * sections.length) - 1
    const newT = t * sections.length - sectionIndex

    const prevC = path[sectionIndex]
    const c = sections[sectionIndex]
    const { code } = c
    const start: Complex = [c.x0, c.y0]
    const end: Complex = [c.x, c.y]

    if (
      code === "M" ||
      code === "L" ||
      code === "H" ||
      code === "V" ||
      code === "Z"
    )
      return linearBezier(start, end)(newT)

    if (code === "Q") return quadraticBezier(start, [c.x1, c.y1], end)(newT)

    if (code === "C")
      return cubicBezier(start, [c.x1, c.y1], [c.x2, c.y2], end)(newT)

    throw Error(`SVG Path Command "${code}" not implemented`)
  }
