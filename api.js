const express = require('express')
const app = express()
const port = 3000

require('dotenv').config();


app.get('/', (req, res) => {
    res.send('Welcome to unsplash source - go to <code>.../1600x900?keyword=magic</code>')
})

app.get('/:size', async (req, res) => {
    const { size } = req.params;
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).send('Keyword is required');
    }

    const unsplashURL = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keyword)}&w=${size.split('x')[0]}&h=${size.split('x')[1]}&client_id=${process.env.CLIENT_KEY}`;

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
        }
    } catch (error) {
        res.status(500).send('Error fetching image');
    }
});


app.listen(port, () => {
    console.log(`Unsplash image app listening on port ${port}`)
});
