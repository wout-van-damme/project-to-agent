from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class ToolModel(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)