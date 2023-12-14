import { FourierCoefficient, getFourierPoints } from "./fourier"

export type FourierPointsData = [number, FourierCoefficient[]]

self.onmessage = (e: MessageEvent<FourierPointsData>) => {
  const [numberOfPoints, coefficients] = e.data

  const fourierPoints = getFourierPoints(numberOfPoints, coefficients)

  self.postMessage(fourierPoints)
}
