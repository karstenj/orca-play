'use strict'

function OrcaPlay () {
    const { orcaClient, Operator } = document.getElementById('orca-iframe').contentWindow;
    const { pilotClient } = document.getElementById('pilot-iframe').contentWindow;

    this.orcaClient = orcaClient
    this.pilotClient = pilotClient
    this.io = new IOWrapper(this)
    const orcaPlay = this

    this.install = (host = document.body) => {
      this.io.install(host)
    }

    this.start = (bpm = 120) => {
      console.info('OrcaPlay', 'Starting..')
      this.io.start()
    }

    orcaClient.library[';'] = function OperatorPilotNote (orca, x, y, passive) {
      Operator.call(this, orca, x, y, ';', true)
    
      this.name = 'pilot synth'
      this.info = 'PILOT synth/sampler'
    
      this.operation = function (force = false) {
        let msg = ''
        for (let x = 1; x <= 36; x++) {
          const g = orca.glyphAt(this.x + x, this.y)
          orca.lock(this.x + x, this.y)
          if (g === '.') { break }
          msg += g
        }
    
        if (msg.length < 3) { return }
        if (!this.hasNeighbor('*') && force === false) { return }
    
        this.draw = false
        orcaPlay.io.io_pilot.push_note(msg)
    
        if (force === true) {
          orcaPlay.io.io_pilot.run_note()
        }
      }
    }
    orcaClient.library['='] = function OperatorPilotEffect (orca, x, y, passive) {
      Operator.call(this, orca, x, y, ';', true)
    
      this.name = 'pilot effect/drum'
      this.info = 'PILOT effect/drum'
    
      this.operation = function (force = false) {
        let msg = ''
        for (let x = 1; x <= 36; x++) {
          const g = orca.glyphAt(this.x + x, this.y)
          orca.lock(this.x + x, this.y)
          if (g === '.') { break }
          msg += g
        }
    
        if (msg.length < 2) { return }
        if (!this.hasNeighbor('*') && force === false) { return }
    
        this.draw = false
        orcaPlay.io.io_pilot.push_effect(msg)
    
        if (force === true) {
          orcaPlay.io.io_pilot.run_effect()
        }
      }
    }
}
  
window.onload = () => {
  const orcaPlay = new OrcaPlay()
  orcaPlay.install(document.body)
  orcaPlay.start()
};
