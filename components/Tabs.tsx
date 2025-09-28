import React from 'react';
import { Tab } from '../types';

interface TabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
    const tabs: { id: Tab; icon: string; label: string }[] = [
        { id: 'ai_gen', icon: 'fa-solid fa-wand-magic-sparkles', label: 'AI Gen' },
        { id: 'create_image', icon: 'fa-solid fa-palette', label: 'Tạo Ảnh' },
        { id: 'process_old_image', icon: 'fa-solid fa-wand-magic', label: 'Xử lý ảnh cũ' },
        { id: 'character_compositing', icon: 'fa-solid fa-users-viewfinder', label: 'Ghép ảnh' },
        { id: 'video', icon: 'fa-solid fa-film', label: 'Prompt video' },
    ];

    return (
        <div className="flex space-x-2 border-b border-gray-700 mb-6 overflow-x-auto pb-px">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const isAIGen = tab.id === 'ai_gen';

                let buttonClasses = `flex items-center gap-2 px-4 py-3 font-semibold text-sm sm:text-base rounded-t-lg transition-all duration-300 focus:outline-none flex-shrink-0 `;

                if (isActive) {
                    buttonClasses += 'bg-gray-800/80 border-b-2 border-indigo-500 text-white';
                } else {
                    buttonClasses += 'text-gray-400 hover:bg-gray-700/50 hover:text-white';
                    // Special highlight for the AI Gen tab when it's not active
                    if (isAIGen) {
                        buttonClasses += ' text-indigo-300 shadow-indigo-500/50 shadow-[0_0_10px] ring-1 ring-indigo-500/50';
                    }
                }

                return (
                    <button
                        key={tab.id}
                        className={buttonClasses}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;