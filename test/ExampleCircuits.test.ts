import { Signals, getSignalCount } from '../src/Signals'
import { ConstantCombinator } from '../src/ConstantCombinator'
import { DeciderCombinator, Operations } from '../src/DeciderCombinator'
import { Module, SignalCollection } from '../src/Module'

class Counter extends Module {
  constructor(output: SignalCollection) {
    super()
    this.connectOutput(output.red, 'network')
    this.connectOutput(output.green, 'network')
  }

  describe(): void {
    const sig: Signals = {
      IRON_PLATE: 1
    }

    let constantCombinator = new ConstantCombinator({ red: 'input', green: 'constant' }, sig)
    let deciderCombinator = new DeciderCombinator(
      { red: 'input', green: 'network' },
      { red: '', green: 'network' },
      'IRON_PLATE',
      Operations.NOT_EQUAL,
      0,
      'IRON_PLATE'
    )

    this.register(constantCombinator)
    this.register(deciderCombinator)
  }
}

class RoundaboutCounter extends Module {
  constructor(output: SignalCollection) {
    super()
    this.connectOutput(output.red, 'network')
    this.connectOutput(output.green, 'network')
  }

  describe(): void {
    const sig: Signals = {
      IRON_PLATE: 1
    }

    let constantCombinator = new ConstantCombinator({ red: 'input', green: 'constant' }, sig)
    let deciderCombinator = new DeciderCombinator(
      { red: 'input', green: 'network' },
      { red: '', green: 'network' },
      'IRON_PLATE',
      Operations.LESS,
      10,
      'IRON_PLATE'
    )

    this.register(constantCombinator)
    this.register(deciderCombinator)
  }
}

class Pulsegenerator extends Module {
  constructor(output: SignalCollection) {
    super()
    this.connectOutput(output.red, 'output')
    this.connectOutput(output.green, 'output')
  }

  describe(): void {
    const sig: Signals = {
      IRON_PLATE: 1
    }

    let constantCombinator = new ConstantCombinator({ red: 'input', green: 'constant' }, sig)
    let deciderCombinator = new DeciderCombinator(
      { red: 'input', green: 'network' },
      { red: '', green: 'network' },
      'IRON_PLATE',
      Operations.LESS,
      10,
      'IRON_PLATE'
    )
    let pulseShaper = new DeciderCombinator(
      { red: 'empty', green: 'network' },
      { red: '', green: 'output' },
      'IRON_PLATE',
      Operations.EQUAL,
      1,
      'IRON_PLATE',
      true
    )

    this.register(constantCombinator)
    this.register(deciderCombinator)
    this.register(pulseShaper)
  }
}

describe('Circuits', () => {
  describe('Simple circuits', () => {
    it('Counter', () => {
      let counter = new Counter({ red: 'red', green: 'green' })

      for (let i = 0; i <= 10; i++) {
        counter.tick()
        counter.clearNetworks()
        counter.tock()
        expect(getSignalCount('IRON_PLATE', counter.getOutputSignals('red'))).toEqual(i)
      }
    })

    it('Roundabout counter', () => {
      let counter = new RoundaboutCounter({ red: 'red', green: 'green' })

      for (let y = 0; y < 3; y++) {
        for (let i = 0; i < 10; i++) {
          counter.tick()
          counter.clearNetworks()
          counter.tock()
          expect(getSignalCount('IRON_PLATE', counter.getOutputSignals('red'))).toEqual(i)
        }
      }
    })
  })

  describe('More complex circuits', () => {
    it('Pulsegenerator', () => {
      // pulsegenerator with period of 10 ticks
      let pulsegenerator = new Pulsegenerator({ red: 'red', green: 'green' })

      for (let i = 0; i <= 100; i++) {
        pulsegenerator.tick()
        pulsegenerator.clearNetworks()
        pulsegenerator.tock()
        let expectedValue = 0
        if ((i - 2) % 10 === 0) {
          expectedValue = 1
        }

        expect(getSignalCount('IRON_PLATE', pulsegenerator.getOutputSignals('red'))).toEqual(
          expectedValue
        )
      }
    })
  })
})
