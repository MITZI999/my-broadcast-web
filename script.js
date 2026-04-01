// Replace this with your Pterodactyl Server IP and Port
const SERVER_URL = "http://154.26.130.68:25664"; 

async function getPair() {
    const cc = document.getElementById('cc').value;
    const num = document.getElementById('num').value;
    const log = document.getElementById('log');

    if (!num) {
        alert("Please enter your phone number!");
        return;
    }

    log.innerText = "SYSTEM: CONNECTING TO SERVER...";
    log.style.color = "#00d4ff";

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(`${SERVER_URL}/get-pair?number=${cc}${num}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.code) {
            await navigator.clipboard.writeText(data.code);
            log.innerText = "SUCCESS: " + data.code + " (COPIED)";
            log.style.color = "#00ff00";
            alert("Pairing Code: " + data.code + "\n\nCopied to clipboard!");
        } else {
            log.innerText = "SYSTEM: NO RESPONSE FROM SERVER";
            log.style.color = "#ffae00";
        }

    } catch (error) {
        console.error("Error:", error);
        log.innerText = "ERROR: CONNECTION BLOCKED";
        log.style.color = "#ff4d4d";

        // Instructions for the user if blocked
        const fix = confirm("Connection Blocked!\n\nTo fix this, allow 'Insecure Content' in site settings.\n\nClick OK for instructions.");
        if (fix) {
            alert("1. Click the Lock icon in URL bar\n2. Go to Site Settings\n3. Set 'Insecure Content' to ALLOW\n4. Refresh the page.");
        }
    }
}

// Check if server is online
async function checkStatus() {
    const statusText = document.getElementById('status-text');
    try {
        const r = await fetch(`${SERVER_URL}/get-pair?number=ping`);
        if (r.ok) {
            statusText.innerText = "V5.0 | ONLINE";
            statusText.style.color = "#00ff00";
        }
    } catch (e) {
        statusText.innerText = "V5.0 | LOST";
        statusText.style.color = "#ff4d4d";
    }
}

// Auto check status every 5 seconds
setInterval(checkStatus, 5000);
