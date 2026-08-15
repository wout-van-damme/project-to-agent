from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AgentInfo(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class NodeCreate(BaseModel):
    parent_id: Optional[int] = None
    type: str
    title: str
    description: str
    status: Optional[str] = None
    agent_id: Optional[int] = None


class NodeUpdate(BaseModel):
    description: str
    status: Optional[str] = None
    agent_id: Optional[int] = None


class CommentInfo(BaseModel):
    id: int
    sender: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class NodeResponse(BaseModel):
    id: int
    type: str
    title: str
    description: str
    status: str
    nodes: list["NodeResponse"] = []
    comments: list[CommentInfo] = []
    agent: Optional[AgentInfo] = None

    model_config = {"from_attributes": True}
