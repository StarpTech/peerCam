'use strict'

// API https://github.com/webtorrent/webtorrent/blob/master/docs/api.md

const MediaStreamRecorder = require('msr')
const WebTorrent = require('webtorrent')
const EventEmitter = require('eventemitter3')

const defaultOptions = {
  seconds: 8000,
  announceList: [],
  mediaConstraints: {
    audio: true, // don't forget audio!
    video: true // don't forget video!
  }
}

class Viewer extends EventEmitter {
  constructor(options = {}) {
    super()
    this._webTorrentClient = new WebTorrent()
    this._options = Object.assign(defaultOptions, options)
  }
  start(magnetURI) {

    const opts = {
      announce: this._options.announceList,
      // store: // Custom chunk store (must follow [abstract-chunk-store](https://www.npmjs.com/package/abstract-chunk-store) API)
      getAnnounceOpts: function () {
        return {
          customUsername: 'fooBar'
        }
      },
      dht: false
    }

    this._webTorrentClient.add(magnetURI, opts, (torrent) => {
      /* Look for the file that ends in .webm and render it, in the future we can
       * add additional file types for scaling. E.g other video formats or even VR!
       */

      let file = torrent.files.find((file) => {
        return file.name.endsWith('.webm')
      })

      torrent.on('download', function (bytes) {
        console.log('just downloaded: ' + bytes)
        console.log('total downloaded: ' + torrent.downloaded);
        console.log('download speed: ' + torrent.downloadSpeed)
        console.log('progress: ' + torrent.progress)
      })

      torrent.on('wire', function (wire, addr) {
        console.log('Connected to peer with address ' + addr)
      })

      // Stream the file in the browser
      file.renderTo(this._options.renderTo, {
        autoplay: true
      })

      // listens for when torrents are done and appends total downloaded to menu
      torrent.on('done', () => {
        console.log('Torrent done')
      })
    })
  }
}

module.exports = Viewer