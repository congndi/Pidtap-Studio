// FIX: Import both Branch and TechOptions types to correctly type the constants.
import { Branch, TechOptions } from './types';

export const branchTranslations: Record<Branch, string> = {
    modern_human: 'Con người Hiện đại',
    prehistoric_human: 'Con người Tiền sử',
    modern_creature: 'Sinh vật Hiện đại',
    prehistoric_creature: 'Sinh vật Tiền sử',
    landscape_scene: 'Cảnh quan / Bối cảnh'
};

// FIX: Use the imported TechOptions type directly instead of a dynamic import.
export const techOptionLabels: Record<keyof TechOptions, string> = {
    style: 'Phong cách',
    layout: 'Bố cục',
    angle: 'Góc máy',
    quality: 'Chất lượng'
};

export const promptConfig = {
    common: {
        art_style: "e.g., photorealistic, cinematic, anime, watercolor, impressionistic",
        lighting: "e.g., soft morning light, dramatic chiaroscuro, neon glow, golden hour",
        color_palette: "e.g., vibrant and saturated, monochrome, pastel, earthy tones",
        camera_shot: "e.g., wide-angle, macro, aerial view, dutch angle, portrait",
        composition: "e.g., rule of thirds, leading lines, symmetrical, minimalist",
        detail_level: "e.g., hyper-detailed, intricate, simple, abstract",
        negative_prompt_suggestions: "e.g., ugly, deformed, blurry, bad anatomy, extra limbs"
    },
    modern_human: {
        character_concept: "e.g., cyberpunk hacker, elegant queen, gritty detective, futuristic soldier",
        clothing_style: "e.g., high-fashion couture, tactical gear, vintage streetwear, formal suit",
        facial_expression: "e.g., determined, serene, melancholic, joyful",
        setting: "e.g., neon-lit city street, opulent throne room, abandoned warehouse, high-tech lab"
    },
    prehistoric_human: {
        character_concept: "e.g., wise shaman, fierce hunter, tribal chieftain, young gatherer",
        clothing_materials: "e.g., animal hides, woven fibers, bone ornaments, leather straps",
        tools_weapons: "e.g., stone-tipped spear, obsidian knife, bow and arrow, ceremonial staff",
        environment: "e.g., lush jungle, icy tundra, savanna plains, cave dwelling with fire"
    },
    modern_creature: {
        creature_concept: "e.g., bio-mechanical dragon, ethereal forest spirit, robotic wolf, colossal city leviathan",
        key_features: "e.g., glowing eyes, metallic feathers, crystalline scales, integrated weaponry",
        abilities: "e.g., breathes plasma, camouflages with light, controls technology, telekinetic powers",
        habitat: "e.g., post-apocalyptic city ruins, enchanted digital forest, deep-sea trench, orbital station"
    },
    prehistoric_creature: {
        creature_concept: "e.g., tyrannosaurus rex with feathers, saber-toothed tiger, woolly mammoth, velociraptor pack",
        physical_attributes: "e.g., massive size, sharp claws, powerful jaws, thick fur, vibrant plumage",
        behavior: "e.g., hunting, grazing, migrating, defending territory",
        environment: "e.g., primordial swamp, volcanic landscape, dense fern forest, vast grasslands"
    },
    landscape_scene: {
        scene_concept: "e.g., floating sky islands, futuristic underwater city, enchanted alien forest, volcanic wasteland",
        key_elements: "e.g., strange flora and fauna, towering crystal structures, ancient ruins, cascading waterfalls",
        time_of_day: "e.g., twin-sun sunset, bioluminescent night, perpetual twilight, stormy afternoon",
        mood_atmosphere: "e.g., mysterious and awe-inspiring, peaceful and serene, dangerous and foreboding, vibrant and full of life"
    }
};

export const techOptionsData = {
    style: ["Mặc định", "Cinematic", "Photorealistic", "Anime", "Fantasy Art", "Cyberpunk", "Vintage"],
    layout: ["Mặc định", "Portrait", "Landscape", "Close-up", "Wide Shot"],
    angle: ["Mặc định", "Eye-level", "High-angle", "Low-angle", "Dutch Angle"],
    quality: ["Mặc định", "Hyper-detailed", "8K", "Sharp focus", "Intricate details"]
};

export const techOptionsTranslations: { [key: string]: string } = {
    "Cinematic": "Điện ảnh",
    "Photorealistic": "Chân thực",
    "Anime": "Anime / Hoạt hình",
    "Fantasy Art": "Nghệ thuật Giả tưởng",
    "Cyberpunk": "Viễn tưởng Cyberpunk",
    "Vintage": "Cổ điển",
    "Portrait": "Chân dung",
    "Landscape": "Phong cảnh",
    "Close-up": "Cận cảnh",
    "Wide Shot": "Toàn cảnh",
    "Eye-level": "Ngang tầm mắt",
    "High-angle": "Góc cao",
    "Low-angle": "Góc thấp",
    "Dutch Angle": "Góc nghiêng",
    "Hyper-detailed": "Siêu chi tiết",
    "Sharp focus": "Lấy nét sắc sảo",
    "Intricate details": "Chi tiết phức tạp"
};