'use strict'

/* global Kit */

function Rack (client) {
  this.el = document.createElement('div')
  this.el.id = 'rack'
  this.isReady = false

  this.kits = []

  this.install = (host) => {
    host.appendChild(this.el)

    // Drum Kits
    this.add(new Kit('tr808', client)) // saw-acid
    this.add(new Kit('tr909', client)) // square-acid
    this.add(new Kit('dmx', client)) // FM square
    this.add(new Kit('dnb', client)) // Solid Bass(DX100)
    this.add(new Kit('dark', client)) // Odyssey(Arp B)
    this.add(new Kit('deep', client)) // Solina(Cello)
    this.add(new Kit('tech', client)) // Attack Lead(Aelita)
    this.add(new Kit('modular', client)) // Good Vibes(DX100)
    this.add(new Kit('gabber', client)) // Kulak Decay(Altair 231)
    this.add(new Kit('bergh', client)) // Tiny Rave(DX100)
    this.add(new Kit('vermona', client)) // Funk Bass(Aelita)
    this.add(new Kit('commodore', client)) // Troika Pulse(Altair 231)
    this.add(new Kit('dmg', client)) // Comecon(Altair 231)

    // Sampler Kits

    for (const kit of this.kits) {
      kit.install(this.el)
    }
  }

  this.add = (kit) => {
    console.log('Rack', 'Adding ' + kit.name)
    this.kits.push(kit)
  }

  this.start = () => {
    console.log('Starting')

    for (const kit of this.kits) {
      kit.start()
      kit.connect(client.mixer)
    }
    client.mixer.start()
    client.io.start()
  }

  this.update = () => {
    for (const kit of this.kits) {
      if (!kit.isReady) {
        return
      }
    }
    console.log('Loading complete.')
    this.isReady = true
    this.start()
  }

  this.play = (ch, pad, vel = 127) => {
    if (!this.isReady) { console.log('Rack', 'Still loading..'); return }
    if (!this.kits[ch]) { console.warn('Rack', 'Missing kit ', ch); return }
    this.kits[ch].play(pad, vel)
  }
}
