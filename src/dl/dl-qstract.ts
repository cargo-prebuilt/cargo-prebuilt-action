import { arch, platform } from 'node:process'
import * as core from '../trim/core'
import * as exec from '../trim/exec'
import { TMP_DIR } from '../vals'
import { hashFile } from '../sha256'
import { downloadFile } from '../utils'

const QSTRACT_DL_URL =
  'https://github.com/cargo-prebuilt/qstract/releases/download/v0.2.1/'

export async function installQstract(): Promise<string> {
  let dlFile
  let dlHash

  core.info(`Installing qstract to ${TMP_DIR}`)

  switch (arch) {
    case 'arm':
      if (platform === 'linux') {
        dlFile = 'armv7-unknown-linux-musleabihf'
        dlHash =
          'c753d53de1c545e2d2ab200d0039030ee87227f664cd467e43d9164dfe988351'
      } else core.setFailed('unsupported platform')
      break
    case 'arm64':
      if (platform === 'linux') {
        dlFile = 'aarch64-unknown-linux-musl'
        dlHash =
          '02daab626235b83e3f4d10a7b9f8c23f2ed9064ebdd8a2c37df8fc44d2e49489'
      } else if (platform === 'darwin') {
        dlFile = 'aarch64-apple-darwin'
        dlHash =
          'e74fb3c7ac9022a4cbebed8e6e2f7a2f33f702f254149ec65d8f86bc85e393bf'
      } else if (platform === 'win32') {
        dlFile = 'aarch64-pc-windows-msvc.exe'
        dlHash =
          'e58d9486c9e79e104d4fb0f24005c11ee63f48607802ba92f61891e44fe345f6'
      } else core.setFailed('unsupported platform')
      break
    case 'x64':
      if (platform === 'linux') {
        dlFile = 'x86_64-unknown-linux-musl'
        dlHash =
          'd84ce8b6232184c63abc416142c6461deaf086ee0b0cb499bc8cd6e895ea151c'
      } else if (platform === 'darwin') {
        dlFile = 'x86_64-apple-darwin'
        dlHash =
          '99340796fd1bdd291d6baf517a97f27cb0032ddb2f8891637c3aa406d0ca16de'
      } else if (platform === 'win32') {
        dlFile = 'x86_64-pc-windows-msvc.exe'
        dlHash =
          'f7dd87b512b164b7c37375d1acb27b8cc868f72d10d9952414c42c80040e5d6f'
      } else if (platform === 'freebsd') {
        dlFile = 'x86_64-unknown-freebsd'
        dlHash =
          '444834d9c3084b4761d58934f59feef9905ef660e7ee9cf411b0f33556ae346c'
      } else core.setFailed('unsupported platform')
      break
    case 's390x':
      if (platform === 'linux') {
        dlFile = 's390x-unknown-linux-gnu'
        dlHash =
          'f925013bec975df407d293a6eb30d641568c393a226707ec87c80d5f3d045893'
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
