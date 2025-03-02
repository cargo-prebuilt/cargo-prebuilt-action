import { arch, platform } from 'node:process'
import * as core from '../trim/core'
import * as exec from '../trim/exec'
import { TMP_DIR } from '../vals'
import { hashFile } from '../sha256'
import { downloadFile } from '../utils'

const RSIGN_DL_URL =
  'https://github.com/cargo-prebuilt/index/releases/download/rsign2-0.6.4/'

export async function installRsign2(qstract: string): Promise<string> {
  let dlFile
  let dlHash

  core.info(`Installing rsign2 to ${TMP_DIR}`)

  switch (arch) {
    case 'arm':
      if (platform === 'linux') {
        dlFile = 'armv7-unknown-linux-musleabihf'
        dlHash =
          '77e5bd64bd2d60c0127adeeb0e2a8dd5a69fd9f6c61ec53706774c7df3d04b6f'
      } else core.setFailed('unsupported platform')
      break
    case 'arm64':
      if (platform === 'linux') {
        dlFile = 'aarch64-unknown-linux-musl'
        dlHash =
          '5be366398760c0a908f197581c3c1b378e08b2dfc40d86acafa60cc5218ea52c'
      } else if (platform === 'darwin') {
        dlFile = 'aarch64-apple-darwin'
        dlHash =
          '946a35aa2bcff08b1e14b9834224d947e4719ffaf09a87c548b479f002a01454'
      } else if (platform === 'win32') {
        dlFile = 'aarch64-pc-windows-msvc'
        dlHash =
          '05acb9a14e6c81cc7ff4d82d4cd2213c1424a2a7f41479c13080725f52e9d4c7'
      } else core.setFailed('unsupported platform')
      break
    case 'x64':
      if (platform === 'linux') {
        dlFile = 'x86_64-unknown-linux-musl'
        dlHash =
          '5c7c17e5f65d740e80fd3bf187701a90dbde1829521c77aaca30c06c24fbca92'
      } else if (platform === 'darwin') {
        dlFile = 'x86_64-apple-darwin'
        dlHash =
          'ac85d87369576b5be0d381bb47c702028e1750dfaa1d81c698743a98ebdfb72a'
      } else if (platform === 'win32') {
        dlFile = 'x86_64-pc-windows-msvc'
        dlHash =
          'b39ab2cc69476b3cb7a4ce22f2f2aaf3ae2f3dae343a7396d0f73ab27ab9c76d'
      } else if (platform === 'freebsd') {
        dlFile = 'x86_64-unknown-freebsd'
        dlHash =
          '26dec3708735ff35c0b5a295a75893f0238a531d34f483ba279ca26f43496c72'
      } else core.setFailed('unsupported platform')
      break
    case 's390x':
      if (platform === 'linux') {
        dlFile = 's390x-unknown-linux-gnu'
        dlHash =
          '548ba02e63894975488388dc0edc057a0dea8177d2f7852a4ae92205b7341b0b'
      } else core.setFailed('unsupported platform')
      break
  }

  if (!dlFile) core.setFailed('unsupported or missing platform (rsign2)')

  const tarPath = `${TMP_DIR}/rsign.tar.gz`

  core.debug(
    `rsign2: \n    dlFile ${dlFile}\n    dlHash ${dlHash}\n    binPath ${tarPath}`
  )

  await downloadFile(`${RSIGN_DL_URL}${dlFile}.tar.gz`, tarPath)

  // Check tar hash
  const hash = await hashFile(tarPath)
  if (hash !== dlHash) core.setFailed('sha256 hash does not match for rsign2')
  core.debug('Hash matched for rsign')

  // Extract
  core.debug('Extracting rsign')
  exec.execFile(qstract, ['-z', '-C', `${TMP_DIR}`, tarPath])

  let toolPath
  if (platform === 'win32') toolPath = `${TMP_DIR}/rsign.exe`
  else toolPath = `${TMP_DIR}/rsign`

  core.debug(`Tool path rsign ${toolPath}`)

  // Check if rsign works
  exec.execFile(toolPath, ['--version'])

  core.info('Installed rsign2')

  return toolPath
}
