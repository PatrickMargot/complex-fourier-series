import { useState, useEffect, useRef } from "react"
import fourierPointsWorker from "../utils/fourierPointsWorker?worker"
import { FourierPointsData } from "../utils/fourierPointsWorker"
import { Complex } from "../utils/complex"

const useFourierPointsWorker = (fourierPointsData: FourierPointsData) => {
  const workerRef = useRef<Worker>()
  const [fourierPoints, setFourierPoints] = useState<Complex[]>([])

  useEffect(() => {
    const worker = new fourierPointsWorker()

    worker.onmessage = e => setFourierPoints(e.data)

    workerRef.current = worker

    return () => workerRef.current?.terminate()
  }, [])

  useEffect(() => {
    workerRef.current?.postMessage(fourierPointsData)
  }, fourierPointsData)

  return fourierPoints
}

export default useFourierPointsWorker
