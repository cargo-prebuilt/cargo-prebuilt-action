import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as httpm from '@actions/http-client'
import {arch, platform} from 'node:process'
import {hashFile} from './sha256'
import {DL_URL} from './vals'
import path from 'node:path'
import {writeFileSync} from 'node:fs'

const DL =
  'https://github.com/cargo-prebuilt/index/releases/download/rsign2-0.6.3/'
const PUB_KEY = 'RWTSqAR1Hbfu6mBFiaz4hb9I9gikhMmvKkVbyz4SJF/oxJcbbScmCqqO'

export async function verifyFileMinisign(
  version: string,
  fileName: string,
  filePath: string
): Promise<void> {
  return new Promise(async resolve => {
    const rsign2 = await installRsign2()

    const archivePath = path.dirname(filePath)
    const client = new httpm.HttpClient('minisign downloader')
    const res = await client.get(`${DL_URL}${version}/${fileName}.minisig`)
    const minisignFile = await res.readBody()

    const minisignFilePath = `${archivePath}/${fileName}.minisig`
    writeFileSync(minisignFilePath, minisignFile)

    await exec.exec(rsign2, [
      'verify',
      `${filePath}`,
      '-P',
      `${PUB_KEY}`,
      '-x',
      `${minisignFilePath}`
    ])

    resolve()
  })
}

async function installRsign2(): Promise<string> {
  return new Promise(async resolve => {
    let dlFile
    let dlHash

    switch (arch) {
      case 'arm':
        if (platform === 'linux') {
          dlFile = 'armv7-unknown-linux-musleabihf'
          dlHash =
            '2a187ff785d0520ecdd14af4fb0834d0cdb90d41fa42470413ba6f8187e5142b'
        } else throw new Error('unsupported platform')
        break
      case 'arm64':
        if (platform === 'linux') {
          dlFile = 'aarch64-unknown-linux-musl'
          dlHash =
            '18803b59a0c4baa9b3d5c7a26a5e6336df9c5ff04c851944ffafa87e111ae026'
        } else if (platform === 'darwin') {
          dlFile = 'aarch64-apple-darwin'
          dlHash =
            'e5770f96ad51aab5a35e595462283ae521f3fd995158c82f220d28b498802cf0'
        } else throw new Error('unsupported platform')
        break
      case 'x64':
        if (platform === 'linux') {
          dlFile = 'x86_64-unknown-linux-musl'
          dlHash =
            'd013658223ba79bd84b2e409ed26f2c533dcb15546071b33eb32b499bade9349'
        } else if (platform === 'darwin') {
          dlFile = 'x86_64-apple-darwin'
          dlHash =
            'cf3a305a760beb7245b564dee4b180198542f63aef2f954e1f9f3f732a7cf6d0'
        } else if (platform === 'win32') {
          dlFile = 'x86_64-pc-windows-msvc'
          dlHash =
            '8e77f7f2f01413cc2ef767fd2adac04ef4972749625dc29a4ee09a014895ee4d'
        } else if (platform === 'freebsd') {
          dlFile = 'x86_64-unknown-freebsd'
          dlHash =
            '4e32038f9acece4996be3671e709b9d188d7e7464c3c13954ee12298244bd884'
        } else if (platform === 'sunos') {
          dlFile = 'x86_64-sun-solaris'
          dlHash =
            '54abb8a9dee8d7562beefffeede9edf691677437d34293572d884f2aa0fd68e0'
        } else throw new Error('unsupported platform')
        break
      case 's390x':
        if (platform === 'linux') {
          dlFile = 's390x-unknown-linux-gnu'
          dlHash =
            '73c4a77aef2bace5a9ea1471348203c26e2c8bb869d587f7376ddff31063b8ad'
        } else throw new Error('unsupported platform')
        break
    }

    if (!dlFile) throw new Error('unsupported or missing platform')

    const toolPath = await tc.downloadTool(`${DL}${dlFile}.tar.gz`)
    const hash = await hashFile(toolPath)

    if (hash !== dlHash)
      throw new Error('sha256 hash does not match for rsign2')

    const directory = await tc.extractTar(toolPath)
    core.info('Installed rsign2')

    resolve(`${directory}/rsign`)
  })
}
