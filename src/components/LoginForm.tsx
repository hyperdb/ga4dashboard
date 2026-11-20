import { useState, type FormEvent } from 'react';
import {
    Box,
    Button,
    Center,
    Field,
    Heading,
    Input,
    Stack,
    Text,
} from '@chakra-ui/react';

interface LoginFormProps {
    onLogin: (userId: string, password: string) => Promise<void>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;

        const trimmedUserId = userId.trim();
        if (!trimmedUserId || !password) {
            setError('ユーザーIDとパスワードを入力してください');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await onLogin(trimmedUserId, password);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'ログインに失敗しました');
        } finally {
            setSubmitting(false);
        }
    };

    const isSubmitDisabled = !userId.trim() || !password || submitting;

    return (
        <Center minH="100vh" px={4}>
            <Box
                w="full"
                maxW="420px"
                p={8}
                borderWidth="1px"
                borderRadius="lg"
                bg="bg.panel"
            >
                <form onSubmit={handleSubmit}>
                    <Heading size="xl" mb={6}>
                        ログイン
                    </Heading>

                    <Stack gap={5}>
                        <Field.Root required>
                            <Field.Label>
                                ユーザーID
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                                type="text"
                                value={userId}
                                onChange={(e) => {
                                    setUserId(e.target.value);
                                    if (error) setError(null);
                                }}
                                autoComplete="username"
                                autoFocus
                            />
                        </Field.Root>

                        <Field.Root required>
                            <Field.Label>
                                パスワード
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError(null);
                                }}
                                autoComplete="current-password"
                            />
                        </Field.Root>

                        {error && (
                            <Text color="fg.error" fontSize="sm" role="alert">
                                {error}
                            </Text>
                        )}

                        <Button
                            type="submit"
                            w="full"
                            mt={2}
                            loading={submitting}
                            disabled={isSubmitDisabled}
                        >
                            ログイン
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Center>
    );
}
