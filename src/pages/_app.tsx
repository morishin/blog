import '../styles/index.scss';

import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useEffect } from 'react';

declare global {
    // eslint-disable-next-line no-var
    var gtag: any;
    // eslint-disable-next-line no-var
    var twttr: {
        widgets: {
            createTweet: (id: string, container: HTMLElement, options: Record<string, string>) => void;
        };
        ready: (f: () => void) => void;
    };
}

const gaTrackingID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID!;

const App = ({ Component, pageProps }: AppProps): React.ReactNode => {
    useEffect(() => {
        import('../custom-elements');
    }, []);

    return (
        <>
            <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingID}`} />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaTrackingID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
            <Script
                id="twitter-widget"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.twttr = (function(d, s, id) {
                            var js, fjs = d.getElementsByTagName(s)[0],
                                t = window.twttr || {};
                            if (d.getElementById(id)) return t;
                            js = d.createElement(s);
                            js.id = id;
                            js.src = "https://platform.twitter.com/widgets.js";
                            fjs.parentNode.insertBefore(js, fjs);

                            t._e = [];
                            t.ready = function(f) {
                                t._e.push(f);
                            };

                            return t;
                        }(document, "script", "twitter-wjs"));
                    `,
                }}
            />
            <Component {...pageProps} />
        </>
    );
};

export default App;
