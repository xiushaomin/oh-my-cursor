#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${OHM_CURSOR_REPO_URL:-https://github.com/xiushaomin/oh-my-cursor.git}"
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

mkdir -p "$INSTALL_ROOT" "$LOCAL_DIR_ROOT"

if [ -d "$INSTALL_DIR/.git" ]; then
  say "Existing install found at $INSTALL_DIR"
  say "Updating repository"
  git -C "$INSTALL_DIR" fetch --all --prune
  git -C "$INSTALL_DIR" checkout "$BRANCH"
  git -C "$INSTALL_DIR" pull --ff-only origin "$BRANCH"
else
  if [ -e "$INSTALL_DIR" ]; then
    printf 'Error: install path exists but is not a git checkout: %s\n' "$INSTALL_DIR" >&2
    exit 1
  fi
  say "Cloning repository into $INSTALL_DIR"
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$INSTALL_DIR"
fi

if [ -L "$LOCAL_DIR" ] || [ -e "$LOCAL_DIR" ]; then
  rm -rf "$LOCAL_DIR"
fi

mkdir -p "$LOCAL_DIR"
rsync -a --delete --exclude '.git' "$INSTALL_DIR/" "$LOCAL_DIR/"

say "Plugin copied to $LOCAL_DIR"
say "Restart Cursor or run Developer: Reload Window"
