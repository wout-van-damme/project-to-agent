from sqlalchemy.orm import Session

from app.models.node import NodeModel
from app.schemas.node import NodeCreate, NodeResponse


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
        self.db.add(node)
        self.db.commit()
        self.db.refresh(node)
        return node

    def get_hierarchical_nodes(self) -> list[NodeResponse]:
        all_nodes = self.db.query(NodeModel).all()
        nodes_by_id = {}
        for node in all_nodes:
            nodes_by_id[node.id] = NodeResponse(
                id=node.id,
                type=node.type,
                title=node.title,
                description=node.description,
                nodes=[],
            )
        roots = []
        for node in all_nodes:
            if node.parent_id is None:
                roots.append(nodes_by_id[node.id])
            elif node.parent_id in nodes_by_id:
                nodes_by_id[node.parent_id].nodes.append(nodes_by_id[node.id])
        return roots
