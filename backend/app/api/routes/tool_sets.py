from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.tool_set import ToolSetCreate, ToolSetResponse, ToolSetUpdate
from app.schemas.tool import ToolCreate, ToolResponse
from app.database import get_db_session
from app.services.tool_set_service import ToolSetService

router = APIRouter()


@router.post("/tool-sets/addToolSet", response_model=ToolSetResponse)
def add_tool_set(data: ToolSetCreate, db: Session = Depends(get_db_session)):
    service = ToolSetService(db)
    tool_set = service.create_tool_set(data)
    return ToolSetResponse(id=tool_set.id, name=tool_set.name, tools=[])


@router.get("/tool-sets/getAllToolSets", response_model=list[ToolSetResponse])
def get_tool_sets(db: Session = Depends(get_db_session)):
    service = ToolSetService(db)
    return service.get_all_tool_sets()


@router.get("/tool-sets/getToolSet/{tool_set_id}", response_model=ToolSetResponse)
def get_tool_set(tool_set_id: int, db: Session = Depends(get_db_session)):
    service = ToolSetService(db)
    tool_set = service.get_tool_set_by_id(tool_set_id)
    if not tool_set:
        raise HTTPException(status_code=404, detail="Tool set not found")
    return ToolSetResponse(
        id=tool_set.id,
        name=tool_set.name,
        tools=[ToolResponse(id=t.id, name=t.name, category=t.category) for t in tool_set.tools]
    )


@router.put("/tool-sets/updateToolSet/{tool_set_id}", response_model=ToolSetResponse)
def update_tool_set(tool_set_id: int, data: ToolSetUpdate, db: Session = Depends(get_db_session)):
    service = ToolSetService(db)
    tool_set = service.update_tool_set(tool_set_id, data)
    if not tool_set:
        raise HTTPException(status_code=404, detail="Tool set not found")
    return ToolSetResponse(
        id=tool_set.id,
        name=tool_set.name,
        tools=[ToolResponse(id=t.id, name=t.name, category=t.category) for t in tool_set.tools]
    )


@router.delete("/tool-sets/deleteToolSet/{tool_set_id}")
def delete_tool_set(tool_set_id: int, db: Session = Depends(get_db_session)):
    service = ToolSetService(db)
    deleted = service.delete_tool_set(tool_set_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Tool set not found")
    return {"message": "Tool set deleted"}
