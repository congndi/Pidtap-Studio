import React, { useState } from 'react';
import { ImageOutput } from '../types';
import Spinner from './Spinner';

interface OutputSectionProps {
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
    generatedImages: ImageOutput[];
    videoPromptOutput: string | null;
    onSetImageForAIGen: (image: string) => void;
    onImageDelete: (index: number) => void;
}

const OutputSection: React.FC<OutputSectionProps> = ({ isLoading, loadingMessage, error, generatedImages, videoPromptOutput, onSetImageForAIGen, onImageDelete }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [promptToShow, setPromptToShow] = useState<string | null>(null);

    const hasImageContent = generatedImages.length > 0;
    const hasVideoPromptContent = !!videoPromptOutput;
    const hasContent = hasImageContent || hasVideoPromptContent;
    const hasError = !!error;

    const handleDownloadAll = () => {
        generatedImages.forEach((image, index) => {
            try {
                const link = document.createElement('a');
                link.href = `data:image/png;base64,${image.src}`;
                link.download = `pidtap-studio-${Date.now()}-${index + 1}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                console.error("Failed to trigger download for image", index, e);
            }
        });
    };
    
    const handleCopyPrompt = () => {
        if (videoPromptOutput) {
            navigator.clipboard.writeText(videoPromptOutput).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
    };

    const handleImageDeleteAndClose = (index: number) => {
        onImageDelete(index);
        // If we delete the last image, close modal. Otherwise, show the previous one.
        if (generatedImages.length <= 1) {
            setSelectedImageIndex(null); 
        } else if (selectedImageIndex === generatedImages.length - 1) {
             setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex === null || generatedImages.length === 0) return;
        setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % generatedImages.length);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex === null || generatedImages.length === 0) return;
        setSelectedImageIndex((prevIndex) => (prevIndex! - 1 + generatedImages.length) % generatedImages.length);
    };


    if (isLoading) {
        return (
            <div className="mt-8 text-center">
                <div className="inline-block"><Spinner /></div>
                <p className="text-indigo-300 mt-2">{loadingMessage}</p>
            </div>
        );
    }
    
    if (!hasContent && !hasError) {
        return null;
    }
    
    return (
        <div className="mt-8 space-y-8">
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
            
            {hasVideoPromptContent && (
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">
                            <i className="fa-solid fa-pen-ruler mr-2"></i>
                            Prompt Video được tạo
                        </h2>
                        <button
                            onClick={handleCopyPrompt}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
                            <span>{isCopied ? 'Đã sao chép!' : 'Sao chép'}</span>
                        </button>
                    </div>
                    <pre className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg font-mono text-gray-300 text-sm leading-relaxed overflow-x-auto">
                        {videoPromptOutput}
                    </pre>
                </div>
            )}

            {hasImageContent && (
                 <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Kết quả Sáng tạo</h2>
                        <button
                            onClick={handleDownloadAll}
                            disabled={generatedImages.length === 0}
                            title="Tải xuống tất cả ảnh"
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-cloud-download"></i>
                            <span>Tải tất cả</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {generatedImages.map((image, index) => (
                             <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition">
                                <img 
                                    src={`data:image/png;base64,${image.src}`} 
                                    alt={`Generated image ${index + 1}`} 
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => setSelectedImageIndex(index)}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center text-xs text-white font-mono">
                                    {image.resolution}
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedImageIndex !== null && generatedImages[selectedImageIndex] && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedImageIndex(null)}>
                    <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Prev Button */}
                        {generatedImages.length > 1 && (
                            <button onClick={handlePrevImage} className="absolute left-2 md:left-4 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition">
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                        )}
                        
                        {/* Image and Action Bar Wrapper */}
                        <div className="relative max-w-4xl max-h-[90vh]">
                             <img 
                                src={`data:image/png;base64,${generatedImages[selectedImageIndex].src}`} 
                                alt="Enlarged view" 
                                className="block max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                            />
                             
                            {/* NEW Action Bar */}
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-12 rounded-b-lg">
                                <a 
                                    href={`data:image/png;base64,${generatedImages[selectedImageIndex].src}`} 
                                    download={`pidtap-studio-${Date.now()}-${selectedImageIndex}.png`} 
                                    title="Tải xuống" 
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-indigo-600 transition-all duration-300"
                                >
                                    <i className="fa-solid fa-download"></i>
                                    <span className="hidden sm:inline">Tải xuống</span>
                                </a>

                                {generatedImages[selectedImageIndex].prompt && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setPromptToShow(generatedImages[selectedImageIndex].prompt!); }} 
                                        title="Xem prompt đã dùng" 
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-green-600 transition-all duration-300"
                                    >
                                        <i className="fa-solid fa-file-lines"></i>
                                        <span className="hidden sm:inline">Xem Prompt</span>
                                    </button>
                                )}

                                <button 
                                    onClick={() => { onSetImageForAIGen(`data:image/png;base64,${generatedImages[selectedImageIndex].src}`); setSelectedImageIndex(null); }} 
                                    title="Dùng ảnh này để chỉnh sửa tiếp" 
                                    className="flex items-center gap-2 px-5 py-3 text-base font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 ring-2 ring-indigo-500/50 transform hover:scale-105"
                                >
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                    <span className="hidden sm:inline">Chỉnh sửa AI</span>
                                </button>
                                <button 
                                    onClick={() => handleImageDeleteAndClose(selectedImageIndex)} 
                                    title="Xóa" 
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                    <span className="hidden sm:inline">Xóa</span>
                                </button>
                            </div>
                        </div>

                        {/* Next Button */}
                        {generatedImages.length > 1 && (
                            <button onClick={handleNextImage} className="absolute right-2 md:right-4 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition">
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        )}
                        
                        <button className="absolute top-4 right-4 text-white bg-black/40 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition" onClick={() => setSelectedImageIndex(null)}><i className="fa-solid fa-times text-xl"></i></button>
                        
                        {/* Resolution Info */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono shadow-lg">
                           {selectedImageIndex + 1} / {generatedImages.length} | {generatedImages[selectedImageIndex].resolution}
                        </div>
                    </div>
                </div>
            )}
            
            {promptToShow && (
                <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPromptToShow(null)}>
                    <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-6 rounded-xl max-w-2xl w-full space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                <i className="fa-solid fa-terminal mr-2"></i>
                                Prompt đã sử dụng
                            </h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(promptToShow).then(() => {
                                        setIsCopied(true);
                                        setTimeout(() => setIsCopied(false), 2000);
                                    });
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
                                <span>{isCopied ? 'Đã sao chép!' : 'Sao chép'}</span>
                            </button>
                        </div>
                        <pre className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg font-mono text-gray-300 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                            {promptToShow}
                        </pre>
                        <div className="text-right">
                            <button 
                                onClick={() => setPromptToShow(null)}
                                className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutputSection;