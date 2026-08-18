import React from "react";
import { MIC1, MIC2, PREAMP, SOUND_CARD, SPEAKERS } from "./Hardware";

type HardwareItem = {
    imageSrc: string;
    title: string;
    eyebrow: string;
    desc: React.ReactNode;
    height: number;
    width: number;
};

type HardwareKeys = "speakers" | "soundcard" | "preamp" | "mic1" | "mic2";

const hardwareObj: Record<HardwareKeys, HardwareItem> = {
    speakers: {
        imageSrc: "/matos/enceintes.jpg",
        title: "Enceintes Adam Audio A7V",
        eyebrow: "Monitoring",
        desc: SPEAKERS,
        height: 480,
        width: 480,
    },
    soundcard: {
        imageSrc: "/matos/carte-son.jpg?v=2",
        title: "Carte Son Apollo Twin USB",
        eyebrow: "Interface principale",
        desc: SOUND_CARD,
        height: 1920,
        width: 1920,
    },
    preamp: {
        imageSrc: "/matos/preamp.jpg",
        title: "Preampli Neve 1073SPX",
        eyebrow: "Preamp",
        desc: PREAMP,
        height: 599,
        width: 800,
    },
    mic1: {
        imageSrc: "/matos/mic1.jpg",
        title: "Micro Sony C-80",
        eyebrow: "Micro 1",
        desc: MIC1,
        height: 600,
        width: 600,
    },
    mic2: {
        imageSrc: "/matos/mic2.jpg",
        title: "Micro Neumann U87",
        eyebrow: "Micro 2",
        desc: MIC2,
        height: 600,
        width: 600,
    },
};

export { hardwareObj, type HardwareItem };
