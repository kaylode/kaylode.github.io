#!/bin/bash
cd "$(dirname "$0")"

# Ensure dependencies are synced
uv sync

# Run the app
uv run uvicorn main:app --reload --port 8000
