from pydantic import BaseModel

class NodeRest(BaseModel):
    type: str
    title: str
    description: str