import { useEffect, useState } from 'react';
import axios from 'axios';


function FirstPage() {
  const [images, setImages] = useState([]);

  // Fetch images from the backend when the component mounts
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get('/');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    fetchImages();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
<div style={{ backgroundColor: 'green', margin: 0, padding: 0, boxSizing: 'border-box', overflown: 'visible'}}>
   

      {/* Render sections with background images */}
      {images.map((base64String, index) => (
        <div
          key={index}
          className="image-section"
          style={{ backgroundImage: `url(data:image/jpeg;base64,${base64String})`}}>
        </div>
      ))}
    </div>
  );
}

export default FirstPage;

