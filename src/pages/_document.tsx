import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';

type Props = DocumentInitialProps & {
    lang: string;
};

class MyDocument extends Document<Props> {
    static async getInitialProps(ctx: DocumentContext): Promise<Props> {
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => App,
                enhanceComponent: (Component) => Component,
            });

        const initialProps = await Document.getInitialProps(ctx);
        const lang = ctx.asPath?.endsWith('/en') ? 'en' : 'ja';
        return { ...initialProps, lang };
    }

    render() {
        return (
            <Html lang={this.props.lang} className="antialiased scroll-pt-8">
                <Head />
                <body className="bg-white text:gray-900 dark:bg-black dark:text-zinc-50 pb-12">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
