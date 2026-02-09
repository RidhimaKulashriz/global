from .state import State
import requests
from dotenv import load_dotenv
load_dotenv()
def weather_node(state: State):
    BASE_URL = os.getenv("BASE_URL")
    print("WEATHER CALLED")
    city = state.location
    resp = requests.get(f"{BASE_URL}?city={city}")
    if resp.status_code==200:
        return {"weather": resp.json()} 

