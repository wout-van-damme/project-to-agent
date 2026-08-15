from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

from app.models.agent import AgentModel
from app.models.comment import CommentModel
from app.models.node import NodeModel


class PlayService:
    def __init__(self, db: Session):
        self.db = db

    def play_node(self, node_id: int) -> CommentModel | None:
        node = self.db.query(NodeModel).filter(NodeModel.id == node_id).first()
        if node is None:
            return None
        if node.agent is None:
            return None

        node.status = "in progress"
        self.db.commit()

        try:
            model = self._build_model(node.agent)
            prompt = (
                f"You are assigned the following task:\n\n{node.description}\n\n"
                "Complete the task and provide the result."
            )
            response = model.invoke([SystemMessage(content=prompt)])
        finally:
            node.status = "review me"
            self.db.commit()

        # TODO instead of directly adding the comment do this in the route and use the comment service for this?
        comment = CommentModel(node_id=node_id, sender=node.agent.name, content=response.content)
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    @staticmethod
    def _build_model(agent: AgentModel) -> BaseChatModel:
        
        provider = (agent.provider or "").lower()

        # TODO test openai
        # if provider == "openai":
        #     return ChatOpenAI(
        #         model=agent.modelName,
        #         api_key=agent.apiKey or None,
        #         base_url=agent.url or None,
        #     )
        return ChatOllama(
            model=agent.modelName,
            base_url=agent.url or "http://localhost:11434",
        )
