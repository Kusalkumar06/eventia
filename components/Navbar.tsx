'use client'
import React from 'react'
import Link from 'next/link'
import { lobster } from '@/app/utilities/fonts'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  return (
    <div>
      <nav className='px-20 py-3 flex justify-between'>
        <div>
          <Link href='/' className={`${lobster.className} text-[#DB2525] text-[30px] text`}>Eventia</Link>
        </div>
        <div className='flex space-x-9 items-center justify-center font'>
          <Link href='/' className={`transition text-[18px] flex items-center  gap-3  ${pathname === '/' && 'bg-[#f9c3c3ff] rounded px-4 py-px'}`}>{pathname === '/' && <span className="w-2 h-2 rounded-full bg-[#DB2525]"></span>} Home</Link>
          <Link href='/events' className={`transition text-[18px] flex items-center  gap-3  ${pathname === '/events' && 'bg-[#f9c3c3ff] rounded px-4 py-px'}`}>{pathname === '/events' && <span className="w-2 h-2 rounded-full bg-[#DB2525]"></span>} Events</Link>
          <Link href='/my-events' className={`transition text-[18px] flex items-center  gap-3  ${pathname === '/my-events' && 'bg-[#f9c3c3ff] rounded px-4 py-px'}`}>{pathname === '/my-events' && <span className="w-2 h-2 rounded-full bg-[#DB2525]"></span>} My Events</Link>
          <Link href='/profile' className={`transition text-[18px] flex items-center  gap-3  ${pathname === '/profile' && 'bg-[#f9c3c3ff] rounded px-4 py-px'}`}>{pathname === '/profile' && <span className="w-2 h-2 rounded-full bg-[#DB2525]"></span>} profile</Link>
          <button className='bg-[#DB2525] rounded-[5px] text-center px-5 py-1 text-white'>
            <Link href='/create-event'>+ Create Event</Link>
          </button>
          <button className='border border-[#DB2525] rounded-[5px] text-center px-5 py-1 text-[#DB2525] hover:bg-[#DB2525] hover:text-white'>
            <Link href='/create-event'>Sign out</Link>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
