function IOPilot (orcaPlay) {
    this.stack_note = []
    this.stack_effect = []

    this.run = function () {
        this.run_note()
        this.run_effect()
    }

    this.run_note = function () {
        for (const item of this.stack_note) {
            orcaPlay.pilotClient.mixer.run_note(item)
        }
    }
    this.run_effect = function () {
        for (const item of this.stack_effect) {
            orcaPlay.pilotClient.mixer.run_effect(item)
        }
    }

    this.clear = () => {
        this.stack_note = []
        this.stack_effect = []
    }

    this.install = (host) => {

    }

    this.start = () => {
        console.log('IO Pilot', 'Starting..')
    }

    this.push_note = function (msg) {
        this.stack_note.push(msg)
    }

    this.push_effect = function (msg) {
        this.stack_effect.push(msg)
    }
}