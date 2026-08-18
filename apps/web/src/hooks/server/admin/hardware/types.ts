export type HardwareItem = {
    id: number;
    slug: string;
    eyebrow: string;
    title: string;
    description: string;
    image_url: string;
    image_width: number;
    image_height: number;
    display_order: number;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
};

export type CreateHardwarePayload = {
    slug: string;
    eyebrow: string;
    title: string;
    description: string;
    image_url: string;
    image_width: number;
    image_height: number;
    is_visible: boolean;
};

export type UpdateHardwarePayload = Partial<CreateHardwarePayload>;
