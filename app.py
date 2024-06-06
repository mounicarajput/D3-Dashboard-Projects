from flask import Flask, jsonify
from pymongo import MongoClient
from bson.json_util import dumps

# Initialize the Flask application
app = Flask(__name__)

# Set up the MongoDB client
client = MongoClient("mongodb://localhost:27017/")
db = client["dashboard_db"]
collection = db["sector_insights"]

@app.route('/', methods=['GET'])
def home():
    return "<h1>Welcome to the Data Visualization Dashboard</h1>"

@app.route('/api/data', methods=['GET'])
def get_data():
    # Fetch data from MongoDB
    data = list(collection.find())
    # Convert MongoDB data to JSON
    json_data = dumps(data)
    return json_data, 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(debug=True)

