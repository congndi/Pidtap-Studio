import React from 'react';
import TechOptionsSelector from './TechOptionsSelector';
import { TechOptions, ImageAnalysisMode } from '../types';

interface ImageTabProps {
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    techOptions: TechOptions;
    setTechOptions: (options: TechOptions) => void;
    analysisMode: ImageAnalysisMode;
    setAnalysisMode: (mode: ImageAnalysisMode) => void;
    getPrompt: boolean;
    setGetPrompt: (value: boolean) => void;
}

const ImageTab: React.FC<ImageTabProps> = ({ imageFile, setImageFile, techOptions, setTechOptions, analysisMode, setAnalysisMode, getPrompt, setGetPrompt }) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImageFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const resetImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
    };

    const previewUrl = imageFile ? URL.createObjectURL(imageFile) : null;
    
    const getAnalysisModeDescription = () => {
        switch(analysisMode) {
            case 'freestyle':
                return 'AI sẽ phân tích khách quan tất cả các chi tiết trong ảnh.';
            case 'focused':
                return 'AI sẽ tự động xác định chủ đề và phân tích chuyên sâu theo cấu trúc đó.';
            case 'in_depth':
                return 'AI sẽ thực hiện phân tích sâu, có cấu trúc để trích xuất thông tin chi tiết nhất có thể.';
            case 'super':
                return 'AI sẽ tự xác định chủ đề, sau đó phân tích sâu và bổ sung chi tiết kỹ thuật chuyên nghiệp vào cấu trúc đó.';
            default:
                return '';
        }
    }


    return (
        <div className="space-y-6">
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                    <i className="fa-solid fa-upload mr-2 text-indigo-400"></i>Tải lên một ảnh để AI phân tích:
                </label>
                <div 
                    className={`relative group w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300 cursor-pointer ${previewUrl ? 'border-indigo-500' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('image-file-input')?.click()}
                >
                    <input 
                        type="file" 
                        id="image-file-input" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {previewUrl ? (
                        <>
                            <img src={previewUrl} className="absolute inset-0 w-full h-full object-contain rounded-lg p-2" alt="Preview"/>
                            <button 
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 z-10" 
                                title="Xóa ảnh" 
                                onClick={resetImage}
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </>
                    ) : (
                        <div className="text-center">
                            <i className="fa-solid fa-cloud-arrow-up text-4xl mb-2"></i>
                            <p>Nhấn để chọn hoặc kéo thả ảnh</p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chế độ phân tích:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-900/50 border border-gray-600 rounded-lg p-1 w-full max-w-md">
                    <button 
                        className={`py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'freestyle' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        onClick={() => setAnalysisMode('freestyle')}
                    >
                        <i className="fa-solid fa-brain"></i> Tự Do
                    </button>
                    <button 
                        className={`py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'focused' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        onClick={() => setAnalysisMode('focused')}
                    >
                        <i className="fa-solid fa-crosshairs"></i> Tập Trung
                    </button>
                    <button 
                        className={`py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'in_depth' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        onClick={() => setAnalysisMode('in_depth')}
                    >
                        <i className="fa-solid fa-magnifying-glass-chart"></i> Chuyên Sâu
                    </button>
                    <button 
                        className={`py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'super' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'text-gray-400 hover:bg-gray-700'}`}
                        onClick={() => setAnalysisMode('super')}
                        aria-pressed={analysisMode === 'super'}
                    >
                        <i className="fa-solid fa-meteor"></i> Siêu Cấp
                    </button>
                </div>
                 <p className="text-xs text-gray-500 mt-2">
                    {getAnalysisModeDescription()}
                </p>
            </div>
            
            <div className="flex items-center">
                <input
                    id="get-prompt-checkbox-image"
                    type="checkbox"
                    checked={getPrompt}
                    onChange={(e) => setGetPrompt(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="get-prompt-checkbox-image" className="ml-3 block text-sm font-medium text-gray-300 cursor-pointer">
                    Lấy prompt để sử dụng lại
                </label>
            </div>

            <TechOptionsSelector
                techOptions={techOptions}
                setTechOptions={setTechOptions}
            />
        </div>
    );
};

export default ImageTab;