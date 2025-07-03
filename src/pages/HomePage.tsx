import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileImage, 
  FileText, 
  ArrowRight, 
  Merge, 
  Scissors,
  Archive,
  Upload,
  Download,
  Shield
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  const tools = [
    {
      title: 'Image to PDF',
      description: 'Convert multiple images into a single PDF document',
      icon: <FileImage className="w-8 h-8" />,
      link: '/image-to-pdf',
      color: 'blue'
    },
    {
      title: 'PDF to Image',
      description: 'Extract pages from PDF as high-quality images',
      icon: <FileText className="w-8 h-8" />,
      link: '/pdf-to-image',
      color: 'emerald'
    },
    {
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      icon: <Merge className="w-8 h-8" />,
      link: '/merge-pdf',
      color: 'purple'
    },
    {
      title: 'Split PDF',
      description: 'Split a PDF into separate pages or ranges',
      icon: <Scissors className="w-8 h-8" />,
      link: '/pdf-splitter',
      color: 'orange'
    },
    {
      title: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      icon: <Archive className="w-8 h-8" />,
      link: '/pdf-compressor',
      color: 'red'
    },
    {
      title: 'Compress Images',
      description: 'Optimize image file sizes for web and storage',
      icon: <FileImage className="w-8 h-8" />,
      link: '/image-compressor',
      color: 'indigo'
    }
  ];

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Easy Upload',
      description: 'Drag & drop or click to upload your files'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Processing',
      description: 'All processing happens in your browser'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Instant Download',
      description: 'Download your converted files immediately'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Professional File Converter
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Convert, merge, split, and compress files with ease. All processing happens 
          locally in your browser for maximum privacy and speed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/image-to-pdf">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Learn More
          </Button>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Available Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link key={index} to={tool.link} className="group">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className={`w-16 h-16 bg-${tool.color}-100 rounded-full flex items-center justify-center mb-4 mx-auto text-${tool.color}-600`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                  <span className="text-sm font-medium">Try it now</span>
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose FileTools Pro?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <Card className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Trusted by thousands of users worldwide
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold mb-1">10K+</div>
            <div className="text-blue-100">Files Converted</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">6</div>
            <div className="text-blue-100">Tools Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">100%</div>
            <div className="text-blue-100">Browser-based</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-blue-100">Data Stored</div>
          </div>
        </div>
      </div>
    </div>
  );
};
