// Schedule only the first 800 ms on the audio clock, independent of UI timers.
var GameSounds = (function() {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    var context;
    var buffers = {};
    if (AudioContextClass) {
        try {
            context = new AudioContextClass();
            ['circle', 'cross', 'line'].forEach(function(name) {
                buffers[name] = fetch('assets/' + name + '.wav')
                    .then(function(response) {
                        if (!response.ok) throw Error('Sound unavailable: ' + name);
                        return response.arrayBuffer();
                    })
                    .then(function(data) { return context.decodeAudioData(data); })
                    .catch(function() { return null; });
            });
        } catch (error) { /* Gameplay remains available without audio. */ }
    }

    function unlock() {
        if (context && context.state === 'suspended') context.resume().catch(function() {});
    }
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);

    return {
        play: function(name) {
            if (Preferences.get().vfx === '0' || !context || !buffers[name]) return;
            unlock();
            buffers[name].then(function(buffer) {
                if (Preferences.get().vfx === '0' || !buffer || context.state !== 'running') return;
                var source = context.createBufferSource();
                source.buffer = buffer;
                source.connect(context.destination);
                source.onended = function() { source.disconnect(); };
                source.start(0, 0, Math.min(0.8, buffer.duration));
            });
        }
    };
})();
