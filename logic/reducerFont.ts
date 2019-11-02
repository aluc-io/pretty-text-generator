import { findIndex } from 'lodash'
import WebFont from 'webfontloader'

export interface IFontInfo {
  fontNameArr: string[]
  active: boolean
  pending: boolean
}

export type TStateFontArr = IFontInfo[]

export interface IActionFontArr {
  type: 'ACTIVE_FONT' | 'INACTIVE_FONT' | 'LOADING_FONT'
  fontName: string
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

/*
WebFont.load({
  google: { families: initStateFontArr.map( item => item.fontNameArr[0]) },
})
*/

export const getFontFamilyFromFontInfo = (fontInfo: IFontInfo) => {
  const { fontNameArr, active } = fontInfo
  return active ? `"${fontNameArr[0]}", ${fontNameArr[1]}` : fontNameArr[1]
}

export const loadWebFont = (fontName: string) => new Promise<string>((resolve, reject) => {
  const families = [fontName === 'Sunflower' ? 'Sunflower:300' : fontName]
  WebFont.load({
    google: { families },
    active: () => resolve(fontName),
    inactive: () => reject(fontName),
  })
})

const reducerFontArr = (state: TStateFontArr, action: IActionFontArr) => {
  const idx = findIndex(state, f => f.fontNameArr[0] === action.fontName)

  switch (action.type) {
    case 'LOADING_FONT':
      return [
        ...state.slice(0,idx),
        { ...state[idx], pending: true },
        ...state.slice(idx+1),
      ]

    case 'ACTIVE_FONT':
      return [
        ...state.slice(0,idx),
        { ...state[idx], active: true, pending: false },
        ...state.slice(idx+1),
      ]

    case 'INACTIVE_FONT':
      return [
        ...state.slice(0,idx),
        { ...state[idx], pending: false },
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

export default reducerFontArr
