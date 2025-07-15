import React, { useState } from 'react';

interface FaqItem {
    Title?: string;
    Text?: string;
}

interface FaqProps {
    title?: string;
    subtitle?: string;
    items?: FaqItem[];
}

const FaqComponent: React.FC<FaqProps> = ({ title, subtitle, items = [] }) => {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());

    const toggleItem = (index: number) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(index)) {
            newOpenItems.delete(index);
        } else {
            newOpenItems.add(index);
        }
        setOpenItems(newOpenItems);
    };

    return (
        <div>
            {/* FAQ Items */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border border-jagt-50">
                    {items.map((item, index) => (
                        <div key={index} className={`${index !== 0 ? 'border-t border-jagt-50' : ''}`}>
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                            >
                                <span className="font-semibold text-jagt-600 text-lg">
                                    {item.Title}
                                </span>
                                <div className="ml-4 flex-shrink-0">
                                    <i className={`far ${openItems.has(index) ? 'fa-chevron-up' : 'fa-chevron-down'} text-jagt-600`}></i>
                                </div>
                            </button>

                            {openItems.has(index) && (
                                <div className="px-6 pb-5">
                                    <div className="text-jagt-600 leading-relaxed">
                                        {item.Text}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaqComponent;
