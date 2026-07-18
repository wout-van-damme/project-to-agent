from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db_session
from app.schemas.comment import CommentCreate, CommentResponse, CommentUpdate
from app.services.comment_service import CommentService

router = APIRouter()


@router.post("/node/{node_id}/addComment", response_model=CommentResponse)
def add_comment(node_id: int, data: CommentCreate, db: Session = Depends(get_db_session)):
    service = CommentService(db)
    comment = service.create_comment(node_id, data)
    if comment is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return comment


@router.get("/node/{node_id}/getComments", response_model=list[CommentResponse])
def get_comments(node_id: int, db: Session = Depends(get_db_session)):
    service = CommentService(db)
    return service.get_comments_for_node(node_id)


@router.put("/comment/{comment_id}", response_model=CommentResponse)
def update_comment(comment_id: int, data: CommentUpdate, db: Session = Depends(get_db_session)):
    service = CommentService(db)
    comment = service.update_comment(comment_id, data)
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.delete("/comment/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db_session)):
    service = CommentService(db)
    if not service.delete_comment(comment_id):
        raise HTTPException(status_code=404, detail="Comment not found")
