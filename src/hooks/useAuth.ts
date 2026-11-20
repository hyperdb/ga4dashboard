import { useState, useEffect, useCallback } from 'react';
import { loginWithCommonsApi, validateAuthToken } from '@/lib/authApi';

const TOKEN_STORAGE_KEY = 'ga4dashboard_auth_token';

function readStoredToken(): string | null {
    try {
        return sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
        return null;
    }
}

function saveStoredToken(token: string): void {
    try {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
        // sessionStorage が使えない環境でもメモリ上の状態で継続する
    }
}

function clearStoredToken(): void {
    try {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
        // 無視
    }
}

export function useAuth() {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [checking, setChecking] = useState<boolean>(() => Boolean(readStoredToken()));

    useEffect(() => {
        const storedToken = readStoredToken();
        if (!storedToken) {
            return;
        }

        let cancelled = false;

        async function verify() {
            try {
                const result = await validateAuthToken(storedToken!);
                if (cancelled) return;

                if (result.valid) {
                    setToken(storedToken);
                    setUserId(result.userId);
                } else {
                    clearStoredToken();
                    setToken(null);
                    setUserId(null);
                }
            } catch {
                if (cancelled) return;
                clearStoredToken();
                setToken(null);
                setUserId(null);
            } finally {
                if (!cancelled) {
                    setChecking(false);
                }
            }
        }

        verify();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback(async (rawUserId: string, password: string) => {
        const trimmedUserId = rawUserId.trim();
        const result = await loginWithCommonsApi(trimmedUserId, password);
        saveStoredToken(result.token);
        setToken(result.token);
        setUserId(trimmedUserId);
    }, []);

    const logout = useCallback(() => {
        clearStoredToken();
        setToken(null);
        setUserId(null);
    }, []);

    return {
        token,
        userId,
        isAuthenticated: Boolean(token),
        checking,
        login,
        logout,
    };
}
