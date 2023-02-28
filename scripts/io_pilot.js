function IOPilot (orcaPlay) {
    this.stack = []

    this.run = function () {
        for (const item of this.stack) {
            orcaPlay.pilotClient.mixer.run(item)
        }
    }

    this.clear = () => {
        this.stack = []
    }

    this.install = (host) => {

    }

    this.start = () => {
        console.log('IO Pilot', 'Starting..')
    }

    this.push = function (msg) {
        this.stack.push(msg)
    }
}