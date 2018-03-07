import { SignalNetwork } from '../src/SignalNetwork'
import { Signals } from '../src/Signals'
import { Signal } from '../src/Signal'

describe('Signal Network', () => {
  it('creates a new network that has no signals', () => {
    let network: SignalNetwork = new SignalNetwork('Network1')
    expect(network.getSignals()).toEqual({})
    expect(network.getSignalCount('IRON_PLATE')).toEqual(0)
  })

  it('adds one signal correctly to the network', () => {
    let network = new SignalNetwork('Network2')
    const signal: Signal = { name: 'IRON_PLATE', counts: 1234 }
    network.addSignal(signal)
    expect(network.getSignals()).toEqual({
      IRON_PLATE: 1234
    })
  })

  it('adds two different signals correctly to the network', () => {
    let network = new SignalNetwork('Network3')
    const signal1: Signal = { name: 'IRON_PLATE', counts: 1234 }
    const signal2: Signal = { name: 'COPPER_PLATE', counts: 5678 }
    network.addSignal(signal1)
    network.addSignal(signal2)
    expect(network.getSignals()).toEqual({
      IRON_PLATE: 1234,
      COPPER_PLATE: 5678
    })
  })

  it('adds two signals correctly to the network', () => {
    let network = new SignalNetwork('Network3')
    const signal1: Signal = { name: 'COPPER_PLATE', counts: 5 }
    const signal2: Signal = { name: 'COPPER_PLATE', counts: 10 }
    network.addSignal(signal1)
    network.addSignal(signal2)
    expect(network.getSignals()).toEqual({
      COPPER_PLATE: 15
    })
  })

  it('adds signals correctly to the network', () => {
    let network = new SignalNetwork('Network4')
    const signals: Signals = {
      IRON_PLATE: 15,
      COPPER_PLATE: 4
    }
    network.addSignals(signals)
    expect(network.getSignals()).toEqual(signals)
  })

  it('has the same values after copying', () => {
    let network = new SignalNetwork('Network5')
    const signals: Signals = {
      IRON_PLATE: 15,
      COPPER_PLATE: 4
    }
    network.addSignals(signals)
    let networkCopy = network
    expect(networkCopy.getSignals()).toEqual(signals)
  })

  it('removes empty signals', () => {
    let network = new SignalNetwork('Network6')
    const signals: Signals = {
      IRON_PLATE: 15,
      COPPER_PLATE: 0
    }
    network.addSignals(signals)
    expect(network.getSignals()).toEqual({ IRON_PLATE: 15 })
  })
})
