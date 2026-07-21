from pydantic import BaseModel


class AgentCreate(BaseModel):
    name: str
    provider: str
    modelName: str
    url: str
    apiKey: str
