'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = status === 'authenticated';

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-surface-container top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-6 lg:px-12 xl:px-20 h-20 max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
        {/* Logo and Main Nav */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.svg" 
              alt="Vyora Logo" 
              className="w-8 h-8 group-hover:scale-105 transition-transform"
            />
            <span className="font-display text-headline-md font-bold text-on-surface tracking-tight">
              Vyora
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="font-label-md text-label-md text-secondary hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="font-label-md text-label-md text-secondary hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="font-label-md text-label-md text-secondary hover:text-primary transition-colors">
              Pricing
            </a>
          </nav>
        </div>

        {/* Desktop CTA/Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="text-body-md text-secondary border-r border-surface-container pr-4 font-medium">
                {session.user?.name || session.user?.email}
              </span>
              <Link
                href="/dashboard"
                className="text-secondary font-label-md text-label-md hover:text-on-surface transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-secondary font-label-md text-label-md hover:text-on-surface transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/login"
                className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md hover:shadow-md transition-all active:scale-95 hover:bg-primary-container/90"
              >
                Start Planning
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex md:hidden w-10 h-10 items-center justify-center rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-on-surface">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-container bg-background px-6 py-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-md text-secondary hover:text-primary py-2 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-md text-secondary hover:text-primary py-2 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-md text-secondary hover:text-primary py-2 transition-colors"
            >
              Pricing
            </a>
          </nav>
          
          <div className="pt-4 border-t border-surface-container flex flex-col gap-4">
            {isLoggedIn ? (
              <>
                <div className="text-body-md text-secondary font-medium">
                  Signed in as: {session.user?.name || session.user?.email}
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center border border-surface-container px-6 py-2 rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md text-center cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center border border-surface-container px-6 py-2 rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md text-center"
                >
                  Start Planning
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
