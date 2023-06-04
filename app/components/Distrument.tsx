import { Grid, GridItem, Heading, Button, HStack, IconButton, ButtonGroup, Flex, Spacer, Tooltip, VStack, Tag, Slider, SliderTrack, SliderThumb, SliderFilledTrack, Text, Accordion, AccordionButton, AccordionItem, AccordionPanel, AccordionIcon, Code } from "@chakra-ui/react"
import { BsMagic, BsPlayCircle } from "react-icons/bs"
import { SoundItem } from "@/types/SoundItem.type"
import { SoundItemBoxes } from "./SoundItemBoxes";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Sound, soundsState } from "../Sounds";
import { useState } from "react";
import { MeanStdSettings, MultiParamSettings, SingleParamSettings } from "./DistrumentSettings";


const titleCase = (str: string) => {
    return str.replace(/\w\S*/g, (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    );
};

export function Distrument({ id, playSound, playSounds, updateNote, randomize }: { id: number, playSounds: (sounds: SoundItem[]) => void, updateNote: any, playSound: (sound: SoundItem) => void, randomize: any }) {
    const sounds = useRecoilValue(soundsState);

    return (
        <Flex gap={4} mb={3}>
            <VStack align="left" width="100%">
                <Heading size="lg">{titleCase(sounds[id].distribution)}</Heading>
                <MultiParamSettings id={id} />
            </VStack>

            <Spacer />
            <Flex alignItems="top" mt={3}>
                <ButtonGroup gap={1} mr={5}>
                    <Tooltip label="Randomize Notes">
                        <IconButton onClick={randomize} icon={<BsMagic />} aria-label="Randomize" />
                    </Tooltip>
                </ButtonGroup>
                <SoundItemBoxes sounds={sounds[id].notes} onSoundItemClick={updateNote} />
            </Flex>
        </Flex>
    )
}