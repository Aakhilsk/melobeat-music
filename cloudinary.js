const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'dg3tzymwn', 
  api_key: '694737997368187', 
  api_secret: 'otHhcSkHyAkTzMIYiXwaQc8az0Y' 
});

// cloudinary.config({ 
//   cloud_name: 'dg3tzymwn', 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET, 
// });

module.exports = {cloudinary};