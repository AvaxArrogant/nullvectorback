#!/bin/sh
set -e

mkdir -p "${PULSESHIELD_DATA_DIR:-/data/pulseshield}"
chown -R nextjs:nodejs "${PULSESHIELD_DATA_DIR:-/data/pulseshield}"

exec su-exec nextjs:nodejs "$@"
