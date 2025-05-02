/* eslint-disable jsx-a11y/media-has-caption */
import { IoSparkles } from 'react-icons/io5';

type Props = {
    audioPath: string;
    lang?: 'en' | null;
};

export const AudioOverview: React.FC<Props> = ({ audioPath, lang }) => {
    const title = lang === 'en' ? 'Audio Overview by NotebookLM' : 'この記事の音声解説 by NotebookLM';
    return (
        <div className="p-[1.5px] dark:p-[1px] rounded-xl bg-[radial-gradient(circle_at_top_left,_#9867f0,_#ed4e50)]">
            <div className="flex flex-col p-4 pb-6 gap-4 rounded-xl border border-transparent text-sm bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
                        <radialGradient id="radial-layer" cx="0%" cy="0%" r="100%" fx="0%" fy="0%">
                            <stop offset="0%" stopColor="#9867f0" />
                            <stop offset="100%" stopColor="#ed4e50" />
                        </radialGradient>
                    </svg>
                    <IoSparkles fill="url(#radial-layer)" />
                    <p className="text-md font-bold">{title}</p>
                </div>
                <audio controls className="w-full">
                    <source src={audioPath} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
};
