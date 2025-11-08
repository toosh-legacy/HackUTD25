import praw
import pandas as pd
import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import getpass

# --- AUTH ---
client_id = getpass.getpass("Enter Reddit CLIENT_ID: ")
client_secret = getpass.getpass("Enter Reddit_CLIENT_SECRET: ")
user_agent = input("Enter Reddit_USER_AGENT: ")

reddit = praw.Reddit(
    client_id=client_id,
    client_secret=client_secret,
    user_agent=user_agent
)

subreddits = ["tmobile", "tmobileisp"]

# --- COLLECT POSTS ---
posts_data = []
for sub in subreddits:
    subreddit = reddit.subreddit(sub)
    for post in subreddit.new(limit=500):
        posts_data.append({
            "subreddit": sub,
            "type": "post",
            "id": post.id,
            "created_utc": datetime.datetime.fromtimestamp(post.created_utc),
            "text": post.title + " " + (post.selftext or ""),
            "score": post.score,
            "num_comments": post.num_comments,
        })

df_posts = pd.DataFrame(posts_data)

# --- COLLECT COMMENTS ---
comments_data = []
for sub in subreddits:
    subreddit = reddit.subreddit(sub)
    for comment in subreddit.comments(limit=1000):
        comments_data.append({
            "subreddit": sub,
            "type": "comment",
            "id": comment.id,
            "created_utc": datetime.datetime.fromtimestamp(comment.created_utc),
            "text": comment.body,
            "score": comment.score,
        })

df_comments = pd.DataFrame(comments_data)

# --- SENTIMENT ---
analyzer = SentimentIntensityAnalyzer()

def add_sentiment(df):
    scores = df["text"].astype(str).apply(analyzer.polarity_scores)
    df["neg"] = scores.apply(lambda x: x["neg"])
    df["neu"] = scores.apply(lambda x: x["neu"])
    df["pos"] = scores.apply(lambda x: x["pos"])
    df["compound"] = scores.apply(lambda x: x["compound"])
    return df

df_posts = add_sentiment(df_posts)
df_comments = add_sentiment(df_comments)

df_posts.to_csv("tmobile_posts_sentiment.csv", index=False)
df_comments.to_csv("tmobile_comments_sentiment.csv", index=False)

print("✔ Data saved to CSV")

# --- HAPPINESS INDEX CALC ---
# We weight posts higher (because they reflect more intentional effort to complain/praise)
df_posts["weight"] = 2.0
df_comments["weight"] = 1.0

combined = pd.concat([df_posts, df_comments], ignore_index=True)

weighted_score = (combined["compound"] * combined["weight"]).sum() / combined["weight"].sum()

happiness_index = (weighted_score + 1) * 5

print("\n📊 T-Mobile Happiness Index (0-10):", round(happiness_index, 2))