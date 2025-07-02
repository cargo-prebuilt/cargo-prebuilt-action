import fs, { readFileSync } from 'node:fs';
import path, { sep } from 'node:path';
import crypto, { createHash } from 'node:crypto';
import os from 'node:os';
import process$1, { arch, platform } from 'node:process';
import { execFileSync, execSync } from 'node:child_process';
import { finished } from 'node:stream/promises';
import { Readable } from 'node:stream';

/*
 * The MIT License (MIT)
 *
 * Copyright 2019 GitHub
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode || (ExitCode = {}));
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process$1.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    return val.trim();
}
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process$1.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return issueFileCommand('OUTPUT', prepareKeyValueMessage(name, value));
    }
    process$1.stdout.write(os.EOL);
    issueCommand('set-output', { name }, toCommandValue(value));
}
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process$1.stdout.write(message + os.EOL);
}
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    issueCommand('warning', toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    issueCommand('error', toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    issueCommand('debug', {}, message);
}
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process$1.exitCode = ExitCode.Failure;
    error(message);
}
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process$1.env['GITHUB_PATH'] || '';
    if (filePath) {
        issueFileCommand('PATH', inputPath);
    }
    else {
        issueCommand('add-path', {}, inputPath);
    }
    process$1.env['PATH'] = `${inputPath}${path.delimiter}${process$1.env['PATH']}`;
}
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
function issueFileCommand(command, message) {
    const filePath = process$1.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${crypto.randomUUID()}`;
    const convertedValue = toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process$1.stdout.write(cmd.toString() + os.EOL);
}
const CMD_STRING = '::';
class Command {
    command;
    message;
    properties;
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}

function execFile(file, args, options) {
    if (!options)
        options = { encoding: 'utf8' };
    else
        options.encoding = 'utf8';
    return execFileSync(file, args, options);
}
function execGetOutput(command) {
    return execSync(command, {
        encoding: 'utf8'
    });
}

function getVersions() {
    const output = execGetOutput('git ls-remote --tags --refs https://github.com/cargo-prebuilt/cargo-prebuilt.git');
    const re = /v((\d+)\.(\d+)\.(\d+))[^-]/g;
    const tmp = [...output.matchAll(re)].map((a) => {
        return a[1];
    });
    return tmp.sort((a, b) => {
        if (a === b)
            return 0;
        const as = a.split('.');
        const bs = b.split('.');
        if (as[0] > bs[0] ||
            (as[0] === bs[0] && as[1] > bs[1]) ||
            (as[0] === bs[0] && as[1] === bs[1] && as[2] > bs[2]))
            return 1;
        return -1;
    });
}
function currentTarget() {
    switch (arch) {
        case 'arm':
            if (platform === 'linux')
                return 'armv7-unknown-linux-gnueabihf';
            else
                setFailed('unsupported platform');
            break;
        case 'arm64':
            if (platform === 'linux')
                return 'aarch64-unknown-linux-gnu';
            else if (platform === 'darwin')
                return 'aarch64-apple-darwin';
            else
                setFailed('unsupported platform');
            break;
        case 'riscv64':
            if (platform === 'linux')
                return 'riscv64gc-unknown-linux-gnu';
            else
                setFailed('unsupported platform');
            break;
        case 's390x':
            if (platform === 'linux')
                return 's390x-unknown-linux-gnu';
            else
                setFailed('unsupported platform');
            break;
        case 'x64':
            if (platform === 'linux')
                return 'x86_64-unknown-linux-gnu';
            else if (platform === 'darwin')
                return 'x86_64-apple-darwin';
            else if (platform === 'win32')
                return 'x86_64-pc-windows-msvc';
            else if (platform === 'freebsd')
                return 'x86_64-unknown-freebsd';
            else
                setFailed('unsupported platform');
            break;
    }
    setFailed('unsupported or missing platform');
    return 'NULL';
}
async function downloadFile(url, path) {
    if (!(await downloadFileWithErr(url, path)))
        setFailed(`Could not download ${url}`);
}
async function downloadFileWithErr(url, path) {
    debug(`Started download of ${url} to ${path}`);
    const res = await fetch(url);
    if (res.status === 200) {
        const stream = fs.createWriteStream(path, { flags: 'w' });
        // @ts-expect-error body stream should not be null
        await finished(Readable.fromWeb(res.body).pipe(stream));
        debug(`Finished download of ${url} to ${path}`);
        return true;
    }
    debug(`Could not download ${url}`);
    return false;
}

const DL_URL = 'https://github.com/cargo-prebuilt/cargo-prebuilt/releases/download/v';
const PREBUILT_INDEX_PUB_KEY = 'RWTSqAR1Hbfu6mBFiaz4hb9I9gikhMmvKkVbyz4SJF/oxJcbbScmCqqO';
const INSTALL_DIR = path.join(os.homedir(), '.cargo/bin');
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'cargo-prebuilt-'));

async function verifyFileHash(version, filePath) {
    const res = await fetch(`${DL_URL}${version}/hashes.sha256`);
    const sha256File = (await res.text()).trim();
    const fileHash = await hashFile(filePath);
    // This is probably fine, but maybe this should be change later
    if (!sha256File.includes(fileHash))
        throw new Error('sha256 hash does not match');
}
// TODO: Use sha256 from qstract?
async function hashFile(filePath) {
    return new Promise((resolve) => {
        const fd = readFileSync(filePath);
        const hash = createHash('sha256').update(fd).digest('hex');
        resolve(hash);
    });
}

async function verifyFileMinisign(version, fileName, filePath, rsign2) {
    const archivePath = path.dirname(filePath);
    const minisignFilePath = `${archivePath}/${fileName}.minisig`;
    await downloadFile(`${DL_URL}${version}/${fileName}.minisig`, minisignFilePath);
    execFile(rsign2, [
        'verify',
        `${filePath}`,
        '-P',
        `${PREBUILT_INDEX_PUB_KEY}`,
        '-x',
        `${minisignFilePath}`
    ]);
}

const QSTRACT_DL_URL = 'https://github.com/cargo-prebuilt/qstract/releases/download/v0.2.8/';
async function installQstract() {
    let dlFile;
    let dlHash;
    info(`Installing qstract to ${TMP_DIR}`);
    switch (arch) {
        case 'arm':
            if (platform === 'linux') {
                dlFile = 'armv7-unknown-linux-musleabihf';
                dlHash =
                    '8696095e880152242ce14aefc1ce1b4b67a11cc75e062dacc8596b7465eaf0a1';
            }
            else
                setFailed('unsupported platform');
            break;
        case 'arm64':
            if (platform === 'linux') {
                dlFile = 'aarch64-unknown-linux-musl';
                dlHash =
                    'd3870a102fbe50301d7fdf685ceb8e7b679c3b1afc92653bedb9137389e354c1';
            }
            else if (platform === 'darwin') {
                dlFile = 'aarch64-apple-darwin';
                dlHash =
                    '8ce9e27d38da5ec3797f48708e2fc99982302f6c3ff52b3b0818287914365a50';
            }
            else if (platform === 'win32') {
                dlFile = 'aarch64-pc-windows-msvc.exe';
                dlHash =
                    '07bd05f3c70296f3076bc34dbb4d1da1a35ee1253a299525baab8eefe9a20e66';
            }
            else
                setFailed('unsupported platform');
            break;
        case 'x64':
            if (platform === 'linux') {
                dlFile = 'x86_64-unknown-linux-musl';
                dlHash =
                    '315cc94e280473ef849146dd15d9459be078a59d3612e52a4015d97f64b52eac';
            }
            else if (platform === 'darwin') {
                dlFile = 'x86_64-apple-darwin';
                dlHash =
                    'b190c6ed4b88e0f6bcd9d274389c120d80a85b70660584595af572b106623c42';
            }
            else if (platform === 'win32') {
                dlFile = 'x86_64-pc-windows-msvc.exe';
                dlHash =
                    'fe98cadc7f185eb8fb9bf651e9423b74eddf6cf6c8beb0085de4ca25b2c42b27';
            }
            else if (platform === 'freebsd') {
                dlFile = 'x86_64-unknown-freebsd';
                dlHash =
                    '348b108302d24d79677186a34c363997b49b957e4a88e5da34c8699b44fe8d20';
            }
            else
                setFailed('unsupported platform');
            break;
        case 'riscv64':
            if (platform === 'linux') {
                dlFile = 'riscv64gc-unknown-linux-musl';
                dlHash =
                    'aa9a71164a2c6c12e7876b2fab4b9d00912981866dd2097243724c2c97779b9c';
            }
            else
                setFailed('unsupported platform');
            break;
        case 's390x':
            if (platform === 'linux') {
                dlFile = 's390x-unknown-linux-gnu';
                dlHash =
                    '2d94c0de4a89fbe18cd531bbd95de7ec89f086edbd2fc81f2ccbfa58df5439ca';
            }
            else
                setFailed('unsupported platform');
            break;
    }
    if (!dlFile)
        setFailed('unsupported or missing platform (qstract)');
    let binPath = `${TMP_DIR}/qstract`;
    if (platform === 'win32')
        binPath += '.exe';
    debug(`qstract: \n    dlFile ${dlFile}\n    dlHash ${dlHash}\n    binPath ${binPath}`);
    await downloadFile(`${QSTRACT_DL_URL}qstract-${dlFile}`, binPath);
    // Check hash
    const hash = await hashFile(binPath);
    if (hash !== dlHash)
        setFailed('sha256 hash does not match for qstract');
    debug('Hash matched for qstract');
    if (!binPath.endsWith('.exe')) {
        execGetOutput(`chmod +x ${binPath}`);
        debug('Detected unix, trying to set exe bit with chmod');
    }
    // Test run
    execFile(binPath, ['--version']);
    info('Installed qstract');
    return binPath;
}

const RSIGN_DL_URL = 'https://github.com/cargo-prebuilt/index/releases/download/rsign2-0.6.4/';
async function installRsign2(qstract) {
    let dlFile;
    let dlHash;
    info(`Installing rsign2 to ${TMP_DIR}`);
    switch (arch) {
        case 'arm':
            if (platform === 'linux') {
                dlFile = 'armv7-unknown-linux-musleabihf';
                dlHash =
                    '77e5bd64bd2d60c0127adeeb0e2a8dd5a69fd9f6c61ec53706774c7df3d04b6f';
            }
            else
                setFailed('unsupported platform');
            break;
        case 'arm64':
            if (platform === 'linux') {
                dlFile = 'aarch64-unknown-linux-musl';
                dlHash =
                    '5be366398760c0a908f197581c3c1b378e08b2dfc40d86acafa60cc5218ea52c';
            }
            else if (platform === 'darwin') {
                dlFile = 'aarch64-apple-darwin';
                dlHash =
                    '946a35aa2bcff08b1e14b9834224d947e4719ffaf09a87c548b479f002a01454';
            }
            else if (platform === 'win32') {
                dlFile = 'aarch64-pc-windows-msvc';
                dlHash =
                    '05acb9a14e6c81cc7ff4d82d4cd2213c1424a2a7f41479c13080725f52e9d4c7';
            }
            else
                setFailed('unsupported platform');
            break;
        case 'x64':
            if (platform === 'linux') {
                dlFile = 'x86_64-unknown-linux-musl';
                dlHash =
                    '5c7c17e5f65d740e80fd3bf187701a90dbde1829521c77aaca30c06c24fbca92';
            }
            else if (platform === 'darwin') {
                dlFile = 'x86_64-apple-darwin';
                dlHash =
                    'ac85d87369576b5be0d381bb47c702028e1750dfaa1d81c698743a98ebdfb72a';
            }
            else if (platform === 'win32') {
                dlFile = 'x86_64-pc-windows-msvc';
                dlHash =
                    'b39ab2cc69476b3cb7a4ce22f2f2aaf3ae2f3dae343a7396d0f73ab27ab9c76d';
            }
            else if (platform === 'freebsd') {
                dlFile = 'x86_64-unknown-freebsd';
                dlHash =
                    '26dec3708735ff35c0b5a295a75893f0238a531d34f483ba279ca26f43496c72';
            }
            else
                setFailed('unsupported platform');
            break;
        case 'riscv64':
            if (platform === 'linux') {
                dlFile = 'riscv64gc-unknown-linux-gnu'; // TODO: Musl version?
                dlHash =
                    '2139d29cdf23d0be3c6cbce00acfc0d27cf5bf0ee2780ec0b8a7fd2961f7f146';
            }
            else
                setFailed('unsupported platform');
            break;
        case 's390x':
            if (platform === 'linux') {
                dlFile = 's390x-unknown-linux-gnu';
                dlHash =
                    '548ba02e63894975488388dc0edc057a0dea8177d2f7852a4ae92205b7341b0b';
            }
            else
                setFailed('unsupported platform');
            break;
    }
    if (!dlFile)
        setFailed('unsupported or missing platform (rsign2)');
    const tarPath = `${TMP_DIR}/rsign.tar.gz`;
    debug(`rsign2: \n    dlFile ${dlFile}\n    dlHash ${dlHash}\n    binPath ${tarPath}`);
    await downloadFile(`${RSIGN_DL_URL}${dlFile}.tar.gz`, tarPath);
    // Check tar hash
    const hash = await hashFile(tarPath);
    if (hash !== dlHash)
        setFailed('sha256 hash does not match for rsign2');
    debug('Hash matched for rsign');
    // Extract
    debug('Extracting rsign');
    execFile(qstract, ['-z', '-C', `${TMP_DIR}`, tarPath]);
    let toolPath;
    if (platform === 'win32')
        toolPath = `${TMP_DIR}/rsign.exe`;
    else
        toolPath = `${TMP_DIR}/rsign`;
    debug(`Tool path rsign ${toolPath}`);
    // Check if rsign works
    execFile(toolPath, ['--version']);
    info('Installed rsign2');
    return toolPath;
}

// TODO: Retry option that runs cargo-prebuilt again if it fails?
async function run() {
    try {
        let prebuiltVersion = getInput('prebuilt-version');
        let fallbackVersion;
        let prebuiltTarget = getInput('prebuilt-target');
        const prebuiltVerify = getInput('prebuilt-verify');
        const pkgs = getInput('pkgs');
        const target = getInput('target');
        const safe = getInput('safe');
        const update = getInput('update');
        const index = getInput('index');
        const pubKey = getInput('pub-key');
        const auth = getInput('auth');
        const indexKey = getInput('index-key');
        const ci = getInput('ci');
        const noSig = getInput('no-sig');
        const noHash = getInput('no-hash');
        const hashBins = getInput('hash-bins');
        const path = getInput('path');
        const reportPath = getInput('report-path');
        const noCreatePath = getInput('no-create-path');
        const reports = getInput('reports');
        const config = getInput('config');
        const requireConfig = getInput('require-config');
        const out = getInput('out');
        const getLatest = getInput('get-latest');
        const color = getInput('color');
        if (prebuiltVersion === 'latest') {
            const latest = getVersions();
            prebuiltVersion = latest[latest.length - 1];
            fallbackVersion = latest[latest.length - 2];
            info(`Picked cargo-prebuilt version ${prebuiltVersion} with fallback version ${fallbackVersion}`);
        }
        if (prebuiltTarget === 'current') {
            prebuiltTarget = currentTarget();
        }
        setOutput('prebuilt-version', prebuiltVersion);
        setOutput('prebuilt-target', prebuiltTarget);
        // Install qstract
        const qstract = await installQstract();
        // Install rsign2
        let rsignLet = '';
        if (prebuiltVerify === 'minisign') {
            debug('Verify method is minisign, downloading rsign2');
            rsignLet = await installRsign2(qstract);
        }
        const rsign = rsignLet;
        // Install cargo-prebuilt
        const fileEnding = prebuiltTarget.includes('windows-msvc')
            ? '.zip'
            : '.tar.gz';
        // Download
        const prebuiltPath = `${TMP_DIR}/${prebuiltTarget}${fileEnding}`;
        const dl1 = await downloadFileWithErr(`${DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`, prebuiltPath);
        if (!dl1) {
            warning('Failed to install latest version using fallback version');
            if (fallbackVersion)
                prebuiltVersion = fallbackVersion;
            const dl2 = await downloadFileWithErr(`${DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`, prebuiltPath);
            if (!dl2)
                setFailed('Could not install cargo-prebuilt from fallback');
        }
        // Verify
        if (prebuiltVerify === 'sha256') {
            await verifyFileHash(prebuiltVersion, prebuiltPath);
            info('Verified downloaded archive with sha256 hash');
        }
        else if (prebuiltVerify === 'minisign') {
            await verifyFileMinisign(prebuiltVersion, `${prebuiltTarget}${fileEnding}`, prebuiltPath, rsign);
            info('Verified downloaded archive with minisign');
        }
        // eslint-disable-next-line no-empty
        else if (prebuiltVerify === 'none') {
        }
        else
            setFailed('invalid prebuilt-verify type');
        // Extract
        debug(`Extracting ${prebuiltPath}`);
        if (prebuiltTarget.includes('windows-msvc'))
            execFile(qstract, ['--zip', '-C', TMP_DIR, prebuiltPath]);
        else
            execFile(qstract, ['-z', '-C', TMP_DIR, prebuiltPath]);
        let tmpBin = `${TMP_DIR}${sep}cargo-prebuilt`;
        let finalBin = `${INSTALL_DIR}${sep}cargo-prebuilt`;
        if (prebuiltTarget.includes('windows-msvc')) {
            tmpBin += '.exe';
            finalBin += '.exe';
        }
        execGetOutput(`mv ${tmpBin} ${finalBin}`);
        addPath(INSTALL_DIR);
        info(`Installed cargo-prebuilt@${prebuiltVersion} at ${finalBin}`);
        setOutput('prebuilt-binary', finalBin);
        // Install prebuilt crates if needed
        if (pkgs !== '') {
            const args = [];
            if (safe === 'true')
                args.push('--safe');
            if (update === 'true')
                args.push('--update');
            if (ci === 'true')
                args.push('--ci');
            if (noSig === 'true')
                args.push('--no-sig');
            if (noHash === 'true')
                args.push('--no-hash');
            if (hashBins === 'true')
                args.push('--hash-bins');
            if (noCreatePath === 'true')
                args.push('--no-create-path');
            if (requireConfig === 'true')
                args.push('--require-config');
            if (out === 'true')
                args.push('--out');
            if (getLatest === 'true')
                args.push('--get-latest');
            if (color === 'true')
                args.push('--color');
            if (color === 'false')
                args.push('--no-color');
            if (target !== '') {
                args.push('--target');
                args.push(target);
            }
            if (index !== '') {
                args.push('--index');
                args.push(index);
            }
            if (pubKey !== '') {
                args.push('--pub-key');
                args.push(pubKey);
            }
            if (auth !== '') {
                args.push('--auth');
                args.push(auth);
            }
            if (indexKey !== '') {
                args.push('--index-key');
                args.push(indexKey);
            }
            if (path !== '') {
                args.push('--path');
                args.push(path);
            }
            if (reportPath !== '') {
                args.push('--reportPath');
                args.push(reportPath);
            }
            if (reports !== '') {
                args.push('--reports');
                args.push(reports);
            }
            if (config !== '') {
                args.push('--config');
                args.push(config);
            }
            args.push(pkgs);
            const output = execFile(finalBin, args);
            setOutput('out', output);
            if (path !== '')
                addPath(path);
            info(`Installed tools ${pkgs}`);
        }
        debug(`Cleaning up tmp dir ${TMP_DIR}`);
        fs.rm(TMP_DIR, { recursive: true, force: true }, (err) => {
            if (err)
                error(err.message);
        });
        process.exit(0);
    }
    catch (error) {
        if (error instanceof Error)
            setFailed(error.message);
    }
}

run();
//# sourceMappingURL=index.js.map
