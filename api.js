const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

require('dotenv').config();

const getFallbackImage = (w = 800, h = 600) => {
  const imageUrls = [
    'https://images.unsplash.com/photo-1578589591337-864142c03335',
    'https://images.unsplash.com/photo-1452621946466-c0f2ff2ff100',
    'https://images.unsplash.com/photo-1464278533981-50106e6176b1'
  ];
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return `${imageUrls[randomIndex]}?w=${w}&h=${h}&fit=crop`;
};

const parseSize = (size) => {
  if (!size) return [null, null];
  const [width, height] = size.split('x').map(dim => parseInt(dim, 10));
  return [width || null, height || null];
};

const formatImageUrl = (baseUrl, width, height) => {
  if (!width || !height) return baseUrl;
  return `${baseUrl}&w=${width}&h=${height}&fit=crop`;
};

const handleApiError = (error, width, height) => {
  console.error('API Error:', error);
  return getFallbackImage(width || 800, height || 600);
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'page.html'));
});

app.get('/random/:size?', async (req, res) => {
  const [width, height] = parseSize(req.params.size);
  const randomImage = getFallbackImage(width, height);
  res.redirect(randomImage);
});

app.get('/id/:photoId/:size?', async (req, res) => {
  const { photoId } = req.params;
  const [width, height] = parseSize(req.params.size);
  
  if (!photoId) {
    return res.status(400).send('Photo ID is required');
  }
  
  const photoURL = `https://api.unsplash.com/photos/${photoId}?client_id=${process.env.CLIENT_KEY}`;
  
  try {
    const response = await fetch(photoURL);
    const photo = await response.json();
    
    if (photo && photo.urls) {
      const imageUrl = formatImageUrl(photo.urls.raw, width, height);
      res.redirect(imageUrl);
    } else {
      if (photo.errors) {
        return res.status(404).send(`Photo not found: ${photo.errors[0]}`);
      }
      res.redirect(getFallbackImage(width, height));
    }
  } catch (error) {
    res.redirect(handleApiError(error, width, height));
  }
});

app.get('/user/:username/:size?', async (req, res) => {
  const { username } = req.params;
  const [width, height] = parseSize(req.params.size);
  
  if (!username) {
    return res.status(400).send('Username is required');
  }
  
  const userPhotosURL = `https://api.unsplash.com/users/${encodeURIComponent(username)}/photos?per_page=30&client_id=${process.env.CLIENT_KEY}`;
  
  try {
    const response = await fetch(userPhotosURL);
    const photos = await response.json();
    
    if (photos && Array.isArray(photos) && photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * photos.length);
      const selectedPhoto = photos[randomIndex];
      const imageUrl = formatImageUrl(selectedPhoto.urls.raw, width, height);
      res.redirect(imageUrl);
    } else {
      res.redirect(getFallbackImage(width, height));
    }
  } catch (error) {
    res.redirect(handleApiError(error, width, height));
  }
});

app.get('/collection/:collectionId/:size?', async (req, res) => {
  const { collectionId } = req.params;
  const [width, height] = parseSize(req.params.size);
  
  if (!collectionId) {
    return res.status(400).send('Collection ID is required');
  }
  
  const collectionPhotosURL = `https://api.unsplash.com/collections/${encodeURIComponent(collectionId)}/photos?per_page=30&client_id=${process.env.CLIENT_KEY}`;
  
  try {
    const response = await fetch(collectionPhotosURL);
    const photos = await response.json();
    
    if (photos && Array.isArray(photos) && photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * photos.length);
      const selectedPhoto = photos[randomIndex];
      const imageUrl = formatImageUrl(selectedPhoto.urls.raw, width, height);
      res.redirect(imageUrl);
    } else {
      if (photos.errors) {
        return res.status(404).send(`Collection not found: ${photos.errors[0]}`);
      }
      res.redirect(getFallbackImage(width, height));
    }
  } catch (error) {
    res.redirect(handleApiError(error, width, height));
  }
});

app.get('/:size?', async (req, res) => {
  const [width, height] = parseSize(req.params.size);
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).send('Keyword is required');
  }

  const queryParams = new URLSearchParams({
    query: keyword,
    client_id: process.env.CLIENT_KEY
  });
  
  // Only add width and height if they exist
  if (width) queryParams.append('w', width);
  if (height) queryParams.append('h', height);
  
  const unsplashURL = `https://api.unsplash.com/photos/random?${queryParams}`;

  try {
    const response = await fetch(unsplashURL);
    const data = await response.json();
    
    if (data && data.urls) {
      const imageUrl = formatImageUrl(data.urls.raw, width, height);
      res.redirect(imageUrl);
    } else {
      res.redirect(getFallbackImage(width, height));
    }
  } catch (error) {
    res.redirect(handleApiError(error, width, height));
  }
});

app.listen(port, () => {
  console.log(`Unsplash image app listening on port ${port}`);
});
