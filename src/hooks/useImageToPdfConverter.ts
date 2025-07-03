import { useState, useCallback } from 'react';
import { convertMultipleImagesToPDF } from '../utils/multipleImageConverter';

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface ConversionResult {
  url: string;
  filename: string;
}

interface Progress {
  current: number;
  total: number;
}

export const useImageToPdfConverter = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);

  const addImages = useCallback((files: File[]) => {
    const newImages: ImageItem[] = files.map(file => ({
      id: Math.random().toString(36).substring(2),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
    setError(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Clean up object URL
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return updated;
    });
  }, []);

  const reorderImages = useCallback((newImages: ImageItem[]) => {
    setImages(newImages);
  }, []);

  const convertToPdf = useCallback(async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    setError(null);
    setProgress({ current: 0, total: images.length });

    try {
      const files = images.map(img => img.file);
      const pdfBlob = await convertMultipleImagesToPDF(files, (current) => {
        setProgress({ current, total: files.length });
      });

      const url = URL.createObjectURL(pdfBlob);
      const filename = `converted_images_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      setResult({ url, filename });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert images to PDF');
    } finally {
      setIsConverting(false);
      setProgress(null);
    }
  }, [images]);

  const reset = useCallback(() => {
    // Clean up object URLs
    images.forEach(img => URL.revokeObjectURL(img.preview));
    if (result) {
      URL.revokeObjectURL(result.url);
    }
    
    setImages([]);
    setResult(null);
    setError(null);
    setProgress(null);
  }, [images, result]);

  return {
    images,
    isConverting,
    error,
    result,
    progress,
    addImages,
    removeImage,
    reorderImages,
    convertToPdf,
    reset
  };
};
