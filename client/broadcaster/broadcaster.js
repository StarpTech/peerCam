const broadcaster = new Broadcaster({
  announceList: ['ws://127.0.0.1:9000']
});

$('#button-play-gum').click(function() {
  broadcaster.start()
})

$('#button-stop-gum').click(function() {
  broadcaster.stop()
})
