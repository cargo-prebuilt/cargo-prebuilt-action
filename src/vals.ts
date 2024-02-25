import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export const DL_URL =
  'https://github.com/cargo-prebuilt/cargo-prebuilt/releases/download/v'
export const PREBUILT_INDEX_PUB_KEY =
  'RWTSqAR1Hbfu6mBFiaz4hb9I9gikhMmvKkVbyz4SJF/oxJcbbScmCqqO'
export const INSTALL_DIR = path.join(os.homedir(), '.cargo/bin')
export const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'cargo-prebuilt-'))
