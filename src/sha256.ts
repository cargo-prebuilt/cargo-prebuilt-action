import * as httpm from '@actions/http-client'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {DL_URL} from './vals'

export async function verifyFileHash(
  version: string,
  filePath: string
): Promise<void> {
  return new Promise(async resolve => {
    const client = new httpm.HttpClient('sha256 downloader')
    const res = await client.get(`${DL_URL}${version}/hashes.sha256`)
    const sha256File = await res.readBody()

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
