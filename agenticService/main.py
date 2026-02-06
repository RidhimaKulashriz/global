from fastapi import FastAPI
from agents.agent_node import generate_ans
app = FastAPI()
@app.get("/")
def chek():
    return {"response" : generate_ans()}

