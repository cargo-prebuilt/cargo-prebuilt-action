import fs from 'node:fs'
import { sep } from 'node:path'
import * as core from './trim/core'
import * as exec from './trim/exec'
import { currentTarget, downloadFileWithErr, getVersions } from './utils'
import { DL_URL, INSTALL_DIR, TMP_DIR } from './vals'
import { verifyFileHash } from './sha256'
import { verifyFileMinisign } from './minisign'
import { installQstract } from './dl/dl-qstract'
import { installRsign2 } from './dl/dl-rsign2'

export async function run(): Promise<void> {
  try {
    let prebuiltVersion: string = core.getInput('prebuilt-version')
    let fallbackVersion: string | undefined
    let prebuiltTarget: string = core.getInput('prebuilt-target')
    const prebuiltVerify: string = core.getInput('prebuilt-verify')

    const pkgs: string = core.getInput('pkgs')

    const target: string = core.getInput('target')
    const safe: string = core.getInput('safe')
    const update: string = core.getInput('update')
    const index: string = core.getInput('index')
    const pubKey: string = core.getInput('pub-key')
    const auth: string = core.getInput('auth')
    const indexKey: string = core.getInput('index-key')
    const ci: string = core.getInput('ci')
    const noSig: string = core.getInput('no-sig')
    const noHash: string = core.getInput('no-hash')
    const hashBins: string = core.getInput('hash-bins')
    const path: string = core.getInput('path')
    const reportPath: string = core.getInput('report-path')
    const noCreatePath: string = core.getInput('no-create-path')
    const reports: string = core.getInput('reports')
    const config: string = core.getInput('config')
    const requireConfig: string = core.getInput('require-config')
    const out: string = core.getInput('out')
    const getLatest: string = core.getInput('get-latest')
    const color: string = core.getInput('color')

    if (prebuiltVersion === 'latest') {
      const latest = getVersions()
      prebuiltVersion = latest[latest.length - 1]
      fallbackVersion = latest[latest.length - 2]
      core.info(
        `Picked cargo-prebuilt version ${prebuiltVersion} with fallback version ${fallbackVersion}`
      )
    }
    if (prebuiltTarget === 'current') {
      prebuiltTarget = currentTarget()
    }

    core.setOutput('prebuilt-version', prebuiltVersion)
    core.setOutput('prebuilt-target', prebuiltTarget)

    // Install qstract
    const qstract = await installQstract()

    // Install rsign2
    let rsignLet = ''
    if (prebuiltVerify === 'minisign') {
      core.debug('Verify method is minisign, downloading rsign2')
      rsignLet = await installRsign2(qstract)
    }
    const rsign = rsignLet

    // Install cargo-prebuilt
    const fileEnding: string = prebuiltTarget.includes('windows-msvc')
      ? '.zip'
      : '.tar.gz'

    // Download
    const prebuiltPath = `${TMP_DIR}/${prebuiltTarget}${fileEnding}`
    const dl1 = await downloadFileWithErr(
      `${DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`,
      prebuiltPath
    )
    if (!dl1) {
      core.warning('Failed to install latest version using fallback version')
      if (fallbackVersion) prebuiltVersion = fallbackVersion
      const dl2 = await downloadFileWithErr(
        `${DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`,
        prebuiltPath
      )
      if (!dl2) core.setFailed('Could not install cargo-prebuilt from fallback')
    }

    // Verify
    if (prebuiltVerify === 'sha256') {
      await verifyFileHash(prebuiltVersion, prebuiltPath)
      core.info('Verified downloaded archive with sha256 hash')
    } else if (prebuiltVerify === 'minisign') {
      await verifyFileMinisign(
        prebuiltVersion,
        `${prebuiltTarget}${fileEnding}`,
        prebuiltPath,
        rsign
      )
      core.info('Verified downloaded archive with minisign')
    }
    // eslint-disable-next-line no-empty
    else if (prebuiltVerify === 'none') {
    } else core.setFailed('invalid prebuilt-verify type')

    // Extract
    core.debug(`Extracting ${prebuiltPath}`)
    if (prebuiltTarget.includes('windows-msvc'))
      exec.execFile(qstract, ['--zip', '-C', TMP_DIR, prebuiltPath])
    else exec.execFile(qstract, ['-z', '-C', TMP_DIR, prebuiltPath])

    let tmpBin = `${TMP_DIR}${sep}cargo-prebuilt`
    let finalBin = `${INSTALL_DIR}${sep}cargo-prebuilt`
    if (prebuiltTarget.includes('windows-msvc')) {
      tmpBin += '.exe'
      finalBin += '.exe'
    }
    exec.execGetOutput(`mv ${tmpBin} ${finalBin}`)

    core.addPath(INSTALL_DIR)
    core.info(`Installed cargo-prebuilt@${prebuiltVersion} at ${finalBin}`)
    core.setOutput('prebuilt-binary', finalBin)

    // Install prebuilt crates if needed
    if (pkgs !== '') {
      const args: string[] = []

      if (safe === 'true') args.push('--safe')
      if (update === 'true') args.push('--update')
      if (ci === 'true') args.push('--ci')
      if (noSig === 'true') args.push('--no-sig')
      if (noHash === 'true') args.push('--no-hash')
      if (hashBins === 'true') args.push('--hash-bins')
      if (noCreatePath === 'true') args.push('--no-create-path')
      if (requireConfig === 'true') args.push('--require-config')
      if (out === 'true') args.push('--out')
      if (getLatest === 'true') args.push('--get-latest')

      if (color === 'true') args.push('--color')
      if (color === 'false') args.push('--no-color')

      if (target !== '') {
        args.push('--target')
        args.push(target)
      }
      if (index !== '') {
        args.push('--index')
        args.push(index)
      }
      if (pubKey !== '') {
        args.push('--pub-key')
        args.push(pubKey)
      }
      if (auth !== '') {
        args.push('--auth')
        args.push(auth)
      }
      if (indexKey !== '') {
        args.push('--index-key')
        args.push(indexKey)
      }
      if (path !== '') {
        args.push('--path')
        args.push(path)
      }
      if (reportPath !== '') {
        args.push('--reportPath')
        args.push(reportPath)
      }
      if (reports !== '') {
        args.push('--reports')
        args.push(reports)
      }
      if (config !== '') {
        args.push('--config')
        args.push(config)
      }

      args.push(pkgs)

      const output = exec.execFile(finalBin, args)
      core.setOutput('out', output)

      if (path !== '') core.addPath(path)
      core.info(`Installed tools ${pkgs}`)
    }

    core.debug(`Cleaning up tmp dir ${TMP_DIR}`)
    fs.rm(TMP_DIR, { recursive: true, force: true }, err => {
      if (err) core.error(err.message)
    })

    process.exit(0)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
