from pydantic import BaseModel

class NodeRest(BaseModel):
    parent_id: int
    type: str
    title: str
    description: str