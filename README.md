# Install cargo-prebuilt

[![build-test](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml/badge.svg)](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml)

Installs cargo-prebuilt and the crates you pass to it.

See:

- [cargo-prebuilt](https://github.com/cargo-prebuilt/cargo-prebuilt)
- [cargo-prebuilt-index](https://github.com/cargo-prebuilt/index)

## Compatibility

| Action Versions | Prebuilt Versions | Note                     |
| --------------- | ----------------- | ------------------------ |
| 4.\*.\*         | 0.7.\*            |                          |
| 3.\*.\*         | 0.6.\*            | Deprecated               |
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

See [action.yml](action.yml) for all options.

- ```yaml
  prebuilt-version: 'Version of cargo-prebuilt to use'
    default: latest
  ```

- ```yaml
  prebuilt-target: 'Target for the version of cargo-prebuilt to install'
    default: current
  ```

- ```yaml
  prebuilt-verify: 'Verify downloaded cargo prebuilt'
    options:
      - 'none: Do not verify'
      - 'sha256: Verify using sha256 hash
      (Only for making sure the download is not corrupted)'
      - 'minisign: Verify using minisign (Using rsign2)'
    default: 'sha256'
  ```

- ```yaml
  pkgs: 'A CSV list of prebuilt crates needed with
    optional version numbers (see cargo-prebuilt cli)'
    default: ''
  ```

## Outputs

See [action.yml](action.yml)

- ```yaml
  prebuilt-version: 'Cargo prebuilt version that was installed'
  ```

- ```yaml
  prebuilt-target: 'Cargo prebuilt target that was installed'
  ```

- ```yaml
  out: 'Stdout of cargo-prebuilt if it downloaded any tools'
  ```
