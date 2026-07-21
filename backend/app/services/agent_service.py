from sqlalchemy.orm import Session

from app.models.comment import CommentModel
from app.models.node import NodeModel
from app.models.agent import AgentModel
from app.schemas.agent import AgentCreate


class AgentService:
    def __init__(self, db: Session):
        self.db = db

    def create_agent(self, data: AgentCreate) -> CommentModel | None:
        agent = AgentModel(
            name=data.name,
            provider=data.provider,
            modelName=data.modelName,
            url=data.url,
            apiKey=data.apiKey
        )
        self.db.add(agent)
        self.db.commit()
        self.db.refresh(agent)
        return agent