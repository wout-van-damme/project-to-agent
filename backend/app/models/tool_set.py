from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class ToolSetModel(Base):
    __tablename__ = "tool_sets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    tools = relationship("ToolModel", back_populates="tool_set", cascade="all, delete-orphan")