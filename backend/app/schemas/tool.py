from pydantic import BaseModel


class ToolCreate(BaseModel):
    name: str


class ToolUpdate(BaseModel):
    name: str | None = None


class ToolResponse(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}