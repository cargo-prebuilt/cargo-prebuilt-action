# Install cargo-prebuilt

[![build-test](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml/badge.svg)](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml)

Installs cargo-prebuilt and the crates you pass to it.

See:
- [cargo-prebuilt](https://github.com/cargo-prebuilt/cargo-prebuilt)
- [cargo-prebuilt-index](https://github.com/cargo-prebuilt/index)

### Inputs

- version: Defaults to latest
- target: Defaults to current
- tools: Defaults to ''
- tools-target: Defaults to current
- tools-index: Defaults to ''
- tools-auth: Defaults to ''
- tools-path: Defaults to ''
- tools-ci: Defaults to true

### Outputs

- version: version of cargo-prebuilt installed
- target: target of cargo-prebuilt installed

### Usage

```yaml
name: Install
on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install cargo-prebuilt
        uses: cargo-prebuilt/cargo-prebuilt-action@v1
        with:
          tools: just,rtx-cli@1.22.5
```
or
```yaml
name: Install
on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install cargo-prebuilt
        uses: cargo-prebuilt/cargo-prebuilt-action@v1
      - run: cargo prebuilt just
```

```yaml
name: Install 0.3.0 for aarch64-apple-darwin
on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install cargo-prebuilt
        uses: cargo-prebuilt/cargo-prebuilt-action@v1
        with:
          version: 0.5.1
          target: aarch64-apple-darwin
```
