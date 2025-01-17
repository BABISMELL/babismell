import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);

      // In a real app, you would upload to a server here
      // For now, we'll just use the object URL
      console.log('File selected:', file.name);

    } catch (error) {
      console.error('Error handling file:', error);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
        }`}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="mx-auto h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {isDragActive
                ? 'Déposez l\'image ici'
                : 'Glissez une image ou cliquez pour sélectionner'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG ou WEBP jusqu'à 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}