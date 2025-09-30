import mysql.connector
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
import sys

nltk.download('vader_lexicon', quiet=True)

def analyze_specific_comment(comment_id):
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="student_residence"
        )
        cursor = db.cursor()

        cursor.execute("SELECT comment FROM comments WHERE id = %s", (comment_id,))
        result = cursor.fetchone()

        if result:
            text = result[0]
            if text:
                sia = SentimentIntensityAnalyzer()
                sentiment = sia.polarity_scores(text)
                compound_score = sentiment['compound']

                # Update score in DB
                cursor.execute("UPDATE comments SET sentiment_score = %s WHERE id = %s", (compound_score, comment_id))
                db.commit()
                print(f"Updated sentiment for comment ID {comment_id}")
            else:
                print("Empty comment")
        else:
            print("Comment not found")

    except Exception as e:
        print(f"Error: {str(e)}")

    finally:
        if 'db' in locals() and db.is_connected():
            cursor.close()
            db.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        comment_id = int(sys.argv[1])
        analyze_specific_comment(comment_id)
    else:
        print("Comment ID not provided")


#cd C:/xampp/htdocs/project/python
#python calculate_sentiment.py 6
