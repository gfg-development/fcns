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

class TriggeredCounter extends Module {
  constructor(input: SignalCollection, output: SignalCollection) {
    super()

    this.connectInput(input.red, 'input')

    this.connectOutput(output.red, 'network')
    this.connectOutput(output.green, 'network')
  }

  describe(): void {
    let triggerCombinator = new DeciderCombinator(
      { red: 'input', green: 'empty' },
      { red: 'up', green: '' },
      'IRON_PLATE',
      Operations.NOT_EQUAL,
      0,
      'IRON_PLATE',
      true
    )
    let deciderCombinator = new DeciderCombinator(
      { red: 'up', green: 'network' },
      { red: '', green: 'network' },
      'IRON_PLATE',
      Operations.NOT_EQUAL,
      0,
      'IRON_PLATE'
    )

    this.register(triggerCombinator)
    this.register(deciderCombinator)
  }
}

class DiscriminatedTriggeredCounter extends Module {
  constructor(output: SignalCollection) {
    super()

    this.connectOutput(output.red, 'redOutput')
    this.connectOutput(output.green, 'greenOutput')
  }

  describe(): void {
    const counter = new TriggeredCounter(
      { red: 'redInput', green: 'greenInput' },
      { red: 'redOutput', green: 'greenOutput' }
    )

    const discriminator = new DeciderCombinator(
      { red: 'redOutput', green: 'empty' },
      { red: 'redInput', green: '' },
      'IRON_PLATE',
      Operations.LESS_EQUAL,
      17,
      'IRON_PLATE',
      true
    )

    this.register(counter)
    this.register(discriminator)
  }
}

class DiscriminatedTriggeredCounterMerged extends Module {
  constructor(output: SignalCollection) {
    super()

    this.connectOutput(output.red, 'network')
    this.connectOutput(output.green, 'network')
  }

  describe(): void {
    let triggerCombinator = new DeciderCombinator(
      { red: 'trigger', green: 'empty' },
      { red: 'up', green: '' },
      'IRON_PLATE',
      Operations.NOT_EQUAL,
      0,
      'IRON_PLATE',
      true
    )
    let deciderCombinator = new DeciderCombinator(
      { red: 'up', green: 'network' },
      { red: '', green: 'network' },
      'IRON_PLATE',
      Operations.NOT_EQUAL,
      0,
      'IRON_PLATE'
    )
    const discriminator = new DeciderCombinator(
      { red: 'empty', green: 'network' },
      { red: 'trigger', green: '' },
      'IRON_PLATE',
      Operations.LESS_EQUAL,
      17,
      'IRON_PLATE',
      true
    )

    this.register(discriminator)
    this.register(triggerCombinator)
    this.register(deciderCombinator)
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

    it('Triggered Counter', () => {
      let counter = new DiscriminatedTriggeredCounter({ red: 'red', green: 'green' })
      let merged = new DiscriminatedTriggeredCounterMerged({ red: 'red', green: 'green' })

      for (let i = 0; i <= 100; i++) {
        counter.tick()
        counter.clearNetworks()
        counter.tock()

        merged.tick()
        merged.clearNetworks()
        merged.tock()

        let expectValue = i - 1

        if (expectValue < 0) {
          expectValue = 0
        } else if (expectValue > 20) {
          expectValue = 20
        }

        expect(getSignalCount('IRON_PLATE', merged.getOutputSignals('red'))).toEqual(expectValue)
        expect(getSignalCount('IRON_PLATE', merged.getOutputSignals('green'))).toEqual(expectValue)

        expect(getSignalCount('IRON_PLATE', counter.getOutputSignals('red'))).toEqual(expectValue)
        expect(getSignalCount('IRON_PLATE', counter.getOutputSignals('green'))).toEqual(expectValue)
      }
    })
  })
})
