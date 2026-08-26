from pydantic import BaseModel


class ToolCreate(BaseModel):
    name: str
    category: str


class ToolUpdate(BaseModel):
    name: str | None = None
    category: str | None = None


class ToolResponse(BaseModel):
    id: int
    name: str
    category: str

    model_config = {"from_attributes": True}