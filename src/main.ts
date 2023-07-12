import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'
import {currentTarget} from './utils'

const DL_URL =
  'https://github.com/cargo-prebuilt/cargo-prebuilt/releases/download/v'

async function run(): Promise<void> {
  try {
    let prebuiltVersion: string = core.getInput('prebuilt-version')
    let fallbackVersion: string | undefined
    let prebuiltTarget: string = core.getInput('prebuilt-target')
    //    const prebuiltVerify: string = core.getInput('prebuilt-verify')

    const pkgs: string = core.getInput('pkgs')
    const target: string = core.getInput('target')
    const index: string = core.getInput('index')
    const auth: string = core.getInput('auth')
    const path: string = core.getInput('path')
    const reportPath: string = core.getInput('report-path')
    const ci: string = core.getInput('ci')
    const sig: string = core.getInput('sig')
    const forceVerify: string = core.getInput('force-verify')
    const skipBinHash: string = core.getInput('skip-bin-hash')
    const color: string = core.getInput('color')

    if (prebuiltVersion === 'latest') {
      const out = await exec.getExecOutput(
        'git ls-remote --tags --refs https://github.com/cargo-prebuilt/cargo-prebuilt.git'
      )

      const re = /v((\d+)\.(\d+)\.(\d+))[^-]/g
      const tmp = [...out.stdout.matchAll(re)].map(a => {
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

    // TODO: Verify downloads?
    if (directory === '') {
      let prebuiltPath
      try {
        prebuiltPath = await tc.downloadTool(
          `${DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`
        )
      } catch {
        core.info('Failed to install main version using fallback version')
        if (fallbackVersion)
          prebuiltPath = await tc.downloadTool(
            `${DL_URL}${fallbackVersion}/${prebuiltTarget}${fileEnding}`
          )
        else throw new Error('Could not install cargo-prebuilt from fallback')
      }

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
      if (index !== '') args.push(`--index='${index}'`)
      if (auth !== '') args.push(`--auth='${auth}'`)
      if (path !== '') args.push(`--path='${path}'`)
      if (reportPath !== '') args.push(`--report-path='${reportPath}'`)
      if (ci === 'true') args.push('--ci')
      if (sig === '') args.push(`--sig='${sig}'`)
      if (forceVerify === 'true') args.push('--force-verify')
      if (skipBinHash === 'true') args.push('--skip-bin-hash')
      if (color === 'true') args.push('--color')
      if (color === 'false') args.push('--no-color')
      args.push(pkgs)

      const out = await exec.getExecOutput('cargo-prebuilt', args)
      core.setOutput('out', out)

      if (path !== '') core.addPath(path)
      core.debug(`Installed tools ${pkgs}`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
