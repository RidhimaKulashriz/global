from langgraph.graph import StateGraph, END
from .agent_node import generate_ans
from .news_node import news_node
from .weather_node import weather_node
from .state import State
def dummy_ent(state:State):
    return {"__next__": ["news", "weather"]}
def merge_node(state: State):
    return {"merged_context": f"{state.news}\n{state.weather}"}
graph = StateGraph(State)
graph.add_node("controller", dummy_ent)
graph.add_node("news", news_node)       
graph.add_node("weather", weather_node) 
graph.add_node("merge", merge_node)
graph.add_node("agent", generate_ans)

graph.set_entry_point("controller")

graph.add_edge("news", "merge")
graph.add_edge("weather", "merge")
graph.add_edge("merge", "agent")
graph.add_edge("agent", END)

app = graph.compile()


