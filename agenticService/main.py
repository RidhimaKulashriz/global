from fastapi import FastAPI
from agents.graph import app
fastapi_app = FastAPI()

@fastapi_app.get("/")
def chek():
    res= app.invoke({"user_url": "HELLO"})
    return {"response" : res}

