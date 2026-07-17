from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.api.routes.nodes import router as nodes_router
from app.api.routes.comments import router as comments_router

Base.metadata.create_all(engine)

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


@api.get("/")
def index():
    return {"response": "TEST"}
