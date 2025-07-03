import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Menu, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { MobileMenu } from './MobileMenu';

interface NavbarProps {
  activeTool: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTool }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [pdfDropdownOpen, setPdfDropdownOpen] = React.useState(false);
  const [imageDropdownOpen, setImageDropdownOpen] = React.useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">FileTools Pro</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <Link to="/">
                  <Button
                    variant={location.pathname === '/' ? 'primary' : 'secondary'}
                  >
                    Home
                  </Button>
                </Link>
                
                {/* PDF Tools Dropdown */}
                <div className="relative">
                  <Button
                    variant={activeTool === 'pdf' ? 'primary' : 'secondary'}
                    onClick={() => setPdfDropdownOpen(!pdfDropdownOpen)}
                    icon={<ChevronDown className="w-4 h-4 ml-1" />}
                  >
                    PDF Tools
                  </Button>
                  {pdfDropdownOpen && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <Link to="/pdf-to-image" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setPdfDropdownOpen(false)}>
                        PDF to Image
                      </Link>
                      <Link to="/merge-pdf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setPdfDropdownOpen(false)}>
                        Merge PDFs
                      </Link>
                      <Link to="/pdf-splitter" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setPdfDropdownOpen(false)}>
                        Split PDF
                      </Link>
                      <Link to="/pdf-compressor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setPdfDropdownOpen(false)}>
                        Compress PDF
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Image Tools Dropdown */}
                <div className="relative">
                  <Button
                    variant={activeTool === 'image' ? 'primary' : 'secondary'}
                    onClick={() => setImageDropdownOpen(!imageDropdownOpen)}
                    icon={<ChevronDown className="w-4 h-4 ml-1" />}
                  >
                    Image Tools
                  </Button>
                  {imageDropdownOpen && (
                    <div className="absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <Link to="/image-to-pdf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setImageDropdownOpen(false)}>
                        Image to PDF
                      </Link>
                      <Link to="/image-compressor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setImageDropdownOpen(false)}>
                        Compress Images
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <Button
              variant="secondary"
              icon={<Menu className="w-5 h-5" />}
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
};
