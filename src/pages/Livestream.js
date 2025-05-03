// (Use the exact Livestream component code you provided)
// Added Facebook Live integration:

const [fbLiveUrl, setFbLiveUrl] = useState('');

const startFBLive = async () => {
  try {
    const response = await FB.api(
      '/me/live_videos',
      'POST',
      { status: 'LIVE_NOW' },
      { access_token: FB_ACCESS_TOKEN }
    );
    setFbLiveUrl(response.embed_html);
  } catch (error) {
    console.error('FB Live Error:', error);
  }
};
