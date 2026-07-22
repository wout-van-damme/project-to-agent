from pydantic import BaseModel


class AgentCreate(BaseModel):
    name: str
    provider: str
    modelName: str
    url: str
    apiKey: str



class AgentResponse(BaseModel):
    id: int
    name: str
    provider: str
    modelName: str
    url: str
    apiKey: str
    
    model_config = {"from_attributes": True}
