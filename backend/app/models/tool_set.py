from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship

from app.database import Base


tool_set_tools = Table(
    "tool_set_tools",
    Base.metadata,
    Column("tool_set_id", Integer, ForeignKey("tool_sets.id"), primary_key=True),
    Column("tool_id", Integer, ForeignKey("tools.id"), primary_key=True),
)


class ToolSetModel(Base):
    __tablename__ = "tool_sets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    tools = relationship("ToolModel", secondary=tool_set_tools, back_populates="tool_sets")
    agents = relationship("AgentModel", back_populates="tool_set")