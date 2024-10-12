import Link from 'next/link';

import { SidebarContent } from '..';

declare namespace Keywords {
    type Props = {
        keywords: Keyword[];
        seeAllKeywords: boolean;
    };

    type Keyword = {
        keyword: string;
        count: number | null;
    };
}

const Keywords: React.FC<Keywords.Props> = ({ keywords, seeAllKeywords }) => {
    return (
        <SidebarContent title="キーワード">
            <div className="ml-2">
                <ul className="space-y-1 mb-2 list-['-_'] list-inside marker:text-gray-500 dark:marker:text-gray-400">
                    {keywords.map(({ count, keyword }) => (
                        <li key={keyword}>
                            <Link
                                href={`/keywords/${keyword}`}
                                className="hover:text-orange-300 dark:hover:text-amber-500"
                            >
                                {keyword}
                            </Link>
                            {count !== null && (
                                <span className="text-sm text-gray-500 dark:text-gray-400"> ({count})</span>
                            )}
                        </li>
                    ))}
                </ul>
                {seeAllKeywords && (
                    <Link href="/keywords" className="hover:text-orange-300 dark:hover:text-amber-500">
                        もっと見る
                    </Link>
                )}
            </div>
        </SidebarContent>
    );
};

export { Keywords };
