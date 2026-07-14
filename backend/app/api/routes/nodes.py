from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/node/getNode/{node_id}", response_model=NodeResponse)
def get_node(node_id: int, db: Session = Depends(get_db_session)):
    service = NodeService(db)
    node = service.get_node_by_id(node_id)
    if node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return node


@router.get("/nodes/getHierarchicalNodes", response_model=list[NodeResponse])
def get_hierarchical_nodes(db: Session = Depends(get_db_session)):
    service = NodeService(db)
    return service.get_hierarchical_nodes()
