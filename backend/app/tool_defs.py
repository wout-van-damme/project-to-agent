from pathlib import Path
from langchain_core.tools import tool
from app.config import AGENT_WORKING_DIR

PROJECT_ROOT = (Path("./") / AGENT_WORKING_DIR).resolve()

def _get_path(file_path: str) -> Path:
    path = (PROJECT_ROOT / file_path).resolve()
    if not str(path).startswith(str(PROJECT_ROOT)):
        # TODO: what should happen here? (request permission in a comment???)
        raise ValueError(f"Path {file_path} attempts to escape project root")
    return path


@tool
def read_file(file_path: str) -> str:
    """Read the contents of a file in the project's directory."""
    path = _get_path(file_path)
    
    try:
        if not path.exists():
            return f"ERROR: File not found: {file_path}"
        if not path.is_file():
            return f"ERROR: Not a file: {file_path}"
        
        return path.read_text(encoding="utf-8")
    except Exception as e:
        return f"ERROR: Reading file:\n```{e}```\n"


@tool
def write_file(file_path: str, content: str) -> str:
    """Write content to a file in the project's directory. Also creates parent directories if needed."""
    path = _get_path(file_path)
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return f"File written: {file_path}"
    except Exception as e:
        return f"ERROR: Writing file:\n```{e}```\n"






TOOLS = [read_file, write_file]
