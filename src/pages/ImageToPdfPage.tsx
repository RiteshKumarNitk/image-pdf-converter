import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FileImage, AlertCircle, Download, X, Move, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  addImages, 
  removeImage, 
  reorderImages, 
  convertImagesToPdf, 
  reset 
} from '../store/slices/imageConverterSlice';

interface ImageToPdfPageProps {
  isMobile: boolean;
}

export const ImageToPdfPage: React.FC<ImageToPdfPageProps> = ({ isMobile }) => {
  const dispatch = useAppDispatch();
  const { images, isConverting, error, result, progress } = useAppSelector(state => state.imageConverter);

  const handleAddImages = (files: File[]) => {
    dispatch(addImages(files));
  };

  const handleRemoveImage = (id: string) => {
    dispatch(removeImage(id));
  };

  const handleReorderImages = (newImages: any[]) => {
    dispatch(reorderImages(newImages));
  };

  const handleConvertToPdf = () => {
    dispatch(convertImagesToPdf(images));
  };

  const handleReset = () => {
    dispatch(reset());
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp']
    },
    multiple: true,
    onDrop: handleAddImages
  });

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    handleReorderImages(newImages);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileImage className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Image to PDF Converter
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert multiple images into a single PDF document. Drag and drop images 
          to reorder them, then download your PDF.
        </p>
      </div>

      {/* Upload Area */}
      {images.length === 0 && (
        <div className="max-w-2xl mx-auto">
          <Card 
            {...getRootProps()} 
            className={`p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50 scale-105' 
                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <FileImage className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-700">
                  {isDragActive ? 'Drop images here...' : 'Upload Images'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drag & drop images or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports: JPG, PNG, GIF, WebP, BMP
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Images ({images.length})
            </h2>
            <div className="space-x-3">
              <Button
                variant="secondary"
                onClick={() => document.querySelector('input[type="file"]')?.click()}
                icon={<Plus className="w-4 h-4" />}
              >
                Add More
              </Button>
              <Button
                onClick={handleConvertToPdf}
                disabled={isConverting || images.length === 0}
                loading={isConverting}
              >
                Convert to PDF
              </Button>
            </div>
          </div>

          {/* Hidden file input for adding more images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              handleAddImages(files);
              e.target.value = '';
            }}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <Card key={image.id} className="p-4">
                <div className="relative">
                  <img
                    src={image.preview}
                    alt={image.file.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {image.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(image.file.size / 1024)} KB
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => moveImage(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    icon={<Move className="w-3 h-3" />}
                  >
                    Up
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                    disabled={index === images.length - 1}
                    icon={<Move className="w-3 h-3" />}
                  >
                    Down
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Progress */}
      {isConverting && progress && (
        <Card className="max-w-2xl mx-auto p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Converting to PDF...
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Processing image {progress.current} of {progress.total}
            </p>
          </div>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Download className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            PDF Created Successfully!
          </h3>
          <p className="text-gray-600 mb-6">
            Your PDF is ready for download
          </p>
          <div className="space-y-3">
            <Button onClick={handleDownload} size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Convert Another
            </Button>
          </div>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="max-w-2xl mx-auto p-4 border-red-200 bg-red-50">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Conversion Failed</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Mobile Warning */}
      {isMobile && (
        <Card className="max-w-2xl mx-auto p-4 border-blue-200 bg-blue-50">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700 text-sm">
              For best results with large files, use a desktop browser
            </p>
          </div>
        </Card>
      )}

      {/* Features */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Features
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <FileImage className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-800 mb-2">Multiple Formats</h4>
            <p className="text-sm text-gray-600">
              Support for JPG, PNG, GIF, WebP, and BMP images
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Move className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-800 mb-2">Reorder Pages</h4>
            <p className="text-sm text-gray-600">
              Drag and drop to arrange your images in any order
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Download className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-800 mb-2">High Quality</h4>
            <p className="text-sm text-gray-600">
              Preserves original image quality in the PDF output
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
