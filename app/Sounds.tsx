import { SoundItem } from "@/types/SoundItem.type";
import { atom } from "recoil";


export const isPlayingState = atom({
    key: 'isPlaying',
    default: false
  })

  
export type Sound = {
    distribution: string,
    notes: SoundItem[]
    instrument: string,
    distParams: DistParams
}

export type DistParams = {
    mean?: number,
    std?: number,
    min?: number,
    max?: number,
    lambda?: number,
    alpha?: number,
    beta?: number,
    n?: number,
    p?: number,
}

const initialNotes: SoundItem[] = [];
for (let i = 0; i < 16; i++) {
    initialNotes.push({ freq: 0, index: i });
}

const initialSounds: Sound[] =
    [
        {
            distribution: 'normal',
            notes: initialNotes,
            instrument: 'synth',
            distParams: {
                mean: 349.23,
                std: 150
            }
        },
        {
            distribution: 'poisson',
            notes: initialNotes,
            instrument: 'synth',
            distParams: {
                lambda: 150,
            }
        },
        {
            distribution: 'uniform',
            notes: initialNotes,
            instrument: 'fm',
            distParams: {
                min: 30,
                max: 2000
            }
        },
        {
            distribution: 'pareto',
            notes: initialNotes,
            instrument: 'am',
            distParams: {
                alpha: 4,
                beta: 50
            }
        },
        {
            distribution: 'binomial',
            notes: initialNotes,
            instrument: 'synth',
            distParams: {
                n: 500,
                p: 0.5
            }
        },
    ];

export const soundsState = atom<Sound[]>({
    key: 'sounds',
    default: initialSounds,
});

export const activeNoteIndexState = atom<number | null>({
    key: 'activeNoteIndex',
    default: null,
});
