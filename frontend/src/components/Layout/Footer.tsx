import React from 'react';

export const Footer: React.FC = () => {
    const FOOTER_ITEMS = [
        { label: "Discover", icon: <></>, url: "/groups" },
        { label: "My Groups", icon: <></>, url: "/activity" },
        { label: "Rewards", icon: <></>, url: "/rewards" },
    ]
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
                {FOOTER_ITEMS.map((navItem) => (<a key={`${navItem.url}`} href={navItem.url} className="flex items-center ">
                    <p className="text-gray-800">{navItem.icon}</p>
                    <p className="text-sm text-gray-800">{navItem.label}</p>
                </a>))}

            </div>
        </nav>
    );
};


