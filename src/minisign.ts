import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'
import * as core from './trim/core'
import * as exec from './trim/exec'
import { DL_URL, PREBUILT_INDEX_PUB_KEY } from './vals'
import { installRsign2 } from './dl/dl-rsign2'

export async function verifyFileMinisign(
  version: string,
  fileName: string,
  filePath: string
): Promise<void> {
  const rsign2 = await installRsign2()

  const archivePath = path.dirname(filePath)
  const minisignFilePath = `${archivePath}/${fileName}.minisig`

  core.debug('Downloading minisig')
  const res = await fetch(`${DL_URL}${version}/${fileName}.minisig`)
  if (res.status === 200) {
    const stream = fs.createWriteStream(minisignFilePath, { flags: 'w' })
    // @ts-expect-error body stream should not be null
    await finished(Readable.fromWeb(res.body).pipe(stream))
  } else core.setFailed('Could not download minisig')
  core.debug('Downloaded minisig')

  exec.execFile(rsign2, [
    'verify',
    `${filePath}`,
    '-P',
    `${PREBUILT_INDEX_PUB_KEY}`,
    '-x',
    `${minisignFilePath}`
  ])
}
