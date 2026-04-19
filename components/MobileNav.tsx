'use client';

import {
    Compass,
    Home,
    PlusCircle,
    BarChart3,
    Wallet,
    Flame,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';

const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Explore', icon: Compass, href: '/explore' },
    { label: 'Create', icon: PlusCircle, href: '/create' },
    { label: 'Impact', icon: Flame, href: '/impact' },
    { label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
];

export default function MobileNav() {
    const pathname = usePathname();
    const { wallet, disconnect, select, wallets, publicKey, connecting } = useWallet();

    const handleWalletClick = async () => {
        try {
            // If already connected, disconnect
            if (publicKey) {
                console.log("Disconnecting wallet");
                await disconnect();
                return;
            }

            // If not connected, connect
            // Find a ready wallet (Phantom preferred, then any ready wallet)
            const readyStates = new Set<WalletReadyState>([
                WalletReadyState.Installed,
                WalletReadyState.Loadable,
            ]);

            const phantom = wallets.find(
                (walletOption) =>
                    walletOption.adapter.name.toLowerCase().includes("phantom") &&
                    readyStates.has(walletOption.readyState)
            );

            const selectedWallet = phantom || wallets.find((w) => readyStates.has(w.readyState));

            if (!selectedWallet) {
                console.error("No wallet available. Please install Phantom or Backpack.");
                return;
            }

            console.log("Connecting to wallet:", selectedWallet.adapter.name);
            
            // Select the wallet before explicitly starting the connection flow.
            select(selectedWallet.adapter.name);

            await selectedWallet.adapter.connect();
            console.log("Wallet connected successfully");
        } catch (error) {
            console.error("Wallet connection error:", error);
        }
    };

    const getWalletLabel = () => {
        if (connecting) {
            return 'Connecting...';
        }
        if (publicKey) {
            return publicKey.toBase58().slice(0, 6);
        }
        return 'Connect';
    };

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
                <button
                    onClick={handleWalletClick}
                    disabled={connecting}
                    title={publicKey ? "Click to disconnect" : "Click to connect wallet"}
                    className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 active:scale-90 transition-transform duration-200 cursor-pointer disabled:opacity-50 ${
                        publicKey
                            ? 'bg-[#2D7774]/10 dark:bg-teal-500/20 text-[#2D7774] dark:text-teal-400 hover:bg-[#2D7774]/20 dark:hover:bg-teal-500/30'
                            : connecting
                            ? 'bg-[#97422f]/10 dark:bg-orange-500/20 text-[#97422f] dark:text-orange-400'
                            : 'text-stone-500 dark:text-stone-400 hover:text-[#266866] dark:hover:text-teal-400 hover:bg-stone-100 dark:hover:bg-stone-800/50 transition-colors'
                    }`}
                >
                    <Wallet className="h-5 w-5" />
                    <span className="font-sans text-[11px] font-semibold tracking-wide uppercase">
                        {getWalletLabel()}
                    </span>
                </button>
            </div>
        </nav>
    );
}
