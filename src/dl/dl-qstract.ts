import { arch, platform } from 'node:process'
import * as core from '../trim/core'
import * as exec from '../trim/exec'
import { TMP_DIR } from '../vals'
import { hashFile } from '../sha256'
import { downloadFile } from '../utils'

const QSTRACT_DL_URL =
  'https://github.com/cargo-prebuilt/qstract/releases/download/v0.2.2/'

export async function installQstract(): Promise<string> {
  let dlFile
  let dlHash

  core.info(`Installing qstract to ${TMP_DIR}`)

  switch (arch) {
    case 'arm':
      if (platform === 'linux') {
        dlFile = 'armv7-unknown-linux-musleabihf'
        dlHash =
          'cf5873c7f1ab8bb290461be9bf5cf228fd6514d6935c58d2d2371807f9db2b4b'
      } else core.setFailed('unsupported platform')
      break
    case 'arm64':
      if (platform === 'linux') {
        dlFile = 'aarch64-unknown-linux-musl'
        dlHash =
          'ed70461b244ddb70f404e977d80953064894e58eaf765d6e7a427e5ea6825558'
      } else if (platform === 'darwin') {
        dlFile = 'aarch64-apple-darwin'
        dlHash =
          'd25739ab9e422ddc27d3fabd5d15fc559ad5e1dd2733247871c94d3283a9df0d'
      } else if (platform === 'win32') {
        dlFile = 'aarch64-pc-windows-msvc.exe'
        dlHash =
          '9aca16d7573a399fa76f07fc8ecebc041974835d58411139261cbb8e06b983bf'
      } else core.setFailed('unsupported platform')
      break
    case 'x64':
      if (platform === 'linux') {
        dlFile = 'x86_64-unknown-linux-musl'
        dlHash =
          '7ed02b0f0fa3a0a9fe736c770344570e010a76a5d87fa79445703a7962810975'
      } else if (platform === 'darwin') {
        dlFile = 'x86_64-apple-darwin'
        dlHash =
          'c98544c1416a82320615e8db78babaae2e117b66fff052e40230e32379a2be03'
      } else if (platform === 'win32') {
        dlFile = 'x86_64-pc-windows-msvc.exe'
        dlHash =
          'd358098f4f7a26014c45ae568ef65a2abc422ea09d1fe80143f3bcdda22e090f'
      } else if (platform === 'freebsd') {
        dlFile = 'x86_64-unknown-freebsd'
        dlHash =
          '51b5bfe2ab4fdbfe05c563af6c21cf59ec437f9c1a409f115a3f086edaaf12a9'
      } else core.setFailed('unsupported platform')
      break
    case 's390x':
      if (platform === 'linux') {
        dlFile = 's390x-unknown-linux-gnu'
        dlHash =
          '7298ee90656b7024e8ef893b1cb952dfa52b9acfb4a6ad67cb8ff163d2cfcbde'
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
