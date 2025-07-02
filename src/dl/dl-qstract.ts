import { arch, platform } from 'node:process'
import * as core from '../trim/core.js'
import * as exec from '../trim/exec.js'
import { TMP_DIR } from '../vals.js'
import { hashFile } from '../sha256.js'
import { downloadFile } from '../utils.js'

const QSTRACT_DL_URL =
  'https://github.com/cargo-prebuilt/qstract/releases/download/v0.2.8/'

export async function installQstract(): Promise<string> {
  let dlFile
  let dlHash

  core.info(`Installing qstract to ${TMP_DIR}`)

  switch (arch) {
    case 'arm':
      if (platform === 'linux') {
        dlFile = 'armv7-unknown-linux-musleabihf'
        dlHash =
          '8696095e880152242ce14aefc1ce1b4b67a11cc75e062dacc8596b7465eaf0a1'
      } else core.setFailed('unsupported platform')
      break
    case 'arm64':
      if (platform === 'linux') {
        dlFile = 'aarch64-unknown-linux-musl'
        dlHash =
          'd3870a102fbe50301d7fdf685ceb8e7b679c3b1afc92653bedb9137389e354c1'
      } else if (platform === 'darwin') {
        dlFile = 'aarch64-apple-darwin'
        dlHash =
          '8ce9e27d38da5ec3797f48708e2fc99982302f6c3ff52b3b0818287914365a50'
      } else if (platform === 'win32') {
        dlFile = 'aarch64-pc-windows-msvc.exe'
        dlHash =
          '07bd05f3c70296f3076bc34dbb4d1da1a35ee1253a299525baab8eefe9a20e66'
      } else core.setFailed('unsupported platform')
      break
    case 'x64':
      if (platform === 'linux') {
        dlFile = 'x86_64-unknown-linux-musl'
        dlHash =
          '315cc94e280473ef849146dd15d9459be078a59d3612e52a4015d97f64b52eac'
      } else if (platform === 'darwin') {
        dlFile = 'x86_64-apple-darwin'
        dlHash =
          'b190c6ed4b88e0f6bcd9d274389c120d80a85b70660584595af572b106623c42'
      } else if (platform === 'win32') {
        dlFile = 'x86_64-pc-windows-msvc.exe'
        dlHash =
          'fe98cadc7f185eb8fb9bf651e9423b74eddf6cf6c8beb0085de4ca25b2c42b27'
      } else if (platform === 'freebsd') {
        dlFile = 'x86_64-unknown-freebsd'
        dlHash =
          '348b108302d24d79677186a34c363997b49b957e4a88e5da34c8699b44fe8d20'
      } else core.setFailed('unsupported platform')
      break
    case 'riscv64':
      if (platform === 'linux') {
        dlFile = 'riscv64gc-unknown-linux-musl'
        dlHash =
          'aa9a71164a2c6c12e7876b2fab4b9d00912981866dd2097243724c2c97779b9c'
      } else core.setFailed('unsupported platform')
      break
    case 's390x':
      if (platform === 'linux') {
        dlFile = 's390x-unknown-linux-gnu'
        dlHash =
          '2d94c0de4a89fbe18cd531bbd95de7ec89f086edbd2fc81f2ccbfa58df5439ca'
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
