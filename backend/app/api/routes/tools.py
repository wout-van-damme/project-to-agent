from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.schemas.tool import ToolResponse
from app.database import get_db_session
from app.services.tool_service import ToolService

router = APIRouter()



@router.get("/tools/getAllTools", response_model=list[ToolResponse])
def get_all_tools(db: Session = Depends(get_db_session)):
    service = ToolService(db)
    return service.get_all_tools()

