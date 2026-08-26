from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class ToolModel(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True)
    category = Column(String)
    tool_set_id = Column(Integer, ForeignKey("tool_sets.id"))
    tool_set = relationship("ToolSetModel", back_populates="tools")