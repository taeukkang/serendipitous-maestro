import { HStack, Flex, Tooltip, VStack, Slider, SliderTrack, SliderThumb, SliderFilledTrack, Text, Code } from "@chakra-ui/react"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { DistParams, soundsState, isPlayingState } from "../Sounds";
import { useEffect, useState } from "react";
import { distParams } from "../utils/distParams";

export function MeanStdSettings({ id }: any) {
    const sounds = useRecoilValue(soundsState);
    const setSounds = useSetRecoilState(soundsState);

    const updateDistParams = (id: number, mean: number, std: number) => {
        setSounds((prevSounds) => {
            return [...prevSounds].map((sound, index) => {
                if (index === id) {
                    let updatedSound = { ...sound, distParams: { mean: mean, std: std } };
                    return updatedSound;
                }
                return sound
            })
        });
    }

    const [expandSettings, setExpandSettings] = useState(false)

    const toggleSettings = () => {
        setExpandSettings(!expandSettings)
    }

    const [showMeanTooltip, setShowMeanTooltip] = useState(false)
    const [showStdTooltip, setShowStdTooltip] = useState(false)

    const [meanValue, setMeanValue] = useState(sounds[id].distParams.mean)
    const [stdValue, setStdValue] = useState(sounds[id].distParams.std)

    useEffect(() => {
        updateDistParams(id, meanValue || 0, stdValue || 0)
    }, [meanValue, stdValue])

    return (
        <VStack width="100%" onMouseLeave={() => setExpandSettings(false)} pr={3} pb={3} align="left">
            <HStack as="button" onClick={toggleSettings} onMouseOver={() => setExpandSettings(true)}>
                <Code>µ = {sounds[id].distParams?.mean}</Code>
                <Code>σ = {sounds[id].distParams?.std}</Code>
            </HStack>

            {expandSettings && (
                <VStack width="100%">
                    <Flex width="100%">
                        <Text width="60px">Mean</Text>
                        <Slider
                            aria-label='slider-mean'
                            defaultValue={meanValue}
                            min={0}
                            max={1000}
                            flex={1}
                            onMouseEnter={() => setShowMeanTooltip(true)}
                            onMouseLeave={() => setShowMeanTooltip(false)}
                            onChange={(value) => setMeanValue(value)}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <Tooltip
                                hasArrow
                                bg='teal.500'
                                color='white'
                                placement='top'
                                isOpen={showMeanTooltip}
                                label={meanValue}
                            >
                                <SliderThumb />
                            </Tooltip>
                        </Slider>
                    </Flex>
                    <Flex width="100%">
                        <Text width="60px">Std</Text>
                        <Slider
                            aria-label='slider-std'
                            defaultValue={stdValue}
                            min={0}
                            max={500}
                            flex={1}
                            onChange={(value) => setStdValue(value)}
                            onMouseEnter={() => setShowStdTooltip(true)}
                            onMouseLeave={() => setShowStdTooltip(false)}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <Tooltip
                                hasArrow
                                bg='teal.500'
                                color='white'
                                placement='top'
                                isOpen={showStdTooltip}
                                label={stdValue}
                            >
                                <SliderThumb />
                            </Tooltip>
                        </Slider>
                    </Flex>
                </VStack>
            )}
        </VStack>
    )
}

export function SingleParamSettings({ id, paramSymbol, paramName, paramId }: { id: number, paramSymbol: string, paramName: string, paramId: string }) {
    const sounds = useRecoilValue(soundsState);
    const setSounds = useSetRecoilState(soundsState);

    const updateDistParams = (id: number, updatedParamValue: number) => {
        setSounds((prevSounds) => {
            return [...prevSounds].map((sound, index) => {
                if (index === id) {
                    let updatedSound = { ...sound, distParams: { [paramId]: updatedParamValue } };
                    return updatedSound;
                }
                return sound
            })
        });
    }

    const [expandSettings, setExpandSettings] = useState(false)

    const toggleSettings = () => {
        setExpandSettings(!expandSettings)
    }

    const [showTooltip, setShowTooltip] = useState(false)

    const [paramValue, setParamValue] = useState(sounds[id].distParams[paramId as keyof DistParams])

    useEffect(() => {
        updateDistParams(id, paramValue || 0)
    }, [paramValue])

    return (
        <VStack width="100%" onMouseLeave={() => setExpandSettings(false)} pr={3} pb={3} align="left">
            <HStack as="button" onClick={toggleSettings} onMouseOver={() => setExpandSettings(true)}>
                <Code>{paramSymbol} = {sounds[id].distParams[paramId as keyof DistParams]}</Code>
            </HStack>

            {expandSettings && (
                <VStack width="100%">
                    <Flex width="100%">
                        <Text width="60px">{paramName}</Text>
                        <Slider
                            aria-label='slider-mean'
                            defaultValue={paramValue}
                            min={0}
                            max={1000}
                            flex={1}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onChange={(value) => setParamValue(value)}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <Tooltip
                                hasArrow
                                bg='teal.500'
                                color='white'
                                placement='top'
                                isOpen={showTooltip}
                                label={paramValue}
                            >
                                <SliderThumb />
                            </Tooltip>
                        </Slider>
                    </Flex>
                </VStack>
            )}
        </VStack>
    )
}

export function MultiParamSettings({ id }: { id: number }) {
    const sounds = useRecoilValue(soundsState);
    const setSounds = useSetRecoilState(soundsState);

    const isPlaying = useRecoilValue(isPlayingState);
    const setIsPlaying = useSetRecoilState(isPlayingState);

    const params = distParams[sounds[id].distribution as keyof typeof distParams]

    const [tooltipValues, setTooltipValues] = useState(params.map(
        (param) => {
            return {
                paramKey: param.paramKey,
                value: sounds[id].distParams[param.paramKey as keyof DistParams],
                showTooltip: false
            }
        }
    ))

    const setShowTooltip = (paramKey: string, showTooltip: boolean) => {
        setTooltipValues((prevTooltipValues) => {
            return prevTooltipValues.map((tooltipValue) => {
                if (tooltipValue.paramKey === paramKey) {
                    return { ...tooltipValue, showTooltip: showTooltip }
                }
                return tooltipValue
            })
        })
    }

    const setTooltipValue = (paramKey: string, value: number) => {
        setTooltipValues((prevTooltipValues) => {
            return prevTooltipValues.map((tooltipValue) => {
                if (tooltipValue.paramKey === paramKey) {
                    return { ...tooltipValue, value: value }
                }
                return tooltipValue
            })
        })
    }

    const updateDistParams = (updatedKey: string, updatedValue: number) => {
        setSounds((prevSounds) => {
            return [...prevSounds].map((sound, index) => {
                if (index === id) {
                    let updatedSound = {
                        ...sound, distParams: {
                            ...sound.distParams,
                            [updatedKey]: updatedValue
                        }
                    };
                    return updatedSound;
                }
                return sound
            })
        });
    }

    const [expandSettings, setExpandSettings] = useState(false)

    const toggleSettings = () => {
        setExpandSettings(!expandSettings)
    }

    return (
        <VStack width="100%" onMouseLeave={() => setExpandSettings(false)} pr={3} pb={3} align="left">
            <HStack as="button" onClick={toggleSettings} onMouseOver={() => setExpandSettings(true)}>
                ( {params.map((param, index) => {
                    return <Code key={index}>{param.paramSymbol} = {sounds[id].distParams[param.paramKey as keyof DistParams]}</Code>
                })} )
            </HStack>

            {expandSettings && (
                params.map((param, index) => {

                    let max = 1000;
                    let step: number | undefined = undefined;
                    if (param.paramKey === 'p') {
                        max = 1
                        step = 0.01
                    }

                    return (
                        <VStack width="100%" key={index}>
                            <Flex width="100%">
                                <Text width="60px">{param.paramName}</Text>
                                <Slider
                                    aria-label='slider-mean'
                                    defaultValue={sounds[id].distParams[param.paramKey as keyof DistParams]}
                                    min={0}
                                    max={max}
                                    step={step}
                                    flex={1}
                                    onMouseEnter={() => setShowTooltip(param.paramKey, true)}
                                    onMouseLeave={() => setShowTooltip(param.paramKey, false)}
                                    onChange={(value) => setTooltipValue(param.paramKey, value)}
                                    onChangeEnd={(value) => updateDistParams(param.paramKey, value)}
                                    isDisabled={isPlaying}
                                >
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <Tooltip
                                        hasArrow
                                        bg='teal.500'
                                        color='white'
                                        placement='top'
                                        isOpen={tooltipValues[index].showTooltip}
                                        label={tooltipValues[index].value}
                                    >
                                        <SliderThumb />
                                    </Tooltip>
                                </Slider>
                            </Flex>
                        </VStack>
                    )
                })
            )}
        </VStack>
    )
}