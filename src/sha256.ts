import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {DL_URL} from './vals'

export async function verifyFileHash(
  version: string,
  filePath: string
): Promise<void> {
  return new Promise(async resolve => {
    const sha256File = await (
      await fetch(`${DL_URL}${version}/hashes.sha256`)
    ).text()
    const fileHash = await hashFile(filePath)

    // This is probably fine, but maybe this should be change later
    if (!sha256File.includes(fileHash))
      throw new Error('sha256 hash does not match')

    resolve()
  })
}

export async function hashFile(filePath: string): Promise<string> {
  return new Promise(resolve => {
    const fd = readFileSync(filePath)
    const hash = createHash('sha256').update(fd).digest('hex')
    resolve(hash)
  })
}
