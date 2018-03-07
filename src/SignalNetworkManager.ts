import { SignalNetwork } from './SignalNetwork'
import { Signals } from './Signals'

export class SignalNetworkManager {
  private signalNetworks: { [id: string]: SignalNetwork } = {}

  registerSignal(signal: string): void {
    if (!(signal in this.signalNetworks)) {
      this.signalNetworks[signal] = new SignalNetwork(signal)
    }
  }

  getSignals(signal: string): Signals {
    this.testForSignal(signal)
    return this.signalNetworks[signal].getSignals()
  }

  addSignals(signalName: string, signals: Signals): void {
    this.testForSignal(signalName)
    this.signalNetworks[signalName].addSignals(signals)
  }

  clearNetworks(): void {
    for (const name of Object.keys(this.signalNetworks)) {
      this.signalNetworks[name].clear()
    }
  }

  signalNames(): string[] {
    return Object.keys(this.signalNetworks)
  }

  private testForSignal(signal: string) {
    if (!(signal in this.signalNetworks)) {
      throw new Error('SignalNetworkManager: unknown signal')
    }
  }
}
