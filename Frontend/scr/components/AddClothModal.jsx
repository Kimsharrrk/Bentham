import React, { useState } from 'react';

const AddClothModal = ({ closeModal, refreshCloset }) => {
    const [preview, setPreview] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [file, setFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('file', file);
        formData.append('color', selectedColor);

        if (!file || !formData.get('category') || !selectedColor) {
            alert('사진, 카테고리, 색상은 필수 항목입니다.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/wardrobe/items`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to add item');
            alert('옷이 성공적으로 추가되었습니다.');
            refreshCloset();
            closeModal();
        } catch (error) {
            console.error("Error adding item:", error);
            alert('옷 추가에 실패했습니다.');
        }
    };
    
    const colors = ["#ffffff", "#000000", "#a8a29e", "#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">새 옷 등록</h2>
                    <button onClick={closeModal} className="text-stone-500 hover:text-stone-800 text-3xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                     <div className="mb-4">
                        <label className="block text-stone-700 text-sm font-bold mb-2">옷 사진</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {preview ? (
                                    <img src={preview} alt="미리보기" className="mx-auto h-24 w-auto mb-2"/>
                                ) : (
                                    <i className="fas fa-camera text-4xl text-stone-400"></i>
                                )}
                                <div className="flex text-sm text-stone-600">
                                    <label htmlFor="cloth-image" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-700 hover:text-amber-600">
                                        <span>파일 업로드</span>
                                        <input id="cloth-image" name="cloth-image" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    <p className="pl-1">또는 파일을 여기로 드래그하세요</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-stone-700 text-sm font-bold mb-2">옷 이름</label>
                        <input name="name" type="text" placeholder="예: 화이트 셔츠" className="shadow appearance-none border rounded w-full py-2 px-3" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-stone-700 text-sm font-bold mb-2">카테고리</label>
                        <select name="category" className="block w-full bg-white border border-stone-300 px-4 py-2 pr-8 rounded" defaultValue="상의">
                            <option>상의</option><option>하의</option><option>아우터</option><option>신발</option><option>액세서리</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-stone-700 text-sm font-bold mb-2">색상</label>
                        <div className="flex flex-wrap gap-3">
                            {colors.map(color => (
                                <span key={color} onClick={() => setSelectedColor(color)} className={`color-swatch ${selectedColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }}></span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <button type="button" onClick={closeModal} className="btn-secondary font-bold py-2 px-4 rounded-full">취소</button>
                        <button type="submit" className="btn-primary font-bold py-2 px-4 rounded-full">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClothModal;

