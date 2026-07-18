from sqlalchemy.orm import Session

from app.models.comment import CommentModel
from app.models.node import NodeModel
from app.schemas.comment import CommentCreate, CommentResponse


class CommentService:
    def __init__(self, db: Session):
        self.db = db

    def create_comment(self, node_id: int, data: CommentCreate) -> CommentModel | None:
        node = self.db.query(NodeModel).filter(NodeModel.id == node_id).first()
        if not node:
            return None
        comment = CommentModel(node_id=node_id, sender="You", content=data.content)
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def get_comments_for_node(self, node_id: int) -> list[CommentResponse]:
        comments = (
            self.db.query(CommentModel)
            .filter(CommentModel.node_id == node_id)
            .order_by(CommentModel.created_at.asc())
            .all()
        )
        return [
            CommentResponse(
                id=c.id,
                node_id=c.node_id,
                sender=c.sender,
                content=c.content,
                created_at=c.created_at,
            )
            for c in comments
        ]
