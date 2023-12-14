import { useState, useEffect, useRef } from "react"

const useWorker = <T>(url: string, initialState: T, workerMessages: any[]) => {
  const workerRef = useRef<Worker>()
  const [state, setState] = useState<T>(initialState)

  useEffect(() => {
    const worker = new Worker(new URL(url, import.meta.url), {
      type: "module",
    })

    worker.onmessage = e => setState(e.data)

    workerRef.current = worker

    return () => workerRef.current?.terminate()
  }, [])

  useEffect(() => {
    workerRef.current?.postMessage(workerMessages)
  }, workerMessages)

  return state
}

export default useWorker
