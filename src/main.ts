import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'
import {currentTarget} from './utils'
import {DL_URL} from './vals'
import {verifyFileHash} from './sha256'
import {verifyFileMinisign} from './minisign'

async function run(): Promise<void> {
  try {
    let prebuiltVersion: string = core.getInput('prebuilt-version')
    let fallbackVersion: string | undefined
    let prebuiltTarget: string = core.getInput('prebuilt-target')
    const prebuiltVerify: string = core.getInput('prebuilt-verify')

    const pkgs: string = core.getInput('pkgs')
    const target: string = core.getInput('target')
    const indexKey: string = core.getInput('index-key')
    const index: string = core.getInput('index')
    const auth: string = core.getInput('auth')
    const config: string = core.getInput('config')
    const path: string = core.getInput('path')
    const reportPath: string = core.getInput('report-path')
    const ci: string = core.getInput('ci')
    const sig: string = core.getInput('sig')
    const noVerify: string = core.getInput('no-verify')
    const safe: string = core.getInput('safe')
    const out: string = core.getInput('out')
    const color: string = core.getInput('color')

    if (prebuiltVersion === 'latest') {
      const output = await exec.getExecOutput(
        'git ls-remote --tags --refs https://github.com/cargo-prebuilt/cargo-prebuilt.git'
      )

      const re = /v((\d+)\.(\d+)\.(\d+))[^-]/g
      const tmp = [...output.stdout.matchAll(re)].map(a => {
        return a[1]
      })

      const latest = tmp.sort((a, b) => {
        if (a === b) return 0
        const as = a.split('.')
        const bs = b.split('.')
        if (
          as[0] > bs[0] ||
          (as[0] === bs[0] && as[1] > bs[1]) ||
          (as[0] === bs[0] && as[1] === bs[1] && as[2] > bs[2])
        )
          return 1
        return -1
      })
      prebuiltVersion = latest[latest.length - 1]
      fallbackVersion = latest[latest.length - 2]
      core.info(
        `Picked cargo-prebuilt version ${prebuiltVersion} with fallback version ${fallbackVersion}`
      )
    }
    if (prebuiltTarget === 'current') {
      prebuiltTarget = await currentTarget()
    }

    core.setOutput('prebuilt-version', prebuiltVersion)
    core.setOutput('prebuilt-target', prebuiltTarget)

    const fileEnding: string = prebuiltTarget.includes('windows-msvc')
      ? '.zip'
      : '.tar.gz'

    let directory = tc.find('cargo-prebuilt', prebuiltVersion, prebuiltTarget)
    core.debug(`Found cargo-prebuilt in tool cache at ${directory}`)
    core.addPath(directory)

    if (directory === '') {
      let prebuiltPath: string

      // Download
      try {
        prebuiltPath = await tc.downloadTool(
          `${DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`
        )
      } catch {
        core.warning('Failed to install main version using fallback version')
        if (fallbackVersion) {
          prebuiltVersion = fallbackVersion
          prebuiltPath = await tc.downloadTool(
            `${DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`
          )
        } else throw new Error('Could not install cargo-prebuilt from fallback')
      }

      // Verify file
      if (prebuiltVerify === 'sha256') {
        await verifyFileHash(prebuiltVersion, prebuiltPath)
        core.info('Verified downloaded archive with sha256 hash')
      } else if (prebuiltVerify === 'minisign') {
        await verifyFileMinisign(
          prebuiltVersion,
          `${prebuiltTarget}${fileEnding}`,
          prebuiltPath
        )
        core.info('Verified downloaded archive with minisign')
      }
      // eslint-disable-next-line no-empty
      else if (prebuiltVerify === 'none') {
      } else throw new Error('invalid prebuilt-verify type')

      // Extract
      if (prebuiltTarget.includes('windows-msvc')) {
        directory = await tc.extractZip(prebuiltPath)
      } else {
        directory = await tc.extractTar(prebuiltPath)
      }

      directory = await tc.cacheDir(
        directory,
        'cargo-prebuilt',
        prebuiltVersion,
        prebuiltTarget
      )

      core.addPath(directory)
      core.info('Installed cargo-prebuilt')
    }
    core.debug(`cargo-prebuilt: ${directory}`)

    // Install prebuilt crates if needed
    if (pkgs !== '') {
      const args: string[] = []
      if (target !== '') args.push(`--target='${target}'`)
      if (indexKey !== '') args.push(`--index-key='${indexKey}'`)
      if (index !== '') args.push(`--index='${index}'`)
      if (auth !== '') args.push(`--auth='${auth}'`)
      if (config !== '') args.push(`--config='${config}'`)
      if (path !== '') args.push(`--path='${path}'`)
      if (reportPath !== '') args.push(`--report-path='${reportPath}'`)
      if (ci === 'true') args.push('--ci')
      if (sig !== '') args.push(`--sig='${sig}'`)
      if (noVerify === 'true') args.push('--no-verify')
      if (safe === 'true') args.push('--safe')
      if (out === 'true') args.push('--out')
      if (color === 'true') args.push('--color')
      if (color === 'false') args.push('--no-color')
      args.push(pkgs)

      const output = await exec.getExecOutput('cargo-prebuilt', args)
      core.setOutput('out', output.stdout)

      if (path !== '') core.addPath(path)
      core.debug(`Installed tools ${pkgs}`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
