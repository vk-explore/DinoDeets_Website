import https from 'https';

https.get('https://www.youtube.com/@dinodeets', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<meta property="og:url" content="https:\/\/www\.youtube\.com\/channel\/(UC[^"]+)">/);
    if (match) {
      console.log('Channel ID:', match[1]);
    } else {
      console.log('Not found in og:url. Trying another regex...');
      const match2 = data.match(/"channelId":"(UC[^"]+)"/);
      if (match2) {
        console.log('Channel ID:', match2[1]);
      } else {
        console.log('Completely failed to find channel ID. Output length:', data.length);
      }
    }
  });
}).on('error', err => {
  console.log('Error: ' + err.message);
});
