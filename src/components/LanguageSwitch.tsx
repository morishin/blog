import Link from 'next/link';

type Props = {
    currentLang: 'ja' | 'en';
    path: string;
};

export const LanguageSwitch: React.FC<Props> = ({ currentLang, path }) => {
    const basePath = path.replace(/\/en$/, '');
    const enPath = `${basePath}/en`;

    return (
        <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
                <Link
                    href={basePath}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        currentLang === 'ja'
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                >
                    日本語
                </Link>
                <Link
                    href={enPath}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        currentLang === 'en'
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                >
                    English
                </Link>
            </div>
        </div>
    );
}; 