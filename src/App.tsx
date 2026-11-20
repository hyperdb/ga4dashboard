import { Center, Spinner, Stack, Text } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function App() {
    const { isAuthenticated, checking, userId, login, logout } = useAuth();

    if (checking) {
        return (
            <Center minH="100vh">
                <Stack align="center" gap={3}>
                    <Spinner size="md" />
                    <Text fontSize="sm" color="fg.muted">
                        認証状態を確認中...
                    </Text>
                </Stack>
            </Center>
        );
    }

    if (!isAuthenticated) {
        return <LoginForm onLogin={login} />;
    }

    return <AnalyticsDashboard userId={userId} onLogout={logout} />;
}
