#!/usr/bin/env bash
set -euo pipefail

# =======================
# CONFIG (can be left empty to auto-detect)
# =======================
# If REMOTE_URL is empty, we'll try to read from the current repo's origin.
REMOTE_URL=${REMOTE_URL:-}
WORKDIR=${WORKDIR:-hamro-chiya-pasal-clean}
STRIP_LARGE_BLOBS=${STRIP_LARGE_BLOBS:-10M}

# Optional: author rewrite via .mailmap (set to 1 to enable and edit .mailmap block below)
APPLY_MAILMAP=${APPLY_MAILMAP:-0}

# Optional: default branch rename
RENAME_DEFAULT_BRANCH=${RENAME_DEFAULT_BRANCH:-0}
OLD_DEFAULT_BRANCH=${OLD_DEFAULT_BRANCH:-master}
NEW_DEFAULT_BRANCH=${NEW_DEFAULT_BRANCH:-main}

# Extra paths to purge from history (space-separated). You may override by exporting EXTRA_PURGE before running.
EXTRA_PURGE_DEFAULT=(
  # Build outputs & caches
  "frontend/dist/**"
  "backend/dist/**"
  "**/coverage/**"
  "**/.cache/**"
  "**/.vite/**"
  "**/.eslintcache"
  "**/.DS_Store"
  # Env files
  ".env"
  ".env.local"
  "**/.env"
  "**/.env.*"
  # Platforms
  "**/.vercel/**"
  # Common accidental commits
  "**/node_modules/**"
  "screenshots/**"
  "uploads/**"
  "assets/raw/**"
)

# Merge overrides
IFS=$'\n' read -r -d '' -a EXTRA_PURGE <<<"${EXTRA_PURGE:-${EXTRA_PURGE_DEFAULT[*]}}" || true

# Detect remote if missing
if [[ -z "$REMOTE_URL" ]]; then
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    REMOTE_URL=$(git remote get-url origin 2>/dev/null || true)
  fi
fi

if [[ -z "$REMOTE_URL" ]]; then
  echo "ERROR: REMOTE_URL not set and could not auto-detect from 'git remote get-url origin'."
  echo "Set REMOTE_URL env var or run inside a repo with an 'origin' remote."
  exit 1
fi

# Prechecks
command -v git >/dev/null 2>&1 || { echo "git is required"; exit 1; }
if ! git filter-repo --help >/dev/null 2>&1; then
  echo "git-filter-repo is required. On macOS: brew install git-filter-repo"
  exit 1
fi

# Fresh mirror clone workspace
rm -rf "$WORKDIR"
git clone --mirror "$REMOTE_URL" "$WORKDIR"
cd "$WORKDIR"
echo "Mirror cloned at: $(pwd)"

# Optional author rewrites
if [[ "${APPLY_MAILMAP}" == "1" ]]; then
  cat > .mailmap <<'MAP'
# Example mappings — edit as needed and then rerun with APPLY_MAILMAP=1
#New Dev <new.dev@example.com> <old.dev@example.com>
#Saugat Luitel <saugat@example.com> <saugat.old@example.com>
MAP
fi

# Build invert path args
PATH_ARGS=()
PATH_ARGS+=( --path .env )
PATH_ARGS+=( --path .env.local )
PATH_ARGS+=( --path-glob '*.env' )
PATH_ARGS+=( --path-glob '**/.env' )
PATH_ARGS+=( --path-glob '**/.env.*' )
PATH_ARGS+=( --path-glob '**/.vercel/**' )
PATH_ARGS+=( --path-glob 'frontend/dist/**' )
PATH_ARGS+=( --path-glob 'backend/dist/**' )
PATH_ARGS+=( --path-glob '**/coverage/**' )
PATH_ARGS+=( --path-glob '**/.cache/**' )
PATH_ARGS+=( --path-glob '**/.vite/**' )
PATH_ARGS+=( --path-glob '**/.eslintcache' )
PATH_ARGS+=( --path-glob '**/.DS_Store' )
for p in "${EXTRA_PURGE[@]}"; do
  PATH_ARGS+=( --path-glob "$p" )
done

# Run filter-repo
echo "Rewriting history locally in mirror clone..."
if [[ "${APPLY_MAILMAP}" == "1" ]]; then
  git filter-repo --force \
    --invert-paths "${PATH_ARGS[@]}" \
    --mailmap .mailmap \
    --strip-blobs-bigger-than "$STRIP_LARGE_BLOBS"
else
  git filter-repo --force \
    --invert-paths "${PATH_ARGS[@]}" \
    --strip-blobs-bigger-than "$STRIP_LARGE_BLOBS"
fi

# Optional branch rename
if [[ "${RENAME_DEFAULT_BRANCH}" == "1" ]]; then
  if git show-ref --verify --quiet "refs/heads/${OLD_DEFAULT_BRANCH}"; then
    git branch -m "${OLD_DEFAULT_BRANCH}" "${NEW_DEFAULT_BRANCH}"
  fi
  if git show-ref --verify --quiet "refs/heads/${NEW_DEFAULT_BRANCH}"; then
    git symbolic-ref refs/remotes/origin/HEAD "refs/remotes/origin/${NEW_DEFAULT_BRANCH}" || true
  fi
fi

# Verify
echo "Checking for sensitive paths in history (showing first 50 lines only):"
(git log --stat -- '**/.env*' .env .env.local '**/.vercel/**' \
  'frontend/dist/**' 'backend/dist/**' '**/coverage/**' '**/.cache/**' '**/.vite/**' '**/.eslintcache' '**/.DS_Store' \
  'node_modules/**' 'screenshots/**' 'uploads/**' 'assets/raw/**') | head -n 50 || true

echo "Running git fsck:"
(git fsck) || true

# Final prompt
cat <<MSG

Local rewrite complete in mirror: $(pwd)
To push rewritten history, run (when ready):
  git push origin --force --all
  git push origin --force --tags

NOTE: This will rewrite history on the remote. Ensure collaborators reclone.
MSG
