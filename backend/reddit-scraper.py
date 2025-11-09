# Reddit Scraper for T-Mobile Sentiment
# This script scrapes r/tmobile and r/tmobileisp for sentiment analysis

import praw
import pandas as pd
import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import time
import json
import os

# --- AUTH ---
# Replace these with your actual credentials
CLIENT_ID = "kBtGTlCdmP5Jb-9K0KObcQ"
CLIENT_SECRET = "fVCWX81n1ItMDdOPIJ6eQupLEQfIjQ"
USER_AGENT = "t-scrap data scraper v1.0 (by /u/Safe_Pineapple8112)"

reddit = praw.Reddit(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    user_agent=USER_AGENT
)

subreddits = ["tmobile", "tmobileisp"]
analyzer = SentimentIntensityAnalyzer()


def add_sentiment(df):
    """Add sentiment scores to dataframe"""
    scores = df["text"].astype(str).apply(analyzer.polarity_scores)
    df["neg"] = scores.apply(lambda x: x["neg"])
    df["neu"] = scores.apply(lambda x: x["neu"])
    df["pos"] = scores.apply(lambda x: x["pos"])
    df["compound"] = scores.apply(lambda x: x["compound"])
    return df


def run_scrape_cycle():
    """Scrape Reddit and calculate happiness index"""
    print("\n⏱ Running update at:", datetime.datetime.now())

    posts_data = []
    comments_data = []

    # --- COLLECT POSTS ---
    for sub in subreddits:
        try:
            for post in reddit.subreddit(sub).new(limit=500):
                posts_data.append({
                    "subreddit": sub,
                    "id": post.id,
                    "title": post.title,
                    "text": post.selftext or "",
                    "created_utc": datetime.datetime.fromtimestamp(post.created_utc).isoformat(),
                    "score": post.score,
                    "full_text": post.title + " " + (post.selftext or "")
                })
        except Exception as e:
            print(f"❌ Error scraping posts from r/{sub}:", e)

    # --- COLLECT COMMENTS ---
    for sub in subreddits:
        try:
            for comment in reddit.subreddit(sub).comments(limit=1000):
                comments_data.append({
                    "text": comment.body
                })
        except Exception as e:
            print(f"❌ Error scraping comments from r/{sub}:", e)

    if not posts_data and not comments_data:
        print("⚠️ No data collected, skipping this cycle")
        return

    # Create DataFrames
    df_posts_full = pd.DataFrame(posts_data)
    df_posts = pd.DataFrame([{"text": p["full_text"]} for p in posts_data])
    df_comments = add_sentiment(pd.DataFrame(comments_data))

    # Add sentiment to posts
    df_posts = add_sentiment(df_posts)

    # --- HAPPINESS INDEX ---
    df_posts["weight"] = 2.0  # Posts weighted more heavily
    df_comments["weight"] = 1.0

    combined = pd.concat([df_posts, df_comments], ignore_index=True)

    weighted_score = (combined["compound"] * combined["weight"]).sum() / combined["weight"].sum()
    
    # Convert to 0-100 scale
    happiness_index = (weighted_score + 1) * 50

    # Prepare posts for frontend (most recent 15)
    posts_for_frontend = []
    for i, post_data in enumerate(posts_data[:15]):
        posts_for_frontend.append({
            "id": post_data["id"],
            "subreddit": post_data["subreddit"],
            "title": post_data["title"],
            "content": post_data["text"],
            "created_at": post_data["created_utc"],
            "score": post_data["score"]
        })

    # Save to backend directory
    json_path = os.path.join(os.path.dirname(__file__), "happiness.json")
    posts_json_path = os.path.join(os.path.dirname(__file__), "reddit-posts.json")
    
    with open(json_path, "w") as f:
        json.dump({
            "happiness": round(happiness_index, 2),
            "timestamp": datetime.datetime.now().isoformat(),
            "posts_analyzed": len(posts_data),
            "comments_analyzed": len(comments_data)
        }, f, indent=2)

    with open(posts_json_path, "w") as f:
        json.dump({
            "posts": posts_for_frontend,
            "timestamp": datetime.datetime.now().isoformat()
        }, f, indent=2)

    print(f"✅ Reddit Happiness Index: {round(happiness_index, 2)}%")
    print(f"📊 Analyzed {len(posts_data)} posts and {len(comments_data)} comments")
    print(f"📁 Saved to: {json_path}")
    print(f"📁 Saved posts to: {posts_json_path}")


if __name__ == "__main__":
    print("🚀 Starting Reddit T-Mobile Sentiment Scraper")
    print("📍 Monitoring: r/tmobile, r/tmobileisp")
    print("⏰ Update interval: 30 minutes")
    
    while True:
        try:
            run_scrape_cycle()
        except Exception as e:
            print(f"❌ Error in scrape cycle: {e}")
        
        print("\n💤 Sleeping for 30 minutes...")
        time.sleep(1800)  # 30 minutes
