from pydantic import BaseModel
from typing import Optional,List
class State(BaseModel):
    user_url:str
    location: Optional[str]=None
    caption:Optional[str]=None
    news:Optional[List[str]]=None
    weather:Optional[str]=None
    segregator:Optional[str]=None
    verdict:Optional[str]=None
    prob:Optional[float]=0


