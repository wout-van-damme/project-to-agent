from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db_session
from app.schemas.comment import CommentResponse
from app.schemas.node import NodeCreate, NodeResponse, NodeUpdate
from app.services.node_service import NodeService
from app.services.play_service import PlayService

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


@router.put("/node/updateNode/{node_id}", response_model=NodeResponse)
def update_node(node_id: int, data: NodeUpdate, db: Session = Depends(get_db_session)):
    service = NodeService(db)
    node = service.update_node(node_id, data)
    if node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return node


@router.get("/nodes/getHierarchicalNodes", response_model=list[NodeResponse])
def get_hierarchical_nodes(db: Session = Depends(get_db_session)):
    service = NodeService(db)
    return service.get_hierarchical_nodes()


# TODO temporary code
@router.post("/play/{node_id}", response_model=CommentResponse)
def play_node(node_id: int, db: Session = Depends(get_db_session)):
    play_service = PlayService(db)
    comment = play_service.play_node(node_id)
    if comment is None:
        raise HTTPException(status_code=404, detail="Node or agent not found")
    return comment
