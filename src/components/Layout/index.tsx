import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faRssSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
    article?: Article | undefined;
    children: React.ReactNode;
    description?: string | undefined;
    preview?: string | undefined;
    title?: string | undefined;
    keywords?: string[] | undefined;
};

type Article = {
    date: string;
};

export const Layout: React.FC<Props> = ({ article, children, description, preview, title, keywords }) => {
    const router = useRouter();

    const image = preview ?? 'https://blog.morishin.me/og-image.png';
    const url = `https://blog.morishin.me${router.asPath}`;

    // 現在のURL（相対パス）から対応する言語バージョンのURLを生成
    const getLanguageUrls = (): { jaUrl: string; enUrl: string } => {
        const isEnglish = router.asPath.endsWith('/en');
        const basePath = isEnglish ? router.asPath.replace(/\/en$/, '') : router.asPath;
        const englishPath = `${basePath}/en`;

        return {
            jaUrl: `https://blog.morishin.me${basePath}`,
            enUrl: `https://blog.morishin.me${englishPath}`,
        };
    };

    const { jaUrl, enUrl } = getLanguageUrls();

    // Schema.orgの構造化データを生成
    const generateStructuredData = (): Record<string, any> => {
        if (article) {
            // 記事ページ用のBlogPostingスキーマ
            return {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: title,
                image: [image],
                datePublished: article.date,
                dateModified: article.date,
                author: {
                    '@type': 'Person',
                    name: 'morishin',
                    url: 'https://blog.morishin.me',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'blog.morishin.me',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://blog.morishin.me/og-image.png',
                    },
                },
                url,
                description,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': url,
                },
                keywords: keywords?.join(', '),
            };
        }
        // ウェブサイト共通のスキーマ
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'blog.morishin.me',
            url: 'https://blog.morishin.me',
            description: description ?? "morishin's blog",
        };
    };

    return (
        <>
            <Head>
                <title>{title === undefined ? 'blog.morishin.me' : `${title} - blog.morishin.me`}</title>
                <link
                    rel="alternate"
                    type="application/rss+xml"
                    title="RSS feed"
                    href="https://blog.morishin.me/feed.xml"
                />
                <meta name="viewport" content="initial-scale=1,width=device-width" />

                {/* 基本的なSEOメタタグ */}
                {description !== undefined && <meta name="description" content={description} />}
                {keywords !== undefined && keywords.length > 0 && (
                    <meta name="keywords" content={keywords.join(', ')} />
                )}
                <link rel="canonical" href={url} />

                {/* 言語別ページのhreflang属性（Google多言語対応） */}
                <link rel="alternate" hrefLang="ja" href={jaUrl} />
                <link rel="alternate" hrefLang="en" href={enUrl} />
                <link rel="alternate" hrefLang="x-default" href={jaUrl} />

                {/* 記事メタデータ */}
                {article !== undefined && <meta property="article:published_time" content={article.date} />}
                {article !== undefined && <meta name="author" content="morishin" />}

                {/* OGP Tags */}
                {description !== undefined && <meta property="og:description" content={description} />}
                <meta property="og:site_name" content="blog.morishin.me" />
                <meta property="og:title" content={title ?? 'blog.morishin.me'} />
                <meta property="og:type" content={article === undefined ? 'website' : 'article'} />
                <meta property="og:url" content={url} />
                <meta property="og:image" content={image} />
                <meta property="og:locale" content={router.asPath.endsWith('/en') ? 'en_US' : 'ja_JP'} />
                {router.asPath.endsWith('/en') ? (
                    <meta property="og:locale:alternate" content="ja_JP" />
                ) : (
                    <meta property="og:locale:alternate" content="en_US" />
                )}

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@morishin127" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:image" content={image} />
                {description !== undefined && <meta name="twitter:description" content={description} />}

                {/* Favicon */}
                <link rel="icon" href="/icon-32.png" />
                <link rel="apple-touch-icon" href="/apple-icon.png" sizes="192x192" />

                {/* Schema.org 構造化データ */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
                />
            </Head>
            <header className="max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
                <h1 className="text-base font-medium">
                    <Link href="/">blog.morishin.me</Link>
                </h1>
                <div className="flex items-center justify-between space-x-4">
                    <a
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        href="https://github.com/morishin/blog"
                        target="_blank"
                        title="GitHub"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faGithub} width="20px" />
                    </a>
                    <a
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        href="/feed.xml"
                        title="RSS feed"
                        target="_blank"
                    >
                        <FontAwesomeIcon icon={faRssSquare} width="20px" />
                    </a>
                </div>
            </header>
            <main className="relative">{children}</main>
        </>
    );
};
