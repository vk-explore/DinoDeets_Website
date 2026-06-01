const https = require('https');

https.get('https://www.youtube.com/@dinodeets', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/"channelId":"(UC[^"]+)"/);
    if (match) {
      console.log('Channel ID:', match[1]);
    } else {
      console.log('Not found');
    }
  });
}).on('error', err => {
  console.log('Error: ' + err.message);
});
