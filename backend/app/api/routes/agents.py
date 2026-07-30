from fastapi import APIRouter, Depends, HTTPException

from app.schemas.agent import AgentCreate, AgentResponse, AgentUpdate
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


@router.put("/agents/updateAgent/{agent_id}", response_model=AgentResponse)
def update_agent(agent_id: int, data: AgentUpdate, db: Session = Depends(get_db_session)):
    service = AgentService(db)
    agent = service.update_agent(agent_id, data)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.delete("/agents/deleteAgent/{agent_id}")
def delete_agent(agent_id: int, db: Session = Depends(get_db_session)):
    service = AgentService(db)
    deleted = service.delete_agent(agent_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Agent deleted"}