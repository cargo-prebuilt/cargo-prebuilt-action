# Install cargo-prebuilt

[![build-test](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml/badge.svg)](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml)

Installs cargo-prebuilt and the crates you pass to it.

See:
- [cargo-prebuilt](https://github.com/cargo-prebuilt/cargo-prebuilt)
- [cargo-prebuilt-index](https://github.com/cargo-prebuilt/index)

### Inputs

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
      - 'sha256: Verify using sha256 hash' # TODO
      - 'minisign: Verify using minisign (Requires it to be installed and on the PATH)' # TOSO
    default: 'none'
  ```
- ```yaml
  pkgs: 'A CSV list of prebuilt crates needed with optional version numbers (see cargo-prebuilt cli)'
    default: 'none'
  ```
- ```yaml
  target: 'Target for the version of the tools to install'
    default: 'prebuilt-target'
  ```
- ```yaml
  index: 'Index to use to install tools from'
    default: 'cargo-prebuilt/index'
  ```
- ```yaml
  auth: 'Auth token for index if needed'
    default: 'none'
  ```
- ```yaml
  path: 'Path where prebuilt crates are installed'
    default: 'let cargo-prebuilt decide'
  ```
- ```yaml
  report-path: 'Path where reports are installed'
    default: 'none, disable ci flag to use this'
  ```
- ```yaml
  ci: 'Use the --ci flag (On by default)'
    default: true
  ```
- ```yaml
  sig: 'A public verifying key encoded as base64'
    default: 'none, requires index'
  ```
- ```yaml
  no-verify: 'Do not verify downloaded files'
    default: false
  ```
- ```yaml
  safe: 'Do not overwrite existing files'
    default: false
  ```
- ```yaml
  color: 'Enable or disable color'
    default: 'let cargo-prebuilt decide'
  ```

### Outputs

- ```yaml
  prebuilt-version: 'Cargo prebuilt version that was installed'
  ```
- ```yaml
  prebuilt-target: 'Cargo prebuilt target that was installed'
  ```
- ```yaml
  out : 'Stdout of cargo-prebuilt if it downloaded any tools'
  ```

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
        uses: cargo-prebuilt/cargo-prebuilt-action@v2
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
      - uses: actions/checkout@v3
      - name: Install cargo-prebuilt
        uses: cargo-prebuilt/cargo-prebuilt-action@v2
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
      - uses: actions/checkout@v3
      - name: Install cargo-prebuilt
        uses: cargo-prebuilt/cargo-prebuilt-action@v2
        with:
          prebuilt-version: 0.5.3 # Legacy version, may not work with v2 action
          prebuilt-target: aarch64-apple-darwin
```
