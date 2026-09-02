from pathlib import Path
from langchain_core.tools import tool
from app.config import AGENT_WORKING_DIR


def _get_agent_root(agent_name: str) -> Path:
    return (Path("./") / AGENT_WORKING_DIR / agent_name).resolve()


def _get_path(file_path: str, agent_name: str) -> Path:
    agent_root = _get_agent_root(agent_name)
    path = (agent_root / file_path).resolve()
    if not str(path).startswith(str(agent_root)):
        raise ValueError(f"Path {file_path} attempts to escape agent working directory")
    return path


def create_tools(agent_name: str):
    agent_root = _get_agent_root(agent_name)
    agent_root.mkdir(parents=True, exist_ok=True)

    @tool
    def read_file(file_path: str) -> str:
        """Read the contents of a file in the agent's working directory."""
        path = _get_path(file_path, agent_name)

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
        """Write content to a file in the agent's working directory. Also creates parent directories if needed."""
        path = _get_path(file_path, agent_name)
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
            return f"File written: {file_path}"
        except Exception as e:
            return f"ERROR: Writing file:\n```{e}```\n"

    return [read_file, write_file]