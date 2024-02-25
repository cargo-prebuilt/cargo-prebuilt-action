import * as core from '../trim/core'
import * as exec from '../trim/exec'
import { TMP_DIR } from '../vals'
import { hashFile } from '../sha256'
import fs from 'node:fs'
import { arch, platform } from 'node:process'
import { finished } from 'node:stream/promises'
import { Readable } from 'node:stream'

const QSTRACT_DL_URL =
  'https://github.com/cargo-prebuilt/qstract/releases/download/v0.1.1/'

export async function installQstract(): Promise<string> {
  let dlFile
  let dlHash

  core.info(`Installing qstract to ${TMP_DIR}`)

  switch (arch) {
    case 'arm':
      if (platform === 'linux') {
        dlFile = 'armv7-unknown-linux-musleabihf'
        dlHash =
          '3d5cf7aa92e9d522639ce5c5dc5820e28d3c1c503119eb68f11be31e6f820dee'
      } else core.setFailed('unsupported platform')
      break
    case 'arm64':
      if (platform === 'linux') {
        dlFile = 'aarch64-unknown-linux-musl'
        dlHash =
          'f877fa5f76274425611fe326d647cde2d055a67a36818146dfcf16d12271d4ab'
      } else if (platform === 'darwin') {
        dlFile = 'aarch64-apple-darwin'
        dlHash =
          '0700b6305098eedab4b17b0ce72d89d1cd9f1b999485784acfe86dd0cabff7d0'
      } else if (platform === 'win32') {
        dlFile = 'aarch64-pc-windows-msvc.exe'
        dlHash =
          '91ad82e48f0a675bf819d8915fa4aaf0e4869a035bc1b9fb7543bd47d7e93323'
      } else core.setFailed('unsupported platform')
      break
    case 'x64':
      if (platform === 'linux') {
        dlFile = 'x86_64-unknown-linux-musl'
        dlHash =
          'cacdaad15b7f804483c0646fdd80b34b3744827a812146e454e8b74445040551'
      } else if (platform === 'darwin') {
        dlFile = 'x86_64-apple-darwin'
        dlHash =
          '324aa56cb0d714892d15a074109240b280394c6efd115c941300878af9a42b7c'
      } else if (platform === 'win32') {
        dlFile = 'x86_64-pc-windows-msvc.exe'
        dlHash =
          '2d316e448f25c9f23f1945b0ef2d8d1fd7d98ddd2dc727557a5b6e348ab16c94'
      } else if (platform === 'freebsd') {
        dlFile = 'x86_64-unknown-freebsd'
        dlHash =
          '83218dd8957867c084cf68a054cc0a29464e3f0070ebf6aac750c4c2641307f0'
      } else core.setFailed('unsupported platform')
      break
    case 's390x':
      if (platform === 'linux') {
        dlFile = 's390x-unknown-linux-gnu'
        dlHash =
          '7071438b8fd23c27a44a8d262580f638abab459c7218b5b87cd40e3c14c9710'
      } else core.setFailed('unsupported platform')
      break
  }

  if (!dlFile) core.setFailed('unsupported or missing platform (qstract)')

  let binPath = `${TMP_DIR}/qstract`
  if (platform === 'win32') binPath += '.exe'

  core.debug(
    `qstract: \ndlFile ${dlFile}\ndlHash ${dlHash}\nbinPath ${binPath}`
  )

  const res = await fetch(`${QSTRACT_DL_URL}qstract-${dlFile}`)
  if (res.status === 200) {
    const stream = fs.createWriteStream(binPath, { flags: 'w' })
    // @ts-expect-error body stream should not be null
    await finished(Readable.fromWeb(res.body).pipe(stream))
  } else core.setFailed('Could not download qstract')
  core.debug('Finished download of qstract')

  // Check hash
  const hash = await hashFile(binPath)
  if (hash !== dlHash) core.setFailed('sha256 hash does not match for qstract')
  core.debug('Hash matched for qstract')

  if (!binPath.endsWith('.exe')) {
    exec.execGetOutput(`chmod +x ${binPath}`)
    core.debug('Detected unix, trying to set exe bit with chmod')
  }

  // Test run
  exec.execFile(binPath, ['--version'])

  core.info('Installed qstract')

  return binPath
}
