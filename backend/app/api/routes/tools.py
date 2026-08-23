from fastapi import APIRouter, Depends, HTTPException

from app.schemas.tool import ToolCreate, ToolResponse, ToolUpdate
from sqlalchemy.orm import Session
from app.database import get_db_session
from app.services.tool_service import ToolService


router = APIRouter()


@router.post("/tools/addTool")
def add_tool(data: ToolCreate, db: Session = Depends(get_db_session)):
    service = ToolService(db)
    tool = service.create_tool(data)
    return {"id": tool.id, "message": "Tool created"}


@router.get("/tools/getAllTools", response_model=list[ToolResponse])
def get_tools(db: Session = Depends(get_db_session)):
    service = ToolService(db)
    return service.get_all_tools()


@router.put("/tools/updateTool/{tool_id}", response_model=ToolResponse)
def update_tool(tool_id: int, data: ToolUpdate, db: Session = Depends(get_db_session)):
    service = ToolService(db)
    tool = service.update_tool(tool_id, data)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool


@router.delete("/tools/deleteTool/{tool_id}")
def delete_tool(tool_id: int, db: Session = Depends(get_db_session)):
    service = ToolService(db)
    deleted = service.delete_tool(tool_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Tool not found")
    return {"message": "Tool deleted"}