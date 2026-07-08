from fastapi import FastAPI
from model.rest.node_rest import NodeRest
from model.node_model import Base, NodeModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os


load_dotenv()


api = FastAPI()


db_url = os.getenv("DB_URL")
engine = create_engine(db_url, echo=True)
Base.metadata.create_all(engine)

origins = [
    "http://localhost:4200",
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api.get('/')
def index():
    return { 'response': 'TEST'}

@api.post("/addNode")
async def addNode(nodeRest: NodeRest):
    node = NodeModel(parent_id=nodeRest.parent_id, type=nodeRest.type, title=nodeRest.title, description=nodeRest.description)
    with Session(engine) as session:
        session.add(node)
        session.commit()
        session.refresh(node)
    return {"id": node.id, "message": "Node created"}
