'use client';

import { useState } from 'react';

// Test d'affichage d'images
export default function TestImages() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const product = {
    name: 'Plaid à Manches Test',
    images: [
      '/My-project-1-57.webp',
      'https://m.media-amazon.com/images/I/81WCvlPi2TL.jpg'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-8">Test Images</h1>
      
      {/* Image principale */}
      <div className="relative aspect-square w-96 bg-white rounded-xl overflow-hidden mb-4">
        <img
          src={product.images[selectedImageIndex].startsWith('http') ? product.images[selectedImageIndex] : product.images[selectedImageIndex].startsWith('/') ? product.images[selectedImageIndex] : `/${product.images[selectedImageIndex]}`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="flex space-x-2">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className="relative aspect-square w-20 rounded-lg overflow-hidden border-2 border-gray-200"
          >
            <img
              src={image.startsWith('http') ? image : image.startsWith('/') ? image : `/${image}`}
              alt={`${product.name} - Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
      {/* Debug info */}
      <div className="mt-8 p-4 bg-white rounded-lg">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <p>Image sélectionnée: {product.images[selectedImageIndex]}</p>
        <p>Traitée comme: {product.images[selectedImageIndex].startsWith('http') ? 'URL externe' : 'Image locale'}</p>
        <p>URL finale: {product.images[selectedImageIndex].startsWith('http') ? product.images[selectedImageIndex] : product.images[selectedImageIndex].startsWith('/') ? product.images[selectedImageIndex] : `/${product.images[selectedImageIndex]}`}</p>
      </div>
    </div>
  );
}
