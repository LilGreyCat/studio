import { isIP } from "node:net";

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

type RateLimitResult =
    | { allowed: true }
    | { allowed: false; retryAfterSeconds: number };

const DEFAULT_MAX_REQUESTS = 5;
const DEFAULT_WINDOW_SECONDS = 10 * 60;
const MAX_TRACKED_CLIENTS = 10_000;

const clients = new Map<string, RateLimitEntry>();

function readPositiveInteger(value: string | undefined, fallback: number) {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const maxRequests = readPositiveInteger(
    process.env.CONTACT_RATE_LIMIT_MAX,
    DEFAULT_MAX_REQUESTS
);
const windowMilliseconds =
    readPositiveInteger(
        process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS,
        DEFAULT_WINDOW_SECONDS
    ) * 1000;

function pruneExpiredClients(now: number): void {
    for (const [key, entry] of clients) {
        if (entry.resetAt <= now) {
            clients.delete(key);
        }
    }

    while (clients.size >= MAX_TRACKED_CLIENTS) {
        const oldestKey = clients.keys().next().value as string | undefined;
        if (oldestKey === undefined) {
            return;
        }
        clients.delete(oldestKey);
    }
}

export function getContactClientKey(request: Request): string {
    const realAddress = request.headers.get("x-real-ip")?.trim();
    if (realAddress && isIP(realAddress)) {
        return realAddress;
    }

    const forwardedAddresses =
        request.headers
            .get("x-forwarded-for")
            ?.split(",")
            .map((address) => address.trim()) ?? [];
    for (let index = forwardedAddresses.length - 1; index >= 0; index -= 1) {
        if (isIP(forwardedAddresses[index])) {
            return forwardedAddresses[index];
        }
    }

    return "unknown";
}

export function consumeContactRequest(
    clientKey: string,
    now = Date.now()
): RateLimitResult {
    const current = clients.get(clientKey);

    if (!current || current.resetAt <= now) {
        if (clients.size >= MAX_TRACKED_CLIENTS) {
            pruneExpiredClients(now);
        }

        clients.set(clientKey, {
            count: 1,
            resetAt: now + windowMilliseconds,
        });
        return { allowed: true };
    }

    if (current.count >= maxRequests) {
        return {
            allowed: false,
            retryAfterSeconds: Math.max(
                1,
                Math.ceil((current.resetAt - now) / 1000)
            ),
        };
    }

    current.count += 1;
    return { allowed: true };
}
