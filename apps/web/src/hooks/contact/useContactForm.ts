"use client";

import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useState } from "react";

export type ServiceId =
    | "recording"
    | "mixing"
    | "mastering"
    | "live"
    | "single"
    | "ep"
    | "album";

export type ContactFormData = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

const validServices: ServiceId[] = [
    "recording",
    "mixing",
    "mastering",
    "live",
    "single",
    "ep",
    "album",
];

const initialForm: ContactFormData = {
    name: "",
    email: "",
    phone: "",
    message: "",
};

function parseServicesFromSearchParams(
    searchParams: ReadonlyURLSearchParams
): ServiceId[] {
    const raw = searchParams.get("services");

    if (!raw) {
        return [];
    }

    return raw.split(",").filter((service): service is ServiceId => {
        return validServices.includes(service as ServiceId);
    });
}

async function sendContactForm(
    payload: ContactFormData & { services: ServiceId[] }
) {
    const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Echec de l'envoi.");
    }

    return data;
}

export function useContactForm() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const services = parseServicesFromSearchParams(searchParams);

    const [form, setForm] = useState<ContactFormData>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (field: keyof ContactFormData, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleServiceToggle = (service: ServiceId) => {
        const isSelected = services.includes(service);

        const nextServices = isSelected
            ? services.filter((item) => item !== service)
            : [...services, service];

        const params = new URLSearchParams(searchParams.toString());

        if (nextServices.length === 0) {
            params.delete("services");
        } else {
            params.set("services", nextServices.join(","));
        }

        const query = params.toString();
        const nextUrl = query ? `${pathname}?${query}` : pathname;

        router.replace(nextUrl, { scroll: false });
    };

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (services.length === 0) {
            setErrorMessage(
                "Veuillez choisir au moins un service ou une formule."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            await sendContactForm({
                ...form,
                services,
            });

            setSuccessMessage("Votre message a bien été envoyé.");
            setForm(initialForm);
            router.replace(pathname, { scroll: false });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue.";

            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        services,
        isSubmitting,
        successMessage,
        errorMessage,
        handleChange,
        handleServiceToggle,
        handleSubmit,
    };
}
