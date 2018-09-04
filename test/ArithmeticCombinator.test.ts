import { SignalNetwork } from '../src/SignalNetwork'
import { Signals, SpecialSignals } from '../src/Signals'
import { ArithmeticCombinator, Operations } from '../src/ArithmeticCombinator'

describe('ArithmeticCombinator', () => {
  it('With empty inputs, it outputs nothing', () => {
    let combinator = new ArithmeticCombinator(
      { red: 'redIn', green: 'greenIn' },
      { red: 'redOut', green: 'greenOut' },
      SpecialSignals.EACH,
      Operations.ADD,
      1,
      SpecialSignals.EACH
    )

    combinator.tick()
    combinator.clearNetworks()
    combinator.tock()
    expect(combinator.getOutputSignals('greenOut')).toEqual({})
    expect(combinator.getOutputSignals('redOut')).toEqual({})
  })

  describe('Simple operations', () => {
    it('Simple addition', () => {
      const red: Signals = {
        COPPER_PLATE: 10
      }

      const output: Signals = {
        COPPER_PLATE: 15
      }

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        'COPPER_PLATE',
        Operations.ADD,
        5,
        'COPPER_PLATE'
      )

      combinator.addInputSignals('redIn', red)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })

    it('Division with a reminder', () => {
      const red: Signals = {
        COPPER_PLATE: 15
      }

      const green: Signals = {
        IRON_PLATE: 10
      }

      const output: Signals = {
        IRON_PLATE: 1
      }

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        'COPPER_PLATE',
        Operations.DIV,
        'IRON_PLATE',
        'IRON_PLATE'
      )

      combinator.addInputSignals('redIn', red)
      combinator.addInputSignals('greenIn', green)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })

    it('Division with a reminder', () => {
      const red: Signals = {
        COPPER_PLATE: 16
      }

      const green: Signals = {
        IRON_PLATE: 10
      }

      const output: Signals = {
        IRON_PLATE: 1
      }

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        'COPPER_PLATE',
        Operations.DIV,
        'IRON_PLATE',
        'IRON_PLATE'
      )

      combinator.addInputSignals('redIn', red)
      combinator.addInputSignals('greenIn', green)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })

    it('Division by zero', () => {
      const red: Signals = {
        COPPER_PLATE: 16
      }

      const output: Signals = {}

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        'COPPER_PLATE',
        Operations.DIV,
        'IRON_PLATE',
        'IRON_PLATE'
      )

      combinator.addInputSignals('redIn', red)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })

    it('An exponential operation', () => {
      const red: Signals = {
        COPPER_PLATE: 16
      }

      const green: Signals = {
        IRON_PLATE: 3
      }

      const output: Signals = {
        IRON_PLATE: 16 * 16 * 16
      }

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        'COPPER_PLATE',
        Operations.EXP,
        'IRON_PLATE',
        'IRON_PLATE'
      )

      combinator.addInputSignals('redIn', red)
      combinator.addInputSignals('greenIn', green)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })

    it('An exponential operation with negative exponent', () => {
      const red: Signals = {
        COPPER_PLATE: 16
      }

      const green: Signals = {
        IRON_PLATE: -3
      }

      const output: Signals = {}

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        'COPPER_PLATE',
        Operations.EXP,
        'IRON_PLATE',
        'IRON_PLATE'
      )

      combinator.addInputSignals('redIn', red)
      combinator.addInputSignals('greenIn', green)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })
  })

  describe('each', () => {
    it('simple addition', () => {
      const red: Signals = {
        COPPER_PLATE: 10
      }

      const output: Signals = {
        COPPER_PLATE: 15
      }

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        SpecialSignals.EACH,
        Operations.ADD,
        5,
        SpecialSignals.EACH
      )

      combinator.addInputSignals('redIn', red)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })

    it('multiple additions', () => {
      const red: Signals = {
        COPPER_PLATE: 10,
        IRON_PLATE: 15
      }

      const output: Signals = {
        COPPER_PLATE: 15,
        IRON_PLATE: 20
      }

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        SpecialSignals.EACH,
        Operations.ADD,
        5,
        SpecialSignals.EACH
      )

      combinator.addInputSignals('redIn', red)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })

    it('adding each with one signal', () => {
      const red: Signals = {
        COPPER_PLATE: 10,
        IRON_PLATE: 1
      }

      const output: Signals = {
        COPPER_PLATE: 11,
        IRON_PLATE: 2
      }

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        SpecialSignals.EACH,
        Operations.ADD,
        'IRON_PLATE',
        SpecialSignals.EACH
      )

      combinator.addInputSignals('redIn', red)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })

    it('adding each with one signal and output to one signal', () => {
      const red: Signals = {
        COPPER_PLATE: 10,
        IRON_PLATE: 1
      }

      const output: Signals = {
        IRON_PLATE: 13
      }

      let combinator = new ArithmeticCombinator(
        { red: 'redIn', green: 'greenIn' },
        { red: 'redOut', green: 'greenOut' },
        SpecialSignals.EACH,
        Operations.ADD,
        'IRON_PLATE',
        'IRON_PLATE'
      )

      combinator.addInputSignals('redIn', red)

      combinator.tick()
      combinator.clearNetworks()
      combinator.tock()
      expect(combinator.getOutputSignals('greenOut')).toEqual(output)
      expect(combinator.getOutputSignals('redOut')).toEqual(output)
    })
  })
})
