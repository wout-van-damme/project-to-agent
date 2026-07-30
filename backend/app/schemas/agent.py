from pydantic import BaseModel


class AgentCreate(BaseModel):
    name: str
    provider: str
    modelName: str
    url: str
    apiKey: str


class AgentUpdate(BaseModel):
    name: str | None = None
    provider: str | None = None
    modelName: str | None = None
    url: str | None = None
    apiKey: str | None = None


class AgentResponse(BaseModel):
    id: int
    name: str
    provider: str
    modelName: str
    url: str
    apiKey: str
    
    model_config = {"from_attributes": True}