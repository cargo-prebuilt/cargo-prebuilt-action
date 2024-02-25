import path from 'node:path'
import * as exec from './trim/exec'
import { DL_URL, PREBUILT_INDEX_PUB_KEY } from './vals'
import { installRsign2 } from './dl/dl-rsign2'
import { downloadFile } from './utils'

export async function verifyFileMinisign(
  version: string,
  fileName: string,
  filePath: string
): Promise<void> {
  const rsign2 = await installRsign2()

  const archivePath = path.dirname(filePath)
  const minisignFilePath = `${archivePath}/${fileName}.minisig`

  await downloadFile(
    `${DL_URL}${version}/${fileName}.minisig`,
    minisignFilePath
  )

  exec.execFile(rsign2, [
    'verify',
    `${filePath}`,
    '-P',
    `${PREBUILT_INDEX_PUB_KEY}`,
    '-x',
    `${minisignFilePath}`
  ])
}
