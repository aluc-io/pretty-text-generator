import React, { useReducer, useRef } from 'react'
import { SketchPicker } from 'react-color'
import { TextField, Button } from '@material-ui/core'
import { range, isEqual } from 'lodash'
import colors from 'nice-color-palettes'
import ReactGA from 'react-ga'

import SliderBasic from './SliderBasic'
import SliderFont, { reducerFontArr, initStateFontArr, getFontFamilyFromFontInfo } from './SliderFont'
import { useScale } from '../logic/helper'
import reducer, { initState } from '../logic/reducer'
import ImageCanvas from './ImageCanvas'
import Sticky from './Sticky'

console.log(process.env.GA_TRACKING_ID)
ReactGA.initialize(process.env.GA_TRACKING_ID)
ReactGA.pageview(window.location.pathname + window.location.search)

const download = (ref: any, text: string) => {
  console.log('download')
  if (!ref.current) return

  console.log('download2')
  const canvas: HTMLCanvasElement = ref.current._canvas
  const link = document.createElement('a')
  link.download = 'pretty-text.png'
  link.href = canvas.toDataURL('image/png')
  link.click()

  ReactGA.event({ category: 'order', action: text, label: 'download-image' })
}

const CanvasAndController = () => {
  console.log('render Photo')
  const scale = useScale(window.innerWidth)
  const [state, dispatch] = useReducer(reducer, initState);
  const set = (key: string) => (value: any) => dispatch({ type: 'SET', key, value })
  const {
    text, colorText, anchor, seed, cellSize, xColorsIdx, lineHeight,
    fontSize, fontWeight, letterSpacing, fontIdx,
  } = state

  const [stateFontArr, dispatchFontArr] = useReducer(reducerFontArr, initStateFontArr)
  const fontInfo = stateFontArr[fontIdx]
  const fontFamily = getFontFamilyFromFontInfo(fontInfo)
  const ref = useRef()

  return (

    <div className='main'>
      <Sticky baseline={scale === 1 ? 135 : 110}>
        <div
          className='canvasBox'
          style={{
            transform: `scale(${scale})`,
            width: 512 * scale,
            height: 512 * scale,
          }}>
          <ImageCanvas {...state} fontInfo={fontInfo} _ref={ref}/>
        </div>
      </Sticky>

      <div className='controler'>
        <div style={{ height: 100 }}>
          <TextField
            id="standard-multiline-flexible"
            label="Main Text"
            className={'text'}
            multiline
            rowsMax="4"
            value={text}
            onChange={e => set('text')(e.target.value)}
            margin="normal"
            fullWidth={true}
          />
        </div>

        <SliderFont
          fontIdx={fontIdx}
          setFontIdx={set('fontIdx')}
          stateFontArr={stateFontArr}
          dispatchFontArr={dispatchFontArr}
        />

        <SliderBasic
          title={'fontSize'} step={10} min={10} max={500}
          value={fontSize} setValue={set('fontSize')}
        />
        <SliderBasic
          title={'lineHeight'} step={10} min={0} max={500}
          value={lineHeight} setValue={set('lineHeight')}
        />
        <SliderBasic
          title={'anchor'} step={0.1} min={0} max={1}
          value={anchor} setValue={set('anchor')}
        />
        <SliderBasic
          title={'fontWeight'} step={100} min={200} max={800}
          value={fontWeight} setValue={set('fontWeight')}
        />
        <SliderBasic
          title={'letterSpacing'} step={2} min={-60} max={60}
          value={letterSpacing} setValue={set('letterSpacing')}
        />
        <SliderBasic
          title={'seed'} step={10} min={10} max={400}
          value={seed} setValue={set('seed')}
        />
        <SliderBasic
          title={'cellSize'}
          step={null} min={10} max={300}
          marks={[
            ...range(10,300,10).map(value => ({ value })),
            {value:300},
          ]}
          value={cellSize} setValue={set('cellSize')}
        />
        <div/>
        <SliderBasic
          title={'colorCombination'} step={1} min={1} max={colors.length-1}
          value={xColorsIdx} setValue={xColorsIdx => {
            if (state.xColorsIdx === xColorsIdx) return
            dispatch({ type: 'SET_X_COLORS_IDX', xColorsIdx })
          }}
        />

        <div style={{height:20}}/>
        <div>
          <div>text color</div>
          <SketchPicker
            color={colorText}
            onChange={e => {
              if (isEqual(state.colorText, e.rgb)) return
              console.log('SET_COLOR_TEXT')
              set('colorText')(e.rgb)
            }}
          />
        </div>

        <div style={{height:20}}/>

        <Button
          style={{width: '100%'}}
          variant="outlined"
          color="primary"
          onClick={() => download(ref, text)}
        >
          Download
        </Button>
      </div>

      <div style={{height:20}}/>

      <style jsx>{`
        :global(.text .MuiInput-inputMultiline) {
          font-family: ${fontFamily};
          font-size: 28px;
          line-height: 28px;
          padding: 0px;
          width: 512px;
        }
        .canvasBox {
          width: 512px;
          height: 512px;
          position: relative;
          top: 0px;
        }
        .controler {
          margin-top: ${(512)*scale + 60}px;
          padding: 0px 10px 0px 10px;
        }
        @media (max-width: 512px) {
          .canvasBox {
            transform-origin: top left;
          }
          .controler {
            padding: 0px 18px 0px 18px;
          }
        }
      `}</style>
    </div>
  )
}

export default CanvasAndController
