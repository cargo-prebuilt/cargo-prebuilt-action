import { execSync, execFileSync, ExecFileSyncOptions } from 'node:child_process'

export function execFile(
  file: string,
  args?: string[],
  options?: ExecFileSyncOptions
): string {
  if (!options) options = { encoding: 'utf8' }
  else options.encoding = 'utf8'

  return execFileSync(file, args, options) as string
}

export function execGetOutput(command: string): string {
  return execSync(command, {
    encoding: 'utf8'
  })
}
