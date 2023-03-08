'use strict'

function OrcaPlay () {
    const { orcaClient, Operator } = document.getElementById('orca-iframe').contentWindow;
    const { pilotClient } = document.getElementById('pilot-iframe').contentWindow;


    this.orcaClient = orcaClient
    this.pilotClient = pilotClient
    this.io = new IOWrapper(this)
    const orcaPlay = this

    this.install = (host = document.body) => {
      const infoClose = document.getElementById('info-close');      
      const infoContainer = document.getElementById('info-container');     
      const infoContent = document.getElementById('info-content'); 
      infoClose.addEventListener('click', () => {
        infoContainer.classList.add('hidden');
        infoContainer.classList.remove('flex');
      })
      const acclsInfo = document.createElement('div')
      this.renderAccels(acclsInfo)
      infoContent.appendChild(acclsInfo)
      this.io.install(host)
    }

    this.start = (bpm = 120) => {
      console.info('OrcaPlay', 'Starting..')
      this.io.start()
    }

    this.renderAccels = (acclsInfo) => {
      const head = document.createElement('h2')
      head.innerHTML = 'Accelerators'
      acclsInfo.appendChild(head)
      const table = document.createElement('table')
      acclsInfo.appendChild(table)
      const thead = document.createElement('thead')
      table.appendChild(thead)
      var row = document.createElement('tr')
      thead.appendChild(row)
      var col = document.createElement('th')
      col.innerHTML = 'Key'
      row.appendChild(col)
      col = document.createElement('th')
      col.innerHTML = 'Function'
      row.appendChild(col)
      const tbody = document.createElement('tbody')
      table.appendChild(tbody)
      const cats = this.orcaClient.acels.sort()
      let text = ''
      for (const cat in cats) {
        text += `\n### ${cat}\n\n`
        for (const item of cats[cat]) {
          if (item.accelerator) {
            row = document.createElement('tr')
            tbody.appendChild(row)
            col = document.createElement('td')
            col.innerHTML = item.accelerator.replace('`', 'tilde')
            row.appendChild(col)
            col = document.createElement('td')
            col.innerHTML = item.name
            row.appendChild(col)
          }
        }
      }
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
