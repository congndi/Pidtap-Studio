import React from 'react';
import TechOptionsSelector from './TechOptionsSelector';
import BranchSelector from './BranchSelector';
import { TechOptions, Branch, ImageAnalysisMode } from '../types';

interface IdeaTabProps {
    idea: string;
    setIdea: (idea: string) => void;
    techOptions: TechOptions;
    setTechOptions: (options: TechOptions) => void;
    selectedBranch: Branch;
    setSelectedBranch: (branch: Branch) => void;
    inputMode: 'idea' | 'direct';
    setInputMode: (mode: 'idea' | 'direct') => void;
    analysisMode: ImageAnalysisMode;
    setAnalysisMode: (mode: ImageAnalysisMode) => void;
    directPrompt: string;
    setDirectPrompt: (prompt: string) => void;
    getPrompt: boolean;
    setGetPrompt: (value: boolean) => void;
}

const IdeaTab: React.FC<IdeaTabProps> = ({ 
    idea, setIdea, 
    techOptions, setTechOptions, 
    selectedBranch, setSelectedBranch,
    inputMode, setInputMode,
    analysisMode, setAnalysisMode,
    directPrompt, setDirectPrompt,
    getPrompt, setGetPrompt
}) => {
    
    const getAnalysisModeDescription = () => {
        switch(analysisMode) {
            case 'freestyle':
                return 'AI sẽ tự do sáng tạo từ ý tưởng của bạn, ít bị ràng buộc bởi cấu trúc.';
            case 'focused':
                return 'AI sẽ tuân thủ nghiêm ngặt cấu trúc chủ đề bạn chọn để có kết quả chính xác hơn.';
            case 'in_depth':
                return 'AI sẽ phân tích sâu ý tưởng, bổ sung các chi tiết kỹ thuật chuyên nghiệp về máy ảnh, ánh sáng.';
            case 'super':
                return 'Kết hợp "Tập trung" và "Chuyên sâu". AI vừa tuân thủ chủ đề, vừa bổ sung chi tiết kỹ thuật để có kết quả tốt nhất.';
            default:
                return '';
        }
    }

    return (
        <div className="space-y-6">
            {/* Input Mode Switcher */}
            <div className="flex bg-gray-900/50 border border-gray-600 rounded-lg p-1 w-full max-w-sm">
                <button 
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${inputMode === 'idea' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    onClick={() => setInputMode('idea')}
                    aria-pressed={inputMode === 'idea'}
                >
                    <i className="fa-solid fa-lightbulb mr-2"></i> Từ Ý Tưởng
                </button>
                <button 
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${inputMode === 'direct' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    onClick={() => setInputMode('direct')}
                    aria-pressed={inputMode === 'direct'}
                >
                    <i className="fa-solid fa-terminal mr-2"></i> Prompt có sẵn
                </button>
            </div>

            {inputMode === 'idea' ? (
                // "From Idea" mode UI
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <label htmlFor="idea-input" className="block text-sm font-medium text-gray-300 mb-2">
                            Nhập ý tưởng chính của bạn:
                        </label>
                        <textarea 
                            id="idea-input" 
                            rows={3} 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                            placeholder="Ví dụ: một chiến binh rồng trong bộ giáp công nghệ cao, đứng trên đỉnh một..."
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Chế độ sáng tạo:
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
                    
                    <div className="flex items-center">
                        <input
                            id="get-prompt-checkbox-idea"
                            type="checkbox"
                            checked={getPrompt}
                            onChange={(e) => setGetPrompt(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <label htmlFor="get-prompt-checkbox-idea" className="ml-3 block text-sm font-medium text-gray-300 cursor-pointer">
                            Lấy prompt để sử dụng lại
                        </label>
                    </div>

                    {['focused', 'super'].includes(analysisMode) && (
                        <BranchSelector 
                            selectedBranch={selectedBranch}
                            onSelectBranch={setSelectedBranch}
                        />
                    )}
                    
                    <TechOptionsSelector
                        techOptions={techOptions}
                        setTechOptions={setTechOptions}
                    />
                </div>
            ) : (
                // "Direct Prompt" mode UI
                <div className="animate-fade-in">
                    <label htmlFor="direct-prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
                        Nhập prompt đầy đủ của bạn (ưu tiên Tiếng Anh):
                    </label>
                    <textarea 
                        id="direct-prompt-input" 
                        rows={8} 
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-mono"
                        placeholder="e.g., photorealistic, cinematic shot of a cyberpunk dragon warrior in high-tech armor, standing on a skyscraper, neon city lights, hyper-detailed, 8k --ar 16:9 --neg low quality, blurry"
                        value={directPrompt}
                        onChange={(e) => setDirectPrompt(e.target.value)}
                    ></textarea>
                     <p className="text-xs text-gray-500 mt-2">
                        Trong chế độ này, prompt của bạn sẽ được sử dụng trực tiếp để tạo ảnh. Các tùy chọn về chủ đề và kỹ thuật sẽ bị bỏ qua.
                    </p>
                </div>
            )}
        </div>
    );
};

export default IdeaTab;