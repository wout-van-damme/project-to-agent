from sqlalchemy.orm import Session

from app.models.node import NodeModel
from app.schemas.node import NodeCreate


class NodeService:
    def __init__(self, db: Session):
        self.db = db

    def create_node(self, data: NodeCreate) -> NodeModel:
        node = NodeModel(
            parent_id=data.parent_id,
            type=data.type,
            title=data.title,
            description=data.description,
        )
        self.db.add(node)
        self.db.commit()
        self.db.refresh(node)
        return node
