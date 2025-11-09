import { useEffect, useState } from 'react';
import HappinessGauge from '../components/HappinessGauge';
import '../css/Home.css';

export default function Home() {
  const [overallHappiness, setOverallHappiness] = useState(50);
  const [loading, setLoading] = useState(true);
  const [redditPosts, setRedditPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const fetchOverallHappiness = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/feedback/average');
        const data = await response.json();
        if (data.data?.average !== undefined) {
          setOverallHappiness(data.data.average);
        }
      } catch (error) {
        console.error('Error fetching overall happiness:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverallHappiness();
    
    // Refresh every 30 seconds to keep it updated
    const interval = setInterval(fetchOverallHappiness, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRedditPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/reddit-posts');
        const data = await response.json();
        if (data.posts) {
          setRedditPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching Reddit posts:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchRedditPosts();
    
    // Refresh every 30 minutes (1800000ms)
    const interval = setInterval(fetchRedditPosts, 1800000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">T-Mobile Customer Sentiment Analysis</h1>
        <div className="home-layout">
          {/* Left side - Reddit Posts */}
          <div className="reddit-posts-section">
            <h2 className="section-title">Recent Reddit Posts</h2>
            {postsLoading ? (
              <div className="posts-loading">Loading posts...</div>
            ) : (
              <div className="posts-container">
                {redditPosts.length === 0 ? (
                  <div className="no-posts">No posts available</div>
                ) : (
                  redditPosts.map((post) => (
                    <div key={post.id} className="reddit-post">
                      <div className="post-header">
                        <span className="post-subreddit">r/{post.subreddit}</span>
                        <span className="post-date">{formatDate(post.created_at)}</span>
                      </div>
                      <h3 className="post-title">{post.title}</h3>
                      {post.content && (
                        <p className="post-content">{post.content}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right side - Happiness Gauges */}
          <div className="gauges-section">
            <div className="gauges-wrapper">
              <HappinessGauge 
                value={loading ? 50 : overallHappiness}
                label="Overall User Happiness" 
                isReadOnly={true}
              />
              <HappinessGauge 
                label="Your Happiness"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}