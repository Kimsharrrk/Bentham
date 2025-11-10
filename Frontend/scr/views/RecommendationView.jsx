import React from 'react';

const RecommendationView = () => (
    <main className="py-12">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold">오늘의 AI 스타일 추천</h1>
                <p className="mt-4 text-stone-600">
                    회원님의 옷장과 최근 트렌드를 분석하여 AI가 제안하는 완벽한 스타일링입니다.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                 <div className="bg-stone-200 rounded-lg h-[36rem] flex items-center justify-center">
                    <div className="text-center text-stone-500">
                         <i className="fas fa-robot text-6xl mb-4"></i>
                        <p className="text-xl font-bold">AI 추천 스타일</p>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">코디 아이템</h2>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                             <div key={i} className="flex items-center bg-white p-4 rounded-lg border border-stone-200">
                                <div className="w-20 h-20 bg-stone-100 rounded-md flex-shrink-0"></div>
                                <div className="ml-4 flex-grow">
                                    <p className="text-sm text-stone-500">상의</p>
                                    <h3 className="font-bold">실크 블라우스</h3>
                                    <p className="text-amber-800 font-bold mt-1">125,000원</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </main>
);

export default RecommendationView;
