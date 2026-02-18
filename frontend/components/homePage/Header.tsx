"use client"

import Link from 'next/link'
import { HomeLogoutButton, UserProfileButton } from '../ClientSideButtons'

const Header = () => {
  return (
    <div>
        <header className="border-b-4 border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex max-w-4xl mx-auto items-center justify-between">
            {/* Logo */}
            <Link href={"/"} className="flex items-center cursor-pointer gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full border-4 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-2xl">☕</span>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">
                  TeaTalks
                </h1>
                <p className="text-xs text-muted-foreground -mt-1 font-normal">
                  spill the tea
                </p>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <UserProfileButton />
              <HomeLogoutButton />
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header