import type { ServiceId } from "@/hooks/contact/useContactForm";
import { Resend } from "resend";

import { consumeContactRequest, getContactClientKey } from "./rateLimit";

type ContactPayload = {
    name: string;
    email: string;
    phone?: string;
    services: ServiceId[];
    message: string;
};

const serviceLabels: Record<ServiceId, string> = {
    recording: "Enregistrement",
    mixing: "Mix",
    mastering: "Mastering",
    live: "Accompagnement live",
    single: "Formule Single",
    ep: "Formule EP",
    album: "Formule Album",
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

const fieldLimits = {
    name: 100,
    email: 254,
    phone: 30,
    message: 5000,
} as const;

const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => htmlEntities[character]);
}

function parsePayload(body: unknown): ContactPayload | null {
    if (typeof body !== "object" || body === null) {
        return null;
    }

    const candidate = body as Record<string, unknown>;
    const name =
        typeof candidate.name === "string" ? candidate.name.trim() : "";
    const email =
        typeof candidate.email === "string" ? candidate.email.trim() : "";
    const phone =
        typeof candidate.phone === "string" ? candidate.phone.trim() : "";
    const message =
        typeof candidate.message === "string" ? candidate.message.trim() : "";
    const services = Array.isArray(candidate.services)
        ? candidate.services
        : [];

    if (!name || !email || services.length === 0 || !message) {
        return null;
    }

    if (
        !services.every(
            (service): service is ServiceId =>
                typeof service === "string" &&
                validServices.includes(service as ServiceId)
        )
    ) {
        return null;
    }

    return { name, email, phone, services, message };
}

function exceedsFieldLimits(payload: ContactPayload): boolean {
    return (
        payload.name.length > fieldLimits.name ||
        payload.email.length > fieldLimits.email ||
        (payload.phone?.length ?? 0) > fieldLimits.phone ||
        payload.message.length > fieldLimits.message
    );
}

function buildEmailHtml(payload: ContactPayload): string {
    const phoneLine = payload.phone
        ? escapeHtml(payload.phone)
        : "Non renseigné";
    const servicesLine = payload.services
        .map((service) => escapeHtml(serviceLabels[service]))
        .join("<br />- ");

    return `
        <div style="font-family: Arial, sans-serif;">
            <h3>Nouveau message de contact.</h3>
            <p><strong>Nom:</strong> ${escapeHtml(payload.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
            <p><strong>Téléphone:</strong> ${phoneLine}</p>
            <p><strong>Prestation(s):</strong><br />- ${servicesLine}</p>
            <h3>Message</h3>
            <p style="white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
        </div>
    `;
}

export async function POST(request: Request) {
    const rateLimit = consumeContactRequest(getContactClientKey(request));
    if (!rateLimit.allowed) {
        return Response.json(
            {
                error: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
            },
            {
                status: 429,
                headers: {
                    "Retry-After": String(rateLimit.retryAfterSeconds),
                },
            }
        );
    }

    try {
        const payload = parsePayload(await request.json());

        if (!payload) {
            return Response.json(
                {
                    error: "Veuillez remplir correctement tous les champs obligatoires.",
                },
                { status: 400 }
            );
        }

        if (!isValidEmail(payload.email)) {
            return Response.json(
                { error: "Adresse email invalide." },
                { status: 400 }
            );
        }

        if (exceedsFieldLimits(payload)) {
            return Response.json(
                { error: "Un ou plusieurs champs sont trop longs." },
                { status: 400 }
            );
        }

        const to = process.env.CONTACT_TO_EMAIL;
        const from = process.env.CONTACT_FROM_EMAIL;
        const apiKey = process.env.RESEND_API_KEY;

        if (!to || !from || !apiKey) {
            console.error("Contact email configuration is incomplete");
            return Response.json(
                {
                    error: "Le service de contact est temporairement indisponible.",
                },
                { status: 500 }
            );
        }

        const resend = new Resend(apiKey);
        const result = await resend.emails.send({
            from,
            to,
            replyTo: payload.email,
            subject: `Nouveau message de : ${payload.name.replace(/[\r\n]+/g, " ")}`,
            html: buildEmailHtml(payload),
        });

        if (result.error) {
            console.error("Contact email provider rejected the request");
            return Response.json(
                { error: "L'email n'a pas pu être envoyé." },
                { status: 500 }
            );
        }

        return Response.json({ ok: true });
    } catch (error) {
        console.error(
            "Contact request failed",
            error instanceof Error ? error.name : "UnknownError"
        );
        return Response.json(
            { error: "Une erreur est survenue pendant l'envoi." },
            { status: 500 }
        );
    }
}
