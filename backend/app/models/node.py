from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from app.database import Base


node_agents = Table(
    "node_agents",
    Base.metadata,
    Column("node_id", Integer, ForeignKey("nodes.id"), primary_key=True),
    Column("agent_id", Integer, ForeignKey("agents.id"), primary_key=True),
)


class NodeModel(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parent_id = Column(Integer, ForeignKey("nodes.id"), nullable=True)
    type = Column(String)
    title = Column(String)
    description = Column(String)

    children = relationship("NodeModel", back_populates="parent", lazy="selectin")
    parent = relationship("NodeModel", back_populates="children", remote_side="NodeModel.id", lazy="noload")
    comments = relationship("CommentModel", back_populates="node", lazy="selectin")
    agents = relationship("AgentModel", secondary=node_agents, lazy="selectin")
