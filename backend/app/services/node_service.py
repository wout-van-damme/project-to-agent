from sqlalchemy.orm import Session

from app.models.agent import AgentModel
from app.models.node import NodeModel
from app.schemas.node import AgentInfo, CommentInfo, NodeCreate, NodeResponse, NodeUpdate


class NodeService:
    def __init__(self, db: Session):
        self.db = db

    def create_node(self, data: NodeCreate) -> NodeModel:
        node_type = "workspace" if data.parent_id is None else data.type
        node = NodeModel(
            parent_id=data.parent_id,
            type=node_type,
            title=data.title,
            description=data.description,
        )
        if data.agent_ids:
            agents = self.db.query(AgentModel).filter(AgentModel.id.in_(data.agent_ids)).all()
            node.agents = agents
        self.db.add(node)
        self.db.commit()
        self.db.refresh(node)
        return node

    @staticmethod
    def _to_response(node: NodeModel) -> NodeResponse:
        return NodeResponse(
            id=node.id,
            type=node.type,
            title=node.title,
            description=node.description,
            nodes=[NodeService._to_response(child) for child in node.children],
            comments=[
                CommentInfo(id=c.id, sender=c.sender, content=c.content, created_at=c.created_at)
                for c in node.comments
            ],
            agents=[AgentInfo(id=a.id, name=a.name) for a in node.agents],
        )

    def get_node_by_id(self, node_id: int) -> NodeResponse | None:
        node = self.db.query(NodeModel).filter(NodeModel.id == node_id).first()
        return self._to_response(node) if node else None

    def update_node_description(self, node_id: int, data: NodeUpdate) -> NodeResponse | None:
        node = self.db.query(NodeModel).filter(NodeModel.id == node_id).first()
        if not node:
            return None
        node.description = data.description
        self.db.commit()
        self.db.refresh(node)
        return self._to_response(node)

    def get_hierarchical_nodes(self) -> list[NodeResponse]:
        roots = self.db.query(NodeModel).filter(NodeModel.parent_id.is_(None)).all()
        return [self._to_response(node) for node in roots]
