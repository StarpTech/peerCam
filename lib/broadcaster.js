'use strict'

// API https://github.com/webtorrent/webtorrent/blob/master/docs/api.md

const MediaStreamRecorder = require('msr')
const WebTorrent = require('webtorrent')

const defaultOptions = {
  announceList: [],
  seconds: 3000,
  mediaConstraints: {
    audio: true, // don't forget audio!
    video: true // don't forget video!
  }
}

class Broadcaster {
  constructor (options = {}) {
    this._webTorrentClient = new WebTorrent()
    this._mediaStreamRecorder = require('msr')
    this._options = Object.assign(defaultOptions, options)
  }
  start () {
    this.getUserMedia()
  }
  stop () {
    this._mediaRecorder.stop()
  }
  pause () {
    this._mediaRecorder.pause()
  }
  resume () {
    this._mediaRecorder.resume()
  }
  getUserMedia () {
    navigator.getUserMedia(this._options.mediaConstraints, this.onMediaSuccess.bind(this), this.onMediaError.bind(this))
  }
  onMediaSuccess (stream) {
    const videoTracks = stream.getVideoTracks()
    console.log('Got stream with constraints:', this._options.mediaConstraints)
    console.log('Using video device: ' + videoTracks[0].label)

    stream.oninactive = function () {
      console.log('Stream inactive')
    }

    this._mediaRecorder = new MediaStreamRecorder(stream)
    this._mediaRecorder.mimeType = 'video/webm'
    this._mediaRecorder.ondataavailable = (blob) => {
      const file = new File([blob], 'peerCam.webm', {
        type: 'video/webm'
      })

      const opts = {
        announce: this._options.announceList,
        dht: false
      }

      this._webTorrentClient.seed(file, opts, (torrent) => {
        torrent.on('upload', function (bytes) {
          console.log('Data uploaded!')
        })

        torrent.on('wire', function (wire, addr) {
          console.log('Connected to peer with address ' + addr)
        })

        console.log('Client is seeding ' + torrent.magnetURI)
      })
    }

    this._mediaRecorder.start(this._options.seconds)
  }
  onMediaError (error) {
    if (error.name === 'PermissionDeniedError') {
      console.error('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.')
    }
    console.error('getUserMedia error: ' + error.name, error)
  }
}

module.exports = Broadcaster
