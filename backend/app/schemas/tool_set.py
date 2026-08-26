from pydantic import BaseModel
from typing import Optional
from app.schemas.tool import ToolResponse


class ToolSetCreate(BaseModel):
    name: str
    tool_names: list[str] = []


class ToolSetUpdate(BaseModel):
    name: str | None = None
    tool_names: list[str] = None


class ToolSetResponse(BaseModel):
    id: int
    name: str
    tools: list[ToolResponse] = []

    model_config = {"from_attributes": True}