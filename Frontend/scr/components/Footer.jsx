import React from 'react';

const Footer = () => (
    <footer className="bg-stone-800 text-white">
        <div className="container mx-auto px-6 py-10 text-center">
            <a href="#" className="text-2xl font-serif font-bold text-white">온누리</a>
            <div className="flex justify-center space-x-6 mt-6">
                 <a href="#" className="text-stone-300 hover:text-white">About</a>
                 <a href="#" className="text-stone-300 hover:text-white">Contact</a>
                 <a href="#" className="text-stone-300 hover:text-white">이용약관</a>
                 <a href="#" className="text-stone-300 hover:text-white">개인정보처리방침</a>
            </div>
            <p className="mt-8 text-stone-400 text-sm">&copy; 2025 온누리. All Rights Reserved.</p>
        </div>
    </footer>
);

export default Footer;
