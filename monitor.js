const os = require('os');
const { exec } = require('node:child_process');

let previousIdle = 0;
let previousTotal = 0;

const checkCPUUsage = () => {
    const cpus = os.cpus();
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;

    // Accumulate CPU times
    for (const cpu of cpus) {
        user += cpu.times.user;
        nice += cpu.times.nice;
        sys += cpu.times.sys;
        idle += cpu.times.idle;
        irq += cpu.times.irq;
    }

    const total = user + nice + sys + idle + irq;
    // Calculate usage since last check
    const idleDifference = idle - previousIdle;
    const totalDifference = total - previousTotal;

    previousIdle = idle;
    previousTotal = total;

    const usage = (1 - (idleDifference / totalDifference)) * 100;
    return usage;
};

const monitorCPU = () => {
    const usage = checkCPUUsage();
    console.log(`Current CPU Usage: ${usage.toFixed(2)}%`);

    if (usage > 70) {
        console.log('CPU usage exceeded 70%, restarting server...');
        exec('pm2 restart all', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error restarting server: ${err}`);
                return;
            }
            console.log(`Server restarted successfully. ${stdout}`);
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
        });
    }
};

// Initialize previous values
const initializePreviousValues = () => {
    const cpus = os.cpus();
    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;

    for (const cpu of cpus) {
        user += cpu.times.user;
        nice += cpu.times.nice;
        sys += cpu.times.sys;
        idle += cpu.times.idle;
        irq += cpu.times.irq;
    }

    previousIdle = idle;
    previousTotal = user + nice + sys + idle + irq;
};

// Initialize and start monitoring
initializePreviousValues();
setInterval(monitorCPU, 5000);
