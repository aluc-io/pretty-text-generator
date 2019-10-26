import { Slider } from '@material-ui/core'
import { isArray } from 'util'
import { ElementType } from 'react'
import { ValueLabelProps } from '@material-ui/core/Slider'

interface IProps {
  title: string
  min: number
  max: number
  step: number
  value: number
  setValue: (value: number) => void
  ValueLabelComponent?: ElementType<ValueLabelProps>
}

export default (props: IProps) =>
  <div style={{ width: 512 }}>
    <div>
      <span>{props.title}</span>
    </div>
    <Slider
      value={props.value}
      aria-labelledby="discrete-slider"
      valueLabelDisplay="auto"
      step={props.step}
      ValueLabelComponent={props.ValueLabelComponent}
      marks
      min={props.min}
      max={props.max}
      onChange={(_, value) => props.setValue(isArray(value) ? value[0] : value)}
    />
  </div>
