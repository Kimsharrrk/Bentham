import React, { useState } from 'react';
import AddClothModal from '../components/AddClothModal.jsx';

const ClosetView = ({ items, refreshCloset }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const deleteItem = async (itemId) => {
        if (!window.confirm('정말로 이 옷을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/wardrobe/items/${itemId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete item');
            alert('삭제되었습니다.');
            refreshCloset();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert('삭제에 실패했습니다.');
        }
    };
    
    return (
        <main className="py-12">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">내 옷장</h1>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary font-bold py-2 px-5 rounded-full">
                        <i className="fas fa-plus mr-2"></i>새 옷 추가하기
                    </button>
                </div>
                {items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-stone-200/50 card-hover transition duration-300 group relative">
                                <img src={`http://localhost:8000${item.image_url}`} alt={item.name} className="w-full h-48 object-cover" />
                                <div className="p-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-stone-500">{item.category}</p>
                                        <span className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: item.color || '#ffffff' }}></span>
                                    </div>
                                    <h3 className="font-bold text-md truncate mt-1">{item.name || '이름 없음'}</h3>
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => deleteItem(item.id)} className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600">
                                        <i className="fas fa-trash-alt text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full text-center py-16 text-stone-500">
                        <i className="fas fa-tshirt text-5xl mb-4"></i>
                        <p className="text-xl">옷장이 비어있습니다.</p>
                        <p>새 옷을 추가하여 나만의 스타일을 찾아보세요!</p>
                    </div>
                )}
            </div>
            {isModalOpen && <AddClothModal closeModal={() => setIsModalOpen(false)} refreshCloset={refreshCloset} />}
        </main>
    );
};

export default ClosetView;


