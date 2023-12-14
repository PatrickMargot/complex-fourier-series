import {
  Box,
  Flex,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react"

type LabeledSliderProps = {
  value: number
  onChange: (value: number) => void
  label: string
  step?: number
  min?: number
  max?: number
} & React.ComponentProps<typeof Box>

const LabeledSlider: React.FC<LabeledSliderProps> = ({
  value,
  onChange,
  label,
  step,
  min,
  max,
  ...boxProps
}) => {
  return (
    <Box {...boxProps}>
      <FormLabel mb="1">
        {label} = {value}
      </FormLabel>
      <Flex>
        <Slider
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Flex>
    </Box>
  )
}

export default LabeledSlider
