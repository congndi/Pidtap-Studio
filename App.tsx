import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import IdeaTab from './components/IdeaTab';
import ImageTab from './components/ImageTab';
import FaceSwapTab from './components/FaceSwapTab'; // Import new component
import AIGenTab from './components/AIGenTab';
import RestoreTab from './components/RestoreTab';
import UpscaleTab from './components/UpscaleTab';
import VideoTab from './components/VideoTab';
import CharacterCompositingTab from './components/CharacterCompositingTab';
import OutputSection from './components/OutputSection';
import Footer from './components/Footer';
import { Tab, TechOptions, Branch, Prompts, ImageAnalysisMode, ImageOutput, CreateImageSubTab, ProcessOldImageSubTab, AspectRatio } from './types';
import * as geminiService from './services/geminiService';

// Helper function to get the closest standard aspect ratio from a file
const getImageAspectRatio = (file: File): Promise<Exclude<AspectRatio, 'auto'>> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const ratio = img.naturalWidth / img.naturalHeight;
            URL.revokeObjectURL(img.src);

            const ratios: { name: Exclude<AspectRatio, 'auto'>; value: number }[] = [
                { name: '1:1', value: 1 },
                { name: '16:9', value: 16 / 9 },
                { name: '9:16', value: 9 / 16 },
                { name: '4:3', value: 4 / 3 },
                { name: '3:4', value: 3 / 4 },
            ];

            // Find the ratio with the smallest difference
            const closest = ratios.reduce((prev, curr) => 
                (Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev)
            );
            resolve(closest.name);
        };
        img.onerror = (err) => {
            URL.revokeObjectURL(img.src);
            reject(err);
        };
        img.src = URL.createObjectURL(file);
    });
};


const App: React.FC = () => {
    // Shared State
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Đang tạo kiệt tác...');
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('ai_gen');
    
    // Sub-tab State
    const [createImageSubTab, setCreateImageSubTab] = useState<CreateImageSubTab>('idea');
    const [processImageSubTab, setProcessImageSubTab] = useState<ProcessOldImageSubTab>('restore');

    // Output State
    const [prompts, setPrompts] = useState<Prompts | null>(null);
    const [imageHistory, setImageHistory] = useState<ImageOutput[]>([]);
    const [videoPromptOutput, setVideoPromptOutput] = useState<string | null>(null);
    const [isOutputVisible, setIsOutputVisible] = useState(true);

    // --- Tab-specific State ---
    // CreateImageTab -> IdeaTab
    const [idea, setIdea] = useState('');
    const [ideaInputMode, setIdeaInputMode] = useState<'idea' | 'direct'>('idea');
    const [directPrompt, setDirectPrompt] = useState('');
    const [ideaAnalysisMode, setIdeaAnalysisMode] = useState<ImageAnalysisMode>('focused');
    const [selectedBranch, setSelectedBranch] = useState<Branch>('modern_human');
    const [techOptions, setTechOptions] = useState<TechOptions>({});
    const [getPrompt, setGetPrompt] = useState(false);
    
    // CreateImageTab -> ImageTab
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [analysisMode, setAnalysisMode] = useState<ImageAnalysisMode>('freestyle');

    // CreateImageTab -> FaceSwapTab
    const [faceSwapSourceImage, setFaceSwapSourceImage] = useState<File | null>(null);
    const [faceSwapStyleImage, setFaceSwapStyleImage] = useState<File | null>(null);
    const [faceSwapDescription, setFaceSwapDescription] = useState('');
    const [faceSwapInputMode, setFaceSwapInputMode] = useState<'description' | 'style_image'>('description');
    const [faceSwapAnalysisMode, setFaceSwapAnalysisMode] = useState<ImageAnalysisMode>('focused');


    // AIGenTab
    const [subjectImageFile, setSubjectImageFile] = useState<File | null>(null);
    const [customPrompt, setCustomPrompt] = useState('');
    
    // ProcessOldImageTab -> RestoreTab
    const [restoreImageFile, setRestoreImageFile] = useState<File | null>(null);
    const [restoreMode, setRestoreMode] = useState<'single' | 'multiple'>('single');
    const [restoreGender, setRestoreGender] = useState<'male' | 'female' | ''>('');
    const [restoreAge, setRestoreAge] = useState('');
    const [restoreDescription, setRestoreDescription] = useState('');

    // ProcessOldImageTab -> UpscaleTab
    const [upscaleImageFile, setUpscaleImageFile] = useState<File | null>(null);

    // CharacterCompositingTab
    const [characterImages, setCharacterImages] = useState<File[]>([]);
    const [selectedCharacterIndices, setSelectedCharacterIndices] = useState<number[]>([]);
    const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
    const [compositingDescription, setCompositingDescription] = useState('');
    const [compositingAnalysisMode, setCompositingAnalysisMode] = useState<ImageAnalysisMode>('freestyle');
    const [compositingTechOptions, setCompositingTechOptions] = useState<TechOptions>({});

    // VideoTab
    const [videoSubTab, setVideoSubTab] = useState<'idea' | 'continuation'>('idea');
    const [videoIdeaPrompt, setVideoIdeaPrompt] = useState('');
    const [previousVideoPrompt, setPreviousVideoPrompt] = useState('');
    const [nextVideoIdea, setNextVideoIdea] = useState('');
    const [videoAnalysisMode, setVideoAnalysisMode] = useState<ImageAnalysisMode>('freestyle');


    const [numberOfImages, setNumberOfImages] = useState(1);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('auto');
    
    useEffect(() => {
        // Automatically set aspect ratio to 'auto' and disable it for face swap
        if (activeTab === 'create_image' && createImageSubTab === 'face_swap') {
            setAspectRatio('auto');
        }
    }, [activeTab, createImageSubTab]);

    const resetInputs = () => {
        setIdea('');
        setIdeaInputMode('idea');
        setDirectPrompt('');
        setIdeaAnalysisMode('focused');
        setSelectedBranch('modern_human');
        setTechOptions({});
        setGetPrompt(false);
        setImageFile(null);
        setAnalysisMode('freestyle');
        setFaceSwapSourceImage(null);
        setFaceSwapStyleImage(null);
        setFaceSwapDescription('');
        setFaceSwapInputMode('description');
        setFaceSwapAnalysisMode('focused');
        setSubjectImageFile(null);
        setCustomPrompt('');
        setRestoreImageFile(null);
        setRestoreMode('single');
        setRestoreGender('');
        setRestoreAge('');
        setRestoreDescription('');
        setUpscaleImageFile(null);
        setCharacterImages([]);
        setSelectedCharacterIndices([]);
        setBackgroundImageFile(null);
        setCompositingDescription('');
        setCompositingAnalysisMode('freestyle');
        setCompositingTechOptions({});
        setVideoSubTab('idea');
        setVideoIdeaPrompt('');
        setPreviousVideoPrompt('');
        setNextVideoIdea('');
        setVideoAnalysisMode('freestyle');
        setNumberOfImages(1);
        setAspectRatio('auto');
        // Clear previous prompts and errors when starting fresh
        setError(null);
        setPrompts(null);
        setVideoPromptOutput(null);
    };

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
    };
    
    const handleSetImageForAIGen = async (imageBase64: string) => {
        try {
            const response = await fetch(imageBase64);
            const blob = await response.blob();
            const file = new File([blob], `generated_image.${blob.type.split('/')[1] || 'png'}`, { type: blob.type });

            setSubjectImageFile(file);
            setActiveTab('ai_gen');
        } catch (e) {
            setError('Không thể tải ảnh để chỉnh sửa.');
            console.error(e);
        }
    };

    // --- Image History Helpers ---
    const getBase64ImageDimensions = (base64: string): Promise<{ width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.onerror = reject;
            img.src = `data:image/png;base64,${base64}`;
        });
    };

    const addImagesToHistory = async (base64Images: string[], prompt?: string) => {
        const newImageOutputs = await Promise.all(
            base64Images.map(async (base64) => {
                const { width, height } = await getBase64ImageDimensions(base64);
                return {
                    src: base64,
                    resolution: `${width} x ${height}`,
                    prompt: prompt,
                };
            })
        );
        setImageHistory(prev => [...newImageOutputs, ...prev].slice(0, 8));
    };
    
    const handleGenerate = async () => {
        setIsOutputVisible(true); // Show output section when generation starts
        setError(null); // Clear previous errors, but keep history
        setPrompts(null);
        setVideoPromptOutput(null); // Clear previous video prompt
        setIsLoading(true);
        setLoadingMessage('AI đang tạo kiệt tác...');

        try {
            let finalAspectRatio: Exclude<AspectRatio, 'auto'> = '16:9'; // Default for video is 16:9

            if (aspectRatio === 'auto') {
                let sourceFile: File | null = null;
                
                if (activeTab === 'ai_gen') {
                    sourceFile = subjectImageFile;
                } else if (activeTab === 'create_image' && createImageSubTab === 'image') {
                    sourceFile = imageFile;
                } else if (activeTab === 'create_image' && createImageSubTab === 'face_swap') {
                    sourceFile = faceSwapSourceImage;
                } else if (activeTab === 'character_compositing') {
                    sourceFile = backgroundImageFile; // Prioritize background image for aspect ratio
                }
                
                if (sourceFile) {
                    try {
                        setLoadingMessage('Đang xác định tỷ lệ ảnh...');
                        finalAspectRatio = await getImageAspectRatio(sourceFile);
                    } catch (e) {
                        console.error("Could not determine aspect ratio from image, defaulting.", e);
                        finalAspectRatio = '1:1';
                    }
                } else if (!['video', 'create_image'].includes(activeTab)) {
                    finalAspectRatio = '1:1';
                }
            } else {
                finalAspectRatio = aspectRatio;
            }


            let finalPrompts: Prompts | null = null;
            let imageToEdit: File | null = null;
            let finalEditPrompt: string | null = null;


            if (activeTab === 'create_image') {
                if (createImageSubTab === 'idea') {
                     if (ideaInputMode === 'idea') {
                        if (!idea) throw new Error('Vui lòng nhập ý tưởng của bạn.');
                        setLoadingMessage('Đang rèn giũa prompt...');
                        finalPrompts = await geminiService.generatePromptsFromIdea(idea, selectedBranch, techOptions, ideaAnalysisMode);
                    } else { // 'direct' mode
                        if (!directPrompt) throw new Error('Vui lòng nhập prompt của bạn.');
                        finalPrompts = {
                            english: directPrompt,
                            vietnamese: 'Prompt được cung cấp trực tiếp bởi người dùng.'
                        };
                    }
                } else if (createImageSubTab === 'image') {
                    if (!imageFile) throw new Error('Vui lòng tải lên một hình ảnh.');
                    setLoadingMessage('Đang phân tích ảnh...');
                    finalPrompts = await geminiService.analyzeImage(imageFile, analysisMode, techOptions);
                } else if (createImageSubTab === 'face_swap') {
                    if (!faceSwapSourceImage) throw new Error('Vui lòng tải lên ảnh chân dung.');
                    
                    setLoadingMessage('Đang chuẩn bị prompt ghép mặt...');
                    finalPrompts = await geminiService.generatePromptForFaceComposite(
                        faceSwapInputMode,
                        {
                            description: faceSwapDescription,
                            styleImage: faceSwapStyleImage,
                            analysisMode: faceSwapAnalysisMode,
                            techOptions: techOptions,
                        }
                    );
                    
                    imageToEdit = faceSwapSourceImage;
                    finalEditPrompt = `CRITICAL INSTRUCTION: You MUST use the exact face from the reference image. Preserve 99.99% of the facial features, identity, and expression. Do NOT alter the face. Place this exact person in the following scene: "${finalPrompts.english}"`;
                }
            }
            
            if (finalPrompts && !finalEditPrompt) { // Standard image generation from prompt
                setPrompts(finalPrompts);
                setLoadingMessage('Đang tạo hình ảnh...');
                const images = await geminiService.generateImageFromPrompts(finalPrompts, numberOfImages, finalAspectRatio);
                await addImagesToHistory(images, getPrompt ? finalPrompts.english : undefined);
            } else if (imageToEdit && finalEditPrompt) { // Face Swap generation
                setPrompts(finalPrompts); // Save the generated prompt for display
                setLoadingMessage('Đang ghép mặt vào ảnh mới...');
                 if (numberOfImages > 1) {
                    const imagePromises = Array.from({ length: numberOfImages }, (_, i) => 
                        geminiService.editImage(imageToEdit!, finalEditPrompt!, finalAspectRatio, i)
                    );
                    const images = await Promise.all(imagePromises);
                    await addImagesToHistory(images, getPrompt ? finalPrompts?.english : undefined);
                } else {
                    const editedImage = await geminiService.editImage(imageToEdit, finalEditPrompt, finalAspectRatio);
                    await addImagesToHistory([editedImage], getPrompt ? finalPrompts?.english : undefined);
                }
            } else if (activeTab === 'ai_gen') {
                if (!subjectImageFile) throw new Error('Vui lòng cung cấp ảnh chính để chỉnh sửa.');
                if (!customPrompt) throw new Error('Vui lòng nhập yêu cầu của bạn.');
                
                if (numberOfImages > 1) {
                    setLoadingMessage(`Đang tạo ${numberOfImages} biến thể...`);
                    const imagePromises = Array.from({ length: numberOfImages }, (_, i) => 
                        geminiService.editImage(subjectImageFile, customPrompt, finalAspectRatio, i)
                    );
                    const images = await Promise.all(imagePromises);
                    await addImagesToHistory(images);
                } else {
                    setLoadingMessage('Đang chỉnh sửa ảnh...');
                    const editedImage = await geminiService.editImage(subjectImageFile, customPrompt, finalAspectRatio);
                    await addImagesToHistory([editedImage]);
                }
            } else if (activeTab === 'process_old_image') {
                if (processImageSubTab === 'restore') {
                    if (!restoreImageFile) throw new Error('Vui lòng cung cấp ảnh để khôi phục.');
                    setLoadingMessage('Đang phục chế ảnh...');
                    
                    const restoreOptions = {
                        mode: restoreMode,
                        gender: restoreGender || undefined,
                        age: restoreAge || undefined,
                        description: restoreDescription || undefined,
                    };

                    const restoredImage = await geminiService.restorePhoto(restoreImageFile, restoreOptions);
                    await addImagesToHistory([restoredImage]);
                } else if (processImageSubTab === 'upscale') {
                    if (!upscaleImageFile) throw new Error('Vui lòng cung cấp ảnh để tăng độ phân giải.');
                    setLoadingMessage('Đang tăng độ phân giải ảnh...');
                    const upscaledImage = await geminiService.upscaleImage(upscaleImageFile);
                    await addImagesToHistory([upscaledImage]);
                }
            } else if (activeTab === 'character_compositing') {
                if (selectedCharacterIndices.length === 0) throw new Error('Vui lòng chọn ít nhất một ảnh nhân vật để ghép.');
                if (!compositingDescription) throw new Error('Vui lòng nhập mô tả cho bối cảnh và hành động.');
                
                const selectedCharacterData = selectedCharacterIndices.map(index => ({
                    file: characterImages[index],
                    originalIndex: index + 1, // Pass the 1-based UI index
                }));
                
                if (numberOfImages > 1) {
                    setLoadingMessage(`Đang tạo ${numberOfImages} biến thể ghép...`);
                    const imagePromises = Array.from({ length: numberOfImages }, () => 
                        geminiService.compositeCharacters(selectedCharacterData, backgroundImageFile, compositingDescription, finalAspectRatio, compositingAnalysisMode, compositingTechOptions)
                    );
                    const images = await Promise.all(imagePromises);
                    await addImagesToHistory(images);
                } else {
                    setLoadingMessage('Đang ghép ảnh...');
                    const compositedImage = await geminiService.compositeCharacters(selectedCharacterData, backgroundImageFile, compositingDescription, finalAspectRatio, compositingAnalysisMode, compositingTechOptions);
                    await addImagesToHistory([compositedImage]);
                }
            } else if (activeTab === 'video') {
                 let prompt: string;
                if (videoSubTab === 'idea') {
                    if (!videoIdeaPrompt) throw new Error('Vui lòng nhập ý tưởng chính cho video.');
                    setLoadingMessage('Đang tạo prompt cho video...');
                    prompt = await geminiService.generateVideoPrompt(
                        videoIdeaPrompt,
                        videoAnalysisMode,
                    );
                } else { // 'continuation'
                    if (!previousVideoPrompt) throw new Error('Vui lòng nhập prompt trước đó.');
                    if (!nextVideoIdea) throw new Error('Vui lòng nhập ý tưởng tiếp theo.');
                    setLoadingMessage('Đang tạo prompt tiếp nối...');
                    prompt = await geminiService.generateContinuationVideoPrompt(
                        previousVideoPrompt,
                        nextVideoIdea,
                        videoAnalysisMode
                    );
                }
                setVideoPromptOutput(prompt);
            }
        } catch (err: any) {
            console.error(err);
            let errorMessage = err.message || 'Vui lòng thử lại.';
            try {
                // Attempt to parse the error message if it's a JSON string from the API
                const errorObj = JSON.parse(errorMessage);
                if (errorObj.error && errorObj.error.message) {
                    if (errorObj.error.status === 'RESOURCE_EXHAUSTED') {
                        errorMessage = 'Bạn đã đạt đến giới hạn sử dụng API. Vui lòng kiểm tra gói cước của bạn hoặc thử lại sau một lát.';
                    } else {
                        errorMessage = errorObj.error.message;
                    }
                }
            } catch (e) {
                // Not a JSON string, so use the message as is.
            }
            setError(`Đã xảy ra lỗi: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageDelete = (indexToDelete: number) => {
        setImageHistory(prevHistory => prevHistory.filter((_, index) => index !== indexToDelete));
    };
    
    const getActionText = () => {
        if (isLoading) return 'Đang tạo...';
        switch (activeTab) {
            case 'process_old_image':
                return processImageSubTab === 'restore' ? 'Khôi phục' : 'Upscale';
            case 'video': return 'Tạo Prompt';
            case 'character_compositing': return 'Ghép ảnh';
            case 'ai_gen':
            case 'create_image':
            default: return 'Gen Img';
        }
    };
    
    const getActionIcon = () => {
        if (isLoading) return 'fa-spinner fa-spin';
        switch (activeTab) {
            case 'process_old_image':
                return processImageSubTab === 'restore' ? 'fa-photo-film' : 'fa-magnifying-glass-plus';
            case 'video': return 'fa-pen-ruler';
            case 'character_compositing': return 'fa-users-viewfinder';
            case 'ai_gen':
            case 'create_image':
            default: return 'fa-robot';
        }
    };

    const hasOutput = imageHistory.length > 0 || videoPromptOutput;
    const isFaceSwapTab = activeTab === 'create_image' && createImageSubTab === 'face_swap';

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
            <Header />
            <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
                <div className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm">
                    <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
                    
                    <div className="mt-6">
                        {activeTab === 'ai_gen' && <AIGenTab subjectImageFile={subjectImageFile} setSubjectImageFile={setSubjectImageFile} customPrompt={customPrompt} setCustomPrompt={setCustomPrompt} />}

                        {activeTab === 'create_image' && (
                            <div>
                                <div className="flex space-x-6 border-b border-gray-700 mb-6">
                                    <button
                                        className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors focus:outline-none ${createImageSubTab === 'idea' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setCreateImageSubTab('idea')}
                                        aria-pressed={createImageSubTab === 'idea'}
                                    >
                                        <i className="fa-solid fa-lightbulb"></i>
                                        <span>Từ Ý Tưởng</span>
                                    </button>
                                    <button
                                        className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors focus:outline-none ${createImageSubTab === 'image' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setCreateImageSubTab('image')}
                                        aria-pressed={createImageSubTab === 'image'}
                                    >
                                        <i className="fa-solid fa-camera-retro"></i>
                                        <span>Từ Hình Ảnh</span>
                                    </button>
                                     <button
                                        className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors focus:outline-none ${createImageSubTab === 'face_swap' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setCreateImageSubTab('face_swap')}
                                        aria-pressed={createImageSubTab === 'face_swap'}
                                    >
                                        <i className="fa-solid fa-masks-theater"></i>
                                        <span>Ghép Mặt</span>
                                    </button>
                                </div>
                                <div>
                                    {createImageSubTab === 'idea' && <IdeaTab
                                        idea={idea} setIdea={setIdea}
                                        selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch}
                                        techOptions={techOptions} setTechOptions={setTechOptions}
                                        inputMode={ideaInputMode} setInputMode={setIdeaInputMode}
                                        analysisMode={ideaAnalysisMode} setAnalysisMode={setIdeaAnalysisMode}
                                        directPrompt={directPrompt} setDirectPrompt={setDirectPrompt}
                                        getPrompt={getPrompt} setGetPrompt={setGetPrompt}
                                    />}
                                    {createImageSubTab === 'image' && <ImageTab imageFile={imageFile} setImageFile={setImageFile} analysisMode={analysisMode} setAnalysisMode={setAnalysisMode} techOptions={techOptions} setTechOptions={setTechOptions} getPrompt={getPrompt} setGetPrompt={setGetPrompt} />}
                                    {createImageSubTab === 'face_swap' && <FaceSwapTab 
                                        sourceImage={faceSwapSourceImage} setSourceImage={setFaceSwapSourceImage}
                                        styleImage={faceSwapStyleImage} setStyleImage={setFaceSwapStyleImage}
                                        description={faceSwapDescription} setDescription={setFaceSwapDescription}
                                        inputMode={faceSwapInputMode} setInputMode={setFaceSwapInputMode}
                                        analysisMode={faceSwapAnalysisMode} setAnalysisMode={setFaceSwapAnalysisMode}
                                        techOptions={techOptions} setTechOptions={setTechOptions}
                                        getPrompt={getPrompt} setGetPrompt={setGetPrompt}
                                    />}
                                </div>
                            </div>
                        )}

                        {activeTab === 'character_compositing' && <CharacterCompositingTab
                            characterImages={characterImages}
                            setCharacterImages={setCharacterImages}
                            selectedIndices={selectedCharacterIndices}
                            setSelectedIndices={setSelectedCharacterIndices}
                            backgroundImage={backgroundImageFile}
                            setBackgroundImage={setBackgroundImageFile}
                            description={compositingDescription}
                            setDescription={setCompositingDescription}
                            analysisMode={compositingAnalysisMode}
                            setAnalysisMode={setCompositingAnalysisMode}
                            techOptions={compositingTechOptions}
                            setTechOptions={setCompositingTechOptions}
                        />}
                        
                        {activeTab === 'process_old_image' && (
                             <div>
                                <div className="flex space-x-6 border-b border-gray-700 mb-6">
                                    <button
                                        className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors focus:outline-none ${processImageSubTab === 'restore' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setProcessImageSubTab('restore')}
                                        aria-pressed={processImageSubTab === 'restore'}
                                    >
                                        <i className="fa-solid fa-photo-film"></i>
                                        <span>Khôi Phục Ảnh</span>
                                    </button>
                                    <button
                                        className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors focus:outline-none ${processImageSubTab === 'upscale' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                                        onClick={() => setProcessImageSubTab('upscale')}
                                        aria-pressed={processImageSubTab === 'upscale'}
                                    >
                                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                                        <span>Upscale</span>
                                    </button>
                                </div>
                                 <div>
                                    {processImageSubTab === 'restore' && <RestoreTab
                                        restoreImageFile={restoreImageFile} setRestoreImageFile={setRestoreImageFile}
                                        mode={restoreMode} setMode={setRestoreMode}
                                        // FIX: Pass the correct state setter 'setRestoreGender' to the 'setGender' prop.
                                        gender={restoreGender} setGender={setRestoreGender}
                                        age={restoreAge} setAge={setRestoreAge}
                                        description={restoreDescription} setDescription={setRestoreDescription}
                                    />}
                                    {processImageSubTab === 'upscale' && <UpscaleTab upscaleImageFile={upscaleImageFile} setUpscaleImageFile={setUpscaleImageFile} />}
                                </div>
                            </div>
                        )}

                        {activeTab === 'video' && <VideoTab
                            subTab={videoSubTab} setSubTab={setVideoSubTab}
                            ideaPrompt={videoIdeaPrompt} setIdeaPrompt={setVideoIdeaPrompt}
                            previousPrompt={previousVideoPrompt} setPreviousPrompt={setPreviousVideoPrompt}
                            // FIX: Corrected variable name from `nextIdea` to `nextVideoIdea` to match the state variable.
                            // FIX: Corrected setter function from `setNextIdea` to `setNextVideoIdea`.
                            nextIdea={nextVideoIdea} setNextIdea={setNextVideoIdea}
                            analysisMode={videoAnalysisMode} setAnalysisMode={setVideoAnalysisMode}
                        />}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700 flex flex-wrap items-center justify-between gap-4">
                         <div className="flex flex-wrap items-center gap-4">
                            {['create_image', 'ai_gen', 'character_compositing'].includes(activeTab) && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="aspect-ratio-selector" className={`font-medium text-sm transition-colors ${isFaceSwapTab ? 'text-gray-500' : 'text-gray-400'}`}>Tỷ lệ:</label>
                                        <select 
                                            id="aspect-ratio-selector"
                                            value={aspectRatio}
                                            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                                            disabled={isLoading || isFaceSwapTab}
                                            title={isFaceSwapTab ? "Tỷ lệ được giữ theo ảnh chân dung gốc" : ""}
                                            className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isFaceSwapTab ? (
                                                <option value="auto">Theo ảnh chân dung</option>
                                            ) : (
                                                <>
                                                    <option value="auto">Theo ảnh gốc</option>
                                                    <option value="1:1">Vuông (1:1)</option>
                                                    <option value="16:9">Ngang (16:9)</option>
                                                    <option value="9:16">Dọc (9:16)</option>
                                                    <option value="4:3">Ngang (4:3)</option>
                                                    <option value="3:4">Dọc (3:4)</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="num-images" className="font-medium text-gray-400 text-sm">Số lượng:</label>
                                        <select 
                                            id="num-images"
                                            value={numberOfImages}
                                            onChange={(e) => setNumberOfImages(Number(e.target.value))}
                                            disabled={isLoading}
                                            className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition disabled:opacity-50"
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </>
                            )}
                             <button 
                                onClick={handleGenerate} 
                                disabled={isLoading}
                                className={`px-6 py-3 text-white font-bold rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 text-lg ${isLoading ? 'gen-button-loading cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                <i className={`fa-solid ${getActionIcon()}`}></i>
                                {getActionText()}
                            </button>
                             <button
                                onClick={() => setIsOutputVisible(v => !v)}
                                disabled={!hasOutput}
                                title={isOutputVisible ? 'Ẩn kết quả' : 'Xem kết quả'}
                                aria-label="Toggle results visibility"
                                className="relative px-4 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 text-lg"
                            >
                                <i className="fa-solid fa-images"></i>
                                {hasOutput && (
                                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-800">
                                        {imageHistory.length + (videoPromptOutput ? 1 : 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                        <button 
                            onClick={resetInputs}
                            disabled={isLoading}
                            className="px-5 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        >
                           <i className="fa-solid fa-undo"></i> Làm lại
                        </button>
                    </div>
                </div>

                {isOutputVisible && (
                    <OutputSection
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        error={error}
                        generatedImages={imageHistory}
                        videoPromptOutput={videoPromptOutput}
                        onSetImageForAIGen={handleSetImageForAIGen}
                        onImageDelete={handleImageDelete}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default App;