import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Image to PDF', path: '/image-to-pdf' },
    { label: 'PDF to Image', path: '/pdf-to-image' },
    { label: 'Merge PDFs', path: '/merge-pdf' },
    { label: 'Split PDF', path: '/pdf-splitter' },
    { label: 'Compress PDF', path: '/pdf-compressor' },
    { label: 'Compress Images', path: '/image-compressor' },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Menu</h3>
          <Button variant="secondary" icon={<X />} onClick={onClose} />
        </div>
        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={onClose}>
              <Button
                variant="secondary"
                className="w-full text-left justify-start"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
