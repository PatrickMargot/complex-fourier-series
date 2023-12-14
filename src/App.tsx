import { useEffect, useMemo, useState, useRef } from "react"
import {
  Box,
  Checkbox,
  Fade,
  Flex,
  IconButton,
  Select,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import ChakraUIProvider from "./ChakraUIProvider"
import LabeledSlider from "./components/LabeledSlider"
import { SettingsIcon } from "@chakra-ui/icons"
import { range, scan, last, compose } from "ramda"
import { parametricSvg, parseSvgPath } from "./utils/svg"
import {
  Complex,
  ZERO,
  add,
  cis,
  conjugate,
  magnitude,
  multiply,
  product,
  sum,
} from "./utils/complex"
// import useWorker from "./hooks/useWorker"
import svgPaths from "./svgPaths"
import { getFourierPoints } from "./utils/fourier"
const { PI } = Math

function App() {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true })
  const [numberOfCircles, setNumberOfCircles] = useState(50)
  const [logScale, setLogScale] = useState(2)
  const [speed, setSpeed] = useState(2)
  const [isFollowMode, setIsFollowMode] = useState(false)
  const [selectedSvgIndex, setSelectedSvgIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const scale = 1.5 ** logScale - 1
  const maxCoefficients = useMemo(() => {
    const path = parseSvgPath(svgPaths[selectedSvgIndex].path)
    const shape = compose(conjugate, parametricSvg(path))

    const intSteps = 1000
    const cn = (f: (t: number) => Complex) => (n: number) =>
      sum(
        range(0, intSteps).map(i => {
          const t = i / intSteps
          const dt = 1 / intSteps
          return product([cis(-2 * PI * n * t), f(t), [dt, 0]])
        }),
      )

    return range(1, 501)
      .flatMap(n => [n, -n])
      .map(n => ({ n, c: cn(shape)(n) }))
  }, [selectedSvgIndex])
  const coefficients = useMemo(
    () => maxCoefficients.slice(0, numberOfCircles),
    [maxCoefficients, numberOfCircles],
  )
  const numberOfPoints = 500 * Math.ceil(logScale / 2)
  const fourierPoints = getFourierPoints(numberOfPoints, coefficients)
  //   const fourierPoints = useWorker<Complex[]>(
  //     "../utils/fourierPointsWorker.ts",
  //     [],
  //     [numberOfPoints, coefficients],
  //   )

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current === null) return
      canvasRef.current.height = window.innerHeight
      canvasRef.current.width = window.innerWidth
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    let animationFrameId = 0
    const ctx = canvasRef.current?.getContext("2d") as CanvasRenderingContext2D
    const lineWidth = 1.5 / scale

    const animate = (timestamp: number) => {
      const { width, height } = ctx.canvas
      const speedFactor = speed ** 2 / 100000
      const t = timestamp * speedFactor

      const circles = scan(
        ({ p1: prev }, { n, c }) => {
          const term = multiply(c, cis(n * 2 * PI * t))
          const curr = add(prev, term)
          const r = magnitude(term)
          return { p0: prev, p1: curr, r }
        },
        { p0: ZERO, p1: ZERO, r: 0 },
        coefficients,
      )
      const lastPoint = last(circles)?.p1 ?? ZERO

      ctx.setTransform(
        scale,
        0,
        0,
        -scale,
        width / 2 - (isFollowMode ? lastPoint[0] * scale : 0),
        height / 2 + (isFollowMode ? lastPoint[1] * scale : 0),
      )
      ctx.clearRect(
        -width / 2 / scale + (isFollowMode ? lastPoint[0] : 0),
        -height / 2 / scale + (isFollowMode ? lastPoint[1] : 0),
        width / scale,
        height / scale,
      )

      circles.forEach(({ p0, p1, r }, i) => {
        const vectorlineWidth = lineWidth / 1.001 ** (i + 1)

        ctx.lineWidth = vectorlineWidth
        ctx.strokeStyle = "white"
        ctx.beginPath()
        ctx.moveTo(...p0)
        ctx.lineTo(...p1)
        ctx.stroke()

        ctx.lineWidth = vectorlineWidth / 2
        ctx.strokeStyle = "#0077be"
        ctx.beginPath()
        ctx.arc(...p0, r, 0, 2 * PI)
        ctx.stroke()
      })

      ctx.lineWidth = lineWidth
      ctx.strokeStyle = "yellow"
      ctx.beginPath()
      fourierPoints.forEach(point => ctx.lineTo(...point))
      ctx.closePath()
      ctx.stroke()

      ctx.fillStyle = "red"
      ctx.beginPath()
      ctx.arc(...lastPoint, lineWidth, 0, 2 * PI)
      ctx.fill()

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [scale, coefficients, fourierPoints, speed, isFollowMode])

  return (
    <Flex h="100vh">
      <Fade
        in={!isOpen}
        variants={{
          exit: { width: "auto", overflow: "hidden" },
          enter: { width: 0 },
        }}
      >
        <VStack h="100%" w={300} p={3} align="stretch">
          <LabeledSlider
            value={numberOfCircles}
            onChange={setNumberOfCircles}
            label="Number of Circles"
            min={1}
            max={maxCoefficients.length}
          />
          <LabeledSlider
            value={logScale}
            onChange={setLogScale}
            label="Logarithmic Scale"
            min={0.1}
            max={20}
            step={0.1}
          />
          <LabeledSlider
            value={speed}
            onChange={setSpeed}
            label="Speed"
            min={0}
            max={10}
            step={0.1}
          />
          <Checkbox
            isChecked={isFollowMode}
            onChange={e => setIsFollowMode(e.target.checked)}
          >
            Follow Mode
          </Checkbox>
          <Select
            value={selectedSvgIndex}
            onChange={e => setSelectedSvgIndex(parseInt(e.target.value))}
          >
            {svgPaths.map(({ name }, i) => (
              <option key={i} value={i}>
                {name}
              </option>
            ))}
          </Select>
        </VStack>
      </Fade>
      <Box flex="1" bg="black" overflow="hidden">
        <IconButton
          zIndex="sticky"
          aria-label="Settings"
          size="sm"
          m="1"
          position="absolute"
          icon={<SettingsIcon />}
          onClick={onToggle}
        />
        <Fade
          in={!isOpen}
          variants={{
            exit: { transform: "translateX(-150px)" },
            enter: { transform: "translateX(0)" },
          }}
        >
          <canvas ref={canvasRef} />
        </Fade>
      </Box>
    </Flex>
  )
}

export default function WrappedApp() {
  return (
    <ChakraUIProvider>
      <App />
    </ChakraUIProvider>
  )
}
