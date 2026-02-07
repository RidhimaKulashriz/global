from .state import State
def weather_node(state: State):
    print("WEATHER CALLED")
    return {"weather": "WEATHER NODE"}

