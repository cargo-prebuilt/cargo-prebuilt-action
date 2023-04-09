import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'
import {currentTarget} from './utils'

async function run(): Promise<void> {
  try {
    let prebuiltVersion: string = core.getInput('version')
    let fallbackVersion: string | undefined
    let prebuiltTarget: string = core.getInput('target')
    const prebuiltTools: string = core.getInput('tools')
    const prebuiltToolsTarget: string = core.getInput('tools-target')
    const prebuiltToolsIndex: string = core.getInput('tools-index')
    const prebuiltToolsAuth: string = core.getInput('tools-auth')
    const prebuiltToolsPath: string = core.getInput('tools-path')

    if (prebuiltVersion === 'latest') {
      const out = await exec.getExecOutput(
        'git ls-remote --tags --refs https://github.com/cargo-prebuilt/cargo-prebuilt.git'
      )

      const re = /([0-9]\.[0-9]\.[0-9])/g
      const tmp = [...out.stdout.matchAll(re)].map(a => {
        return a[0]
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

    core.setOutput('version', prebuiltVersion)
    core.setOutput('target', prebuiltTarget)

    const fileEnding: string = prebuiltTarget.includes('windows')
      ? '.zip'
      : '.tar.gz'

    let directory = tc.find('cargo-prebuilt', prebuiltVersion, prebuiltTarget)
    core.debug(`Found cargo-prebuilt tool cache at ${directory}`)
    core.addPath(directory)

    if (directory === '') {
      let prebuiltPath
      try {
        prebuiltPath = await tc.downloadTool(
          `https://github.com/cargo-prebuilt/cargo-prebuilt/releases/download/v${prebuiltVersion}/${prebuiltTarget}${fileEnding}`
        )
      } catch {
        core.info('Failed to install main version using fallback version')
        if (fallbackVersion)
          prebuiltPath = await tc.downloadTool(
            `https://github.com/cargo-prebuilt/cargo-prebuilt/releases/download/v${fallbackVersion}/${prebuiltTarget}${fileEnding}`
          )
        else throw new Error('Could not install cargo-prebuilt')
      }

      if (prebuiltTarget.includes('windows')) {
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

    // Install tools
    const args: string[] = []
    if (prebuiltTarget !== 'current')
      args.push(`--target=${prebuiltToolsTarget}`)
    if (prebuiltToolsIndex !== '') args.push(`--index=${prebuiltToolsIndex}`)
    if (prebuiltToolsAuth !== '') args.push(`--auth=${prebuiltToolsAuth}`)
    if (prebuiltToolsPath !== '') args.push(`--path=${prebuiltToolsPath}`)
    args.push(prebuiltTools)

    await exec.exec(`cargo-prebuilt`, args, {
      env: {
        PREBUILT_PATH: '/prebuilt'
      }
    })

    if (prebuiltToolsPath !== '') core.addPath(prebuiltToolsPath)
    else core.addPath('/prebuilt')

    core.debug(`Installed tools ${prebuiltTools}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
