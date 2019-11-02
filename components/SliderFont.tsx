import { Tooltip } from '@material-ui/core'
import { useEffect, useRef } from 'react'
import WebFont from 'webfontloader'
import SliderBasic from './SliderBasic'
import { findIndex } from 'lodash'

const TooltipFont = (props) => {
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

export const getFontFamilyFromFontInfo = (fontInfo: IFontInfo) => {
  const { fontNameArr, active } = fontInfo
  return active ? `"${fontNameArr[0]}", ${fontNameArr[1]}` : fontNameArr[1]
}
export const fontArr = [
  ['Nanum Gothic', "sans-serif"],
  ['Noto Sans KR', "sans-serif"],
  ['Nanum Myeongjo', "serif"],
  ['Gothic A1', "sans-serif"],
  ['Sunflower', "sans-serif"],
  ['Nanum Gothic Coding', "monospace"],
  ['Nanum Pen Script', "cursive"],
  ['Nanum Brush Script', "cursive"],
  ['Noto Serif KR', "serif"],
  ['Black Han Sans', "sans-serif"],
  ['Do Hyeon', "sans-serif"],
  ['Jua', "sans-serif"],
  ['Dokdo', "cursive"],
  ['Gugi', "cursive"],
  ['Song Myung', "serif"],
  ['Gaegu', "cursive"],
  ['Poor Story', "cursive"],
  ['Hi Melody', "cursive"],
  ['Stylish', "sans-serif"],
  ['East Sea Dokdo', "cursive"],
  ['Kirang Haerang', "cursive"],
  ['Gamja Flower', "cursive"],
  ['Cute Font', "cursive"],
  ['Black And White Picture', "sans-serif"],
  ['Yeon Sung', "cursive"],
  ['Single Day', "cursive"],
]


export interface IFontInfo {
  fontNameArr: string[]
  active: boolean
  pending: boolean
}

type TStateFontArr = IFontInfo[]

interface IActionFontArr {
  type: 'ACTIVE_FONT' | 'LOADING_FONT'
  fontName: string
}

export const reducerFontArr = (state: TStateFontArr, action: IActionFontArr) => {
  const idx = findIndex(state, f => f.fontNameArr[0] === action.fontName)
  console.log('idx: ' + idx)

  switch (action.type) {
    case 'LOADING_FONT':
      return [
        ...state.slice(0,idx),
        { ...state[idx], active: true },
        ...state.slice(idx+1),
      ]

    case 'ACTIVE_FONT':
      return [
        ...state.slice(0,idx),
        { ...state[idx], active: true },
        ...state.slice(idx+1),
      ]

    default:
      return state
  }
}

export const initStateFontArr = fontArr.map( arr => {
  // const fontFamily = `'${arr[0]}', ${arr[1]}`
  return { fontNameArr: arr, active: false, pending: false }
})

interface IProps {
  fontIdx: number
  setFontIdx: (idx: number) => void
  stateFontArr: TStateFontArr
  dispatchFontArr: React.Dispatch<IActionFontArr>
}

/*
WebFont.load({
  google: { families: initStateFontArr.map( item => item.fontNameArr[0]) },
})
*/

export default (props: IProps) => {
  const { stateFontArr, dispatchFontArr, fontIdx, setFontIdx } = props
  const fontInfo = stateFontArr[fontIdx]
  // const [title, setTitle] = useState(getTitle(fontInfo))

  const { fontNameArr, active } = fontInfo
  const title = active ? fontNameArr[0] : `${fontNameArr[0]} (loading...)`

  if (!fontInfo.active && !fontInfo.pending) {
    WebFont.load({
      google: { families: [fontNameArr[0]] },
      active: () => {
        console.log('active: ' + fontNameArr[0])
        dispatchFontArr({ type: 'ACTIVE_FONT', fontName: fontNameArr[0] })
      }
    })
  }


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
