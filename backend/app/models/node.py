from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class NodeModel(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parent_id = Column(Integer, ForeignKey("nodes.id"), nullable=True)
    type = Column(String)
    title = Column(String)
    description = Column(String)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)

    children = relationship("NodeModel", back_populates="parent", lazy="selectin")
    parent = relationship("NodeModel", back_populates="children", remote_side="NodeModel.id", lazy="noload")
    comments = relationship("CommentModel", back_populates="node", lazy="selectin")
    agent = relationship("AgentModel", back_populates="nodes", lazy="selectin")