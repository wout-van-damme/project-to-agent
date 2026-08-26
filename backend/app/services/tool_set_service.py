from sqlalchemy.orm import Session

from app.models.tool_set import ToolSetModel
from app.models.tool import ToolModel
from app.schemas.tool_set import ToolSetCreate, ToolSetResponse, ToolSetUpdate
from app.schemas.tool import ToolResponse


class ToolSetService:
    def __init__(self, db: Session):
        self.db = db

    def create_tool_set(self, data: ToolSetCreate) -> ToolSetModel | None:
        tool_set = ToolSetModel(name=data.name)
        self.db.add(tool_set)
        self.db.commit()
        self.db.refresh(tool_set)
        return tool_set

    def get_all_tool_sets(self) -> list[ToolSetResponse]:
        tool_sets = self.db.query(ToolSetModel).all()
        return [
            ToolSetResponse(
                id=ts.id,
                name=ts.name,
                tools=[ToolResponse(id=t.id, name=t.name, category=t.category) for t in ts.tools]
            )
            for ts in tool_sets
        ]

    def get_tool_set_by_id(self, tool_set_id: int) -> ToolSetModel | None:
        return self.db.query(ToolSetModel).filter(ToolSetModel.id == tool_set_id).first()

    def update_tool_set(self, tool_set_id: int, data: ToolSetUpdate) -> ToolSetModel | None:
        tool_set = self.get_tool_set_by_id(tool_set_id)
        if not tool_set:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(tool_set, field, value)
        self.db.commit()
        self.db.refresh(tool_set)
        return tool_set

    def delete_tool_set(self, tool_set_id: int) -> bool:
        tool_set = self.get_tool_set_by_id(tool_set_id)
        if not tool_set:
            return False
        self.db.delete(tool_set)
        self.db.commit()
        return True

