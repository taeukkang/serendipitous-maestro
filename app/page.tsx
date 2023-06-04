"use client"
import { Image, Box, Button, Container, Flex, Grid, GridItem, HStack, Heading, IconButton, Spacer, VStack, Text } from '@chakra-ui/react'
import * as Tone from 'tone'
import { useEffect, useRef, useState } from 'react'
import { SoundItem } from '@/types/SoundItem.type'
import { Distrument } from './components/Distrument'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { Sound, activeNoteIndexState, isPlayingState, soundsState } from './Sounds'
import { getDistributionRNG } from './utils/random'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'

export default function Home() {
  const isPlaying = useRecoilValue(isPlayingState);
  const setIsPlaying = useSetRecoilState(isPlayingState);

  const sounds = useRecoilValue(soundsState);
  const setSounds = useSetRecoilState(soundsState);

  const setActiveNoteIndex = useSetRecoilState(activeNoteIndexState);

  const numOfBeats = 16;
  const beatIds = Array.from(Array(numOfBeats).keys());

  const seqRef = useRef<Tone.Sequence | null>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const membraneSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const metalSynthRef = useRef<Tone.MetalSynth | null>(null);
  const fmSynthRef = useRef<Tone.FMSynth | null>(null);
  const amSynthRef = useRef<Tone.AMSynth | null>(null);
  const pluckSynthRef = useRef<Tone.PluckSynth | null>(null);

  const instrumentRefs = {
    synth: synthRef,
    membrane: membraneSynthRef,
    metal: metalSynthRef,
    fm: fmSynthRef,
    am: amSynthRef,
    pluck: pluckSynthRef,
  }

  useEffect(() => {
    synthRef.current = new Tone.PolySynth().toDestination();
    membraneSynthRef.current = new Tone.MembraneSynth().toDestination();
    metalSynthRef.current = new Tone.MetalSynth().toDestination();
    fmSynthRef.current = new Tone.FMSynth().toDestination();
    amSynthRef.current = new Tone.AMSynth().toDestination();
    pluckSynthRef.current = new Tone.PluckSynth().toDestination();

    return () => {
      synthRef.current?.dispose();
      membraneSynthRef.current?.dispose();
      metalSynthRef.current?.dispose();
      fmSynthRef.current?.dispose();
      amSynthRef.current?.dispose();
      pluckSynthRef.current?.dispose();
    }
  }, [])


  function playSounds(sounds: SoundItem[]) {
    handleStartClick()
  }

  const handleStartClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  function playSound(sound: SoundItem) {
    if (sound.freq <= 0) {
      synthRef.current?.triggerAttackRelease(0, "4n");
    } else {
      synthRef.current?.triggerAttackRelease(sound.freq, "4n");
    }
  }

  useEffect(() => {
    let i = 0
    seqRef.current = new Tone.Sequence((time, beatIndex) => {
      // subdivisions are given as subarrays

      setActiveNoteIndex(beatIndex)
      sounds.map((sound, index) => {
        let freq = sound.notes[beatIndex].freq


        instrumentRefs[sound.instrument as keyof typeof instrumentRefs].current?.triggerAttackRelease(freq, 0.1, time);
      })

    }, [...beatIds]).start(0);

    return () => {
      seqRef.current?.dispose();
    };
  }, [sounds]);


  function randomizeAllNotes(id: number) {
    let getRandomFreq: () => number = getDistributionRNG(
      sounds[id].distribution,
      sounds[id].distParams
    );

    let updatedNotes = sounds[id].notes.map((soundItem, index) => {
      // flip a coin
      if (Math.random() < 0.5) {
        return { index: index, freq: 0 };
      } else {
        return { index: index, freq: getRandomFreq() };
      }
    });

    updateNotes(id, updatedNotes);
  }

  function updateNotes(id: number, updatedNotes: SoundItem[]) {
    setSounds((prevSounds) => {
      return prevSounds.map((sound, index) => {
        if (index === id) {
          let updatedSound = { ...sound, notes: updatedNotes };
          return updatedSound;
        }
        return sound
      })
    });
  }

  function updateNote(id: number, noteIndex: number) {
    let getRandomFreq: () => number = getDistributionRNG(
      sounds[id].distribution,
      sounds[id].distParams
    );

    let updatedNotes = sounds[id].notes.map((note, _idx) => {
      if (_idx === noteIndex) {
        return { ...note, freq: getRandomFreq() };
      } else {
        return note;
      }
    });

    updateNotes(id, updatedNotes);

    playSound(updatedNotes[noteIndex]);
  }

  return (
    <Container maxW="container.lg" pt={5}>
      <VStack>
        <HStack justify="center">
          <Image src="/serendipitous-maestro/logo.jpg" alt="logo" width="50px" height="50px" borderRadius='full' />
          <Heading>The Serendipitous Maestro</Heading>
        </HStack>
        <HStack>
          <Text>Taeuk Kang</Text>
        </HStack>
      </VStack>

      <Flex mb={4}>
        <Button colorScheme="teal" onClick={handleStartClick} leftIcon={!isPlaying ? <BsPlayFill /> : <BsPauseFill />} aria-label="Play" size="lg">
          {!isPlaying ? "Play" : "Pause"}
        </Button>
      </Flex>

      {
        sounds.map((sound, id) => {
          return (
            <Distrument
              id={id}
              key={id}
              playSound={playSound}
              playSounds={playSounds}
              updateNote={(noteIndex: number) => updateNote(id, noteIndex)}
              randomize={() => randomizeAllNotes(id)}
            />
          )
        })
      }
    </Container >
  )
}
