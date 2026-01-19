let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(f, d, t) {
    initAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(0.15, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + d);
}

export const playPickupSound = () => playTone(600, 0.08, 'sine');
export const playRecycleSound = () => {
    playTone(900, 0.1, 'triangle');
    setTimeout(() => playTone(1200, 0.1, 'triangle'), 120);
};