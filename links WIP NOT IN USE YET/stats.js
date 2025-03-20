const requestCounter = document.getElementById("requestcounter");
const sizeCounter = document.getElementById("sizecounter");
const formatObject = Intl.NumberFormat("en-US");

async function getStats() {
    const statsResponse = await fetch(
        "/edge-api/getStats"
    );
    const stats = await statsResponse.json();

    for (let i=0; i < stats.length; i++) {
        if (stats[i].stat_name === "request_count") {
            requestCounter.innerText = formatObject.format(stats[i].stat_value);
        }
        if (stats[i].stat_name === "request_size") {
            sizeCounter.innerText = formatObject.format(
                Math.round(stats[i].stat_value / 1073741824)
            );
        }
    }
}

document.addEventListener("load", getStats());