interface CommonsApiResponse<T> {
    api_version: string;
    api_route: string;
    send_at: string;
    message: string;
    data: T;
}

interface LoginResponseData {
    token: string;
}

type ValidateTokenResponseData =
    | { valid: 'OK'; user_id: string }
    | { valid: 'NG' };

function getAuthApiBaseUrl(): string {
    const baseUrl = import.meta.env.VITE_AUTH_API_BASE_URL;
    if (!baseUrl) {
        throw new Error('VITE_AUTH_API_BASE_URL is not configured');
    }
    return baseUrl.replace(/\/+$/, '');
}

export async function loginWithCommonsApi(
    userId: string,
    password: string
): Promise<{ token: string; message: string }> {
    const baseUrl = getAuthApiBaseUrl();
    const url = `${baseUrl}/users/auth/${encodeURIComponent(userId)}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    });

    const json = (await res.json().catch(() => null)) as CommonsApiResponse<LoginResponseData> | null;

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error(json?.message || 'ユーザーIDまたはパスワードが正しくありません');
        }
        throw new Error(json?.message || `認証エラーが発生しました (HTTP ${res.status})`);
    }

    const token = json?.data?.token;
    if (!token) {
        throw new Error('認証トークンを取得できませんでした');
    }

    return {
        token,
        message: json.message ?? '',
    };
}

export async function validateAuthToken(
    token: string
): Promise<{ valid: boolean; userId: string | null }> {
    const baseUrl = getAuthApiBaseUrl();
    const url = `${baseUrl}/tokens/valid`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    if (!res.ok) {
        return { valid: false, userId: null };
    }

    const json = (await res.json().catch(() => null)) as CommonsApiResponse<ValidateTokenResponseData> | null;

    if (json?.data?.valid === 'OK') {
        return {
            valid: true,
            userId: json.data.user_id ?? null,
        };
    }

    return { valid: false, userId: null };
}
