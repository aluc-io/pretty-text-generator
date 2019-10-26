import { Slider } from '@material-ui/core'
import { isArray } from 'util'
import { useRef, useEffect } from 'react'
import { Tooltip } from '@material-ui/core'

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

export default (props) => {
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
