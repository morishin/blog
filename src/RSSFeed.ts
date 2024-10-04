import { Feed } from 'feed';

type Post = {
    title: string;
    preface: string;
    date: [year: string, month: string, day: string];
    url: string;
};

class RSSFeed {
    #feed: Feed;

    public constructor() {
        this.#feed = new Feed({
            title: 'blog.morishin.me',
            link: 'https://blog.morishin.me/',
            id: 'https://blog.morishin.me/',
            copyright: `Copyright (c) ${new Date().getFullYear()} Shintaro Morikawa`,
            author: {
                name: 'morishin',
                email: 'sntr92@gmail.com',
                link: 'https://morishin.me/',
            },
        });
    }

    public generate(): string {
        return this.#feed.rss2();
    }

    public register({ title, preface, date, url }: Post): void {
        this.#feed.addItem({
            date: new Date(new Date(date.join('-')).valueOf() - 32_400_000),
            description: preface,
            id: url,
            link: url,
            title,
        });
    }
}

export { RSSFeed };
