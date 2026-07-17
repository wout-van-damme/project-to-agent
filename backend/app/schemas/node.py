from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NodeCreate(BaseModel):
    parent_id: Optional[int] = None
    type: str
    title: str
    description: str


class NodeUpdate(BaseModel):
    description: str


class CommentInfo(BaseModel):
    id: int
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class NodeResponse(BaseModel):
    id: int
    type: str
    title: str
    description: str
    nodes: list["NodeResponse"] = []
    comments: list[CommentInfo] = []

    model_config = {"from_attributes": True}
