import React from 'react';

const Header = ({ setView, user, onLogout }) => (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative">
            
            <a href="#" onClick={(e) => { e.preventDefault(); setView('landing'); }} className="text-2xl font-serif font-bold text-stone-900">온누리</a>
            
            <div className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
                <a href="#closet" onClick={(e) => { e.preventDefault(); setView('closet'); }} className="text-stone-600 hover:text-accent">내 옷장</a>
                <a href="#recommendation" onClick={(e) => { e.preventDefault(); setView('recommendation'); }} className="text-stone-600 hover:text-accent">AI 추천</a>
            </div>

            <div className="flex items-center space-x-2">
                {user ? (
                    <>
                        <span className="text-sm font-medium">환영합니다, {user.name}님!</span>
                        <button onClick={onLogout} className="btn-secondary font-bold py-2 px-4 rounded-full text-sm">로그아웃</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setView('login')} className="btn-secondary font-bold py-2 px-4 rounded-full text-sm">로그인</button>
                        <button className="btn-primary font-bold py-2 px-4 rounded-full text-sm">회원가입</button>
                    </>
                )}
            </div>
        </nav>
    </header>
);

export default Header;

