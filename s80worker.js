function fetchWithTimeout(url, timeout = 7000) {
    let options = {
        cache: "no-store",
        mode: "no-cors"
    }; // specify no-store cache control
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}
function measureResponse(myRes) {
    if (myRes.ok) {
        return myRes.blob();
    }
    else {
        console.log("error; response code: " + myRes.status);
    }
}
self.onmessage = function (event) {
    let startTime = performance.now();
    fetchWithTimeout(`https://s80.us/beta/128k.jpg`)
        .then(measureResponse)
        .then(endTime => {
            let completeTime = performance.now();
            if (completeTime - startTime <= 0) {
                console.log("error: Impossibly short request (likely caused by Spectre mitigation in your browser reducing timer accuracy)");
                console.log("completeTime: " + completeTime);
                console.log("startTime: " + startTime);
                postMessage(1);
            }
            else
                postMessage(Math.ceil(completeTime - startTime));
        });
};
