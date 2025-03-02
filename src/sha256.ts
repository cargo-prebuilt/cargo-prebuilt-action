import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { DL_URL } from './vals'

export async function verifyFileHash(
  version: string,
  filePath: string
): Promise<void> {
  const res = await fetch(`${DL_URL}${version}/hashes.sha256`)
  const sha256File = (await res.text()).trim()

  const fileHash = await hashFile(filePath)

  // This is probably fine, but maybe this should be change later
  if (!sha256File.includes(fileHash))
    throw new Error('sha256 hash does not match')
}

// TODO: Use sha256 from qstract?
export async function hashFile(filePath: string): Promise<string> {
  return new Promise(resolve => {
    const fd = readFileSync(filePath)
    const hash = createHash('sha256').update(fd).digest('hex')
    resolve(hash)
  })
}
