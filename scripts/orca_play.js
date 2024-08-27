import { orcaExamples } from './examples.js'
import Share from './share.js'
import IOWrapper from './io_wrapper.js'
'use strict'

function OrcaPlay() {
  const { orcaClient, Operator } = document.getElementById('orca-iframe').contentWindow;
  const { pilotClient } = document.getElementById('pilot-iframe').contentWindow;

  this.orcaClient = orcaClient
  this.pilotClient = pilotClient
  this.io = new IOWrapper(this)
  this.share = new Share()
  this.guide = false
  this.pilot = true

  const isMac = navigator.platform.match(/^(?:Mac|iP)/)
  const modifierKey = isMac ? '⌘' : 'Ctrl'
  const alpOptKey = isMac ? '⌥' : 'Alt'
  const shiftKey = isMac ? '⇧' : 'Shift'
  const orcaPlay = this
  const orca = orcaPlay.orcaClient;

  this.install = (host = document.body) => {
    this.addAccels()
    // install IO
    this.io.install(host)
    // add key handler for orca accels
    host.addEventListener('keydown', orca.acels.onKeyDown, false)
    host.addEventListener('keyup', orca.acels.onKeyUp, false)
    // add theme element
    host.appendChild(orca.theme.el)
    // read code from URL
    this.share.initCode().then((code) => {
      if (code) {
        orca.whenOpen(undefined, code)
        this.toggleGuide()
        orca.cursor.select(0, 0, 0, 0)
      }
    })
    // set cursor
    // add pilot command handler
    orca.commander.actives["note"] = (p) => {
      this.pilotNote(p.str)
    }
    orca.commander.actives["not"] = (p) => {
      this.pilotNote(p.str)
    }
    orca.commander.actives["effect"] = (p) => {
      this.pilotEffect(p.str)
    }
    orca.commander.actives["eff"] = (p) => {
      this.pilotEffect(p.str)
    }

    this.guideContent = ['Operators'];
    Object.entries(orca.library)
      .forEach(([key, op]) => {
        if (!isNaN(key)) return;
        this.guideContent.push([key, new op().info]);
      });

    const cats = orca.acels.sort();
    for (const cat in cats) {
      this.guideContent.push(cat);
      for (const item of cats[cat]) {
        if (item.accelerator) {
          this.guideContent.push([item.accelerator
            .replace(/CmdOrCtrl/, modifierKey)
            .replace(/Alt\+/i, `${alpOptKey}+`)
            .replace(/Shift\+/i, `${shiftKey}+`)
            .replace('ArrowUp', '↑')
            .replace('ArrowRight', '→')
            .replace('ArrowDown', '↓')
            .replace('ArrowLeft', '←')


            , item.name]);
        }
      }
    }

    orca.drawGuide = () => {
      if (orca.guide !== true) { return }

      orca.write('ORCΛ PLΛY', 2, 0, 100, 4)
      orca.write('A combination of the famous Orca esoteric programming language', 2, 1, 100, 10)
      orca.write('and the Pilot synthesizer that allows to run Orca in a browser', 2, 2, 100, 10)
      orca.write(`without additional setup. Press ${modifierKey}+R for an example.`, 2, 3, 100, 10)

      const lines = orca.orca.h - 7
      let n = 0;
      let width = 1;
      const col = 32;

      for (const line of this.guideContent) {
        const x = 2 + 32 * ((n / lines) | 0)
        const y = 5 + (n % lines)

        if (line instanceof Array) {
          orca.write(line[0], x, y, width, 3)
          orca.write(line[1], x + line[0].length + 1, y, col - width - 1, 10)
        }
        else if (line.length < 15) { // category title
          orca.write(line, x, y, col, 8)
          let i = 1;
          width = -Infinity;
          while (n + i < this.guideContent.length && this.guideContent[n + i] instanceof Array) {
            width = Math.max(width, this.guideContent[n + i][0].length);
            ++i;
          }
        }
        else { // any text
          orca.write(line, x, y, col, 3)
        }

        ++n;
      }
    }
  }

  this.start = () => {
    console.info('OrcaPlay', 'Starting..')
    this.io.start()
  }

  this.addAccels = () => {
    orca.acels.set('View', 'Hide Pilot', 'CmdOrCtrl+H', () => { this.hidePilot() })
    orca.acels.set('File', 'Load Random Example', 'CmdOrCtrl+R', () => { this.randomExample() })
    orca.acels.set('File', 'Share Link', 'CmdOrCtrl+#', () => { this.shareLink() })
  }

  this.hidePilot = () => {
    const pilot = document.getElementById('pilot');
    const orca = document.getElementById('orca');
    if (this.pilot) {
      pilot.classList.add('hidden')
      pilot.classList.remove('pilot_visible')
      orca.classList.add('orca_full_screen')
      orca.classList.remove('orca_shared_screen')
    } else {
      pilot.classList.remove('hidden')
      pilot.classList.add('pilot_visible')
      orca.classList.remove('orca_full_screen')
      orca.classList.add('orca_shared_screen')
    }
    this.pilot = !this.pilot
  }

  this.randomExample = () => {
    if (this.guide) {
      this.toggleGuide();
    }
    const keys = Object.keys(orcaExamples)
    const key = keys[Math.floor(Math.random() * keys.length)];
    console.log('Loading ' + key)
    orca.whenOpen(undefined, orcaExamples[key])
  }

  this.shareLink = () => {
    this.share.handleShare(`${orca.orca}`)
  }

  this.pilotNote = (command) => {
    this.pilotClient.mixer.run_note(command)
  }

  this.pilotEffect = (command) => {
    this.pilotClient.mixer.run_effect(command)
  }

  orcaClient.library[';'] = function OperatorPilotNote(orca, x, y, passive) {
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
  orcaClient.library['='] = function OperatorPilotEffect(orca, x, y, passive) {
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
