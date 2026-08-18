type StudioSlide = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

const studioSlides: StudioSlide[] = [
    {
        src: "01_bureau.png",
        alt: "Bureau du studio",
        width: 1537,
        height: 1023,
    },
    {
        src: "02_angle1.png",
        alt: "Premier angle du studio",
        width: 1537,
        height: 1023,
    },
    {
        src: "03_angle2.png",
        alt: "Deuxième angle du studio",
        width: 1535,
        height: 1024,
    },
    {
        src: "04_fish-oeil1.png",
        alt: "Première vue grand-angle du studio",
        width: 1535,
        height: 1024,
    },
    {
        src: "05_fish-oeil2.png",
        alt: "Deuxième vue grand-angle du studio",
        width: 1536,
        height: 1024,
    },
    {
        src: "06_canape.png",
        alt: "Canapé du studio",
        width: 1537,
        height: 1023,
    },
];

export { studioSlides };
export type { StudioSlide };
