import { arch, platform } from 'node:process'
import fs from 'node:fs'
import { finished } from 'node:stream/promises'
import { Readable } from 'node:stream'
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

export async function downloadFile(url: string, path: string): Promise<void> {
  if (!(await downloadFileWithErr(url, path)))
    core.setFailed(`Could not download ${url}`)
}

export async function downloadFileWithErr(
  url: string,
  path: string
): Promise<boolean> {
  core.debug(`Started download of ${url} to ${path}`)
  const res = await fetch(url)
  if (res.status === 200) {
    const stream = fs.createWriteStream(path, { flags: 'w' })
    // @ts-expect-error body stream should not be null
    await finished(Readable.fromWeb(res.body).pipe(stream))
    core.debug(`Finished download of ${url} to ${path}`)
    return true
  }

  core.debug(`Could not download ${url}`)
  return false
}
