import React, { useState } from 'react'
import { Stage, Text, PixiComponent} from '@inlet/react-pixi'
import { TextStyle, Graphics, Texture, Sprite } from 'pixi.js'
import { RGBColor, HuePicker } from 'react-color'
import rgbHex from 'rgb-hex'
import WebFont from 'webfontloader'
import { TextField } from '@material-ui/core'
import SliderBasic from './SliderBasic'
import TooltipFont, { fontArr } from './TooltipFont'
import Trianglify from 'trianglify'

WebFont.load({
  google: {
    families: fontArr.map(arr => arr[0])
  }
})


const initColorBG: RGBColor = { r: 189, g: 16, b: 224, a: 1 }
const initColorText: RGBColor = { r: 0, g: 0, b: 0, a: 1 }
const initText = '길동'
const initFontIdx = 3

type RectangleProps = { x: number, y: number, color: number, alpha: number, width: number, height: number }

const Rectangle2 = PixiComponent<RectangleProps, Sprite>('Rectangle2', {
  create(props) {
    const pattern = Trianglify({
      height: props.height,
      width: props.width,
      cell_size: 40,
      seed: 10,
    })
    const texture = Texture.from(pattern.canvas())
    return new Sprite(texture);
  },
});

const Rectangle = PixiComponent<RectangleProps, PIXI.Graphics>('Rectangle', {
  create() {
    return new Graphics();
  },
  applyProps(ins: Graphics, _: RectangleProps, newProps: RectangleProps) {
    ins.clear();
    ins.beginFill(newProps.color, newProps.alpha);
    ins.drawRect(newProps.x, newProps.y, newProps.width, newProps.height);
    ins.endFill();
  }
});

const getColorNumber = (color: RGBColor) => {
  return Number(`0x${rgbHex(color.r, color.g, color.b)}`)
}

const Photo = () => {
  const [text, setText] = useState(initText)
  const [colorBG, setColorBG] = useState(initColorBG)
  const [colorText, setColorText] = useState(initColorText)
  const [fontIdx, setFontIdx] = useState(initFontIdx)
  const [anchor, setAnchor] = useState(0.5)
  const [lineHeight, setLineHeight] = useState(0)
  const [fontSize, setFontSize] = useState(250)
  const [fontWeight, setFontWeight] = useState(400)
  const [letterSpacing, setLetterSpacing] = useState(10)

  const colorBGNumber = getColorNumber(colorBG)
  const colorTextNumber = getColorNumber(colorText)
  const fontFamily = `'${fontArr[fontIdx][0]}', ${fontArr[fontIdx][1]}`
  return (
    <>
      <Stage width={512} height={512} options={{ transparent: true }}>
        <Rectangle color={colorBGNumber} alpha={0.5} x={0} y={0} width={512} height={512}/>
        <Rectangle color={0xffeebb} alpha={colorBG.a} x={0} y={0} width={256} height={256}/>
        <Rectangle2 color={0xffeebb} alpha={colorBG.a} x={0} y={0} width={512} height={512}/>
        <Text
          text={text}
          anchor={anchor}
          x={256}
          y={256}
          style={
            new TextStyle({
              // align: 'left',
              fontFamily,
              fontSize,
              fontWeight: String(fontWeight),
              lineHeight,
              // fill: ['#ffffff', '#00ff99'], // gradient
              fill: [colorTextNumber],
              // stroke: '#01d27e',
              // strokeThickness: 5,
              letterSpacing,
              // dropShadow: true,
              // dropShadowColor: '#ccced2',
              // dropShadowBlur: 4,
              // dropShadowAngle: Math.PI / 6,
              // dropShadowDistance: 6,
              // wordWrap: true,
              // wordWrapWidth: 440,
            })
          }
        />
      </Stage>
      <div>
        <TextField
          id="standard-multiline-flexible"
          label="Multiline"
          multiline
          rowsMax="4"
          value={text}
          onChange={e => setText(e.target.value)}
          margin="normal"
        />
      </div>

      <SliderBasic
        title={'fontSize'}
        step={10} min={10} max={400}
        value={fontSize}
        setValue={setFontSize}
      />
      <SliderBasic
        title={'lineHeight'}
        step={10} min={0} max={300}
        value={lineHeight}
        setValue={setLineHeight}
      />
      <SliderBasic
        title={'anchor'}
        step={0.1} min={0} max={1}
        value={anchor}
        setValue={setAnchor}
      />
      <SliderBasic
        title={'fontWeight'}
        step={100} min={200} max={800}
        value={fontWeight}
        setValue={setFontWeight}
      />
      <SliderBasic
        title={'letterSpacing'}
        step={1} min={0} max={40}
        value={letterSpacing}
        setValue={setLetterSpacing}
      />

      <SliderBasic
        title={fontArr[fontIdx][0]}
        step={1} min={0} max={fontArr.length-1}
        ValueLabelComponent={TooltipFont}
        value={fontIdx}
        setValue={setFontIdx}
      />

      <div>
        <div>text</div>
        <HuePicker
          color={colorText}
          onChange={e => setColorText(e.rgb)}
        />
      </div>

      <div>
        <div>background</div>
        <HuePicker
          color={colorBG}
          onChange={e => setColorBG(e.rgb)}
        />
      </div>
    </>
  )
}

export default Photo
