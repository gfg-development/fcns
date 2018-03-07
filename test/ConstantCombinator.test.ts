import { ConstantCombinator } from '../src/ConstantCombinator'
import { Signals } from '../src/Signals'

describe('Constant combinator', () => {
  it('Outputs the right values', () => {
    const signals: Signals = {
      IRON_PLATE: 234,
      COPPER_PLATE: 456
    }
    let combinator = new ConstantCombinator({ green: 'greenOuter', red: 'redOuter' }, signals)
    combinator.tick()
    combinator.clearNetworks()
    combinator.tock()
    expect(combinator.getOutputSignals('greenOuter')).toEqual(signals)
    expect(combinator.getOutputSignals('redOuter')).toEqual(signals)
  })
})
