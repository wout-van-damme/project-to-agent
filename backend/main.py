from fastapi import FastAPI
from model.rest.node_rest import NodeRest
from fastapi.middleware.cors import CORSMiddleware

api = FastAPI()



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
    return {"message": "Hello, World!"}
