# ORCΛ PLΛY

[OrcaPlay](https://karstenj.github.io/orca-play/) is a combination of the [esoteric programming language](https://en.wikipedia.org/wiki/Esoteric_programming_language) [Orca](https://github.com/hundredrabbits/orca) and the synthersizer companion app [Pilot](https://github.com/hundredrabbits/pilot) with some extensions.

This application is a synthesizer and a livecoding environment capable of playing synths and samples by [ToneJS](https://tonejs.github.io/) and sending MIDI to your audio/visual interfaces, like Ableton, Renoise, VCV Rack or SuperCollider.

## Install & Run

### Run in Browser
[OrcaPlay](https://karstenj.github.io/orca-play/)

### Run in Electron
If you wish to use Orca inside of [Electron](https://electronjs.org/), follow these steps:

```
git clone https://github.com/karstenj/orca-play.git
git submodule init
git submodule update
cd orca-play/desktop/
npm install
npm start
```

## Operators

To display the list of operators inside of Orca, use `CmdOrCtrl+G`.

- `A` **add**(*a* b): Outputs sum of inputs.
- `B` **subtract**(*a* b): Outputs difference of inputs.
- `C` **clock**(*rate* mod): Outputs modulo of frame.
- `D` **delay**(*rate* mod): Bangs on modulo of frame.
- `E` **east**: Moves eastward, or bangs.
- `F` **if**(*a* b): Bangs if inputs are equal.
- `G` **generator**(*x* *y* *len*): Writes operands with offset.
- `H` **halt**: Halts southward operand.
- `I` **increment**(*step* mod): Increments southward operand.
- `J` **jumper**(*val*): Outputs northward operand.
- `K` **konkat**(*len*): Reads multiple variables.
- `L` **less**(*a* *b*): Outputs smallest of inputs.
- `M` **multiply**(*a* b): Outputs product of inputs.
- `N` **north**: Moves Northward, or bangs.
- `O` **read**(*x* *y* read): Reads operand with offset.
- `P` **push**(*len* *key* val): Writes eastward operand.
- `Q` **query**(*x* *y* *len*): Reads operands with offset.
- `R` **random**(*min* max): Outputs random value.
- `S` **south**: Moves southward, or bangs.
- `T` **track**(*key* *len* val): Reads eastward operand.
- `U` **uclid**(*step* max): Bangs on Euclidean rhythm.
- `V` **variable**(*write* read): Reads and writes variable.
- `W` **west**: Moves westward, or bangs.
- `X` **write**(*x* *y* val): Writes operand with offset.
- `Y` **jymper**(*val*): Outputs westward operand.
- `Z` **lerp**(*rate* target): Transitions operand to input.
- `*` **bang**: Bangs neighboring operands.
- `#` **comment**: Halts a line.

### IO

- `:` **midi**(channel octave note velocity length): Sends a MIDI note.
- `%` **mono**(channel octave note velocity length): Sends monophonic MIDI note.
- `!` **cc**(channel knob value): Sends MIDI control change.
- `?` **pb**(channel value): Sends MIDI pitch bench.
- `;` **pilot**(channel value): Sends Pilot note.
- `=` **pilot**(channel value): Sends Pilot effect/sample.
- `$` **self**: Sends [ORCA command](#Commands).

## Pilot Synthesizer/Sampler/Player
Pilot has 17 synthesizer voices, 13 sampler voices, 13 drum banks with 16 drum samples and 8 effects.

## MIDI

See description in [Orca](https://github.com/hundredrabbits/orca)
## Advanced Controls

Some of Orca's features can be controlled via its own command-line interface. To activate the command-line prompt, press `CmdOrCtrl+K`. The prompt can also be used to inject patterns or change settings.

### Project Mode

You can **quickly inject orca files** into the currently active file, by using the command-line prompt — Allowing you to navigate across multiple files like you would a project. Press `CmdOrCtrl+L` to load multiple orca files, then press `CmdOrCtrl+B` and type the name of a loaded `.orca` file to inject it.

### Commands

All commands have a shorthand equivalent to their first two characters, for example, `write` can also be called using `wr`. You can see the full list of commands [here](https://github.com/hundredrabbits/Orca/blob/master/desktop/sources/scripts/commander.js).

- `play` Plays program.
- `stop` Stops program.
- `run` Runs current frame.
- `bpm:140` Sets bpm speed to `140`.
- `apm:160` Animates bpm speed to `160`.
- `frame:0` Sets the frame value to `0`.
- `skip:2` Adds `2`, to the current frame value.
- `rewind:2` Removes `2`, to the current frame value.
- `color:f00;0f0;00f` Colorizes the interface.
- `find:aV` Sends cursor to string `aV`.
- `select:3;4;5;6` Move cursor to position `3,4`, and select size `5:6`(optional).
- `inject:pattern;12;34` Inject the local file `pattern.orca`, at `12,34`(optional).
- `write:H;12;34` Writes glyph `H`, at `12,34`(optional).
- `time` Prints the time, in minutes seconds, since `0f`.
- `midi:1;2` Set Midi output device to `#1`, and input device to `#2`.
- `udp:1234;5678` Set UDP output port to `1234`, and input port to `5678`.
- `osc:1234` Set OSC output port to `1234`.

## Base36 Table

Orca operates on a base of **36 increments**. Operators using numeric values will typically also operate on letters and convert them into values as per the following table. For instance `Do` will bang every *24th frame*. 

| **0** | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** | **A** | **B**  | 
| :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:    | 
| 0     | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10    | 11     |
| **C** | **D** | **E** | **F** | **G** | **H** | **I** | **J** | **K** | **L** | **M** | **N**  |
| 12    | 13    | 14    | 15    | 16    | 17    | 18    | 19    | 20    | 21    | 22    | 23     |
| **O** | **P** | **Q** | **R** | **S** | **T** | **U** | **V** | **W** | **X** | **Y** | **Z**  | 
| 24    | 25    | 26    | 27    | 28    | 29    | 30    | 31    | 32    | 33    | 34    | 35     |

## Transpose Table

The midi operator interprets any letter above the chromatic scale as a transpose value, for instance `3H`, is equivalent to `4A`.

| **0** | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** | **A** | **B**  | 
| :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:   | :-:    | 
| _     | _     | _     | _     | _     | _     | _     | _     | _     | _     | A0    | B0     |
| **C** | **D** | **E** | **F** | **G** | **H** | **I** | **J** | **K** | **L** | **M** | **N**  |
| C0    | D0    | E0    | F0    | G0    | A0    | B0    | C1    | D1    | E1    | F1    | G1     | 
| **O** | **P** | **Q** | **R** | **S** | **T** | **U** | **V** | **W** | **X** | **Y** | **Z**  | 
| A1    | B1    | C2    | D2    | E2    | F2    | G2    | A2    | B2    | C3    | D3    | E3     | 

## Links

- [Overview Video](https://www.youtube.com/watch?v=RaI_TuISSJE)
- [Orca Podcast](https://futureofcoding.org/episodes/045)
- [Examples & Templates](https://git.sr.ht/~rabbits/orca-examples)

## Extras

- This application supports the [Ecosystem Theme](https://github.com/hundredrabbits/Themes).
- See the [License](LICENSE.md) file for license rights and limitations (MIT).
- Pull Requests are welcome!
