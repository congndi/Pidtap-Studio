// FIX: Define and export all necessary types for the application.
// This resolves circular dependency and missing export errors across multiple files.
export type Tab = 'ai_gen' | 'create_image' | 'process_old_image' | 'character_compositing' | 'video';

export type CreateImageSubTab = 'idea' | 'image' | 'face_swap';
export type ProcessOldImageSubTab = 'restore' | 'upscale';

export type Branch = 'modern_human' | 'prehistoric_human' | 'modern_creature' | 'prehistoric_creature' | 'landscape_scene';

export type TechOptions = {
    style?: string;
    layout?: string;
    angle?: string;
    quality?: string;
};

export type Prompts = {
    english: string;
    vietnamese: string;
};

export type ImageAnalysisMode = 'freestyle' | 'focused' | 'in_depth' | 'super';

export type ImageOutput = {
    src: string;
    resolution: string;
    prompt?: string;
};

export type AspectRatio = 'auto' | '1:1' | '16:9' | '9:16' | '4:3' | '3:4';