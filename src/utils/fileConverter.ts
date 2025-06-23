import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function convertImageToPDF(imageFile: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Set canvas to image dimensions
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        canvas.width = imgWidth;
        canvas.height = imgHeight;
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/jpeg', 1.0); // max quality

        // Convert pixels to mm: 1 inch = 25.4 mm, 1 inch = 96 px => 1 px ≈ 0.26458 mm
        const pxToMm = (px: number) => (px * 25.4) / 96;
        const pdfWidth = pxToMm(imgWidth);
        const pdfHeight = pxToMm(imgHeight);

        // Create PDF exactly sized to the image
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight],
        });

        // Add image without offset
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        resolve(pdf.output('blob'));
      } catch (error) {
        reject(error);
      }
    };
    
      img.onerror = () => reject(new Error('Failed to load image'));

    
    // Load image
   const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(imageFile);
  });
}

export async function convertPDFToImages(pdfFile: File): Promise<Blob[]> {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const imageBlobs: Blob[] = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      // Get original PDF dimensions (in points)
      const viewport = page.getViewport({ scale: 1 });
      const originalWidth = viewport.width;
      const originalHeight = viewport.height;

      // Calculate scale for 600 DPI (PDF uses 72 DPI as base)
      // 600 DPI / 72 DPI = 8.3333x scale
      const targetScale = 600 / 72;
      
      // Check browser canvas limitations
      const maxDimension = Math.max(originalWidth, originalHeight) * targetScale;
      const browserMaxSize = 32767; // Safe limit for most browsers
      
      if (maxDimension > browserMaxSize) {
        throw new Error(
          `Page ${pageNum} dimensions (${Math.round(maxDimension)}px) exceed browser limits. ` +
          `Try a smaller PDF or fewer pages.`
        );
      }

      // Create high-resolution viewport
      const highResViewport = page.getViewport({ scale: targetScale });
      
      // Create canvas with calculated dimensions
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Canvas context not available');
      }
      
      canvas.width = highResViewport.width;
      canvas.height = highResViewport.height;
      canvas.style.width = `${originalWidth}px`;
      canvas.style.height = `${originalHeight}px`;

      // Render settings for high quality
      const renderContext = {
        canvasContext: context,
        viewport: highResViewport,
        intent: 'print', // Higher quality rendering
      };
      
      await page.render(renderContext).promise;
      
      // Convert to PNG with highest quality
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('PNG conversion failed')),
          'image/png',
          1.0 // Maximum quality
        );
      });
      
      imageBlobs.push(blob);
    }
    
    return imageBlobs;
  } catch (error) {
    throw new Error(`PDF conversion failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}