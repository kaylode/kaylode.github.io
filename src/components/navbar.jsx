'use client'

import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
    const [nav, setNav] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    const links = [
        {
            id: 1,
            link: 'home',
            label: 'Home',
            type: 'scroll'
        },
        {
            id: 2,
            link: '/projects',
            label: 'Projects',
            type: 'route'
        },
        {
            id: 3,
            link: '/publications',
            label: 'Publications',
            type: 'route'
        },
        {
            id: 4,
            link: '/experiences',
            label: 'Experiences',
            type: 'route'
        },
        {
            id: 5,
            link: '/blog',
            label: 'Blog',
            type: 'route'
        },
        {
            id: 6,
            link: '/tracker',
            label: 'Tracker',
            type: 'route'
        },
    ];

    const renderNavLink = (item) => {
        if (item.type === 'route') {
            return (
                <Link 
                    href={item.link}
                    className="capitalize font-medium text-gray-500 hover:text-white hover:scale-110 duration-200 transition-all"
                    onClick={() => setNav(false)}
                >
                    {item.label}
                </Link>
            );
        } else if (isHomePage) {
            return (
                <ScrollLink 
                    to={item.link} 
                    smooth 
                    duration={500}
                    className="capitalize font-medium text-gray-500 hover:text-white hover:scale-110 duration-200 transition-all cursor-pointer"
                    onClick={() => setNav(false)}
                >
                    {item.label}
                </ScrollLink>
            );
        } else {
            return (
                <Link 
                    href={`/#${item.link}`}
                    className="capitalize font-medium text-gray-500 hover:text-white hover:scale-110 duration-200 transition-all"
                    onClick={() => setNav(false)}
                >
                    {item.label}
                </Link>
            );
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full h-20 px-4 text-white bg-black/90 backdrop-blur-sm border-b border-white/10">
            <div>
                <Link href="/" className="text-5xl font-signature ml-2 hover:text-blue-400 transition-colors">
                    Kaylode
                </Link>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex space-x-8">
                {links.map((item) => (
                    <li key={item.id} className="px-4 cursor-pointer">
                        {renderNavLink(item)}
                    </li>
                ))}
            </ul>

            {/* Mobile Menu Button */}
            <div 
                onClick={() => setNav(!nav)} 
                className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden hover:text-white transition-colors"
            >
                {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
            </div>
            
            {/* Mobile Navigation */}
            {nav && (
                <div className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
                    {links.map((item) => (
                        <div key={item.id} className="px-4 py-6 text-4xl cursor-pointer hover:text-white transition-colors">
                            {renderNavLink(item)}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default NavBar;