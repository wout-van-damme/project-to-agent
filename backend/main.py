from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, SessionLocal
from app.models.tool import ToolModel
from app.models.tool_set import ToolSetModel
from app.api.routes.nodes import router as nodes_router
from app.api.routes.comments import router as comments_router
from app.api.routes.agents import router as agents_router
from app.api.routes.tool_sets import router as tool_sets_router
from app.api.routes.tools import router as tools_router

Base.metadata.create_all(engine)


def seed_tools_data():
    db = SessionLocal()
    try:
        if db.query(ToolModel).count() == 0:
            tools = [
                ToolModel(name="read_file", category="file"),
                ToolModel(name="write_file", category="file"),
                ToolModel(name="list_files", category="file"),
            ]
            db.add_all(tools)
            db.commit()
    finally:
        db.close()


seed_tools_data()

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(nodes_router)
api.include_router(comments_router)
api.include_router(agents_router)
api.include_router(tool_sets_router)
api.include_router(tools_router)


@api.get("/")
def index():
    return {"response": "TEST"}
