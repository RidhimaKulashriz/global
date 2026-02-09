from .state import State
import requests
from dotenv import load_dotenv
import os
load_dotenv()
def news_node(state:State):
    NEWS_URL= os.getenv("NEWS_URL")
    print("NEWS CALLED")
    city = state.location
    resp = requests.get(f"{NEWS_URL}?q=flood+{city}+now")
    if resp.status_code==200:
        return {"news" : resp.json()}
