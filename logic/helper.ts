import { once } from 'lodash'
import { useState, useEffect } from "react"

const CANVAS_WIDTH = 512
const MOBILE_LEFT_PADDING = 10

export const getScale = (windowWidth: number) => {
  return windowWidth > (CANVAS_WIDTH + MOBILE_LEFT_PADDING*2)
    ? 1
    : (windowWidth - MOBILE_LEFT_PADDING*2) / CANVAS_WIDTH
}

const initialize = once((func: Function) => func())

export const useScale = (initValue: number) => {
  const [scale, setScale] = useState(getScale(initValue))
  const handleResize = () => setScale(getScale(window.innerWidth))
  useEffect(() => {
    initialize(handleResize)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })
  return scale
}
