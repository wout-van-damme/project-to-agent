from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DB_URL")
AGENT_WORKING_DIR = os.getenv("WORKING_DIR")