from langgraph.graph import StateGraph, END
from .agent_node import generate_ans
from .news_node import news_node
from .weather_node import weather_node
from .state import State
def dummy_ent(state:State):
    return {"__next__": ["news", "weather"]}

graph = StateGraph(State)
graph.add_node("weather", weather_node)
graph.add_node("news", news_node)
graph.add_node("agent", generate_ans)
graph.add_node("sta", dummy_ent)
graph.set_entry_point("sta")
graph.add_edge("news", "agent")
graph.add_edge("weather", "agent")
graph.add_edge("agent", END)
app=graph.compile()

