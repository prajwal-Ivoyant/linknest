
import { AppstoreOutlined, StarOutlined, InboxOutlined, } from '@ant-design/icons';
import { useBookmarkStats } from '../../hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters, } from '../../store/uiSlice';
import SidebarItem from './SidebarItem';


function SidebarMainNav() {
    const dispatch = useAppDispatch();
    const { filters,  } = useAppSelector((s) => s.ui);
    const { data: stats, } = useBookmarkStats();

    const browserCounts: Record<string, number> = {};
    const topicCounts: Record<string, number> = {};

    stats?.byBrowser?.forEach((b: { name: string; count: number }) => {
        browserCounts[b.name] = b.count;
    });

    stats?.byTopic?.forEach((t: { name: string; count: number }) => {
        topicCounts[t.name] = t.count;
    });

    const isAllActive =
        filters.browserSource === 'all' &&
        filters.topicCategory === 'all' &&
        !filters.isFavorite &&
        !filters.isArchived;

    return (
        <>
            {/* Main nav */}
            <SidebarItem
                icon={<AppstoreOutlined />}
                label="All Bookmarks"
                count={stats?.total}
                active={isAllActive}
                onClick={() =>
                    dispatch(setFilters({
                        browserSource: 'all',
                        topicCategory: 'all',
                        isFavorite: false,
                        isArchived: false,
                        search: ''
                    }))
                }
            />

            <SidebarItem
                icon={<StarOutlined />}
                label="Favorites"
                count={stats?.favorites}
                active={!!filters.isFavorite}
                onClick={() =>
                    dispatch(setFilters({
                        isFavorite: true,
                        isArchived: false,
                        browserSource: 'all',
                        topicCategory: 'all'
                    }))
                }
            />

            <SidebarItem
                icon={<InboxOutlined />}
                label="Archive"
                active={!!filters.isArchived}
                onClick={() =>
                    dispatch(setFilters({
                        isArchived: true,
                        isFavorite: false,
                        browserSource: 'all',
                        topicCategory: 'all'
                    }))
                }
            />
        </>
    )
}

export default SidebarMainNav