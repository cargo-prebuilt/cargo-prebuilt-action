import { arch, platform } from 'node:process'
import * as core from './trim/core'

export function currentTarget(): string {
  switch (arch) {
    case 'arm':
      if (platform === 'linux') return 'armv7-unknown-linux-gnueabihf'
      else core.setFailed('unsupported platform')
      break
    case 'arm64':
      if (platform === 'linux') return 'aarch64-unknown-linux-gnu'
      else if (platform === 'darwin') return 'aarch64-apple-darwin'
      else core.setFailed('unsupported platform')
      break
    case 'riscv64':
      if (platform === 'linux') return 'riscv64gc-unknown-linux-gnu'
      else core.setFailed('unsupported platform')
      break
    case 's390x':
      if (platform === 'linux') return 's390x-unknown-linux-gnu'
      else core.setFailed('unsupported platform')
      break
    case 'x64':
      if (platform === 'linux') return 'x86_64-unknown-linux-gnu'
      else if (platform === 'darwin') return 'x86_64-apple-darwin'
      else if (platform === 'win32') return 'x86_64-pc-windows-msvc'
      else if (platform === 'freebsd') return 'x86_64-unknown-freebsd'
      else core.setFailed('unsupported platform')
      break
  }

  core.setFailed('unsupported or missing platform')
  return 'NULL'
}
