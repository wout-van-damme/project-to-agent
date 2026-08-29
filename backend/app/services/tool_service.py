from sqlalchemy.orm import Session
from app.models.tool import ToolModel
from app.schemas.tool import ToolResponse


class ToolService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_tools(self) -> list[ToolResponse]:
        tools = self.db.query(ToolModel).all()
        return [ToolResponse(id=t.id, name=t.name, category=t.category) for t in tools]
