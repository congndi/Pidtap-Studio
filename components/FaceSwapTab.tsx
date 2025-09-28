import React, { useState, useEffect } from 'react';
import TechOptionsSelector from './TechOptionsSelector';
import { TechOptions, ImageAnalysisMode } from '../types';

interface ImageUploaderProps {
    id: string;
    label: string;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    heightClass?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, imageFile, setImageFile, heightClass = 'h-48' }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [imageFile]);


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
    
    return (
        <div>
             <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}:
            </label>
            <div 
                className={`relative group w-full ${heightClass} border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300 cursor-pointer ${previewUrl ? 'border-indigo-500' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById(id)?.click()}
            >
                <input 
                    type="file" 
                    id={id} 
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
                        <p>Nhấn để chọn hoặc kéo thả</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface FaceSwapTabProps {
    sourceImage: File | null;
    setSourceImage: (file: File | null) => void;
    styleImage: File | null;
    setStyleImage: (file: File | null) => void;
    description: string;
    setDescription: (desc: string) => void;
    inputMode: 'description' | 'style_image';
    setInputMode: (mode: 'description' | 'style_image') => void;
    analysisMode: ImageAnalysisMode;
    setAnalysisMode: (mode: ImageAnalysisMode) => void;
    techOptions: TechOptions;
    setTechOptions: (options: TechOptions) => void;
    getPrompt: boolean;
    setGetPrompt: (value: boolean) => void;
}

const FaceSwapTab: React.FC<FaceSwapTabProps> = ({
    sourceImage, setSourceImage,
    styleImage, setStyleImage,
    description, setDescription,
    inputMode, setInputMode,
    analysisMode, setAnalysisMode,
    techOptions, setTechOptions,
    getPrompt, setGetPrompt
}) => {
    
    useEffect(() => {
        if (analysisMode === 'freestyle') {
            setAnalysisMode('focused');
        }
    }, [analysisMode, setAnalysisMode]);

    const getAnalysisModeDescription = () => {
        switch(analysisMode) {
            case 'focused':
                return 'AI sẽ phân tích có cấu trúc để tạo ra bối cảnh chính xác hơn.';
            case 'in_depth':
                return 'AI sẽ phân tích sâu, bổ sung các chi tiết kỹ thuật chuyên nghiệp vào bối cảnh.';
            case 'super':
                 return 'AI sẽ phân tích theo cấu trúc, đồng thời bổ sung chi tiết kỹ thuật chuyên nghiệp để có bối cảnh tốt nhất.';
            default: return '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader 
                    id="faceswap-source-image"
                    label="1. Tải lên ảnh chân dung"
                    imageFile={sourceImage}
                    setImageFile={setSourceImage}
                    heightClass="h-64"
                />
                <div className="space-y-4">
                     <label className="block text-sm font-medium text-gray-300">2. Chọn nguồn tạo bối cảnh</label>
                     <div className="flex bg-gray-900/50 border border-gray-600 rounded-lg p-1 w-full">
                        <button 
                            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${inputMode === 'description' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                            onClick={() => setInputMode('description')}
                            aria-pressed={inputMode === 'description'}
                        >
                            <i className="fa-solid fa-file-lines mr-2"></i> Từ Mô Tả
                        </button>
                        <button 
                            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${inputMode === 'style_image' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                            onClick={() => setInputMode('style_image')}
                            aria-pressed={inputMode === 'style_image'}
                        >
                            <i className="fa-solid fa-image mr-2"></i> Từ Style Ảnh
                        </button>
                    </div>

                    {inputMode === 'description' ? (
                        <div className="animate-fade-in">
                            <textarea 
                                rows={6} 
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                                placeholder="Mô tả bối cảnh bạn muốn ghép mặt vào. Ví dụ: một phi hành gia đang đi trên sao Hỏa, một hiệp sĩ trong bộ giáp sáng ngời..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <ImageUploader 
                                id="faceswap-style-image"
                                label=""
                                imageFile={styleImage}
                                setImageFile={setStyleImage}
                                heightClass="h-[148px]"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-6 border-t border-gray-700 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Chế độ sáng tạo bối cảnh:
                    </label>
                    <div className="flex bg-gray-900/50 border border-gray-600 rounded-lg p-1 w-full max-w-md">
                        <button 
                            className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'focused' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                            onClick={() => setAnalysisMode('focused')}
                            aria-pressed={analysisMode === 'focused'}
                        >
                            <i className="fa-solid fa-crosshairs"></i> Tập Trung
                        </button>
                        <button 
                            className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'in_depth' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                            onClick={() => setAnalysisMode('in_depth')}
                            aria-pressed={analysisMode === 'in_depth'}
                        >
                           <i className="fa-solid fa-magnifying-glass-chart"></i> Chuyên Sâu
                        </button>
                        <button 
                            className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'super' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'text-gray-400 hover:bg-gray-700'}`}
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
                        id="get-prompt-checkbox-faceswap"
                        type="checkbox"
                        checked={getPrompt}
                        onChange={(e) => setGetPrompt(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="get-prompt-checkbox-faceswap" className="ml-3 block text-sm font-medium text-gray-300 cursor-pointer">
                        Lấy prompt để sử dụng lại
                    </label>
                </div>

                <TechOptionsSelector
                    techOptions={techOptions}
                    setTechOptions={setTechOptions}
                />
            </div>
        </div>
    );
};

export default FaceSwapTab;