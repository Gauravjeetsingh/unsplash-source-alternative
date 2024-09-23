const express = require('express')
const app = express()
const port = 3000

require('dotenv').config();

const getFallbackImage = (w, h) => {
    const imageUrls = [
        'https://images.unsplash.com/photo-1578589591337-864142c03335',
        'https://images.unsplash.com/photo-1452621946466-c0f2ff2ff100',
        'https://images.unsplash.com/photo-1464278533981-50106e6176b1'
    ];
    const randomIndex = Math.floor(Math.random()*imageUrls.length);
    return `${imageUrls[randomIndex]}?w=${w}&h=${h}&fit=crop`;
}


app.get('/', (req, res) => {
    res.send('Welcome to unsplash source - go to <code>.../1600x900?keyword=magic</code>')
})

app.get('/random/:size', async (req, res) => {
    const { size } = req.params;
   const [width, height] = size.split('x');
   if (!size) {
    return res.status(400).send('Size is required');
   }
   const randomImage = getFallbackImage(width, height);
   res.redirect(randomImage);
})

app.get('/:size', async (req, res) => {
    const { size } = req.params;
    const { keyword } = req.query;

    const [width, height] = size.split('x');

    if (!keyword) {
        return res.status(400).send('Keyword is required');
    }

    const unsplashURL = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keyword)}&w=${width}&h=${height}&client_id=${process.env.CLIENT_KEY}`;

    try {
        const response = await fetch(unsplashURL);
        const data = await response.json();
        if (data) {
            const width = size.split('x')[0];
            const height = size.split('x')[1];
            // Manipulate the raw URL to include the desired width and height
            const imageUrl = `${data.urls.raw}&w=${width}&h=${height}&fit=crop`;
            // Redirecting to the manipulated image URL
            res.redirect(imageUrl);
        } else {
            const randomImage = getFallbackImage(width, height);
            res.redirect(randomImage);
        }
    } catch (error) {
        const randomImage = getFallbackImage(width, height);
        res.redirect(randomImage);
    }
});


app.listen(port, () => {
    console.log(`Unsplash image app listening on port ${port}`)
});
