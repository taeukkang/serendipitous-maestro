"use client";

import { SoundItem } from "@/types/SoundItem.type";
import { Box, HStack } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { activeNoteIndexState } from "../Sounds";

function SoundItemBox({ soundItem, onClick, active, index }:
    { soundItem: SoundItem, onClick: (index: number) => void, active: boolean, index: number }) {

    let bg = "";
    if (soundItem.freq == 0) {
        bg = "gray.200";
    } else {
        bg = "yellow.200";
    }

    let border = active ? "2px solid black" : "";

    return (
        <Box as="button" w='40px' h='40px' bg={bg} onClick={() => onClick(index)} border={border}>
            {Math.round(soundItem.freq)}
        </Box>
    )
}

export function SoundItemBoxes({ sounds, onSoundItemClick }: { sounds: SoundItem[], onSoundItemClick: (index: number) => void}) {
    const activeNoteIndex = useRecoilValue(activeNoteIndexState);

    return (
        <HStack spacing='3px' flex='1' align="top">
            {
                sounds.map((item, index) => {
                    return (
                        <SoundItemBox key={index} soundItem={item} onClick={onSoundItemClick} index={index} active={activeNoteIndex === index} />
                    )
                })
            }
        </HStack>
    )
}