from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class CommentModel(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    node_id = Column(Integer, ForeignKey("nodes.id"), nullable=False)
    sender = Column(String, default="You")
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    node = relationship("NodeModel", back_populates="comments")
