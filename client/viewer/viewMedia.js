const viewer = new Viewer({
  renderTo: 'video#player1',
  announceList: ['ws://127.0.0.1:9000']
})


$('#button-download').click(function () {
  viewer.start($('#magnetLink').val())
})

$('#button-replay').click(function () {
  var video = $('video#player1')[0]
  video.currentTime = 0
  video.play()
})