import { FC } from 'react';
import { ImageOff } from 'lucide-react';

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  iconSize?: number;
  text?: string;
  fill?: boolean;
}

const ImagePlaceholder: FC<ImagePlaceholderProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  iconSize = 24,
  text = 'Image non disponible',
  fill = false,
}) => {
  const containerClasses = [
    'bg-gray-100',
    'flex flex-col items-center justify-center',
    'text-gray-400',
    className,
  ].filter(Boolean).join(' ');

  const style = {
    ...(!fill && { width, height }),
  };

  return (
    <div 
      className={containerClasses}
      style={style}
    >
      <ImageOff size={iconSize} className="mb-2" />
      <span className="text-sm text-center px-2">{text}</span>
    </div>
  );
};

export default ImagePlaceholder;
