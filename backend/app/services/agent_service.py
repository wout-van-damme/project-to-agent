from sqlalchemy.orm import Session

from app.models.comment import CommentModel
from app.models.node import NodeModel
from app.models.agent import AgentModel
from app.schemas.agent import AgentCreate, AgentResponse, AgentUpdate


class AgentService:
    def __init__(self, db: Session):
        self.db = db

    def create_agent(self, data: AgentCreate) -> AgentModel | None:
        agent = AgentModel(
            name=data.name,
            provider=data.provider,
            modelName=data.modelName,
            url=data.url,
            apiKey=data.apiKey,
            tool_set_id=data.tool_set_id
        )
        self.db.add(agent)
        self.db.commit()
        self.db.refresh(agent)
        return agent
    
    def get_all_agents(self) -> list[AgentResponse]:
        agents = (
            self.db.query(AgentModel).all()
        )
        return [
            AgentResponse(
                id=a.id,
                name=a.name,
                provider=a.provider,
                modelName=a.modelName,
                url=a.url,
                apiKey=a.apiKey,
                tool_set_id=a.tool_set_id
            )
            for a in agents
        ]

    def get_agent_by_id(self, agent_id: int) -> AgentModel | None:
        return self.db.query(AgentModel).filter(AgentModel.id == agent_id).first()

    def update_agent(self, agent_id: int, data: AgentUpdate) -> AgentModel | None:
        agent = self.get_agent_by_id(agent_id)
        if not agent:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(agent, field, value)
        self.db.commit()
        self.db.refresh(agent)
        return agent

    def delete_agent(self, agent_id: int) -> bool:
        agent = self.get_agent_by_id(agent_id)
        if not agent:
            return False
        self.db.delete(agent)
        self.db.commit()
        return True