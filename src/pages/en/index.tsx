import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

import { Keywords, LatestPosts, Layout, Links, PostCollection, SideBySide } from '../../components';
import * as Post from '../../Post';
import { PostRepository } from '../../PostRepository';

type Post = {
    date: [year: string, month: string, day: string];
    keywords: string[];
    slug: string;
    path: string;
    preview: string | null;
    preface: string;
    title: string;
    lang: 'en' | null;
};

type LatestPost = {
    title: string;
    path: string;
    date: [year: string, month: string, day: string];
    lang: 'en' | null;
};

type Props = {
    keywords: Array<[string, number]>;
    latestPosts: LatestPost[];
    posts: Post[];
};

const Page: NextPage<Props> = ({ keywords, latestPosts, posts }) => (
    <Layout
        title="English articles"
        description="English translations of articles on blog.morishin.me."
    >
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pt-4">
            <SideBySide>
                <PostCollection
                    posts={posts}
                    readMoreLabel="Read more"
                    accessory={
                        <Link
                            href="/en/all"
                            className="block w-72 text-center mx-auto border border-zinc-500 dark:border-zinc-400 py-2"
                        >
                            See all English articles
                        </Link>
                    }
                />
                <>
                    <LatestPosts
                        posts={latestPosts}
                        title="Latest English posts"
                        seeAllPath="/en/all"
                    />
                    <Keywords
                        keywords={keywords.map(([keyword, count]) => ({ keyword, count }))}
                        seeAllKeywords={true}
                    />
                    <Links />
                </>
            </SideBySide>
        </div>
    </Layout>
);

const getStaticProps: GetStaticProps<Props> = async () => {
    const enKeys = await PostRepository.list('en');

    const ps = await Promise.all(
        enKeys.reverse().map(async (key) => await PostRepository.lookup(key)),
    );

    const posts: Post[] = [];
    for (const post of ps.slice(0, 5)) {
        const { date, keywords, path, preface, preview, slug, title, lang } = post;

        const prefaceHTML = unified()
            .use(rehypeStringify, { allowDangerousHtml: true })
            .stringify(await Post.Body.transform({ type: 'root', children: preface }));

        posts.push({
            slug,
            title,
            date,
            keywords,
            path,
            preview,
            preface: prefaceHTML,
            lang,
        });
    }

    const latestPosts: LatestPost[] = ps.slice(0, 5).map(({ title, path, date, lang }) => ({
        title,
        path,
        date,
        lang,
    }));

    // 英語版記事本文に出現するキーワード集計は JA 側と共通でよい
    // (キーワードは frontmatter から読まれ、JA/EN で同じ値を持つ想定)
    const keywordCount = new Map<string, number>();
    for (const post of ps) {
        for (const kw of post.keywords) {
            keywordCount.set(kw, (keywordCount.get(kw) ?? 0) + 1);
        }
    }

    const keywords = Array.from(keywordCount.entries())
        .sort((a, b) =>
            a[1] === b[1] ? a[0].toLowerCase().localeCompare(b[0].toLowerCase()) : a[1] < b[1] ? 1 : -1,
        )
        .slice(0, 5);

    return {
        props: {
            keywords,
            latestPosts,
            posts,
        },
    };
};

export default Page;
export { getStaticProps };
