import { useState, useMemo } from 'react';
import aggregateByDate from '@/lib/aggregateByDate';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    Container,
    Heading,
    Box,
    Center,
    Flex,
    Button,
    Text,
    VStack
} from '@chakra-ui/react';

interface AnalyticsDashboardProps {
    userId: string | null;
    onLogout: () => void;
}

export default function AnalyticsDashboard({
    userId,
    onLogout,
}: AnalyticsDashboardProps) {
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const { data, loading, error } = useAnalytics(selectedProperty);

    const chartData = useMemo(() => {
        if (!selectedProperty) {
            // 「すべてのサイト」の場合は日付ごとに合算
            return aggregateByDate(data);
        }
        // 特定サイト絞り込み時は日付昇順に並べる
        return [...data].sort((a, b) => a.target_date.localeCompare(b.target_date));
    }, [data, selectedProperty]);

    return (
        <Container minH="100vh" p="2em">
            <Flex justify="flex-end" align="center" gap={3} mb={4}>
                {userId && (
                    <Text fontSize="sm" color="fg.muted">
                        ログイン中: {userId}
                    </Text>
                )}
                <Button size="sm" variant="outline" onClick={onLogout}>
                    ログアウト
                </Button>
            </Flex>

            {loading ? (
                <Box p="2rem">Loading analytics...</Box>
            ) : error ? (
                <Box p="2rem" color="fg.error">
                    Error: {error}
                </Box>
            ) : (
                <Box>
                    <Center mb="3em">
                        <VStack>
                            <Heading fontSize={"2xl"}>GA4アクセス分析</Heading>
                            <Text fontSize={"sm"}>Google Analytics 4から取得したアクセスデータを表示するダッシュボード</Text>
                        </VStack>
                    </Center>

                    <Center mb="2em">
                        <Box>
                            <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>
                                サイト絞り込み:
                            </label>
                            <select
                                value={selectedProperty}
                                onChange={(e) => setSelectedProperty(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px' }}
                            >
                                <option value="">すべてのサイト</option>
                                {/* ここに実際のプロパティIDを設定してください */}
                                <option value="503836006">hyperdb.jp</option>
                                <option value="503595137">hyperdb.me</option>
                                <option value="503795561">hyperdb.net</option>
                                <option value="413259445">hyperdb.work</option>
                            </select>
                        </Box>
                    </Center>

                    <Box my="2em">
                        <Center>
                            <Heading fontSize="xl">アクセス推移 (PV / ユーザー数)</Heading>
                        </Center>
                        <Box w="100%" h="400px">
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="target_date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="page_views"
                                        name="ページビュー (PV)"
                                        stroke="#8884d8"
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="active_users"
                                        name="アクティブユーザー"
                                        stroke="#82ca9d"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sessions"
                                        name="セッション数"
                                        stroke="#ffc658"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </Box>
            )}
        </Container>
    );
}
