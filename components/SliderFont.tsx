import { Tooltip } from '@material-ui/core'
import { useEffect, useRef, ElementType } from 'react'
import SliderBasic from './SliderBasic'
import { fontArr, TStateFontArr, IActionFontArr, loadWebFont } from '../logic/reducerFont'
import { ValueLabelProps } from '@material-ui/core/Slider'

const TooltipFont: ElementType<ValueLabelProps> = (props) => {
  const { children, open, value } = props;
  const popperRef = useRef(null);
  useEffect(() => {
    if (!popperRef.current) return
    popperRef.current.update()
  })

  return (
    <Tooltip
      PopperProps={{ popperRef }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={fontArr[value][0]}
    >
      {children}
    </Tooltip>
  );
}

interface IProps {
  fontIdx: number
  setFontIdx: (idx: number) => void
  stateFontArr: TStateFontArr
  dispatchFontArr: React.Dispatch<IActionFontArr>
}

export default (props: IProps) => {
  const { stateFontArr, dispatchFontArr, fontIdx, setFontIdx } = props
  const fontInfo = stateFontArr[fontIdx]
  const { fontNameArr, active } = fontInfo
  const fontName = fontNameArr[0]
  const title = active ? fontName : `${fontName} (loading...)`

  useEffect( () => {
    if (fontInfo.active || fontInfo.pending) return

    dispatchFontArr({ type: 'LOADING_FONT', fontName })
    loadWebFont(fontName)
      .then( () => dispatchFontArr({ type: 'ACTIVE_FONT', fontName }))
      .catch( () => dispatchFontArr({ type: 'INACTIVE_FONT', fontName }))
  })

  return (
    <SliderBasic
      title={`fontFamily: ${title}`}
      labelType={'TITLE'}
      step={1} min={0} max={stateFontArr.length-1}
      ValueLabelComponent={TooltipFont}
      value={fontIdx}
      setValue={setFontIdx}
    />
  )
}
