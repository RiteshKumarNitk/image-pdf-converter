import React from 'react';
import { FileImage, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ImageToolsProps {
  isMobile: boolean;
}

export const ImageTools: React.FC<ImageToolsProps> = ({ isMobile }) => {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileImage className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon: Advanced Image Tools</h2>
          <p className="text-gray-600 mb-6">
            We're working on professional image conversion and optimization tools.
            Check back soon for features like batch processing, format conversion,
            and resolution enhancement.
          </p>
          <Button className="mx-auto">
            Notify Me When Available
          </Button>
        </Card>

        {isMobile && (
          <div className="mt-4">
            <Card className="p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-blue-700">
                For best results with large files, use a desktop browser
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};