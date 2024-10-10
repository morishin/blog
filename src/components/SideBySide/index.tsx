declare namespace SideBySide {
    type Props = {
        children: [React.ReactNode, React.ReactNode];
        className?: string;
    };
}

const SideBySide: React.FC<SideBySide.Props> = ({ children, className = '' }: SideBySide.Props) => {
    return (
        <div className={`flex justify-between flex-wrap ${className}`}>
            <div className="flex flex-col flex-1 box-border pt-2 lg:pt-4 px-4 max-w-full">{children[0]}</div>
            <aside className="hidden grow shrink-0 lg:block w-1/4 pl-4 max-w-sm space-y-10">{children[1]}</aside>
        </div>
    );
};

export { SideBySide };
