import type { AnalyticsRecord } from '../hooks/useAnalytics';

// 同じ target_date のデータを合算する関数
const aggregateByDate = (records: AnalyticsRecord[]) => {
    const map = new Map<string, {
        target_date: string;
        page_views: number;
        active_users: number;
        sessions: number;
    }>();

    for (const row of records) {
        const existing = map.get(row.target_date);
        if (existing) {
            existing.page_views += row.page_views;
            existing.active_users += row.active_users;
            existing.sessions += row.sessions;
        } else {
            map.set(row.target_date, {
                target_date: row.target_date,
                page_views: row.page_views,
                active_users: row.active_users,
                sessions: row.sessions,
            });
        }
    }

    // 日付昇順（古い日 -> 新しい日）に並べ替え
    return Array.from(map.values()).sort((a, b) =>
        a.target_date.localeCompare(b.target_date)
    );
}
export default aggregateByDate;