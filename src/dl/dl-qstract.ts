import { arch, platform } from 'node:process'
import * as core from '../trim/core'
import * as exec from '../trim/exec'
import { TMP_DIR } from '../vals'
import { hashFile } from '../sha256'
import { downloadFile } from '../utils'

const QSTRACT_DL_URL =
  'https://github.com/cargo-prebuilt/qstract/releases/download/v0.2.7/'

export async function installQstract(): Promise<string> {
  let dlFile
  let dlHash

  core.info(`Installing qstract to ${TMP_DIR}`)

  switch (arch) {
    case 'arm':
      if (platform === 'linux') {
        dlFile = 'armv7-unknown-linux-musleabihf'
        dlHash =
          '78445544d6594c784218c7ee697c05d6c89ac0c3968110bb6c596930f7bbb0e3'
      } else core.setFailed('unsupported platform')
      break
    case 'arm64':
      if (platform === 'linux') {
        dlFile = 'aarch64-unknown-linux-musl'
        dlHash =
          '2f0dd680ab0a3d5a1b0540b597bbc03ba56137dd90e78b223e44c79c5ef51646'
      } else if (platform === 'darwin') {
        dlFile = 'aarch64-apple-darwin'
        dlHash =
          '5db19a7f1b2756aac83737a8fc8257a5cfd0e365f4a3b4346d1abda7db5d5fa7'
      } else if (platform === 'win32') {
        dlFile = 'aarch64-pc-windows-msvc.exe'
        dlHash =
          'afc42a5a9db07460f6eedd81505185fb28970d33363166e81f6eae2058316cc5'
      } else core.setFailed('unsupported platform')
      break
    case 'x64':
      if (platform === 'linux') {
        dlFile = 'x86_64-unknown-linux-musl'
        dlHash =
          '9735286f26b844fe404f0637f05a2940294c49d3b7000a8062e7ff5add24a92a'
      } else if (platform === 'darwin') {
        dlFile = 'x86_64-apple-darwin'
        dlHash =
          '24dffda26597a5660bbd0fe9b4684bb2eec5872d971d96975ab705808f619a84'
      } else if (platform === 'win32') {
        dlFile = 'x86_64-pc-windows-msvc.exe'
        dlHash =
          'f24ebe890b9b3ad8443df9c9ebd4df34c4e90bbb09b6d64f874ef6eecec12813'
      } else if (platform === 'freebsd') {
        dlFile = 'x86_64-unknown-freebsd'
        dlHash =
          '3b8297655f12ff6e8042b6b00a4a8d4566a77e17c76f2dca3cacd2d7a718a47c'
      } else core.setFailed('unsupported platform')
      break
    case 's390x':
      if (platform === 'linux') {
        dlFile = 's390x-unknown-linux-gnu'
        dlHash =
          '34b837adb8de3ded0946ef6e166eb2908c6a78f614ef7c6e99551be5f842b2c7'
      } else core.setFailed('unsupported platform')
      break
  }

  if (!dlFile) core.setFailed('unsupported or missing platform (qstract)')

  let binPath = `${TMP_DIR}/qstract`
  if (platform === 'win32') binPath += '.exe'

  core.debug(
    `qstract: \n    dlFile ${dlFile}\n    dlHash ${dlHash}\n    binPath ${binPath}`
  )

  await downloadFile(`${QSTRACT_DL_URL}qstract-${dlFile}`, binPath)

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
