import React from 'react';

const LandingView = ({ setView }) => (
    <main>
        <section className="h-screen bg-stone-900 flex items-center justify-center text-center text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
            <div className="z-10 fade-in">
                <h1 className="text-5xl md:text-7xl font-serif mb-4">온누리</h1>
                <p className="text-lg md:text-xl font-light tracking-wider mb-8">디지털 옷장으로 시작하는 나만의 스타일링</p>
                <button onClick={() => setView('closet')} className="btn-primary font-bold py-3 px-8 rounded-full">
                    내 옷장 만들기 <i className="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </section>
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-4">온누리, 이렇게 사용하세요</h2>
                <p className="text-stone-600 max-w-2xl mx-auto mb-12">당신의 옷으로 시작되는 새로운 패션 경험. 2단계로 간편하게 만나보세요.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                     <div className="flex flex-col items-center">
                         <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4"><i className="fas fa-tshirt text-3xl text-accent"></i></div>
                         <h3 className="text-xl font-bold mb-2">1. 디지털 옷장 채우기</h3>
                         <p className="text-stone-500">가지고 있는 옷 사진을 찍어 나만의 온라인 옷장을 만드세요.</p>
                    </div>
                     <div className="flex flex-col items-center">
                         <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4"><i className="fas fa-robot text-3xl text-accent"></i></div>
                         <h3 className="text-xl font-bold mb-2">2. AI 스타일링 추천</h3>
                         <p className="text-stone-500">AI가 내 옷을 기반으로 매일 새로운 코디와 쇼핑 아이템을 제안합니다.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
);

export default LandingView;