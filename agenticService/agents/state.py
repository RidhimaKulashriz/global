from pydantic import BaseModel
from typing import Optional,List,Dict, Any
class State(BaseModel):
    user_obj:Optional[str]=None
    user_url:Optional[str]=None
    location: Optional[str]=None
    caption:Optional[str]=None
    news:Optional[List[str]]=None
    weather:Optional[Dict[str, Any]]=None
    segregator:Optional[str]=None
    verdict:Optional[str]=None
    prob:Optional[float]=0
    analysis_steps:Optional[List[str]]=None
    merged_context:Optional[str]=None


