import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

import { Keywords, LatestPosts, Layout, Links, SideBySide } from '../components';
import { PostRepository } from '../PostRepository';

type Post = {
    title: string;
    path: string;
    date: [year: string, month: string, day: string];
};

type Props = {
    keywords: Array<[string, number]>;
    latestPosts: Post[];
    allPosts: Post[];
};

const Page: NextPage<Props> = ({ keywords, latestPosts, allPosts }) => (
    <Layout title="All posts">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pt-4">
            <SideBySide>
                <>
                    <h1 className="text-2xl mb-4">All posts</h1>
                    <ul className="space-y-1 text-lg list-['-_'] list-inside marker:text-gray-500 dark:marker:text-gray-400">
                        {allPosts.map(({ title, path, date }) => (
                            <li key={path}>
                                <Link href={path} className="hover:text-orange-300 dark:hover:text-amber-500">
                                    {title}
                                </Link>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {` (${date[0]}-${date[1]}-${date[2]})`}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
                <>
                    <LatestPosts posts={latestPosts} />
                    <Keywords
                        keywords={keywords.slice(0, 5).map(([keyword, count]) => ({ keyword, count }))}
                        seeAllKeywords={true}
                    />
                    <Links />
                </>
            </SideBySide>
        </div>
    </Layout>
);

const getStaticProps: GetStaticProps<Props> = async () => {
    const keys = await PostRepository.list();

    const posts = [];

    for (const key of keys.reverse()) {
        const post = await PostRepository.lookup(key);

        posts.push(post);
    }

    const latestPosts = posts.slice(0, 5);

    const keywords = new Map<string, number>();
    for (const post of posts) {
        for (const kw of post.keywords) {
            const count = keywords.get(kw);

            if (count === undefined) {
                keywords.set(kw, 1);
            } else {
                keywords.set(kw, count + 1);
            }
        }
    }

    return {
        props: {
            keywords: Array.from(keywords.entries()).sort((a, b) =>
                a[1] === b[1] ? a[0].toLowerCase().localeCompare(b[0].toLowerCase()) : a[1] < b[1] ? 1 : -1,
            ),
            latestPosts,
            allPosts: posts,
        },
    };
};

export default Page;
export { getStaticProps };
