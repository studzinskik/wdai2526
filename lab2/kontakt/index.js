function chrono(clock) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

var clock = document.querySelector("#clock");

if (clock) {
    chrono(clock);
    setInterval(chrono, 1000, clock);
}