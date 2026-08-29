from sqlalchemy.orm import Session, joinedload

from app.models.tool_set import ToolSetModel
from app.models.tool import ToolModel
from app.schemas.tool_set import ToolSetCreate, ToolSetResponse, ToolSetUpdate
from app.schemas.tool import ToolResponse


class ToolSetService:
    def __init__(self, db: Session):
        self.db = db

    def _get_tools_by_ids(self, tool_ids: list[int]) -> list[ToolModel]:
        if not tool_ids:
            return []
        return self.db.query(ToolModel).filter(ToolModel.id.in_(tool_ids)).all()

    def create_tool_set(self, data: ToolSetCreate) -> ToolSetModel | None:
        tools = self._get_tools_by_ids(data.tool_ids)
        tool_set = ToolSetModel(name=data.name, tools=tools)
        self.db.add(tool_set)
        self.db.commit()
        self.db.refresh(tool_set)
        return tool_set

    def get_all_tool_sets(self) -> list[ToolSetResponse]:
        tool_sets = self.db.query(ToolSetModel).options(joinedload(ToolSetModel.tools)).all()
        return [
            ToolSetResponse(
                id=ts.id,
                name=ts.name,
                tools=[ToolResponse(id=t.id, name=t.name, category=t.category) for t in ts.tools]
            )
            for ts in tool_sets
        ]

    def get_tool_set_by_id(self, tool_set_id: int) -> ToolSetModel | None:
        return self.db.query(ToolSetModel).options(joinedload(ToolSetModel.tools)).filter(ToolSetModel.id == tool_set_id).first()

    def update_tool_set(self, tool_set_id: int, data: ToolSetUpdate) -> ToolSetModel | None:
        tool_set = self.get_tool_set_by_id(tool_set_id)
        if not tool_set:
            return None
        update_data = data.model_dump(exclude_unset=True)
        if "tool_ids" in update_data:
            tool_set.tools = self._get_tools_by_ids(update_data.pop("tool_ids"))
        for field, value in update_data.items():
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

