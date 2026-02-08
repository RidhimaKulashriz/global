from fastapi import FastAPI
from agents.graph import app
from datetime import timedelta
from google.cloud import storage
import uuid
from pydantic import BaseModel
fastapi_app = FastAPI()
client = storage.Client.from_service_account_json("service-account.json")
# we will change it before deploying...abhi ke lie for testing and local dev, isse rehne do
bucket = client.bucket("gem3-bucket")

class FileSchema(BaseModel):
    file_name:str

@fastapi_app.put("/get-url")
def upload_url(payload:FileSchema):
    file_id= str(uuid.uuid4())
    obj= f"uploads/{file_id}-{payload.file_name}"
    blob = bucket.blob(obj)
    signed_url = blob.generate_signed_url(version="v4", expiration=timedelta(minutes=60),method="PUT",content_type="image/jpeg")
    return {"upload_url":signed_url, "obj": obj}
   

class InputSchema(BaseModel):
    obj:str
    location:str
    caption:str
@fastapi_app.post("/result")
def chek(payload:InputSchema):
    obj= payload.obj
    blob = bucket.blob(obj)
    image_bytes = blob.download_as_bytes()
    res = app.invoke({
        "user_url": f"gs://gem3-bucket/{obj}",
        "location": payload.location,
        "caption": payload.caption
    })
    return {"response": res}
