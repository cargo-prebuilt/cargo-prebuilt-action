import { arch, platform } from 'node:process'
import * as core from '../trim/core'
import * as exec from '../trim/exec'
import { TMP_DIR } from '../vals'
import { hashFile } from '../sha256'
import { downloadFile } from '../utils'

const QSTRACT_DL_URL =
  'https://github.com/cargo-prebuilt/qstract/releases/download/v0.2.4/'

export async function installQstract(): Promise<string> {
  let dlFile
  let dlHash

  core.info(`Installing qstract to ${TMP_DIR}`)

  switch (arch) {
    case 'arm':
      if (platform === 'linux') {
        dlFile = 'armv7-unknown-linux-musleabihf'
        dlHash =
          '32402ded7f58241eed6d4828b390cf5e1eb36a76cfdfc309a1e60f4b19451f1a'
      } else core.setFailed('unsupported platform')
      break
    case 'arm64':
      if (platform === 'linux') {
        dlFile = 'aarch64-unknown-linux-musl'
        dlHash =
          '737e5ce7c575f4f67fadca5da700b71c002206b33a417e787b8a97312538b71d'
      } else if (platform === 'darwin') {
        dlFile = 'aarch64-apple-darwin'
        dlHash =
          '98deb3f9e974feeb4cd71d2043994276870076f2f061480eabf74ed1ce57ef03'
      } else if (platform === 'win32') {
        dlFile = 'aarch64-pc-windows-msvc.exe'
        dlHash =
          '9e6a5c049a54282de979094bb3a115ae3a26af764aa6743af17e1084964a1a39'
      } else core.setFailed('unsupported platform')
      break
    case 'x64':
      if (platform === 'linux') {
        dlFile = 'x86_64-unknown-linux-musl'
        dlHash =
          '707502e94f3c06ea2ed926a567f3999f7534e0f6aae4e994b17df657adb48318'
      } else if (platform === 'darwin') {
        dlFile = 'x86_64-apple-darwin'
        dlHash =
          'a3ff3767eb11a0ac54111855b6bbc416921f121ca0e1f4a0ce0c9c97c4c16994'
      } else if (platform === 'win32') {
        dlFile = 'x86_64-pc-windows-msvc.exe'
        dlHash =
          '6badce5c4702ebbe3bcb0e222aeef78ded42639fefbdc83d622adf753a30b359'
      } else if (platform === 'freebsd') {
        dlFile = 'x86_64-unknown-freebsd'
        dlHash =
          'f1ac3af9f0ddb816e8433139621ce4f1fd4f9d312a1ffe6ec7aa93dd396126fc'
      } else core.setFailed('unsupported platform')
      break
    case 's390x':
      if (platform === 'linux') {
        dlFile = 's390x-unknown-linux-gnu'
        dlHash =
          'af5b85c77fcf6a8b6c916f2171e1fbd2f69be8192d8b1cc38d95c71758b1bc73'
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
