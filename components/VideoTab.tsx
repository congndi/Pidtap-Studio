import React from 'react';
import { ImageAnalysisMode } from '../types';

interface VideoTabProps {
    subTab: 'idea' | 'continuation';
    setSubTab: (tab: 'idea' | 'continuation') => void;
    ideaPrompt: string;
    setIdeaPrompt: (prompt: string) => void;
    previousPrompt: string;
    setPreviousPrompt: (prompt: string) => void;
    nextIdea: string;
    setNextIdea: (prompt: string) => void;
    analysisMode: ImageAnalysisMode;
    setAnalysisMode: (mode: ImageAnalysisMode) => void;
}

const VideoTab: React.FC<VideoTabProps> = ({ 
    subTab, setSubTab, 
    ideaPrompt, setIdeaPrompt, 
    previousPrompt, setPreviousPrompt,
    nextIdea, setNextIdea,
    analysisMode, setAnalysisMode 
}) => {
     const getAnalysisModeDescription = () => {
        switch(analysisMode) {
            case 'freestyle':
                return 'AI sẽ tự do sáng tạo để tạo ra một prompt giàu trí tưởng tượng và điện ảnh.';
            case 'focused':
                return 'AI sẽ phân tích ý tưởng theo cấu trúc và tự động thêm các góc máy điện ảnh phù hợp.';
            case 'in_depth':
                return 'AI sẽ phân tích sâu ý tưởng, bổ sung các chi tiết kỹ thuật chuyên nghiệp về máy ảnh, ánh sáng.';
            case 'super':
                return 'AI sẽ xác định chủ đề của ý tưởng, sau đó áp dụng các chi tiết kỹ thuật chuyên nghiệp để có prompt tốt nhất.';
            default:
                return '';
        }
    }
    return (
        <div className="space-y-6">
            {/* Sub-tab switcher */}
            <div className="flex bg-gray-900/50 border border-gray-600 rounded-lg p-1 w-full max-w-sm">
                <button 
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${subTab === 'idea' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    onClick={() => setSubTab('idea')}
                    aria-pressed={subTab === 'idea'}
                >
                    <i className="fa-solid fa-lightbulb mr-2"></i> Từ Ý Tưởng
                </button>
                <button 
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${subTab === 'continuation' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    onClick={() => setSubTab('continuation')}
                    aria-pressed={subTab === 'continuation'}
                >
                    <i className="fa-solid fa-infinity mr-2"></i> Mở rộng
                </button>
            </div>

            {/* Content for "From Idea" sub-tab */}
            {subTab === 'idea' && (
                 <div className="space-y-6 animate-fade-in">
                    <div>
                        <label htmlFor="video-idea-input" className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fa-solid fa-pen-fancy mr-2 text-indigo-400"></i>Nhập ý tưởng chính:
                        </label>
                        <textarea 
                            id="video-idea-input" 
                            rows={3} 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                            placeholder="Ví dụ: một chiếc ô tô thể thao đang chạy qua một thành phố tương lai vào ban đêm."
                            value={ideaPrompt}
                            onChange={(e) => setIdeaPrompt(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            )}
            
            {/* Content for "Continuation" sub-tab */}
            {subTab === 'continuation' && (
                <div className="space-y-6 animate-fade-in">
                     <div>
                        <label htmlFor="video-previous-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fa-solid fa-backward-step mr-2 text-indigo-400"></i>Prompt trước đó:
                        </label>
                        <textarea 
                            id="video-previous-prompt" 
                            rows={4} 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-mono text-sm"
                            placeholder="Dán prompt bạn đã tạo ở bước trước vào đây..."
                            value={previousPrompt}
                            onChange={(e) => setPreviousPrompt(e.target.value)}
                        ></textarea>
                    </div>
                     <div>
                        <label htmlFor="video-next-idea" className="block text-sm font-medium text-gray-300 mb-2">
                            <i className="fa-solid fa-forward-step mr-2 text-indigo-400"></i>Ý tưởng cho cảnh tiếp theo:
                        </label>
                        <textarea 
                            id="video-next-idea" 
                            rows={3} 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                            placeholder="Ví dụ: chiếc xe rẽ vào một con hẻm tối, và một nhân vật bí ẩn xuất hiện."
                            value={nextIdea}
                            onChange={(e) => setNextIdea(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            )}


            {/* Common creative mode selector */}
            <div className="pt-4 border-t border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chế độ sáng tạo Prompt:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-900/50 border border-gray-600 rounded-lg p-1 w-full max-w-md">
                    <button 
                        className={`py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'freestyle' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        onClick={() => setAnalysisMode('freestyle')}
                        aria-pressed={analysisMode === 'freestyle'}
                    >
                        <i className="fa-solid fa-brain"></i> Tự Do
                    </button>
                    <button 
                        className={`py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'focused' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        onClick={() => setAnalysisMode('focused')}
                        aria-pressed={analysisMode === 'focused'}
                    >
                        <i className="fa-solid fa-crosshairs"></i> Tập Trung
                    </button>
                     <button 
                        className={`py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${analysisMode === 'in_depth' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        onClick={() => setAnalysisMode('in_depth')}
                        aria-pressed={analysisMode === 'in_depth'}
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
        </div>
    );
};

export default VideoTab;