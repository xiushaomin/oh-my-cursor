#!/usr/bin/env bash
set -euo pipefail

INSTALL_ROOT="${OHM_CURSOR_INSTALL_ROOT:-$HOME/.cursor/plugins/src}"
INSTALL_DIR="${OHM_CURSOR_INSTALL_DIR:-$INSTALL_ROOT/oh-my-cursor}"
LOCAL_DIR_ROOT="${OHM_CURSOR_LINK_DIR:-$HOME/.cursor/plugins/local}"
LOCAL_DIR="${OHM_CURSOR_LINK_PATH:-$LOCAL_DIR_ROOT/oh-my-cursor}"
BRANCH="${OHM_CURSOR_BRANCH:-main}"

say() {
  printf '[oh-my-cursor] %s\n' "$1"
}

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf 'Error: required command not found: %s\n' "$1" >&2
    exit 1
  fi
}

need_cmd git
need_cmd mkdir
need_cmd rsync

if [ ! -d "$INSTALL_DIR/.git" ]; then
  printf 'Error: no installed checkout found at %s\n' "$INSTALL_DIR" >&2
  exit 1
fi

say "Updating repository at $INSTALL_DIR"
git -C "$INSTALL_DIR" fetch --all --prune
git -C "$INSTALL_DIR" checkout "$BRANCH"
git -C "$INSTALL_DIR" pull --ff-only origin "$BRANCH"
mkdir -p "$LOCAL_DIR_ROOT"
rm -rf "$LOCAL_DIR"
mkdir -p "$LOCAL_DIR"
rsync -a --delete --exclude '.git' "$INSTALL_DIR/" "$LOCAL_DIR/"
say "Update complete; plugin copied to $LOCAL_DIR"
say "Restart Cursor or run Developer: Reload Window"
