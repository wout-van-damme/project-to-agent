from sqlalchemy.orm import Session

from app.models.tool import ToolModel
from app.schemas.tool import ToolCreate, ToolResponse, ToolUpdate


class ToolService:
    def __init__(self, db: Session):
        self.db = db

    def create_tool(self, data: ToolCreate) -> ToolModel | None:
        tool = ToolModel(name=data.name)
        self.db.add(tool)
        self.db.commit()
        self.db.refresh(tool)
        return tool

    def get_all_tools(self) -> list[ToolResponse]:
        tools = self.db.query(ToolModel).all()
        return [ToolResponse(id=t.id, name=t.name) for t in tools]

    def get_tool_by_id(self, tool_id: int) -> ToolModel | None:
        return self.db.query(ToolModel).filter(ToolModel.id == tool_id).first()

    def update_tool(self, tool_id: int, data: ToolUpdate) -> ToolModel | None:
        tool = self.get_tool_by_id(tool_id)
        if not tool:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(tool, field, value)
        self.db.commit()
        self.db.refresh(tool)
        return tool

    def delete_tool(self, tool_id: int) -> bool:
        tool = self.get_tool_by_id(tool_id)
        if not tool:
            return False
        self.db.delete(tool)
        self.db.commit()
        return True