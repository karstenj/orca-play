'use strict'

/* global library */

function OrcaPlay (client) {
    this.el = document.createElement('div')
    this.el.id = 'orcaplay'
  
    this.acels = client.acels
    this.channel = 0

    const enferBridge = {
        send: (msg) => {
          this.onMessage({ data: msg });
        },
        name: 'enferBridge',
      };
    
    client.io.midi.outputDevice = () => enferBridge;
  
    this.install = (host = document.body) => {
      this.rack = new Rack(this)
      this.mixer = new Mixer(this)
      /*this.acels.set('Play', 'Test Midi', 'X', () => { this.rack.play(this.channel, 0) })
      this.acels.set('Play', 'Test Midi', 'C', () => { this.rack.play(this.channel, 1) })
      this.acels.set('Play', 'Test Midi', 'V', () => { this.rack.play(this.channel, 2) })
      this.acels.set('Play', 'Test Midi', 'Z', () => { this.rack.play(this.channel, 3) })
      this.acels.set('Play', 'Test Midi', 'S', () => { this.rack.play(this.channel, 4) })
      this.acels.set('Play', 'Test Midi', 'D', () => { this.rack.play(this.channel, 5) })
      this.acels.set('Play', 'Test Midi', 'F', () => { this.rack.play(this.channel, 6) })
      this.acels.set('Play', 'Test Midi', 'G', () => { this.rack.play(this.channel, 7) })
      this.acels.set('Play', 'Test Midi', 'E', () => { this.rack.play(this.channel, 8) })
      this.acels.set('Play', 'Test Midi', 'R', () => { this.rack.play(this.channel, 9) })
      this.acels.set('Play', 'Test Midi', 'T', () => { this.rack.play(this.channel, 10) })
      this.acels.set('Play', 'Test Midi', 'Y', () => { this.rack.play(this.channel, 11) })
      this.acels.set('Play', 'Test Midi', '4', () => { this.rack.play(this.channel, 12) })
      this.acels.set('Play', 'Test Midi', '5', () => { this.rack.play(this.channel, 13) })
      this.acels.set('Play', 'Test Midi', '6', () => { this.rack.play(this.channel, 14) })
      this.acels.set('Play', 'Test Midi', '7', () => { this.rack.play(this.channel, 15) })
  
      this.acels.set('Play', 'Next', ']', () => { this.modChannel(1) })
      this.acels.set('Play', 'Prev', '[', () => { this.modChannel(-1) })*/
  
      this.mixer.install(this.el)
      this.rack.install(this.el)
      host.appendChild(this.el)
    }
  
    this.start = (bpm = 120) => {
      console.info('Enfer', 'Starting..')
      console.info(`${this.acels}`)
      this.mixer.setBpm(bpm)
     }
  
    this.modChannel = (mod) => {
      this.channel += mod
      this.channel = this.channel % 16
      console.log('Enfer Channel', this.channel)
    }

    this.onMessage = (msg) => {
        if (msg.data[0] >= 144 && msg.data[0] < 160) {
          const ch = msg.data[0] - 144
          const pad = msg.data[1] - 24
          const vel = msg.data[2]
          this.rack.play(ch, pad, vel)
        } else if (msg.data[0] >= 176 && msg.data[0] < 184) {
          const ch = msg.data[0] - 176
          const knob = msg.data[1] - 1
          const vel = msg.data[2]
          this.mixer.tweak(ch, knob, vel)
        }
    }  
    
    library['/'] = function OperatorToneJS (orca, x, y, passive) {
      Operator.call(this, orca, x, y, '/', true)
    
      this.name = 'ToneJS'
      this.info = 'Sends to ToneJS'
      this.ports.channel = { x: 1, y: 0 }
      this.ports.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } }
      this.ports.note = { x: 3, y: 0 }
      this.ports.velocity = { x: 4, y: 0, default: 'f', clamp: { min: 0, max: 16 } }
      this.ports.length = { x: 5, y: 0, default: '1', clamp: { min: 0, max: 32 } }
    
      this.operation = function (force = false) {
        if (!this.hasNeighbor('*') && force === false) { return }
        if (this.listen(this.ports.channel) === '.') { return }
        if (this.listen(this.ports.octave) === '.') { return }
        if (this.listen(this.ports.note) === '.') { return }
        if (!isNaN(this.listen(this.ports.note))) { return }
    
        const channel = this.listen(this.ports.channel, true)
        if (channel > 15) { return }
        const octave = this.listen(this.ports.octave, true)
        const note = this.listen(this.ports.note)
        const velocity = this.listen(this.ports.velocity, true)
        const length = this.listen(this.ports.length, true)
    
        client.io.midi.push(channel, octave, note, velocity, length)
    
        if (force === true) {
          client.io.midi.run()
        }
    
        this.draw = false
      }
    }
}
  