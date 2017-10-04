var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: 'blue',
  progressColor: 'purple',
  splitChannels: true,
  height: 128
});

wavesurfer.load('../data/multichannel_lower.wav');

wavesurfer.on('ready', function () {
  var timeline = Object.create(WaveSurfer.Timeline);

  timeline.init({
    wavesurfer: wavesurfer,
    container: '#waveform-timeline'
  });
});