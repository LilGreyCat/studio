"use client";

import { useEffect, useState } from "react";

type ResourceState<T> = {
    data: T | null;
    isLoading: boolean;
    error: string | null;
};

type ResourceLoader<T> = (id: number, signal: AbortSignal) => Promise<T>;

export function useResource<T>(
    resourceId: number | null,
    load: ResourceLoader<T>,
    fallbackError: string
): ResourceState<T> {
    const [state, setState] = useState<ResourceState<T>>({
        data: null,
        isLoading: resourceId !== null,
        error: null,
    });

    useEffect(() => {
        const controller = new AbortController();

        async function loadResource(): Promise<void> {
            if (resourceId === null) {
                setState({ data: null, isLoading: false, error: null });
                return;
            }

            setState((current) => ({
                ...current,
                isLoading: true,
                error: null,
            }));

            try {
                const data = await load(resourceId, controller.signal);
                setState({ data, isLoading: false, error: null });
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                setState({
                    data: null,
                    isLoading: false,
                    error:
                        error instanceof Error ? error.message : fallbackError,
                });
            }
        }

        void loadResource();
        return () => controller.abort();
    }, [fallbackError, load, resourceId]);

    return state;
}
