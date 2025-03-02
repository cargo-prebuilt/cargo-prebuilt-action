/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 47:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.installQstract = installQstract;
const node_process_1 = __nccwpck_require__(708);
const core = __importStar(__nccwpck_require__(827));
const exec = __importStar(__nccwpck_require__(937));
const vals_1 = __nccwpck_require__(605);
const sha256_1 = __nccwpck_require__(574);
const utils_1 = __nccwpck_require__(236);
const QSTRACT_DL_URL = 'https://github.com/cargo-prebuilt/qstract/releases/download/v0.2.7/';
async function installQstract() {
    let dlFile;
    let dlHash;
    core.info(`Installing qstract to ${vals_1.TMP_DIR}`);
    switch (node_process_1.arch) {
        case 'arm':
            if (node_process_1.platform === 'linux') {
                dlFile = 'armv7-unknown-linux-musleabihf';
                dlHash =
                    '78445544d6594c784218c7ee697c05d6c89ac0c3968110bb6c596930f7bbb0e3';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 'arm64':
            if (node_process_1.platform === 'linux') {
                dlFile = 'aarch64-unknown-linux-musl';
                dlHash =
                    '2f0dd680ab0a3d5a1b0540b597bbc03ba56137dd90e78b223e44c79c5ef51646';
            }
            else if (node_process_1.platform === 'darwin') {
                dlFile = 'aarch64-apple-darwin';
                dlHash =
                    '5db19a7f1b2756aac83737a8fc8257a5cfd0e365f4a3b4346d1abda7db5d5fa7';
            }
            else if (node_process_1.platform === 'win32') {
                dlFile = 'aarch64-pc-windows-msvc.exe';
                dlHash =
                    'afc42a5a9db07460f6eedd81505185fb28970d33363166e81f6eae2058316cc5';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 'x64':
            if (node_process_1.platform === 'linux') {
                dlFile = 'x86_64-unknown-linux-musl';
                dlHash =
                    '9735286f26b844fe404f0637f05a2940294c49d3b7000a8062e7ff5add24a92a';
            }
            else if (node_process_1.platform === 'darwin') {
                dlFile = 'x86_64-apple-darwin';
                dlHash =
                    '24dffda26597a5660bbd0fe9b4684bb2eec5872d971d96975ab705808f619a84';
            }
            else if (node_process_1.platform === 'win32') {
                dlFile = 'x86_64-pc-windows-msvc.exe';
                dlHash =
                    'f24ebe890b9b3ad8443df9c9ebd4df34c4e90bbb09b6d64f874ef6eecec12813';
            }
            else if (node_process_1.platform === 'freebsd') {
                dlFile = 'x86_64-unknown-freebsd';
                dlHash =
                    '3b8297655f12ff6e8042b6b00a4a8d4566a77e17c76f2dca3cacd2d7a718a47c';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 's390x':
            if (node_process_1.platform === 'linux') {
                dlFile = 's390x-unknown-linux-gnu';
                dlHash =
                    '34b837adb8de3ded0946ef6e166eb2908c6a78f614ef7c6e99551be5f842b2c7';
            }
            else
                core.setFailed('unsupported platform');
            break;
    }
    if (!dlFile)
        core.setFailed('unsupported or missing platform (qstract)');
    let binPath = `${vals_1.TMP_DIR}/qstract`;
    if (node_process_1.platform === 'win32')
        binPath += '.exe';
    core.debug(`qstract: \n    dlFile ${dlFile}\n    dlHash ${dlHash}\n    binPath ${binPath}`);
    await (0, utils_1.downloadFile)(`${QSTRACT_DL_URL}qstract-${dlFile}`, binPath);
    // Check hash
    const hash = await (0, sha256_1.hashFile)(binPath);
    if (hash !== dlHash)
        core.setFailed('sha256 hash does not match for qstract');
    core.debug('Hash matched for qstract');
    if (!binPath.endsWith('.exe')) {
        exec.execGetOutput(`chmod +x ${binPath}`);
        core.debug('Detected unix, trying to set exe bit with chmod');
    }
    // Test run
    exec.execFile(binPath, ['--version']);
    core.info('Installed qstract');
    return binPath;
}


/***/ }),

/***/ 818:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.installRsign2 = installRsign2;
const node_process_1 = __nccwpck_require__(708);
const core = __importStar(__nccwpck_require__(827));
const exec = __importStar(__nccwpck_require__(937));
const vals_1 = __nccwpck_require__(605);
const sha256_1 = __nccwpck_require__(574);
const utils_1 = __nccwpck_require__(236);
const RSIGN_DL_URL = 'https://github.com/cargo-prebuilt/index/releases/download/rsign2-0.6.4/';
async function installRsign2(qstract) {
    let dlFile;
    let dlHash;
    core.info(`Installing rsign2 to ${vals_1.TMP_DIR}`);
    switch (node_process_1.arch) {
        case 'arm':
            if (node_process_1.platform === 'linux') {
                dlFile = 'armv7-unknown-linux-musleabihf';
                dlHash =
                    '77e5bd64bd2d60c0127adeeb0e2a8dd5a69fd9f6c61ec53706774c7df3d04b6f';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 'arm64':
            if (node_process_1.platform === 'linux') {
                dlFile = 'aarch64-unknown-linux-musl';
                dlHash =
                    '5be366398760c0a908f197581c3c1b378e08b2dfc40d86acafa60cc5218ea52c';
            }
            else if (node_process_1.platform === 'darwin') {
                dlFile = 'aarch64-apple-darwin';
                dlHash =
                    '946a35aa2bcff08b1e14b9834224d947e4719ffaf09a87c548b479f002a01454';
            }
            else if (node_process_1.platform === 'win32') {
                dlFile = 'aarch64-pc-windows-msvc';
                dlHash =
                    '05acb9a14e6c81cc7ff4d82d4cd2213c1424a2a7f41479c13080725f52e9d4c7';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 'x64':
            if (node_process_1.platform === 'linux') {
                dlFile = 'x86_64-unknown-linux-musl';
                dlHash =
                    '5c7c17e5f65d740e80fd3bf187701a90dbde1829521c77aaca30c06c24fbca92';
            }
            else if (node_process_1.platform === 'darwin') {
                dlFile = 'x86_64-apple-darwin';
                dlHash =
                    'ac85d87369576b5be0d381bb47c702028e1750dfaa1d81c698743a98ebdfb72a';
            }
            else if (node_process_1.platform === 'win32') {
                dlFile = 'x86_64-pc-windows-msvc';
                dlHash =
                    'b39ab2cc69476b3cb7a4ce22f2f2aaf3ae2f3dae343a7396d0f73ab27ab9c76d';
            }
            else if (node_process_1.platform === 'freebsd') {
                dlFile = 'x86_64-unknown-freebsd';
                dlHash =
                    '26dec3708735ff35c0b5a295a75893f0238a531d34f483ba279ca26f43496c72';
            }
            else
                core.setFailed('unsupported platform');
            break;
        case 's390x':
            if (node_process_1.platform === 'linux') {
                dlFile = 's390x-unknown-linux-gnu';
                dlHash =
                    '548ba02e63894975488388dc0edc057a0dea8177d2f7852a4ae92205b7341b0b';
            }
            else
                core.setFailed('unsupported platform');
            break;
    }
    if (!dlFile)
        core.setFailed('unsupported or missing platform (rsign2)');
    const tarPath = `${vals_1.TMP_DIR}/rsign.tar.gz`;
    core.debug(`rsign2: \n    dlFile ${dlFile}\n    dlHash ${dlHash}\n    binPath ${tarPath}`);
    await (0, utils_1.downloadFile)(`${RSIGN_DL_URL}${dlFile}.tar.gz`, tarPath);
    // Check tar hash
    const hash = await (0, sha256_1.hashFile)(tarPath);
    if (hash !== dlHash)
        core.setFailed('sha256 hash does not match for rsign2');
    core.debug('Hash matched for rsign');
    // Extract
    core.debug('Extracting rsign');
    exec.execFile(qstract, ['-z', '-C', `${vals_1.TMP_DIR}`, tarPath]);
    let toolPath;
    if (node_process_1.platform === 'win32')
        toolPath = `${vals_1.TMP_DIR}/rsign.exe`;
    else
        toolPath = `${vals_1.TMP_DIR}/rsign`;
    core.debug(`Tool path rsign ${toolPath}`);
    // Check if rsign works
    exec.execFile(toolPath, ['--version']);
    core.info('Installed rsign2');
    return toolPath;
}


/***/ }),

/***/ 84:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = run;
const node_fs_1 = __importDefault(__nccwpck_require__(24));
const node_path_1 = __nccwpck_require__(760);
const core = __importStar(__nccwpck_require__(827));
const exec = __importStar(__nccwpck_require__(937));
const utils_1 = __nccwpck_require__(236);
const vals_1 = __nccwpck_require__(605);
const sha256_1 = __nccwpck_require__(574);
const minisign_1 = __nccwpck_require__(955);
const dl_qstract_1 = __nccwpck_require__(47);
const dl_rsign2_1 = __nccwpck_require__(818);
// TODO: Retry option that runs cargo-prebuilt again if it fails?
async function run() {
    try {
        let prebuiltVersion = core.getInput('prebuilt-version');
        let fallbackVersion;
        let prebuiltTarget = core.getInput('prebuilt-target');
        const prebuiltVerify = core.getInput('prebuilt-verify');
        const pkgs = core.getInput('pkgs');
        const target = core.getInput('target');
        const safe = core.getInput('safe');
        const update = core.getInput('update');
        const index = core.getInput('index');
        const pubKey = core.getInput('pub-key');
        const auth = core.getInput('auth');
        const indexKey = core.getInput('index-key');
        const ci = core.getInput('ci');
        const noSig = core.getInput('no-sig');
        const noHash = core.getInput('no-hash');
        const hashBins = core.getInput('hash-bins');
        const path = core.getInput('path');
        const reportPath = core.getInput('report-path');
        const noCreatePath = core.getInput('no-create-path');
        const reports = core.getInput('reports');
        const config = core.getInput('config');
        const requireConfig = core.getInput('require-config');
        const out = core.getInput('out');
        const getLatest = core.getInput('get-latest');
        const color = core.getInput('color');
        if (prebuiltVersion === 'latest') {
            const latest = (0, utils_1.getVersions)();
            prebuiltVersion = latest[latest.length - 1];
            fallbackVersion = latest[latest.length - 2];
            core.info(`Picked cargo-prebuilt version ${prebuiltVersion} with fallback version ${fallbackVersion}`);
        }
        if (prebuiltTarget === 'current') {
            prebuiltTarget = (0, utils_1.currentTarget)();
        }
        core.setOutput('prebuilt-version', prebuiltVersion);
        core.setOutput('prebuilt-target', prebuiltTarget);
        // Install qstract
        const qstract = await (0, dl_qstract_1.installQstract)();
        // Install rsign2
        let rsignLet = '';
        if (prebuiltVerify === 'minisign') {
            core.debug('Verify method is minisign, downloading rsign2');
            rsignLet = await (0, dl_rsign2_1.installRsign2)(qstract);
        }
        const rsign = rsignLet;
        // Install cargo-prebuilt
        const fileEnding = prebuiltTarget.includes('windows-msvc')
            ? '.zip'
            : '.tar.gz';
        // Download
        const prebuiltPath = `${vals_1.TMP_DIR}/${prebuiltTarget}${fileEnding}`;
        const dl1 = await (0, utils_1.downloadFileWithErr)(`${vals_1.DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`, prebuiltPath);
        if (!dl1) {
            core.warning('Failed to install latest version using fallback version');
            if (fallbackVersion)
                prebuiltVersion = fallbackVersion;
            const dl2 = await (0, utils_1.downloadFileWithErr)(`${vals_1.DL_URL}${prebuiltVersion}/${prebuiltTarget}${fileEnding}`, prebuiltPath);
            if (!dl2)
                core.setFailed('Could not install cargo-prebuilt from fallback');
        }
        // Verify
        if (prebuiltVerify === 'sha256') {
            await (0, sha256_1.verifyFileHash)(prebuiltVersion, prebuiltPath);
            core.info('Verified downloaded archive with sha256 hash');
        }
        else if (prebuiltVerify === 'minisign') {
            await (0, minisign_1.verifyFileMinisign)(prebuiltVersion, `${prebuiltTarget}${fileEnding}`, prebuiltPath, rsign);
            core.info('Verified downloaded archive with minisign');
        }
        // eslint-disable-next-line no-empty
        else if (prebuiltVerify === 'none') {
        }
        else
            core.setFailed('invalid prebuilt-verify type');
        // Extract
        core.debug(`Extracting ${prebuiltPath}`);
        if (prebuiltTarget.includes('windows-msvc'))
            exec.execFile(qstract, ['--zip', '-C', vals_1.TMP_DIR, prebuiltPath]);
        else
            exec.execFile(qstract, ['-z', '-C', vals_1.TMP_DIR, prebuiltPath]);
        let tmpBin = `${vals_1.TMP_DIR}${node_path_1.sep}cargo-prebuilt`;
        let finalBin = `${vals_1.INSTALL_DIR}${node_path_1.sep}cargo-prebuilt`;
        if (prebuiltTarget.includes('windows-msvc')) {
            tmpBin += '.exe';
            finalBin += '.exe';
        }
        exec.execGetOutput(`mv ${tmpBin} ${finalBin}`);
        core.addPath(vals_1.INSTALL_DIR);
        core.info(`Installed cargo-prebuilt@${prebuiltVersion} at ${finalBin}`);
        core.setOutput('prebuilt-binary', finalBin);
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
            const output = exec.execFile(finalBin, args);
            core.setOutput('out', output);
            if (path !== '')
                core.addPath(path);
            core.info(`Installed tools ${pkgs}`);
        }
        core.debug(`Cleaning up tmp dir ${vals_1.TMP_DIR}`);
        node_fs_1.default.rm(vals_1.TMP_DIR, { recursive: true, force: true }, err => {
            if (err)
                core.error(err.message);
        });
        process.exit(0);
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}


/***/ }),

/***/ 955:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyFileMinisign = verifyFileMinisign;
const node_path_1 = __importDefault(__nccwpck_require__(760));
const exec = __importStar(__nccwpck_require__(937));
const vals_1 = __nccwpck_require__(605);
const utils_1 = __nccwpck_require__(236);
async function verifyFileMinisign(version, fileName, filePath, rsign2) {
    const archivePath = node_path_1.default.dirname(filePath);
    const minisignFilePath = `${archivePath}/${fileName}.minisig`;
    await (0, utils_1.downloadFile)(`${vals_1.DL_URL}${version}/${fileName}.minisig`, minisignFilePath);
    exec.execFile(rsign2, [
        'verify',
        `${filePath}`,
        '-P',
        `${vals_1.PREBUILT_INDEX_PUB_KEY}`,
        '-x',
        `${minisignFilePath}`
    ]);
}


/***/ }),

/***/ 574:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyFileHash = verifyFileHash;
exports.hashFile = hashFile;
const node_fs_1 = __nccwpck_require__(24);
const node_crypto_1 = __nccwpck_require__(598);
const vals_1 = __nccwpck_require__(605);
async function verifyFileHash(version, filePath) {
    const res = await fetch(`${vals_1.DL_URL}${version}/hashes.sha256`);
    const sha256File = (await res.text()).trim();
    const fileHash = await hashFile(filePath);
    // This is probably fine, but maybe this should be change later
    if (!sha256File.includes(fileHash))
        throw new Error('sha256 hash does not match');
}
// TODO: Use sha256 from qstract?
async function hashFile(filePath) {
    return new Promise(resolve => {
        const fd = (0, node_fs_1.readFileSync)(filePath);
        const hash = (0, node_crypto_1.createHash)('sha256').update(fd).digest('hex');
        resolve(hash);
    });
}


/***/ }),

/***/ 827:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInput = getInput;
exports.setOutput = setOutput;
exports.info = info;
exports.warning = warning;
exports.error = error;
exports.debug = debug;
exports.setFailed = setFailed;
exports.addPath = addPath;
const node_crypto_1 = __importDefault(__nccwpck_require__(598));
const node_fs_1 = __importDefault(__nccwpck_require__(24));
const node_os_1 = __importDefault(__nccwpck_require__(161));
const node_path_1 = __importDefault(__nccwpck_require__(760));
const node_process_1 = __importDefault(__nccwpck_require__(708));
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
    const val = node_process_1.default.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
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
    const filePath = node_process_1.default.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return issueFileCommand('OUTPUT', prepareKeyValueMessage(name, value));
    }
    node_process_1.default.stdout.write(node_os_1.default.EOL);
    issueCommand('set-output', { name }, toCommandValue(value));
}
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    node_process_1.default.stdout.write(message + node_os_1.default.EOL);
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
    node_process_1.default.exitCode = ExitCode.Failure;
    error(message);
}
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = node_process_1.default.env['GITHUB_PATH'] || '';
    if (filePath) {
        issueFileCommand('PATH', inputPath);
    }
    else {
        issueCommand('add-path', {}, inputPath);
    }
    node_process_1.default.env['PATH'] = `${inputPath}${node_path_1.default.delimiter}${node_process_1.default.env['PATH']}`;
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
    const filePath = node_process_1.default.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!node_fs_1.default.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    node_fs_1.default.appendFileSync(filePath, `${toCommandValue(message)}${node_os_1.default.EOL}`, {
        encoding: 'utf8'
    });
}
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${node_crypto_1.default.randomUUID()}`;
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
    return `${key}<<${delimiter}${node_os_1.default.EOL}${convertedValue}${node_os_1.default.EOL}${delimiter}`;
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
    node_process_1.default.stdout.write(cmd.toString() + node_os_1.default.EOL);
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


/***/ }),

/***/ 937:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.execFile = execFile;
exports.execGetOutput = execGetOutput;
const node_child_process_1 = __nccwpck_require__(421);
function execFile(file, args, options) {
    if (!options)
        options = { encoding: 'utf8' };
    else
        options.encoding = 'utf8';
    return (0, node_child_process_1.execFileSync)(file, args, options);
}
function execGetOutput(command) {
    return (0, node_child_process_1.execSync)(command, {
        encoding: 'utf8'
    });
}


/***/ }),

/***/ 236:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getVersions = getVersions;
exports.currentTarget = currentTarget;
exports.downloadFile = downloadFile;
exports.downloadFileWithErr = downloadFileWithErr;
const node_process_1 = __nccwpck_require__(708);
const node_fs_1 = __importDefault(__nccwpck_require__(24));
const promises_1 = __nccwpck_require__(466);
const node_stream_1 = __nccwpck_require__(75);
const core = __importStar(__nccwpck_require__(827));
const exec = __importStar(__nccwpck_require__(937));
function getVersions() {
    const output = exec.execGetOutput('git ls-remote --tags --refs https://github.com/cargo-prebuilt/cargo-prebuilt.git');
    const re = /v((\d+)\.(\d+)\.(\d+))[^-]/g;
    const tmp = [...output.matchAll(re)].map(a => {
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
    switch (node_process_1.arch) {
        case 'arm':
            if (node_process_1.platform === 'linux')
                return 'armv7-unknown-linux-gnueabihf';
            else
                core.setFailed('unsupported platform');
            break;
        case 'arm64':
            if (node_process_1.platform === 'linux')
                return 'aarch64-unknown-linux-gnu';
            else if (node_process_1.platform === 'darwin')
                return 'aarch64-apple-darwin';
            else
                core.setFailed('unsupported platform');
            break;
        case 'riscv64':
            if (node_process_1.platform === 'linux')
                return 'riscv64gc-unknown-linux-gnu';
            else
                core.setFailed('unsupported platform');
            break;
        case 's390x':
            if (node_process_1.platform === 'linux')
                return 's390x-unknown-linux-gnu';
            else
                core.setFailed('unsupported platform');
            break;
        case 'x64':
            if (node_process_1.platform === 'linux')
                return 'x86_64-unknown-linux-gnu';
            else if (node_process_1.platform === 'darwin')
                return 'x86_64-apple-darwin';
            else if (node_process_1.platform === 'win32')
                return 'x86_64-pc-windows-msvc';
            else if (node_process_1.platform === 'freebsd')
                return 'x86_64-unknown-freebsd';
            else
                core.setFailed('unsupported platform');
            break;
    }
    core.setFailed('unsupported or missing platform');
    return 'NULL';
}
async function downloadFile(url, path) {
    if (!(await downloadFileWithErr(url, path)))
        core.setFailed(`Could not download ${url}`);
}
async function downloadFileWithErr(url, path) {
    core.debug(`Started download of ${url} to ${path}`);
    const res = await fetch(url);
    if (res.status === 200) {
        const stream = node_fs_1.default.createWriteStream(path, { flags: 'w' });
        // @ts-expect-error body stream should not be null
        await (0, promises_1.finished)(node_stream_1.Readable.fromWeb(res.body).pipe(stream));
        core.debug(`Finished download of ${url} to ${path}`);
        return true;
    }
    core.debug(`Could not download ${url}`);
    return false;
}


/***/ }),

/***/ 605:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TMP_DIR = exports.INSTALL_DIR = exports.PREBUILT_INDEX_PUB_KEY = exports.DL_URL = void 0;
const node_fs_1 = __importDefault(__nccwpck_require__(24));
const node_path_1 = __importDefault(__nccwpck_require__(760));
const node_os_1 = __importDefault(__nccwpck_require__(161));
exports.DL_URL = 'https://github.com/cargo-prebuilt/cargo-prebuilt/releases/download/v';
exports.PREBUILT_INDEX_PUB_KEY = 'RWTSqAR1Hbfu6mBFiaz4hb9I9gikhMmvKkVbyz4SJF/oxJcbbScmCqqO';
exports.INSTALL_DIR = node_path_1.default.join(node_os_1.default.homedir(), '.cargo/bin');
exports.TMP_DIR = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), 'cargo-prebuilt-'));


/***/ }),

/***/ 421:
/***/ ((module) => {

module.exports = require("node:child_process");

/***/ }),

/***/ 598:
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ 24:
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ 161:
/***/ ((module) => {

module.exports = require("node:os");

/***/ }),

/***/ 760:
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),

/***/ 708:
/***/ ((module) => {

module.exports = require("node:process");

/***/ }),

/***/ 75:
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ 466:
/***/ ((module) => {

module.exports = require("node:stream/promises");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __nccwpck_require__(84);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(0, main_1.run)();

})();

module.exports = __webpack_exports__;
/******/ })()
;