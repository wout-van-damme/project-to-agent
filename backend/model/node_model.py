from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class NodeModel(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parent_id = Column(Integer)
    type = Column(String)
    title = Column(String)
    description = Column(String)
