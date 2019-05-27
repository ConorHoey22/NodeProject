const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API Running')); // Test API

const PORT = process.env.PORT || 5000; // Environment variable or port 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
