import fs from 'fs/promises';
import type { Content, Root } from 'mdast';
import path from 'path';

import * as Post from './Post';

type Key = [year: string, month: string, day: string, slug: string, lang: 'en' | null];

type Post = {
    body: Root;
    date: [year: string, month: string, day: string];
    keywords: string[];
    path: string;
    preface: Content[];
    preview: string | null;
    slug: string;
    title: string;
    lang: 'en' | null;
};

const mdRoot = path.join(process.cwd(), 'data', 'posts');
const assetsRoot = path.join(process.cwd(), 'public', 'posts');

const PostRepository = {
    async lookup([year, month, day, slug, lang]: Key): Promise<Post> {
        const mdPath = lang === 'en' 
            ? path.join(mdRoot, year, month, day, `${slug}/en.md`)
            : path.join(mdRoot, year, month, day, `${slug}.md`);
        
        const md = await fs.readFile(mdPath, { encoding: 'utf-8' });

        let previewExists = false;
        try {
            await fs.access(path.join(assetsRoot, year, month, day, slug, 'preview.png'));
            previewExists = true;
        } catch {
            // nop
        }

        const body = Post.Body.parse(md);
        const preface = Post.Preface.extract(body);
        const { keywords } = Post.Frontmatter.extract(body);

        const title = Post.Title.extract(body);

        return {
            body,
            date: [year, month, day],
            keywords,
            path: lang === 'en' 
                ? `/posts/${year}/${month}/${day}/${slug}/en`
                : `/posts/${year}/${month}/${day}/${slug}`,
            preface,
            preview: previewExists ? `/posts/${year}/${month}/${day}/${slug}/preview.png` : null,
            slug,
            title,
            lang: lang ?? null,
        };
    },

    async list(lang?: 'en' | undefined): Promise<Key[]> {
        const keys: Key[] = [];

        const years = await fs.readdir(mdRoot);

        for (const year of years) {
            const months = await fs.readdir(path.join(mdRoot, year));

            for (const month of months) {
                const days = await fs.readdir(path.join(mdRoot, year, month));

                for (const day of days) {
                    const files = await fs.readdir(path.join(mdRoot, year, month, day));

                    for (const file of files) {
                        if (lang === 'en') {
                            // 英語版の記事のみを取得
                            if (!file.endsWith('.md')) {
                                const enFiles = await fs.readdir(path.join(mdRoot, year, month, day, file));
                                for (const enFile of enFiles) {
                                    if (enFile === 'en.md') {
                                        keys.push([year, month, day, file, 'en']);
                                    }
                                }
                            }
                        } else {
                            // 日本語版の記事のみを取得
                            if (file.endsWith('.md')) {
                                const slug = path.parse(file).name;
                                keys.push([year, month, day, slug, null]);
                            }
                        }
                    }
                }
            }
        }

        return keys;
    },
};

export { PostRepository, type Key, type Post };

