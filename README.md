# Install cargo-prebuilt

[![build-test](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml/badge.svg)](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml)

Installs cargo-prebuilt and the crates you pass to it.

See:

- [cargo-prebuilt](https://github.com/cargo-prebuilt/cargo-prebuilt)
- [cargo-prebuilt-index](https://github.com/cargo-prebuilt/index)

## Compatibility

| Action Versions | Prebuilt Versions | Note                     |
|-----------------|-------------------|--------------------------|
| 4.\*.\*         | 0.7.\*            |                          |
| 3.\*.\*         | 0.6.\*            |                          |
| < 3             | < 6               | Deprecated and untracked |

## Usage

```yaml
name: Install
on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install cargo-prebuilt
        uses: cargo-prebuilt/cargo-prebuilt-action@v3
        with:
          pkgs: just,rtx-cli@1.34.1
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
      - uses: actions/checkout@v4
      - name: Install cargo-prebuilt
        uses: cargo-prebuilt/cargo-prebuilt-action@v3
        with:
          pkgs: cargo-deny
      - run: cargo prebuilt just
```

```yaml
name: Install for aarch64-apple-darwin
on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install cargo-prebuilt
        uses: cargo-prebuilt/cargo-prebuilt-action@v3
        with:
          prebuilt-version: 0.6.0
          prebuilt-target: aarch64-apple-darwin
```

## Inputs

See [action.yml](action.yml)

## Outputs

See [action.yml](action.yml)
