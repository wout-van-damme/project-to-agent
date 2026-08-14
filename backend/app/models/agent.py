from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class AgentModel(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    provider = Column(String)
    modelName = Column(String)
    url = Column(String)
    apiKey = Column(String)

    nodes = relationship("NodeModel", back_populates="agent")
    