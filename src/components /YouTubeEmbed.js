export default function YouTubeEmbed({ videoId }) {
  return (
    <div className="video-container">
      <iframe 
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope"
        allowFullScreen
      />
      <div className="chat-widget">
        <iframe
          src="https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}"
        />
      </div>
    </div>
  );
}
