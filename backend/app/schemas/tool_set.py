from pydantic import BaseModel
from typing import Optional
from app.schemas.tool import ToolResponse


class ToolSetCreate(BaseModel):
    name: str
    tool_ids: list[int] = []


class ToolSetUpdate(BaseModel):
    name: str | None = None
    tool_ids: list[int] | None = None


class ToolSetResponse(BaseModel):
    id: int
    name: str
    tools: list[ToolResponse] = []

    model_config = {"from_attributes": True}