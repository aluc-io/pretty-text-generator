import { PixiComponent } from '@inlet/react-pixi'
import { TextStyle, Text as PIXIText} from 'pixi.js'
import { throttle } from 'lodash'
import { IFontInfo, getFontFamilyFromFontInfo } from '../logic/reducerFont'

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

const throttledUpdateText = throttle(updateText, 50)

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

    throttledUpdateText(instance, oldProps, newProps)
  }
})

export default PixiComponentText
