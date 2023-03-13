'use strict'

function OrcaPlay () {
  const { orcaClient, Operator } = document.getElementById('orca-iframe').contentWindow;
  const { pilotClient } = document.getElementById('pilot-iframe').contentWindow;


  this.orcaClient = orcaClient
  this.orcaClient.toggleGuide(false);    
  this.pilotClient = pilotClient
  this.io = new IOWrapper(this)
  this.guide = false
  const orcaPlay = this

  this.install = (host = document.body) => {
    this.addAccels()
    const infoClose = document.getElementById('info-close');      
    const infoContainer = document.getElementById('info-container');     
    const infoContent = document.getElementById('info-content'); 
    // add close handler
    infoClose.addEventListener('click', () => {
      this.toggleGuide()
    })
    // heading in info box
    const head = document.createElement('h1')
    head.innerHTML = 'ORCΛ PLΛY'
    infoContent.appendChild(head)
    // render guide
    const guideInfo = document.createElement('div')
    this.renderGuide(guideInfo)
    infoContent.appendChild(guideInfo)
    // render accelerators
    const acclsInfo = document.createElement('div')
    this.renderAccels(acclsInfo)
    infoContent.appendChild(acclsInfo)
    // install IO
    this.io.install(host)
    // hide orca guide
    this.toggleGuide()
    // add key handler for orca accels
    host.addEventListener('keydown', this.orcaClient.acels.onKeyDown, false)
    host.addEventListener('keyup', this.orcaClient.acels.onKeyUp, false)  
    // add theme element
    host.appendChild(this.orcaClient.theme.el)
    // add pilot command handler
    this.orcaClient.commander.actives["note"] = (p) => {
      this.pilotNote(p.str)
    }
    this.orcaClient.commander.actives["not"] = (p) => {
      this.pilotNote(p.str)
    }
    this.orcaClient.commander.actives["effect"] = (p) => {
      this.pilotEffect(p.str)
    }
    this.orcaClient.commander.actives["eff"] = (p) => {
      this.pilotEffect(p.str)
    }
  }

  this.start = (bpm = 120) => {
    console.info('OrcaPlay', 'Starting..')
    this.io.start()
  }

  this.renderGuide = (guideInfo) => {
    const head = document.createElement('h2')
    head.innerHTML = 'Operators'
    guideInfo.appendChild(head)
    const table = document.createElement('table')
    table.classList.add('table')
    guideInfo.appendChild(table)
    const thead = document.createElement('thead')
    table.appendChild(thead)
    var row = document.createElement('tr')
    thead.appendChild(row)
    var col = document.createElement('th')
    col.innerHTML = 'Operator'
    row.appendChild(col)
    col = document.createElement('th')
    col.innerHTML = 'Description'
    row.appendChild(col)
    const tbody = document.createElement('tbody')
    table.appendChild(tbody)
    const operators = Object.keys(this.orcaClient.library).filter((val) => { return isNaN(val) })
    for (const id in operators) {
      const key = operators[id]
      const oper = new this.orcaClient.library[key]()
      const text = oper.info
      row = document.createElement('tr')
      tbody.appendChild(row)
      col = document.createElement('td')
      col.innerHTML = key
      row.appendChild(col)
      col = document.createElement('td')
      col.innerHTML = text
      row.appendChild(col)
    }
  }

  this.renderAccels = (acclsInfo) => {
    const head = document.createElement('h2')
    head.innerHTML = 'Accelerators'
    acclsInfo.appendChild(head)
    const table = document.createElement('table')
    table.classList.add('table')
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
    for (const cat in cats) {
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

  this.addAccels = () => {
    this.orcaClient.acels.set('View', 'Toggle Guide', 'CmdOrCtrl+G', () => { this.toggleGuide() })      
  }

  this.toggleGuide = () => {
    const infoContainer = document.getElementById('info-container');
    if (this.guide) {
      infoContainer.classList.add('hidden');
      infoContainer.classList.remove('flex');
    } else {
      infoContainer.classList.remove('hidden');
      infoContainer.classList.add('flex');        
    }
    this.guide = !this.guide
  }

  this.pilotNote = (command) => {
    this.pilotClient.mixer.run_note(command)
  }

  this.pilotEffect = (command) => {
    this.pilotClient.mixer.run_effect(command)
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
