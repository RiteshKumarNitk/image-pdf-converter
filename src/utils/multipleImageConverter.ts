import jsPDF from 'jspdf';

export async function convertMultipleImagesToPDF(
  imageFiles: File[],
  onProgress?: (current: number) => void
): Promise<Blob> {
  if (imageFiles.length === 0) {
    throw new Error('No images provided');
  }

  let pdf: jsPDF | null = null;
  let processedCount = 0;

  try {
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      
      // Convert file to image data
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error(`Failed to read image: ${file.name}`));
        reader.readAsDataURL(file);
      });

      // Load image to get dimensions
      const { imgData, width, height } = await new Promise<{imgData: string, width: number, height: number}>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          resolve({
            imgData,
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
        img.src = imageData;
      });

      // Calculate dimensions in mm
      const widthMM = width * 0.264583;
      const heightMM = height * 0.264583;
      const isLandscape = width > height;

      // Create PDF on first image or add page for subsequent images
      if (i === 0) {
        pdf = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [widthMM, heightMM]
        });
      } else {
        pdf!.addPage([widthMM, heightMM], isLandscape ? 'landscape' : 'portrait');
      }

      // Add image to PDF
      pdf!.addImage(imgData, 'JPEG', 0, 0, widthMM, heightMM);
      
      processedCount++;
      if (onProgress) {
        onProgress(processedCount);
      }
    }

    if (!pdf) {
      throw new Error('Failed to create PDF');
    }

    // Convert to blob
    return pdf.output('blob');
  } catch (error) {
    throw new Error(`PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
