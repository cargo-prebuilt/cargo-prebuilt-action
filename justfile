pwd := `pwd`

default:
    just -l

all:
    pnpm run all

default_log_level := 'INFO'
sup-lint LOG_LEVEL=default_log_level:
    docker run \
    -t --rm --pull=always \
    --platform=linux/amd64 \
    -e LOG_LEVEL={{LOG_LEVEL}} \
    -e RUN_LOCAL=true \
    -e SHELL=/bin/bash \
    -e DEFAULT_BRANCH=main \
    -e LINTER_RULES_PATH=/tmp/lint \
    -e VALIDATE_ALL_CODEBASE=true \
    -e VALIDATE_JAVASCRIPT_ES=false \
    -e VALIDATE_JSCPD=false \
    -e VALIDATE_TYPESCRIPT_ES=false \
    -e VALIDATE_JSON=false \
    -e VALIDATE_BIOME_FORMAT=false \
    -e VALIDATE_BIOME_LINT=false \
    -v ./:/tmp/lint \
    ghcr.io/super-linter/super-linter:slim-latest
