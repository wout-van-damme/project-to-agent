import subprocess
from pathlib import Path
import re

from app.config import AGENT_WORKING_DIR
from app.models.agent import AgentModel
from app.models.node import NodeModel


class GitService:
    def __init__(self):
        pass

    def ensure_repo_cloned(self, agent: AgentModel) -> Path:
        if not agent.gitRepository:
            raise ValueError("Agent has no git repository configured")

        agent_root = Path("./") / AGENT_WORKING_DIR / agent.name
        agent_root.mkdir(parents=True, exist_ok=True)

        subprocess.run(
            ["git", "clone", agent.gitRepository, agent_root],
            check=True,
        )

        return agent_root

    def create_branch(self, agent: AgentModel, node: NodeModel) -> str:
        agent_root = self.ensure_repo_cloned(agent)
        short_summary = self._sanitize_name(node.title)
        branch_name = f"task-{node.id}_{short_summary}_{self._sanitize_name(agent.name)}"

        subprocess.run(
            ["git", "checkout", "-b", branch_name],
            check=True,
            cwd=str(agent_root),
        )

        return branch_name

    def push_current_branch(self, agent: AgentModel) -> None:
        if not agent.gitRepository:
            return

        agent_root = Path("./") / AGENT_WORKING_DIR / agent.name

        result = subprocess.run(
            ["git", "branch", "--show-current"],
            check=True,
            cwd=str(agent_root),
            capture_output=True,
            text=True,
        )
        current_branch = result.stdout.strip()

        if current_branch:
            subprocess.run(
                ["git", "push", "origin", current_branch],
                check=True,
                cwd=str(agent_root),
            )

    @staticmethod
    def _sanitize_name(name: str) -> str:
        sanitized = re.sub(r'[^a-zA-Z0-9_-]', '-', name)
        sanitized = re.sub(r'-+', '-', sanitized)
        return sanitized.strip('-').lower()[:50]