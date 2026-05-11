"use client";

import { useState } from "react";

import { loginAdmin } from "./api";

type UseAdminLoginParams = {
    onLoginSuccess?: () => Promise<void> | void;
};

export function useAdminLogin({ onLoginSuccess }: UseAdminLoginParams = {}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        try {
            setIsLoggingIn(true);
            setLoginError(null);

            await loginAdmin({ email, password });
            await onLoginSuccess?.();
        } catch (err) {
            setLoginError(
                err instanceof Error ? err.message : "Failed to login"
            );
        } finally {
            setIsLoggingIn(false);
        }
    }

    return {
        email,
        password,
        isLoggingIn,
        loginError,
        setEmail,
        setPassword,
        handleSubmit,
    };
}
