import { Signals, getSignalCount } from './Signals'
import { Signal } from './Signal'

export class SignalNetwork {
  private networkSignals: Signals = {}
  private name: string

  constructor(name: string) {
    this.name = name
  }

  addSignals(signals: Signals) {
    for (const name of Object.keys(signals)) {
      this.addSignal({ name: name, counts: signals[name] })
    }
  }

  addSignal(signal: Signal) {
    if (signal.name in this.networkSignals) {
      this.networkSignals[signal.name] += signal.counts
    } else {
      this.networkSignals[signal.name] = signal.counts
    }

    for (const name of Object.keys(this.networkSignals)) {
      if (this.networkSignals[name] === 0) {
        delete this.networkSignals[name]
      }
    }
  }

  getSignals(): Signals {
    return this.networkSignals
  }

  getSignalCount(name: string): number {
    return getSignalCount(name, this.networkSignals)
  }

  getName(): string {
    return this.name
  }

  clear() {
    this.networkSignals = {}
  }
}
