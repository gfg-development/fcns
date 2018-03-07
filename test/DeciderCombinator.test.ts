import { DeciderCombinator, Operations } from '../src/DeciderCombinator'
import { SignalNetwork } from '../src/SignalNetwork'
import { Signals, SpecialSignals } from '../src/Signals'

describe('Decider combinator', () => {
  it('outputs nothing without input', () => {
    let combinator = new DeciderCombinator(
      { red: 'redIn', green: 'greenIn' },
      { red: 'redOut', green: 'greenOut' },
      SpecialSignals.EACH,
      Operations.EQUAL,
      0,
      SpecialSignals.EACH
    )

    combinator.tick()
    combinator.clearNetworks()
    combinator.tock()
    expect(combinator.getOutputSignals('greenOut')).toEqual({})
    expect(combinator.getOutputSignals('redOut')).toEqual({})
  })

  describe('Input only on red wire', () => {
    describe('No virtual signals at input', () => {
      it('outputs the right value', () => {
        const input: Signals = {
          COPPER_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          'COPPER_PLATE',
          Operations.GREATER,
          1,
          'COPPER_PLATE'
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(input)
        expect(combinator.getOutputSignals('redOut')).toEqual(input)
      })

      it('outputs the right value (one)', () => {
        const input: Signals = {
          COPPER_PLATE: 10
        }

        const output: Signals = {
          COPPER_PLATE: 1
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          'COPPER_PLATE',
          Operations.GREATER,
          1,
          'COPPER_PLATE',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(output)
        expect(combinator.getOutputSignals('redOut')).toEqual(output)
      })

      it('outputs the right value (one, different signal)', () => {
        const input: Signals = {
          COPPER_PLATE: 10
        }

        const output: Signals = {
          IRON_PLATE: 1
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          'COPPER_PLATE',
          Operations.GREATER,
          1,
          'IRON_PLATE',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(output)
        expect(combinator.getOutputSignals('redOut')).toEqual(output)
      })
    })
  })

  describe('Input only on green wire', () => {
    describe('No virtual signals at input', () => {
      it('outputs the right value', () => {
        const input: Signals = {
          COPPER_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          'COPPER_PLATE',
          Operations.GREATER,
          1,
          'COPPER_PLATE'
        )

        combinator.addInputSignals('greenIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(input)
        expect(combinator.getOutputSignals('redOut')).toEqual(input)
      })

      it('outputs the right value (one)', () => {
        const input: Signals = {
          COPPER_PLATE: 10
        }

        const output: Signals = {
          COPPER_PLATE: 1
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          'COPPER_PLATE',
          Operations.GREATER,
          1,
          'COPPER_PLATE',
          true
        )

        combinator.addInputSignals('greenIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(output)
        expect(combinator.getOutputSignals('redOut')).toEqual(output)
      })

      it('outputs the right value (one, different signal)', () => {
        const input: Signals = {
          COPPER_PLATE: 10
        }

        const output: Signals = {
          IRON_PLATE: 1
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          'COPPER_PLATE',
          Operations.GREATER,
          1,
          'IRON_PLATE',
          true
        )

        combinator.addInputSignals('greenIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(output)
        expect(combinator.getOutputSignals('redOut')).toEqual(output)
      })
    })
  })

  describe('Input on both wires', () => {
    describe('No virtual signals at input', () => {
      it('outputs the right value', () => {
        const input1: Signals = {
          COPPER_PLATE: 10
        }

        const input2: Signals = {
          COPPER_PLATE: 1
        }

        const output: Signals = {
          COPPER_PLATE: 11
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          'COPPER_PLATE',
          Operations.GREATER,
          1,
          'COPPER_PLATE'
        )

        combinator.addInputSignals('greenIn', input1)
        combinator.addInputSignals('redIn', input2)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(output)
        expect(combinator.getOutputSignals('redOut')).toEqual(output)
      })

      it('outputs the right value when output is on everything', () => {
        const input1: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: 5
        }

        const input2: Signals = {
          COPPER_PLATE: 1
        }

        const output: Signals = {
          COPPER_PLATE: 11,
          IRON_PLATE: 5
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          'COPPER_PLATE',
          Operations.GREATER,
          1,
          SpecialSignals.EVERYTHING
        )

        combinator.addInputSignals('greenIn', input1)
        combinator.addInputSignals('redIn', input2)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(output)
        expect(combinator.getOutputSignals('redOut')).toEqual(output)
      })
    })
  })

  describe('Special signals', () => {
    describe('Everything', () => {
      it('Everything equal to zero, output a one', () => {
        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EVERYTHING,
          Operations.EQUAL,
          0,
          'ZERO',
          true
        )

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({ ZERO: 1 })
        expect(combinator.getOutputSignals('redOut')).toEqual({ ZERO: 1 })
      })

      it('Not Everything equal to zero, output not a one', () => {
        const input: Signals = {
          COPPER_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EVERYTHING,
          Operations.EQUAL,
          0,
          'ZERO',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({})
        expect(combinator.getOutputSignals('redOut')).toEqual({})
      })

      it('Everything bigger than 0, output a one', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EVERYTHING,
          Operations.GREATER,
          0,
          'ZERO',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({ ZERO: 1 })
        expect(combinator.getOutputSignals('redOut')).toEqual({ ZERO: 1 })
      })

      it('Not Everything bigger than 0, output not a one', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: -10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EVERYTHING,
          Operations.GREATER,
          0,
          'ZERO',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({})
        expect(combinator.getOutputSignals('redOut')).toEqual({})
      })

      it('Everything bigger than 0, output everything', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EVERYTHING,
          Operations.GREATER,
          0,
          SpecialSignals.EVERYTHING
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(input)
        expect(combinator.getOutputSignals('redOut')).toEqual(input)
      })

      it('Not Everything bigger than 0, output nothing', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: -10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EVERYTHING,
          Operations.GREATER,
          0,
          SpecialSignals.EVERYTHING
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({})
        expect(combinator.getOutputSignals('redOut')).toEqual({})
      })
    })

    describe('Anything', () => {
      it('Anything equal to zero, output not a one', () => {
        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.ANYTHING,
          Operations.EQUAL,
          0,
          'ZERO',
          true
        )

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({})
        expect(combinator.getOutputSignals('redOut')).toEqual({})
      })

      it('Everything is greater zero, output one zero', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.ANYTHING,
          Operations.GREATER,
          0,
          'ZERO',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({ ZERO: 1 })
        expect(combinator.getOutputSignals('redOut')).toEqual({ ZERO: 1 })
      })

      it('One thing is greater zero, output one zero', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: -10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.ANYTHING,
          Operations.GREATER,
          0,
          'ZERO',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({ ZERO: 1 })
        expect(combinator.getOutputSignals('redOut')).toEqual({ ZERO: 1 })
      })

      it('Nothing is greater zero, output not a zero', () => {
        const input: Signals = {
          COPPER_PLATE: -10,
          IRON_PLATE: -10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.ANYTHING,
          Operations.GREATER,
          0,
          'ZERO',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({})
        expect(combinator.getOutputSignals('redOut')).toEqual({})
      })

      it('One thing is greater zero, output everything', () => {
        const input: Signals = {
          COPPER_PLATE: -10,
          IRON_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.ANYTHING,
          Operations.GREATER,
          0,
          SpecialSignals.EVERYTHING
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(input)
        expect(combinator.getOutputSignals('redOut')).toEqual(input)
      })
    })

    describe('Each', () => {
      it('Each equal to zero, output not a one', () => {
        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EACH,
          Operations.EQUAL,
          0,
          'ZERO',
          true
        )

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({})
        expect(combinator.getOutputSignals('redOut')).toEqual({})
      })

      it('Everything is greater zero, output two zeros', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EACH,
          Operations.GREATER,
          0,
          'ZERO',
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({ ZERO: 2 })
        expect(combinator.getOutputSignals('redOut')).toEqual({ ZERO: 2 })
      })

      it('Everything is greater zero, output 15 zeros', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: 5
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EACH,
          Operations.GREATER,
          0,
          'ZERO'
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({ ZERO: 15 })
        expect(combinator.getOutputSignals('redOut')).toEqual({ ZERO: 15 })
      })

      it('One thing is greater zero, output 10 zeros', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: -5
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EACH,
          Operations.GREATER,
          0,
          'ZERO'
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual({ ZERO: 10 })
        expect(combinator.getOutputSignals('redOut')).toEqual({ ZERO: 10 })
      })

      it('Everything is greater zero, output everything', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: 5
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EACH,
          Operations.GREATER,
          0,
          SpecialSignals.EACH
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(input)
        expect(combinator.getOutputSignals('redOut')).toEqual(input)
      })

      it('One signal is greater zero, output this signal', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          IRON_PLATE: -5
        }

        const output: Signals = {
          COPPER_PLATE: 10
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EACH,
          Operations.GREATER,
          0,
          SpecialSignals.EACH
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(output)
        expect(combinator.getOutputSignals('redOut')).toEqual(output)
      })

      it('Two signals are greater zero, output this signals with zero', () => {
        const input: Signals = {
          COPPER_PLATE: 10,
          STEEL: 3,
          IRON_PLATE: -5
        }

        const output: Signals = {
          COPPER_PLATE: 1,
          STEEL: 1
        }

        let combinator = new DeciderCombinator(
          { red: 'redIn', green: 'greenIn' },
          { red: 'redOut', green: 'greenOut' },
          SpecialSignals.EACH,
          Operations.GREATER,
          0,
          SpecialSignals.EACH,
          true
        )

        combinator.addInputSignals('redIn', input)

        combinator.tick()
        combinator.clearNetworks()
        combinator.tock()
        expect(combinator.getOutputSignals('greenOut')).toEqual(output)
        expect(combinator.getOutputSignals('redOut')).toEqual(output)
      })
    })
  })
})
