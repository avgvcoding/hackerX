from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]


def load_dotenv_file(path: Path = ROOT_DIR / ".env") -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


load_dotenv_file()


@dataclass(frozen=True)
class Settings:
    root_dir: Path = ROOT_DIR
    seller_dataset_path: Path = ROOT_DIR / "seller_dataset.json"
    docs_dir: Path = ROOT_DIR / "docs"
    llm_gateway_api_key: str | None = os.getenv("IM_LLM_GATEWAY_API_KEY")
    llm_base_url: str = os.getenv("IM_LLM_BASE_URL", "https://imllm.intermesh.net/v1").rstrip("/")
    llm_primary_model: str = os.getenv("IM_LLM_PRIMARY_MODEL", "openai/gpt-5.4")
    llm_fallback_model: str = os.getenv("IM_LLM_FALLBACK_MODEL", "anthropic/claude-sonnet-4-6")
    embedding_model: str = os.getenv("IM_EMBEDDING_MODEL", "openai/text-embedding-3-large")
    llm_timeout_seconds: int = int(os.getenv("IM_LLM_TIMEOUT_SECONDS", "45"))


settings = Settings()
