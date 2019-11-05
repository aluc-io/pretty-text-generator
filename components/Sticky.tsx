import { useEffect, useState, CSSProperties } from "react"

const PADDING = 10

interface IProps {
  baseline: number
}

const useIsFixed = (initValue: boolean, baseline: number) => {
  const [isFixed, setIsFixed] = useState(initValue)
  useEffect(() => {
    const handler = () => {
      const newIsFixed = window.scrollY > baseline - PADDING
      if (newIsFixed === isFixed) return

      setIsFixed(newIsFixed)
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [baseline, isFixed])
  return isFixed
}

const Sticky: React.FunctionComponent<IProps> = props => {
  const { baseline } = props
  const isFixed = useIsFixed(false, baseline)
  const style: CSSProperties = {
    position: isFixed ? 'fixed' : 'absolute',
    top: isFixed ? 0 : baseline,
    paddingTop: isFixed ? PADDING : 0,
    paddingBottom: isFixed ? PADDING : 0,
    paddingLeft: PADDING,
    paddingRight: PADDING,
    backgroundColor: 'white',
    zIndex: 9,
  }

  return (
    <div style={style}>
      {props.children}
    </div>
  )
}

export default Sticky
