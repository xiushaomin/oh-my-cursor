#!/usr/bin/env bash
set -euo pipefail

INSTALL_ROOT="${OHM_CURSOR_INSTALL_ROOT:-$HOME/.cursor/plugins/src}"
INSTALL_DIR="${OHM_CURSOR_INSTALL_DIR:-$INSTALL_ROOT/oh-my-cursor}"
LOCAL_DIR_ROOT="${OHM_CURSOR_LINK_DIR:-$HOME/.cursor/plugins/local}"
LOCAL_DIR="${OHM_CURSOR_LINK_PATH:-$LOCAL_DIR_ROOT/oh-my-cursor}"

say() {
  printf '[oh-my-cursor] %s\n' "$1"
}

if [ -L "$LOCAL_DIR" ] || [ -e "$LOCAL_DIR" ]; then
  rm -rf "$LOCAL_DIR"
  say "Removed local plugin copy $LOCAL_DIR"
else
  say "No local plugin copy found at $LOCAL_DIR"
fi

if [ -d "$INSTALL_DIR/.git" ]; then
  rm -rf "$INSTALL_DIR"
  say "Removed checkout $INSTALL_DIR"
else
  say "No installed checkout found at $INSTALL_DIR"
fi

say "Uninstall complete"
