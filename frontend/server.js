const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Serve static files from the frontend directory
app.use(express.static(__dirname));

// Route for the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('🏦 KODBANK FRONTEND SERVER RUNNING');
  console.log('========================================');
  console.log('');
  console.log('✅ Frontend: http://localhost:8080');
  console.log('✅ Backend:  http://localhost:3000');
  console.log('');
  console.log('📱 Open in your browser:');
  console.log('   http://localhost:8080');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('========================================');
});
