const https = require('https');

const urls = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1473966968600-fa804b8696bc?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1583243265507-7427838501df?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1624222247344-550fb8ecf7c4?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000"
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${res.statusCode} - ${url}`);
  }).on('error', (e) => {
    console.error(e);
  });
});
