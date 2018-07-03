import Log from './log'

function isRunningAsar() {
    return process.mainModule.filename.indexOf('app.asar') !== -1;
}

export function launchProc(exePath, params) {
    const { execFile } = require('child_process');
    var executablePath = ``;

    const path = require('path');
    executablePath = path.join(__dirname, exePath);
    // if(isRunningAsar()) {
    //     const path = require('path');
    //     executablePath = path.join(__dirname, exePath);
    // }
    // else {
    //     executablePath = `${process.resourcesPath}/app/${exePath}`;
    // }

    Log.info(`executablePath : ${executablePath}`);

    execFile(executablePath, params, function(err, data) {
        Log.info(err);
        Log.info(data);
    });
}