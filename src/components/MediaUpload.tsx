import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MediaUploadProps {
  value: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  onChange: (url: string, type: 'image' | 'video', thumbnailUrl?: string) => void;
  onTypeChange: (type: 'image' | 'video') => void;
}

export function MediaUpload({ 
  value, 
  mediaType, 
  thumbnailUrl,
  onChange, 
  onTypeChange 
}: MediaUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsLoading(true);
      const file = acceptedFiles[0];
      if (!file) return;

      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      
      // If it's a video, generate a thumbnail
      let thumbnail;
      if (mediaType === 'video') {
        const video = document.createElement('video');
        video.src = objectUrl;
        await new Promise((resolve) => {
          video.onloadeddata = () => {
            video.currentTime = 1; // Get frame at 1 second
            video.onseeked = () => {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(video, 0, 0);
              thumbnail = canvas.toDataURL('image/jpeg');
              resolve(null);
            };
          };
        });
      }

      onChange(objectUrl, mediaType, thumbnail);
    } catch (error) {
      console.error('Error handling file:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onChange, mediaType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': mediaType === 'image' ? ['.jpeg', '.jpg', '.png', '.webp'] : [],
      'video/*': mediaType === 'video' ? ['.mp4', '.webm'] : []
    },
    maxSize: mediaType === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024, // 5MB for images, 50MB for videos
    multiple: false
  });

  return (
    <div className="space-y-4">
      <RadioGroup
        value={mediaType}
        onValueChange={(value) => onTypeChange(value as 'image' | 'video')}
        className="flex space-x-4 mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="image" id="image" />
          <Label htmlFor="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Image
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="video" id="video" />
          <Label htmlFor="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vidéo
          </Label>
        </div>
      </RadioGroup>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
        }`}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative">
            {mediaType === 'image' ? (
              <img
                src={value}
                alt="Preview"
                className="mx-auto h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="relative">
                <video
                  src={value}
                  className="mx-auto h-48 object-cover rounded-lg"
                  controls
                />
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="Video thumbnail"
                    className="absolute inset-0 mx-auto h-48 object-cover rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                onChange('', mediaType);
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
                ? `Déposez votre ${mediaType === 'image' ? 'image' : 'vidéo'} ici`
                : `Glissez ou cliquez pour sélectionner ${mediaType === 'image' ? 'une image' : 'une vidéo'}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {mediaType === 'image' 
                ? 'PNG, JPG ou WEBP jusqu\'à 5MB'
                : 'MP4 ou WEBM jusqu\'à 50MB'}
            </p>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="text-center text-sm text-gray-500">
          Chargement en cours...
        </div>
      )}
    </div>
  );
}