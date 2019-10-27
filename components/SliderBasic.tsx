import { Slider } from '@material-ui/core'
import { isArray } from 'util'
import { ElementType } from 'react'
import { ValueLabelProps, Mark } from '@material-ui/core/Slider'

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

export default (props: IProps) => {
  const { title, labelType='TITLE_VALUE' } = props
  const label = labelType === 'TITLE_VALUE'
    ? `${props.title}: ${props.value}`
    : title

  return (
    <div style={{ width: 512 }}>
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
        onChange={(_, value) => props.setValue(isArray(value) ? value[0] : value)}
        getAriaValueText={props.getAriaValueText}
      />
    </div>
  )
}
