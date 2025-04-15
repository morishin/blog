import { SidebarContent } from '..';

declare namespace Links {
    type Props = Record<string, never>;
}

const links = [
    ['morishin.me', 'https://morishin.me/'],
    ['GitHub', 'https://github.com/morishin'],
    ['𝕏', 'https://x.com/morishin127'],
];

const Links: React.FC<Links.Props> = () => {
    return (
        <SidebarContent title="Links">
            <ul className="space-y-1 pl-2 list-['-_'] list-inside marker:text-gray-500 dark:marker:text-gray-400">
                {links.map(([title, href]) => (
                    <li key={href}>
                        <a
                            className="hover:text-orange-300 dark:hover:text-amber-500"
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {title}
                        </a>
                    </li>
                ))}
            </ul>
        </SidebarContent>
    );
};

export { Links };
