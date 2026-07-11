from typing import Optional

from pydantic import BaseModel


class NodeCreate(BaseModel):
    parent_id: Optional[int] = None
    type: str
    title: str
    description: str


class NodeResponse(BaseModel):
    id: int
    type: str
    title: str
    description: str
    nodes: list["NodeResponse"] = []

    model_config = {"from_attributes": True}
