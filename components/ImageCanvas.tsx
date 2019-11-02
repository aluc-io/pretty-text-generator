import React, { FunctionComponent } from 'react'
import rgbHex from 'rgb-hex'
import { isEqual, throttle, debounce } from 'lodash'
import { Texture, Sprite } from 'pixi.js'
import { Stage, PixiComponent } from '@inlet/react-pixi'
import Trianglify from 'trianglify'
import colors from 'nice-color-palettes'
import PixiComponentText from './PixiComponentText'
import { ICanvasState } from '../logic/reducer'
import { RGBColor } from 'react-color'
import { IFontInfo } from '../logic/reducerFont'

interface ITextCanvasProps extends ICanvasState {
  fontInfo: IFontInfo
  _ref: React.LegacyRef<Stage>,
}

type TPropsTrianglify = {
  width: number, height: number,
  seed: number, cell_size: number,
  x_colors: string | false | string[],
  y_colors: string | false | string[],
}

const getXColors = (arr: string[]) => [arr[1], arr[0], arr[2]]

const getColorNumberFromRGBColor = (color: RGBColor) => {
  return Number(`0x${rgbHex(color.r, color.g, color.b)}`)
}

const applyPropsTrianglifyRect = (sprite: Sprite, oldProps: TPropsTrianglify, newProps: TPropsTrianglify) => {
  if (isEqual(newProps, oldProps)) return

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
    // console.log('throttle')
    applyPropsTrianglifyRect(...args)
  }, 60, { trailing: true }),
})
const TrianglifyRectLazy = PixiComponent<TPropsTrianglify, Sprite>('TrianglifyRectLazy', {
  create: createTrianglifyRect,
  applyProps: debounce((...args) => {
    // console.log('deboucnce')
    applyPropsTrianglifyRect(...args)
  }, 1500, { trailing: true }),
})

const ImageCanvas: FunctionComponent<ITextCanvasProps> = props => {
  const {
    text, anchor, seed, cellSize, xColorsIdx, lineHeight,
    fontSize, fontWeight, colorText, letterSpacing, fontInfo,
    _ref,
  } = props

  const colorTextAsNumber = getColorNumberFromRGBColor(colorText)
  return (
    <Stage ref={_ref} width={512} height={512} options={{ preserveDrawingBuffer: true }}>
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
          fill: [colorTextAsNumber],
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

  )
}

export default ImageCanvas
