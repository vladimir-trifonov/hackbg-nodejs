module.exports = {
	repeatEvery: repeatEvery
}

function repeatEvery(func, interval) {
    var now = new Date(),
        delay = interval - now % interval;

    function start() {
        func();
        setInterval(func, interval);
    }
    
    setTimeout(start, delay);
}