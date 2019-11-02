import { Slider } from '@material-ui/core'
import { isArray } from 'util'
import { ElementType, memo } from 'react'
import { ValueLabelProps, Mark } from '@material-ui/core/Slider'
import { SlideProps } from '@material-ui/core/Slide'

interface IProps {
  title: string
  labelType?: 'TITLE_VALUE' | 'TITLE'
  min: number
  max: number
  step: number
  value: number
  marks?: boolean | Mark[]
  setValue: (value: number) => void
  ValueLabelComponent?: ElementType<ValueLabelProps>
  getAriaValueText?: (value: number, index: number) => string
}

const SliderBasic = (props: IProps) => {
  const { title, labelType='TITLE_VALUE' } = props
  const label = labelType === 'TITLE_VALUE'
    ? `${props.title}: ${props.value}`
    : title

  return (
    <div className='sliderBasic'>
      <div>
        <span>{label}</span>
      </div>
      <Slider
        value={props.value}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={props.step}
        ValueLabelComponent={props.ValueLabelComponent}
        marks={props.marks || true}
        min={props.min}
        max={props.max}
        onChange={(_, value) => {
          if (value === props.value) return
          props.setValue(isArray(value) ? value[0] : value)
        }}
        getAriaValueText={props.getAriaValueText}
      />
      <style jsx>{`
        .sliderBasic {
          margin-top: 12px;
        }
      `}</style>

    </div>
  )
}

const propsAreEqual = (prevProps: Readonly<IProps>, nextProps: Readonly<IProps>) => {
  // 현재 application 동작 중 value 값의 변화만 일어나기 때문에
  return prevProps.value === nextProps.value
}

export default memo(SliderBasic, propsAreEqual)

