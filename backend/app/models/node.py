from sqlalchemy import Column, Integer, String

from app.database import Base


class NodeModel(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parent_id = Column(Integer, nullable=True)
    type = Column(String)
    title = Column(String)
    description = Column(String)
