'use client';

import {
    Compass,
    Home,
    PlusCircle,
    BarChart3,
    User,
    Flame,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Explore', icon: Compass, href: '/explore' },
    { label: 'Create', icon: PlusCircle, href: '/create' },
    { label: 'Impact', icon: Flame, href: '/impact' },
    { label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { label: 'Profile', icon: User, href: '/profile' },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 w-full h-20 bg-[#fcf9f1]/80 dark:bg-stone-950/80 backdrop-blur-xl z-50 flex justify-around items-center px-4 pt-safe no-border tonal-layering shadow-[0_4px_24px_rgba(28,28,23,0.08)] rounded-b-[32px]">
            <div className="w-full max-w-2xl mx-auto flex justify-around items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 active:scale-90 transition-transform duration-200 cursor-pointer ${isActive
                                ? 'bg-[#97422f]/10 dark:bg-orange-500/20 text-[#97422f] dark:text-orange-400'
                                : 'text-stone-500 dark:text-stone-400 hover:text-[#266866] dark:hover:text-teal-400 transition-colors'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-sans text-[11px] font-semibold tracking-wide uppercase">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}