type Props = {
    currentLang: 'ja' | 'en';
    path: string;
};

export const LanguageSwitch: React.FC<Props> = ({ currentLang, path }) => {
    const basePath = path.replace(/\/en$/, '');
    const enPath = `${basePath}/en`;

    return (
        <div className="flex flex-col items-center mb-4">
            <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5">
                <a
                    href={basePath}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        currentLang === 'ja'
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                >
                    日本語
                </a>
                <a
                    href={enPath}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        currentLang === 'en'
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                >
                    English
                </a>
            </div>
            {currentLang === 'en' && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    This article is translated from Japanese using AI
                </p>
            )}
        </div>
    );
};
