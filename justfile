default:
    just -l

pwd := `pwd`

default_log_level := 'INFO'
runner := 'docker'
sup-lint LOG_LEVEL=default_log_level:
    {{runner}} run \
    -t --rm --pull=always \
    --platform=linux/amd64 \
    -e LOG_LEVEL={{LOG_LEVEL}} \
    -e RUN_LOCAL=true \
    -e SHELL=/bin/bash \
    -e DEFAULT_BRANCH=main \
    -e VALIDATE_ALL_CODEBASE=true \
    -e TYPESCRIPT_DEFAULT_STYLE=prettier \
    -e VALIDATE_JAVASCRIPT_STANDARD=false \
    -e VALIDATE_TYPESCRIPT_STANDARD=false \
    -e VALIDATE_JSCPD=false \
    -v ./:/tmp/lint \
    ghcr.io/super-linter/super-linter:slim-v6
