# Install cargo-prebuilt

[![build-test](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml/badge.svg)](https://github.com/cargo-prebuilt/cargo-prebuilt-action/actions/workflows/test.yml)

Installs cargo-prebuilt and the crates you pass to it.

See:

- [cargo-prebuilt](https://github.com/cargo-prebuilt/cargo-prebuilt)
- [cargo-prebuilt-index](https://github.com/cargo-prebuilt/index)

## Compatibility

| Action Versions | Prebuilt Versions | Note                     |
|-----------------|-------------------|--------------------------|
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

- ```yaml
  target: 'Target for the version of the tools to install'
    default: prebuilt-target (current)
  ```

- ```yaml
  index-key: 'Index to use from the config file. 
    Requires ci to be set to false if using'
    default: ''
  ```

- ```yaml
  index: 'Index to use to install tools from'
    default: prebuilt default ('gh-pub:github.com/cargo-prebuilt/index')
  ```

- ```yaml
  auth: 'Auth token for index if needed'
    default: ''
  ```

- ```yaml
  config: 'Path to config file to use. Requires ci to be set to false if using'
    default: ''
  ```

- ```yaml
  path: 'Path where prebuilt crates are installed'
    default: let cargo-prebuilt decide ($HOME/.cargo/bin)
  ```

- ```yaml
  report-path: 'Path where reports are installed'
    default: disable ci flag to use this
  ```

- ```yaml
  ci: 'Use the --ci flag'
    default: true
  ```

- ```yaml
  sig: 'A public verifying key encoded as base64'
    default: ''
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
  out: 'Print out events'
    default: true
  ```

- ```yaml
  color: 'Enable or disable color'
    default: let cargo-prebuilt decide
  ```

## Outputs

- ```yaml
  prebuilt-version: 'Cargo prebuilt version that was installed'
  ```

- ```yaml
  prebuilt-target: 'Cargo prebuilt target that was installed'
  ```

- ```yaml
  out : 'Stdout of cargo-prebuilt if it downloaded any tools'
  ```
