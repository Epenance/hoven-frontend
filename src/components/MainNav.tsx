'use client';

import { useState, useRef, useEffect } from 'react';

interface MenuItem {
    title: string;
    description?: string;
    href?: string;
    children?: MenuItem[];
}

interface Props {
    currentPath: string;
    className?: string;
    data?: MenuItem[];
    onMobileToggle?: (isOpen: boolean) => void;
    isMobileOpen?: boolean;
}

export default function MainNav({
    currentPath,
    className = '',
    data = [],
    onMobileToggle,
    isMobileOpen = false
}: Props) {
    const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
    const [internalMobileOpen, setInternalMobileOpen] = useState(false);
    const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Use external mobile state if provided, otherwise use internal state
    const mobileMenuOpen = onMobileToggle ? isMobileOpen : internalMobileOpen;
    const toggleMobile = onMobileToggle || setInternalMobileOpen;

    // Clear dropdown state when mobile menu closes
    useEffect(() => {
        if (!mobileMenuOpen) {
            setOpenDropdowns(new Set());
        }
    }, [mobileMenuOpen]);

    const handleMouseEnter = (itemTitle: string) => {
        // Clear any existing timeout for this item
        const existingTimeout = timeoutRefs.current.get(itemTitle);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
            timeoutRefs.current.delete(itemTitle);
        }

        setOpenDropdowns(prev => new Set(prev).add(itemTitle));
    };

    const handleMouseLeave = (itemTitle: string) => {
        // Set a timeout to close the dropdown after a brief delay
        const timeout = setTimeout(() => {
            setOpenDropdowns(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemTitle);
                return newSet;
            });
        }, 150);

        timeoutRefs.current.set(itemTitle, timeout);
    };

    const toggleMobileDropdown = (itemTitle: string) => {
        setOpenDropdowns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemTitle)) {
                newSet.delete(itemTitle);
            } else {
                newSet.add(itemTitle);
            }
            return newSet;
        });
    };

    const isActive = (href?: string) => {
        if (!href) return false;
        return currentPath === href || currentPath.startsWith(href + '/');
    };

    const renderMenuItem = (item: MenuItem, level = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openDropdowns.has(item.title);
        const itemIsActive = isActive(item.href);

        return (
            <div
                key={item.title}
                className="relative group"
                onMouseEnter={() => level === 0 && !mobileMenuOpen && handleMouseEnter(item.title)}
                onMouseLeave={() => level === 0 && !mobileMenuOpen && handleMouseLeave(item.title)}
            >
                {/* Desktop Menu Item */}
                <div className="hidden md:block">
                    {item.href ? (
                        <a
                            href={item.href}
                            className={`
                                flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                                ${itemIsActive 
                                    ? 'text-primary bg-primary/10' 
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                }
                            `}
                        >
                            {item.title}
                            {hasChildren && (
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </a>
                    ) : (
                        <button
                            className={`
                                flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                                text-gray-700 hover:text-primary hover:bg-gray-50
                            `}
                        >
                            {item.title}
                            {hasChildren && (
                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Desktop Dropdown */}
                    {hasChildren && isOpen && (
                        <div className={`
                            absolute top-full ${level === 0 ? 'left-0' : 'left-full top-0'} mt-1 w-64 
                            bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50
                            transform transition-all duration-200 ease-out
                            opacity-100 scale-100
                        `}>
                            {item.children?.map((child) => (
                                <div key={child.title} className="relative">
                                    {child.href ? (
                                        <a
                                            href={child.href}
                                            className={`
                                                block px-4 py-3 text-sm transition-colors duration-150
                                                ${isActive(child.href)
                                                    ? 'text-primary bg-primary/5 border-r-2 border-primary'
                                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <div className="font-medium">{child.title}</div>
                                            {child.description && (
                                                <div className="text-xs text-gray-500 mt-1">{child.description}</div>
                                            )}
                                        </a>
                                    ) : (
                                        <div className="px-4 py-3">
                                            <div className="font-medium text-gray-700">{child.title}</div>
                                            {child.description && (
                                                <div className="text-xs text-gray-500 mt-1">{child.description}</div>
                                            )}
                                        </div>
                                    )}

                                    {/* Nested children */}
                                    {child.children && child.children.length > 0 && (
                                        <div className="pl-4 border-l border-gray-100 ml-4">
                                            {child.children.map((grandchild) => renderMenuItem(grandchild, level + 1))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Item */}
                <div className="md:hidden">
                    {hasChildren ? (
                        <div className="flex items-center">
                            {/* Clickable link for the parent item */}
                            <a
                                href={item.href}
                                className={`
                                    flex-1 block px-4 py-3 font-medium transition-colors duration-150
                                    ${itemIsActive 
                                        ? 'text-primary bg-primary/10 border-r-4 border-primary' 
                                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                    }
                                `}
                                onClick={() => toggleMobile(false)}
                            >
                                {item.title}
                            </a>
                            {/* Separate toggle button for dropdown */}
                            <button
                                onClick={() => toggleMobileDropdown(item.title)}
                                className="px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            >
                                <svg
                                    className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <a
                            href={item.href}
                            className={`
                                block px-4 py-3 font-medium transition-colors duration-150
                                ${itemIsActive 
                                    ? 'text-primary bg-primary/10 border-r-4 border-primary' 
                                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                }
                            `}
                            onClick={() => toggleMobile(false)}
                        >
                            {item.title}
                        </a>
                    )}

                    {/* Mobile Dropdown */}
                    {hasChildren && isOpen && (
                        <div className="bg-gray-50 border-l-2 border-gray-200">
                            {item.children?.map((child) => (
                                <div key={child.title}>
                                    <a
                                        href={child.href}
                                        className={`
                                            block px-8 py-2 text-sm transition-colors duration-150
                                            ${isActive(child.href)
                                                ? 'text-primary bg-primary/5'
                                                : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                                            }
                                        `}
                                        onClick={() => onMobileToggle?.(false)}
                                    >
                                        <div className="font-medium">{child.title}</div>
                                        {child.description && (
                                            <div className="text-xs text-gray-500 mt-1">{child.description}</div>
                                        )}
                                    </a>

                                    {/* Mobile nested children */}
                                    {child.children && child.children.map((grandchild) => (
                                        <a
                                            key={grandchild.title}
                                            href={grandchild.href}
                                            className={`
                                                block px-12 py-2 text-xs transition-colors duration-150
                                                ${isActive(grandchild.href)
                                                    ? 'text-primary bg-primary/5'
                                                    : 'text-gray-500 hover:text-primary hover:bg-gray-100'
                                                }
                                            `}
                                            onClick={() => onMobileToggle?.(false)}
                                        >
                                            {grandchild.title}
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        };
    }, []);

    return (
        <>
            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center space-x-1 ${className}`}>
                {data.map(item => renderMenuItem(item))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={() => toggleMobile(!mobileMenuOpen)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                    <span className="sr-only">Open main menu</span>
                    {mobileMenuOpen ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-50 md:hidden">
                    {/* Header with close button */}
                    <div className="flex justify-between items-center p-5 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                        <button
                            onClick={() => toggleMobile(false)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Menu content */}
                    <div className="px-5 py-4 overflow-y-auto h-full">
                        <div className="space-y-1">
                            {data.map(item => renderMenuItem(item))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
