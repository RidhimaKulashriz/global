from .state import State
import requests
def weather_node(state: State):
    print("WEATHER CALLED")
    city = state.location
    resp = requests.get(f"https://still-block-2193.govindsys1008.workers.dev?city={city}")
    if resp.status_code==200:
        return {"weather": resp.json()} 

