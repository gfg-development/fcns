import { Signals, getSignalCount } from '../src/Signals'
import { ConstantCombinator } from '../src/ConstantCombinator'
import { DeciderCombinator, Operations } from '../src/DeciderCombinator'
import { Module, SignalCollection } from '../src/Module'
import { VCDGenerator } from '../src/VCDGenerator'

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

describe('VCD File generation', () => {
  it('Pulsegenerator', () => {
    // pulsegenerator with period of 10 ticks
    let pulsegenerator = new Pulsegenerator({ red: 'red', green: 'green' })
    const vcd = new VCDGenerator('test.vcd')
    pulsegenerator.dump(vcd)

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

    vcd.finishDump()
  })
})
