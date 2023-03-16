import IOPilot from './io_pilot.js'

export default function IOWrapper (orcaPlay) {
    this.io_pilot = new IOPilot(orcaPlay)

    orcaPlay.orcaClient.io.run_old = orcaPlay.orcaClient.io.run
    orcaPlay.orcaClient.io.clear_old = orcaPlay.orcaClient.io.clear
    orcaPlay.orcaClient.io.run = () => {
      this.io_pilot.run()
      orcaPlay.orcaClient.io.run_old()
    }

    orcaPlay.orcaClient.io.clear = () => {
        this.io_pilot.clear()
        orcaPlay.orcaClient.io.clear_old()
    }
  
    this.install = (host) => {
        this.io_pilot.install(host)
    }

    this.start = () => {
        this.io_pilot.start()
    }
}