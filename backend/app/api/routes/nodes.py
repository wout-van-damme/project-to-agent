from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db_session
from app.schemas.node import NodeCreate, NodeResponse
from app.services.node_service import NodeService

router = APIRouter()


@router.post("/node/addNode")
def add_node(data: NodeCreate, db: Session = Depends(get_db_session)):
    service = NodeService(db)
    node = service.create_node(data)
    return {"id": node.id, "message": "Node created"}


@router.get("/nodes/getHierarchicalNodes", response_model=list[NodeResponse])
def get_hierarchical_nodes(db: Session = Depends(get_db_session)):
    service = NodeService(db)
    return service.get_hierarchical_nodes()
