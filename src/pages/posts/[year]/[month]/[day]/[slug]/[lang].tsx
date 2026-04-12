import { toString } from 'mdast-util-to-string';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

import { Article, Keywords, LanguageSwitch, Layout, SideBySide, TableOfContents } from '../../../../../../components';
import { AudioOverview } from '../../../../../../components/AudioOverview';
import { SidebarContent } from '../../../../../../components/SidebarContent';
import * as Post from '../../../../../../Post';
import { type Key, PostRepository } from '../../../../../../PostRepository';

type OtherEnglishPost = {
    title: string;
    path: string;
    date: [year: string, month: string, day: string];
};

type Props = {
    date: string;
    keywords: string[];
    html: string;
    preface: string;
    preview: string | null;
    sections: Post.TableOfContents.T;
    title: string;
    year: string;
    month: string;
    day: string;
    slug: string;
    audio: string | null;
    otherEnglishPosts: OtherEnglishPost[];
};

const Page: React.FC<Props> = ({
    date,
    html,
    keywords,
    preface,
    preview,
    sections,
    title,
    year,
    month,
    day,
    slug,
    audio,
    otherEnglishPosts,
}) => {
    const [currentSection, setCurrentSection] = useState<string | null>(null);

    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        if (ref.current === null) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries.filter((entry) => entry.isIntersecting).at(-1);
                if (entry === undefined) {
                    return;
                }

                const heading = entry.target.querySelector('h2, h3');
                if (heading === null) {
                    setCurrentSection(null);
                } else {
                    setCurrentSection('#' + heading.id);
                }
            },
            {
                rootMargin: '-20% 0px -80% 0px',
            },
        );

        const sections = ref.current.querySelectorAll('section');

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    });

    const postPath = `/posts/${year}/${month}/${day}/${slug}`;

    return (
        <Layout
            article={{ date }}
            title={title}
            description={preface}
            preview={preview === null ? undefined : 'https://blog.morishin.me' + preview}
            keywords={keywords}
            alternateLanguages={{
                ja: `https://blog.morishin.me${postPath}`,
                en: `https://blog.morishin.me${postPath}/en`,
            }}
        >
            <header
                className={
                    `w-full h-36 sm:h-40 md:h-48 mb-2 lg:mb-4 lg:mb-12 relative flex flex-col items-center justify-center text-white bg-zinc-900 ` +
                    (preview === null ? '' : 'lg:h-80')
                }
            >
                {preview !== null && (
                    <Image
                        alt=""
                        className="brightness-25"
                        fill
                        priority
                        src={preview}
                        style={{ objectFit: 'cover' }}
                    />
                )}
                <h1 className="text-xl lg:text-3xl font-medium w-5/6 text-center z-10">{title}</h1>
                <time className="z-10 mt-2 lg:mt-4 text-base lg:text-xl">{date}</time>
            </header>
            <LanguageSwitch currentLang="en" path={`/posts/${year}/${month}/${day}/${slug}/en`} />
            <SideBySide className="max-w-screen-2xl mx-auto">
                <div className="w-[620px] max-w-full self-center pt-2 box-border flex flex-col gap-12">
                    {audio !== null && <AudioOverview audioPath={audio} lang="en" />}
                    <Article html={html} ref={ref} />
                </div>
                <>
                    <Keywords keywords={keywords.map((keyword) => ({ keyword, count: null }))} seeAllKeywords={false} />
                    {otherEnglishPosts.length > 0 && (
                        <SidebarContent title="Other English posts">
                            <ul className="space-y-1 mb-2 ml-2 pl-2 list-['-_'] list-inside marker:text-gray-500 dark:marker:text-gray-400">
                                {otherEnglishPosts.map(({ path, title: postTitle }) => (
                                    <li key={path}>
                                        <Link
                                            href={path}
                                            className="hover:text-orange-300 dark:hover:text-amber-500"
                                        >
                                            {postTitle}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </SidebarContent>
                    )}
                    {sections.length > 0 && (
                        <TableOfContents className="sticky top-8" current={currentSection} sections={sections} />
                    )}
                </>
            </SideBySide>
        </Layout>
    );
};

const getStaticPaths: GetStaticPaths = async () => {
    const keys = await PostRepository.list('en');
    const paths = keys
        .filter(([_year, _month, _day, _slug, lang]) => lang === 'en')
        .map(([year, month, day, slug, lang]) => ({
            params: {
                year,
                month,
                day,
                slug,
                lang: lang as 'en',
            },
        }));

    return {
        paths,
        fallback: false,
    };
};

const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const { year, month, day, slug, lang } = params as {
        year: string;
        month: string;
        day: string;
        slug: string;
        lang: string | undefined;
    };

    if (lang !== 'en') {
        return {
            redirect: {
                destination: `/posts/${year}/${month}/${day}/${slug}`,
                permanent: true,
            },
        };
    }

    const key: Key = [year, month, day, slug, 'en'];
    const { body, keywords, preface, preview, title, audio } = await PostRepository.lookup(key);

    const html = unified()
        .use(rehypeStringify, { allowDangerousHtml: true })
        .stringify(await Post.Body.transform(body));

    const tableOfContents = Post.TableOfContents.extract(body);

    // 他の英語記事 (最新 5 件、現在のページ自身は除外) をサイドバー表示用に取得する。
    // 現在のページから他の EN 記事への内部リンクを増やすことで、Googlebot が
    // 英語コンテンツ同士を辿れるようにする狙い。
    const allEnKeys = await PostRepository.list('en');
    const otherEnKeys = allEnKeys
        .filter(([y, m, d, s]) => !(y === year && m === month && d === day && s === slug))
        .reverse()
        .slice(0, 5);
    const otherEnglishPosts = await Promise.all(
        otherEnKeys.map(async (otherKey) => {
            const other = await PostRepository.lookup(otherKey);
            return {
                title: other.title,
                path: other.path,
                date: other.date,
            };
        }),
    );

    return {
        props: {
            date: `${year}-${month}-${day}`,
            keywords,
            html,
            preface: toString({ type: 'root', children: preface }),
            preview,
            sections: tableOfContents,
            title,
            year,
            month,
            day,
            slug,
            audio,
            otherEnglishPosts,
        },
    };
};

export { getStaticPaths, getStaticProps };
export default Page;
