import type { ReactNode } from "react";

export type HardwareCardItem = {
    imageSrc: string;
    title: string;
    eyebrow: string;
    desc: ReactNode;
    height: number;
    width: number;
};
