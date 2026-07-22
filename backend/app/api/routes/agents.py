from fastapi import APIRouter, Depends, HTTPException

from app.schemas.agent import AgentCreate, AgentResponse
from sqlalchemy.orm import Session
from app.database import get_db_session
from app.services.agent_service import AgentService



router = APIRouter()


@router.post("/agents/addAgent")
def add_agent(data: AgentCreate, db: Session = Depends(get_db_session)):
    service = AgentService(db)
    agent = service.create_agent(data)
    return {"id": agent.id, "message": "Agent created"}


@router.get("/agents/getAllAgents", response_model=list[AgentResponse])
def get_agents(db: Session = Depends(get_db_session)):
    service = AgentService(db)
    return service.get_all_agents()