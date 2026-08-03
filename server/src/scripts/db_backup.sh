#!/bin/bash
set -euo pipefail

# Config
source /home/ubuntu/task-flow/.env

DB_CONTAINER="db"
DB_NAME="tasks"
DB_USER="task-manager-db"
BACKUP_DIR="/backups/db"
S3_BUCKET="s3://task-flows/db"
RETENTION_DAYS=1
LOG_FILE="/var/log/db_backup.log"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.dump"

# Helpers
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"; }

alert() {
  curl -s --request POST \
    --url https://api.resend.com/emails \
    --header "Authorization: Bearer $RESEND_API_KEY" \
    --header "Content-Type: application/json" \
    --data "{
      \"from\": \"backups@task-flows.tech\",
      \"to\": \"teszael14@gmail.com\",
      \"subject\": \"[BACKUP FAILED] $DB_NAME\",
      \"text\": \"$1\"
    }"
}

# Pre-checks
mkdir -p "$BACKUP_DIR"
log "Starting backup: $DB_NAME"

# Backup
if ! docker exec -e PGPASSWORD="$DB_PASSWORD" "$DB_CONTAINER" \
  pg_dump -U "$DB_USER" -F c -d "$DB_NAME" > "$BACKUP_FILE"; then
  log "ERROR: pg_dump failed"
  alert "pg_dump failed for $DB_NAME on $(hostname)"
  exit 1
fi

# Compress
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Verify backup is not empty
if [ ! -s "$BACKUP_FILE" ]; then
  log "ERROR: Backup file is empty"
  alert "Backup file empty for $DB_NAME"
  exit 1
fi

log "Backup created: $BACKUP_FILE ($(du -sh "$BACKUP_FILE" | cut -f1))"

# Ship offsite to S3
if ! aws s3 cp "$BACKUP_FILE" "$S3_BUCKET/$(basename "$BACKUP_FILE")"; then
  log "ERROR: S3 upload failed"
  alert "S3 upload failed for $DB_NAME"
  exit 1
fi
log "Uploaded to S3"

# Rotate old local backups
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
log "Rotated backups oldear than $RETENTION_DAYS days"

log "Backup completed successfully"