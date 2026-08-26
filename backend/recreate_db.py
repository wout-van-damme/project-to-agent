from app.database import Base, engine
import app.models.tool
import app.models.tool_set
import app.models.agent
import app.models.node
import app.models.comment

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

print("Database recreated with no data.")