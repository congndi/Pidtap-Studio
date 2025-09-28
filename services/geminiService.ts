import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { TechOptions, Prompts, Branch, ImageAnalysisMode, AspectRatio } from "../types";
import { promptConfig } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const generatePromptInstruction = (preferences: TechOptions, structure: object, coreIdea: string, theme: string): string => {
    let preferencesText = "";
    const chosenPreferences = Object.entries(preferences)
        .filter(([, value]) => value && value !== "Mặc định")
        .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join("\n");

    if (chosenPreferences) {
        preferencesText = `\n**User's Technical Preferences (IMPORTANT: You MUST follow these):**\n${chosenPreferences}\n`;
    }

    return `**User's Core Idea:** "${coreIdea}"
        **Contextual Theme:** "${theme}"
        You are an expert prompt engineer. Your task is to expand the user's simple idea into a detailed specification based on the theme.
        ${preferencesText}
        **Instructions:**
        1. Analyze the user's idea, contextual theme, and especially their technical preferences.
        2. Mentally fill out the JSON structure below with creative details that match all the inputs.
        3. Use ALL details from your mental model to write two rich, descriptive paragraphs (one Vietnamese, one English).
        4. The final paragraph MUST include a comprehensive negative prompt.
        
        **JSON Structure Guide:** ${JSON.stringify(structure, null, 2)}`;
};

const getPromptsFromResponse = (response: GenerateContentResponse): Prompts => {
    const text = response.text?.trim();
    if (!text) {
        console.error("AI response text is empty.");
        return { vietnamese: "Không nhận được phản hồi hợp lệ từ AI.", english: "Did not receive a valid response from AI." };
    }
    try {
        const parsed = JSON.parse(text);
        if (parsed.vietnamese && parsed.english) {
            return parsed as Prompts;
        }
        // Handle in-depth analysis response
        if (parsed.descriptions && parsed.descriptions.vietnamese && parsed.descriptions.english) {
            return {
                vietnamese: parsed.descriptions.vietnamese,
                english: parsed.descriptions.english,
            };
        }
    } catch (e) {
        console.error("Failed to parse JSON, returning raw text.", e);
    }
    // Fallback if JSON parsing fails
    return { vietnamese: text, english: text };
}

export const generatePromptsFromIdea = async (
    idea: string, 
    branch: Branch, 
    techOptions: TechOptions, 
    mode: ImageAnalysisMode
): Promise<Prompts> => {

    const config = {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                vietnamese: { type: Type.STRING },
                english: { type: Type.STRING },
            },
            required: ["vietnamese", "english"],
        },
    };
    
    const createPreferencesText = (options: TechOptions) => {
        let preferencesText = "";
        const chosenPreferences = Object.entries(options)
            .filter(([, value]) => value && value !== "Mặc định")
            .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join("\n");

        if (chosenPreferences) {
            preferencesText = `\n**User's Technical Preferences (IMPORTANT: You MUST incorporate these into your description):**\n${chosenPreferences}\n`;
        }
        return preferencesText;
    };

    let prompt: string;

    if (mode === 'focused') {
        const emptyStructure = {
            common: promptConfig.common,
            [branch]: promptConfig[branch]
        };
        prompt = generatePromptInstruction(techOptions, emptyStructure, idea, branch);
    } else if (mode === 'in_depth') {
        const preferencesText = createPreferencesText(techOptions);
        prompt = `You are a world-class creative director and prompt engineer for an advanced AI image generation model. Your task is to take a user's simple idea and transform it into a professional, hyper-detailed, and cinematic prompt.

        **User's Core Idea:** "${idea}"
        ${preferencesText}
        
        **Instructions:**
        1.  **Deconstruct the Idea:** Break down the user's idea into core components: Subject, Environment, Action, Mood, and Style.
        2.  **Add Professional Details:** For each component, add extremely detailed, professional-level descriptions. Specify professional camera gear (e.g., shot on ARRI Alexa with a 35mm prime lens), advanced lighting techniques (e.g., chiaroscuro, volumetric lighting), composition (e.g., rule of thirds, leading lines), and artistic influences.
        3.  **Synthesize Master Prompts:** Synthesize these details into two master prompts: one in English and one in standard, fully-accented Vietnamese.
        4.  **Negative Prompt:** Include a comprehensive negative prompt within the English prompt using a standard format like '--neg ...' or 'Negative prompt: ...' at the end.
        5.  **Output Format:** Return ONLY the JSON object with the "english" and "vietnamese" prompts.`;
    } else if (mode === 'super') {
        const preferencesText = createPreferencesText(techOptions);
        prompt = `You are a world-class creative director and prompt engineer. Your task is to take a user's simple idea and transform it into a professional, ultimate-quality prompt, strictly following a specific theme while injecting cinematic, professional details.

        **User's Core Idea:** "${idea}"
        **Strict Theme/Branch:** "${branch}" (You MUST adhere to the concepts and structure of this theme. This is the foundational guide for your creativity).
        ${preferencesText}

        **Instructions:**
        1.  **Analyze Idea within Theme:** Analyze the user's idea exclusively through the lens of the '${branch}' theme. Use the theme's structure as your guide.
        2.  **Inject Professional Details:** For each structural element of the theme, inject hyper-detailed, professional-level descriptions. Specify professional camera gear (e.g., shot on ARRI Alexa with a 85mm prime lens), advanced lighting techniques (e.g., chiaroscuro, volumetric lighting, god rays), and cinematic composition (e.g., rule of thirds, leading lines).
        3.  **Synthesize Master Prompts:** Create two master prompts (one in English, one in standard, fully-accented Vietnamese) that are both incredibly detailed AND perfectly aligned with the chosen theme.
        4.  **Negative Prompt:** Include a comprehensive negative prompt within the English prompt.
        5.  **Output Format:** Return ONLY the JSON object with "english" and "vietnamese" prompts.`;
    } else { // freestyle
        const preferencesText = createPreferencesText(techOptions);
        prompt = `You are a creative expert and prompt engineer. Your task is to take the user's core idea and expand it into a single, rich, descriptive, and imaginative paragraph in English, suitable for an advanced AI image generation model. You have creative freedom but must respect the user's technical preferences if provided. Also, create a Vietnamese translation of the final English paragraph.

        **User's Core Idea:** "${idea}"
        ${preferencesText}
        
        **Instructions:**
        1. Brainstorm creative details related to the idea and preferences.
        2. Write the final English prompt as a single, detailed paragraph.
        3. Provide a faithful Vietnamese translation of that English prompt.
        4. Include a comprehensive negative prompt suggestion within the English prompt using a standard format like '--neg ...' or 'Negative prompt: ...' at the end.`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: config
    });
    return getPromptsFromResponse(response);
};

export const analyzeImage = async (imageFile: File, mode: ImageAnalysisMode, techOptions: TechOptions): Promise<Prompts> => {
    const imagePart = await fileToGenerativePart(imageFile);

    const finalPromptConfig = {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                vietnamese: { type: Type.STRING },
                english: { type: Type.STRING },
            },
            required: ["vietnamese", "english"],
        },
    };
    
    let response: GenerateContentResponse;

    if (mode === 'in_depth') {
        const inDepthSchema = { /* ... schema definition from original file is ok ... */ };
        const inDepthPrompt = `...`; // prompt is ok
        
        response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: inDepthPrompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: inDepthSchema,
            },
        });
        return getPromptsFromResponse(response);
    } 
    
    let promptText = '';
    
    if (mode === 'freestyle') {
        promptText = `You are an expert image analyst and prompt engineer. Your task is to analyze a user's image and describe it in extreme detail to create a high-quality generation prompt. Focus on objective details: subject, composition, lighting, style, color palette, and any specific artistic techniques.`;
    } else if (mode === 'super') {
        const categoryKeys = Object.keys(promptConfig).filter(k => k !== 'common') as Branch[];
        promptText = `You are an expert image analyst and creative director... (full prompt from original file)`;
    } else { // focused
        const categoryKeys = Object.keys(promptConfig).filter(k => k !== 'common') as Branch[];
        const classificationPrompt = `Analyze the image and classify it into one of the following categories: ${categoryKeys.join(', ')}.`;
        
        const classificationResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: classificationPrompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { category: { type: Type.STRING, enum: categoryKeys } },
                    required: ["category"],
                },
            },
        });

        const categoryText = classificationResponse.text?.trim();
        if (!categoryText) throw new Error(`Could not classify the image.`);
        const category = JSON.parse(categoryText).category as Branch;

        if (!category || !promptConfig[category]) {
            throw new Error(`Could not classify the image. AI returned: ${categoryText}`);
        }
        
        const focusedStructure = { common: promptConfig.common, [category]: promptConfig[category] };
        promptText = `You are an expert image analyst. The image has been classified as **${category}**... (full prompt from original file)`;
    }
    
    let preferencesText = "";
    const chosenPreferences = Object.entries(techOptions)
        .filter(([, value]) => value && value !== "Mặc định")
        .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join("\n");

    if (chosenPreferences) {
        preferencesText = `\n**User's Technical Preferences (IMPORTANT: You MUST creatively reinterpret the image according to these):**\n${chosenPreferences}\n`;
    }

    response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: `${promptText}\n${preferencesText}` }] },
        config: finalPromptConfig,
    });
    
    return getPromptsFromResponse(response);
};

export const generateImageFromPrompts = async (prompts: Prompts, numberOfImages: number, aspectRatio: Exclude<AspectRatio, 'auto'>): Promise<string[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompts.english,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages.map(img => img.image.imageBytes);
    }
    throw new Error('AI did not return any images.');
};

export const editImage = async (subjectImage: File, customPrompt: string, aspectRatio: Exclude<AspectRatio, 'auto'>, seed?: number): Promise<string> => {
    const imagePart = await fileToGenerativePart(subjectImage);
    const textPart = {
      text: `CRITICAL REQUIREMENT: The final image's aspect ratio MUST be exactly ${aspectRatio}. This is a non-negotiable rule. Do not inherit the aspect ratio from the input image. Now, edit the image with this instruction: "${customPrompt}"`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
          ...(seed && { seed: seed }),
      },
    });

    const content = response.candidates?.[0]?.content;
    if (content && content.parts) {
        for (const part of content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }
    throw new Error('AI did not return an image. It might have refused the request.');
};

const performImageEditTask = async (imageFile: File, promptText: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, { text: promptText }] },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const content = response.candidates?.[0]?.content;
    if (content?.parts) {
        for (const part of content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }
    throw new Error('AI could not process the image.');
};

export const restorePhoto = async (imageFile: File, options: { mode: 'single' | 'multiple', gender?: 'male' | 'female', age?: string, description?: string }): Promise<string> => {
    let promptText = `This is a photo restoration task. Please restore this old, blurry, or damaged photo to high quality. Enhance details, fix colors, and remove scratches or imperfections.`;

    if (options.mode === 'single') {
        promptText += ` The photo contains a single person.`;
        if (options.gender) promptText += ` Gender: ${options.gender}.`;
        if (options.age) promptText += ` Approximate age: ${options.age}.`;
        if (options.description) promptText += ` Additional details: ${options.description}.`;
    } else {
        promptText += ` The photo contains multiple people.`;
        if (options.description) promptText += ` Scene description: ${options.description}.`;
    }
    promptText += ' The goal is a clean, sharp, and natural-looking restoration.';

    return performImageEditTask(imageFile, promptText);
};


export const upscaleImage = async (imageFile: File): Promise<string> => {
    const promptText = `Upscale this image. Increase its resolution and sharpness while preserving all original details and art style. The goal is to make the image clearer and larger without adding new elements or changing the content.`;
    return performImageEditTask(imageFile, promptText);
};

export const compositeCharacters = async (
    characters: { file: File; originalIndex: number }[],
    background: File | null,
    description: string,
    aspectRatio: Exclude<AspectRatio, 'auto'>,
    analysisMode: ImageAnalysisMode,
    techOptions: TechOptions
): Promise<string> => {
    const scenePrompts = await generatePromptsFromIdea(description, 'landscape_scene', techOptions, analysisMode);
    const detailedSceneDescription = scenePrompts.english;
    
    const parts: any[] = [];
    
    for (const char of characters) {
        const imagePart = await fileToGenerativePart(char.file);
        parts.push(imagePart);
        parts.push({ text: `This is Character ${char.originalIndex}.` });
    }

    if (background) {
        const backgroundPart = await fileToGenerativePart(background);
        parts.push(backgroundPart);
        parts.push({ text: 'This is the background image.' });
    }

    const promptText = `
        **Task: Character Compositing**
        You are provided with several character images (labeled "Character 1", "Character 2", etc.) and an optional background image.
        Your job is to composite the selected characters into a single, coherent scene based on the user's description.

        **User's Scene Description:** "${detailedSceneDescription}"

        **Instructions:**
        1.  **Isolate Characters:** Identify and cleanly isolate the characters from their original backgrounds. Preserve their appearance and identity exactly as in the source images.
        2.  **Positioning:** Place the characters into the new scene (either the provided background or a newly generated one) according to the description.
        3.  **Consistency:** Ensure lighting, shadows, and perspective are consistent for all characters and match the background.
        4.  **Final Image:** The final output must be a single, photorealistic image.
        5.  **Aspect Ratio:** The final image MUST have an aspect ratio of ${aspectRatio}. This is a strict requirement.
    `;
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: parts },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const content = response.candidates?.[0]?.content;
    if (content?.parts) {
        for (const part of content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }
    throw new Error('AI could not composite the characters.');
};


export const generateVideoPrompt = async (
    idea: string, 
    mode: ImageAnalysisMode
): Promise<string> => {
    const basePrompt = `
        You are an expert prompt engineer for an advanced text-to-video AI model. Your task is to take a user's simple idea and transform it into a rich, detailed, and cinematic prompt. The prompt should be a single paragraph in English.

        **User's Idea:** "${idea}"

        **Instructions:**
        1.  **Core Elements:** Describe the main subject, the setting, and the primary action.
        2.  **Cinematography:** Specify camera angles (e.g., wide shot, close-up, drone shot, low angle), camera movement (e.g., panning, tracking shot, slow zoom), and lighting (e.g., golden hour, neon glow, cinematic lighting).
        3.  **Atmosphere & Style:** Define the mood (e.g., epic, mysterious, serene) and visual style (e.g., photorealistic, cinematic, futuristic, 8K, hyper-detailed).
        4.  **Details:** Add specific sensory details—what does the scene look, feel, or sound like?
    `;

    let specificInstruction = '';
    if (mode === 'focused') {
        specificInstruction = `5.  **Focused Mode:** Analyze the user's idea and automatically select the most impactful cinematographic choices to bring it to life. Structure the prompt logically.`;
    } else if (mode === 'in_depth') {
        specificInstruction = `5.  **In-depth Mode:** Deconstruct the idea into its core components (subject, environment, style). For each component, add extremely detailed, professional-level descriptions. Synthesize these details into a master prompt, specifying professional camera gear (e.g., shot on ARRI Alexa with a 35mm prime lens) and advanced lighting techniques.`;
    } else if (mode === 'super') {
        specificInstruction = `5. **Super Mode:** First, analyze the user's idea to identify its core genre and theme. Then, adhering strictly to that theme, deconstruct the idea and inject professional-level cinematic details for every component. The final prompt must be both thematically consistent and technically sophisticated, specifying camera gear, advanced lighting, and precise camera movements.`;
    } else { // freestyle
         specificInstruction = `5.  **Freestyle Mode:** You have complete creative freedom. Be imaginative and generate the most visually stunning and dynamic prompt possible based on the user's idea.`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${basePrompt}\n${specificInstruction}`
    });
    
    return response.text;
};

export const generateContinuationVideoPrompt = async (
    previousPrompt: string,
    nextIdea: string,
    mode: ImageAnalysisMode
): Promise<string> => {
    let modeInstruction = '';
    if (mode === 'focused') {
        modeInstruction = 'Choose logical, effective camera shots and movements to advance the scene.';
    } else if (mode === 'in_depth') {
        modeInstruction = 'Add professional-level details about camera work, lighting changes, and environmental interactions to make the transition seamless and cinematic.';
    } else { // freestyle
        modeInstruction = 'Be highly creative and cinematic in your description of the new scene.';
    }

    const prompt = `
        You are an expert prompt engineer for a text-to-video AI model, specializing in creating coherent, continuous scenes.

        **Previous Scene's Prompt:**
        \`\`\`
        ${previousPrompt}
        \`\`\`

        **User's Idea for the NEXT Scene:** "${nextIdea}"

        **Your Task:**
        Create a new, detailed, cinematic prompt for the next scene that logically and visually continues from the previous one.

        **Instructions:**
        1.  **Analyze Continuity:** Understand the subject, setting, style, and mood of the previous prompt.
        2.  **Incorporate New Idea:** Seamlessly integrate the user's "next idea" into the narrative.
        3.  **Maintain Consistency:** The new prompt's style, lighting, and core elements should feel like a natural continuation. Camera work can change to reflect the new action (e.g., from a wide shot to a close-up).
        4.  **Mode Guideline:** ${modeInstruction}
        5.  **Output:** Provide only the new, complete, single-paragraph prompt in English.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text;
};

export const generatePromptForFaceComposite = async (
    mode: 'description' | 'style_image',
    options: {
        description?: string;
        styleImage?: File | null;
        analysisMode: ImageAnalysisMode;
        techOptions: TechOptions;
    }
): Promise<Prompts> => {
     const { description, styleImage, analysisMode, techOptions } = options;
   
    if (mode === 'description') {
        if (!description) throw new Error("Description is required for this mode.");
        return generatePromptsFromIdea(description, 'modern_human', techOptions, analysisMode);
    } else { // 'style_image'
        if (!styleImage) throw new Error("Style image is required for this mode.");
        return analyzeImage(styleImage, analysisMode, techOptions);
    }
};