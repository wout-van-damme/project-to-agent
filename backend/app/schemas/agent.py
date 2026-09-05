from pydantic import BaseModel
from typing import Optional


class AgentCreate(BaseModel):
    name: str
    provider: str
    modelName: str
    url: str
    apiKey: str
    gitRepository: Optional[str] = None
    tool_set_id: Optional[int] = None


class AgentUpdate(BaseModel):
    name: str | None = None
    provider: str | None = None
    modelName: str | None = None
    url: str | None = None
    apiKey: str | None = None
    gitRepository: Optional[str] = None
    tool_set_id: Optional[int] = None


class AgentResponse(BaseModel):
    id: int
    name: str
    provider: str
    modelName: str
    url: str
    apiKey: str
    gitRepository: Optional[str] = None
    tool_set_id: Optional[int] = None
    
    model_config = {"from_attributes": True}