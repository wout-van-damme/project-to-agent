from typing import Optional

from pydantic import BaseModel


class NodeCreate(BaseModel):
    parent_id: Optional[int] = None
    type: str
    title: str
    description: str
