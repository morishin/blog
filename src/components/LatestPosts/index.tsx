import Link from 'next/link';

import { SidebarContent } from '../SidebarContent';

declare namespace LatestPosts {
    type Props = Readonly<{
        about?: string;
        posts: Post[];
        title?: string;
        seeAllPath?: string;
    }>;

    type Post = Readonly<{
        path: string;
        title: string;
        date: [year: string, month: string, day: string];
    }>;
}

const LatestPosts: React.FC<LatestPosts.Props> = ({ about, posts, title, seeAllPath }) => {
    const sidebarTitle = title ?? `Latest posts${about === undefined ? '' : ` about ${about}`}`;
    return (
        <SidebarContent title={sidebarTitle}>
            <div className="ml-2">
                <ul className="space-y-1 mb-2 pl-2 list-['-_'] list-inside marker:text-gray-500 dark:marker:text-gray-400">
                    {posts.map(({ path, title: postTitle }) => (
                        <li key={path}>
                            <Link href={path} className="hover:text-orange-300 dark:hover:text-amber-500">
                                {postTitle}
                            </Link>
                        </li>
                    ))}
                </ul>
                {about === undefined && (
                    <Link href={seeAllPath ?? '/all'} className="hover:text-orange-300 dark:hover:text-amber-500">
                        See all posts
                    </Link>
                )}
            </div>
        </SidebarContent>
    );
};

export { LatestPosts };
