import {
  Box,
  Flex,
  FormLabel,
  NumberInput,
  NumberInputField,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react"
import { useState } from "react"

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
        {/* <NumberInput
          size="sm"
          mr={3}
          w="30%"
          value={inputValue}
          onChange={(valueAsString, valueAsNumber) => {
            console.log(valueAsString, valueAsNumber)
            if (valueAsString === "") {
              setInputValue(sliderMin.toString())
              setValue(sliderMin)
              return
            }
            setInputValue(valueAsString)
            setValue(valueAsNumber)
          }}
          precision={0}
          min={inputMin}
          max={inputMax}
          step={step}
        >
          <NumberInputField px={1} />
        </NumberInput> */}
        <Slider
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          //   focusThumbOnChange={false}
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
