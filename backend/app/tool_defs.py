from pathlib import Path
from langchain_core.tools import tool
from app.config import AGENT_WORKING_DIR
import subprocess


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

    @tool
    def get_git_links() -> str:
        """Get formatted git branch link and diff link for the current branch. Only works if the agent has a git repository assigned."""
        try:
            agent_root = _get_agent_root(agent_name)
            
            result = subprocess.run(
                ["git", "branch", "--show-current"],
                cwd=str(agent_root),
                capture_output=True,
                text=True,
            )
            current_branch = result.stdout.strip()
            if not current_branch:
                return "ERROR: No current branch"
            
            result = subprocess.run(
                ["git", "config", "--get", "remote.origin.url"],
                cwd=str(agent_root),
                capture_output=True,
                text=True,
            )
            remote_url = result.stdout.strip()
            if not remote_url:
                return "ERROR: No remote origin"
            
            branch_link, diff_link = _format_git_links(remote_url, current_branch)
            
            return f"Branch: {branch_link}\nDiff: {diff_link}"
        except Exception as e:
            return f"ERROR: Getting git links:\n```{e}```\n"

    return [read_file, write_file, get_git_links]


def _format_git_links(remote_url: str, branch: str) -> tuple[str, str]:
    url = remote_url.replace(".git", "")
    if url.endswith("/"):
        url = url[:-1]
    
    if "github.com" in url:
        if url.startswith("git@"):
            url = url.replace("git@github.com:", "https://github.com/")
        branch_link = f"{url}/tree/{branch}"
        diff_link = f"{url}/compare/main...{branch}"
    elif "gitlab.com" in url:
        if url.startswith("git@"):
            url = url.replace("git@gitlab.com:", "https://gitlab.com/")
        branch_link = f"{url}/-/tree/{branch}"
        diff_link = f"{url}/-/compare/main...{branch}"
    else:
        branch_link = f"{url}/tree/{branch}"
        diff_link = f"{url}/compare/main...{branch}"
    
    return branch_link, diff_link