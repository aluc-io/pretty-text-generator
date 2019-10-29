import React, { useState, useReducer, useRef } from 'react'
import { Stage, PixiComponent } from '@inlet/react-pixi'
import { TextStyle, Texture, Sprite, Text as PIXIText} from 'pixi.js'
import { RGBColor, SketchPicker } from 'react-color'
import rgbHex from 'rgb-hex'
import hexRgb from 'hex-rgb'
import { TextField, Button } from '@material-ui/core'
import Trianglify from 'trianglify'
import { range, isEqual, throttle, debounce } from 'lodash'
import colors from 'nice-color-palettes'
import SliderBasic from './SliderBasic'
import SliderFont, { reducerFontArr, initStateFontArr, IFontInfo } from './SliderFont'

interface IState {
  xColorsIdx: number
  colorText: RGBColor
}
interface IAction {
  type: 'SET_X_COLORS_IDX' | 'SET_COLOR_TEXT'
  xColorsIdx?: number
  colorText?: RGBColor
}
const reducerColor = (state: IState, action: IAction) => {
  switch (action.type) {
    case 'SET_X_COLORS_IDX':
      if (typeof action.xColorsIdx !== 'number') {
        console.warn("typeof action.xColorsIdx !== 'number'")
        return state
      }
      return {
        ...state,
        xColorsIdx: action.xColorsIdx,
        colorText: getRGBColorFromHexString(colors[action.xColorsIdx][3]),
      }
    case 'SET_COLOR_TEXT':
      return {
        ...state,
        colorText: action.colorText,
      }
    default:
      return state
  }
}

type TPropsTrianglify = {
  width: number, height: number,
  seed: number, cell_size: number,
  x_colors: string | false | string[],
  y_colors: string | false | string[],
}

const applyPropsTrianglifyRect = (sprite: Sprite, oldProps: TPropsTrianglify, newProps: TPropsTrianglify) => {
  if (isEqual(newProps, oldProps)) {
    console.log('isEqual applyPropsTrianglifyRect')
    return
  }
  const { height, width, cell_size, seed, x_colors, y_colors } = newProps
  const pattern = Trianglify({ height, width, cell_size, seed, x_colors })
  sprite.texture = Texture.from(pattern.canvas())
}
const createTrianglifyRect = (props: TPropsTrianglify) => {
  const { height, width, cell_size, seed, x_colors, y_colors } = props
  const pattern = Trianglify({ height, width, cell_size, seed, x_colors })
  const texture = Texture.from(pattern.canvas())
  return new Sprite(texture);
}

const TrianglifyRect = PixiComponent<TPropsTrianglify, Sprite>('TrianglifyRect', {
  create: createTrianglifyRect,
  applyProps: throttle((...args) => {
    console.log('throttle')
    applyPropsTrianglifyRect(...args)
  }, 50, { trailing: true }),
})
const TrianglifyRectLazy = PixiComponent<TPropsTrianglify, Sprite>('TrianglifyRectLazy', {
  create: createTrianglifyRect,
  applyProps: debounce((...args) => {
    console.log('deboucnce')
    applyPropsTrianglifyRect(...args)
  }, 1500, { trailing: true }),
})

type TPropsPixiComponentText = {
  text: string
  anchor: number
  x: number
  y: number
  fontInfo: IFontInfo
  style: {
    // align: 'left',
    fontSize: number
    fontWeight: string
    lineHeight: number
    // fill: ['#ffffff', '#00ff99'], // gradient
    fill: string | number | string[] | number[] | CanvasGradient | CanvasPattern
    stroke: string | number
    // strokeThickness: 5,
    letterSpacing: number,
    // dropShadow: true,
    // dropShadowColor: colors[xColorsIdx][4],
    // dropShadowBlur: 4,
    // dropShadowAngle: Math.PI / 6,
    // dropShadowDistance: 6,
    // wordWrap: true,
    // wordWrapWidth: 440,
  }
}

const getFontFamilyFromFontInfo = (fontInfo: IFontInfo) => {
  const { fontNameArr, active } = fontInfo
  return active ? `"${fontNameArr[0]}", ${fontNameArr[1]}` : fontNameArr[1]
}

const updateText = (instance: PIXIText, oldProps: TPropsPixiComponentText, props: TPropsPixiComponentText) => {
  const fontFamily = getFontFamilyFromFontInfo(props.fontInfo)
  const textStyle = new TextStyle({ ...props.style, fontFamily })
  instance.style = textStyle

  if (!oldProps || oldProps.text !== props.text) {
    instance.text = props.text
  }

  if (!oldProps || oldProps.anchor !== props.anchor) {
    instance.anchor.set(props.anchor)
  }
}

const PixiComponentText = PixiComponent<TPropsPixiComponentText, PIXIText>('PixiComponentText', {
  create: (props) => {
    const instance = new PIXIText(props.text)
    updateText(instance, null, props)
    instance.x = props.x
    instance.y = props.y
    return instance
  },
  applyProps: (instance, oldProps, newProps) => {
    // const { count: _, fontFamily: __, ...oldP } = oldProps
    // const { count, fontFamily, ...newP } = newProps
    // apply rest props to PIXI.Text
    // applyDefaultProps(instance, oldP, newP)
    if (!oldProps.fontInfo) {
      updateText(instance, oldProps, newProps)
      return
    }

    if (
      oldProps.fontInfo.fontNameArr === newProps.fontInfo.fontNameArr
      && oldProps.fontInfo.active !== newProps.fontInfo.active
    ) {
      // https://www.enea.sk/blog/preloading-web-font-pixi.js.html
      setTimeout(() => updateText(instance, oldProps, newProps), 300)
      return
    }

    updateText(instance, oldProps, newProps)
  }
})

const getColorNumberFromRGBColor = (color: RGBColor) => {
  return Number(`0x${rgbHex(color.r, color.g, color.b)}`)
}
const getRGBColorFromHexString = (color: string): RGBColor => {
  const rgb = hexRgb(color)
  return { r: rgb.red, g: rgb.green, b: rgb.blue, a: rgb.alpha }
}

const getXColors = (arr: string[]) => [arr[0], arr[1], arr[3]]

const download = (ref: any) => {
  if (!ref.current) return

  const canvas: HTMLCanvasElement = ref.current._canvas
  const link = document.createElement('a')
  link.download = 'pretty-text.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

const Photo = () => {
  console.log('render')
  const [text, setText] = useState('홍길동')
  const [fontIdx, setFontIdx] = useState(11)
  const [anchor, setAnchor] = useState(0.5)
  const [lineHeight, setLineHeight] = useState(0)
  const [fontSize, setFontSize] = useState(190)
  const [fontWeight, setFontWeight] = useState(400)
  const [letterSpacing, setLetterSpacing] = useState(10)
  const [seed, setSeed] = useState(10)
  const [cellSize, setCellSize] = useState(80)

  const initColorText: RGBColor = { r: 244, g: 244, b: 255, a: 1 }
  const initStateColor: IState = { colorText: initColorText, xColorsIdx: 66 }
  const [stateColor, dispatchColor] = useReducer(reducerColor, initStateColor);
  const { colorText, xColorsIdx } = stateColor
  const colorTextNumber = getColorNumberFromRGBColor(colorText)

  const [stateFontArr, dispatchFontArr] = useReducer(reducerFontArr, initStateFontArr)
  // const fontFamily = `'${fontArr[fontIdx][0]}', ${fontArr[fontIdx][1]}`
  const fontInfo = stateFontArr[fontIdx]
  const fontFamily = getFontFamilyFromFontInfo(fontInfo)
  console.log('fontFamily:' + fontFamily)
  const ref = useRef()

  return (
    <>
      <Stage ref={ref} width={512} height={512} options={{ preserveDrawingBuffer: true }}>
        {/*<Rectangle color={colorBGNumber} alpha={0.5} x={0} y={0} width={512} height={512}/>*/}
        {/* <Rectangle color={firstColorNumber} alpha={0.5} x={0} y={0} width={512} height={512}/> */}
        {/* 경계선이 투명하게 되는 부분을 비슷한 색으로 보정하기 위해 뒤에 한장 더 깐다 */}
        <TrianglifyRectLazy
          width={512} height={512}
          seed={seed} cell_size={200}
          x_colors={getXColors(colors[xColorsIdx])}
          y_colors={false}
        />
        <TrianglifyRect
          width={512} height={512}
          seed={seed} cell_size={cellSize}
          x_colors={getXColors(colors[xColorsIdx])}
          y_colors={false}
        />
        <PixiComponentText
          text={text}
          anchor={anchor}
          x={256}
          y={256}
          fontInfo={fontInfo}
          style={{
            // align: 'left',
            fontSize,
            fontWeight: String(fontWeight),
            lineHeight,
            // fill: ['#ffffff', '#00ff99'], // gradient
            fill: [colorTextNumber],
            stroke: colors[xColorsIdx][4],
            // strokeThickness: 5,
            letterSpacing,
            // dropShadow: true,
            // dropShadowColor: colors[xColorsIdx][4],
            // dropShadowBlur: 4,
            // dropShadowAngle: Math.PI / 6,
            // dropShadowDistance: 6,
            // wordWrap: true,
            // wordWrapWidth: 440,
          }}
        />
      </Stage>
      <div style={{ height: 100 }}>
        <TextField
          id="standard-multiline-flexible"
          label="Main Text"
          className={'text'}
          multiline
          rowsMax="4"
          value={text}
          onChange={e => setText(e.target.value)}
          margin="normal"
        />
      </div>

      <SliderFont
        fontIdx={fontIdx}
        setFontIdx={setFontIdx}
        stateFontArr={stateFontArr}
        dispatchFontArr={dispatchFontArr}
      />

      <SliderBasic
        title={'fontSize'} step={10} min={10} max={500}
        value={fontSize} setValue={setFontSize}
      />
      <SliderBasic
        title={'lineHeight'} step={10} min={0} max={500}
        value={lineHeight} setValue={setLineHeight}
      />
      <SliderBasic
        title={'anchor'} step={0.1} min={0} max={1}
        value={anchor} setValue={setAnchor}
      />
      <SliderBasic
        title={'fontWeight'} step={100} min={200} max={800}
        value={fontWeight} setValue={setFontWeight}
      />
      <SliderBasic
        title={'letterSpacing'} step={2} min={-60} max={60}
        value={letterSpacing} setValue={setLetterSpacing}
      />
      <SliderBasic
        title={'seed'} step={10} min={10} max={400}
        value={seed} setValue={setSeed}
      />
      <SliderBasic
        title={'cellSize'}
        step={null} min={10} max={300}
        marks={[
          ...range(10,300,10).map(value => ({ value })),
          {value:300},
        ]}
        value={cellSize} setValue={setCellSize}
      />
      <SliderBasic
        title={'colorCombination'} step={1} min={1} max={colors.length-1}
        value={xColorsIdx} setValue={xColorsIdx => {
          if (stateColor.xColorsIdx === xColorsIdx) return
          console.log('SET_X_COLORS_IDX')
          dispatchColor({ type: 'SET_X_COLORS_IDX', xColorsIdx })
        }}
      />

      <div>
        <div>text color</div>
        <SketchPicker
          color={colorText}
          onChange={e => {
            if (isEqual(stateColor.colorText, e.rgb)) return
            console.log('SET_COLOR_TEXT')
            dispatchColor({ type: 'SET_COLOR_TEXT', colorText: e.rgb })
          }}
        />
      </div>

      <div style={{height:20}}/>

      <Button
        style={{width:512}}
        variant="outlined" color="primary" onClick={() => download(ref)}>
        Download
      </Button>


      <style jsx>{`
        :global(.text .MuiInput-inputMultiline) {
          font-family: ${fontFamily};
          font-size: 28px;
          line-height: 28px;
          padding: 0px;
          width: 512px;
        }
      `}</style>
    </>
  )
}

export default Photo
