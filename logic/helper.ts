import { useState, useEffect } from "react"

const CANVAS_WIDTH = 512
const MOBILE_LEFT_PADDING = 10

export const getScale = (windowWidth: number) => {
  return windowWidth > (CANVAS_WIDTH + MOBILE_LEFT_PADDING*2)
    ? 1
    : (windowWidth - MOBILE_LEFT_PADDING*2) / CANVAS_WIDTH
}


export const useScale = (initValue: number) => {
  const [scale, setScale] = useState(initValue)
  useEffect(() => {
    const handleResize = () => setScale(getScale(window.innerWidth))
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  })

  return scale
}
