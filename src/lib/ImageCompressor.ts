import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 0.5, // 500KB
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: 'image/webp',
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Image compression failed:', error);
        throw error;
    }
};
