import { Module, SignalCollection } from './Module'
import { Signals } from './Signals'

export class ConstantCombinator extends Module {
  private setOutput: Signals

  constructor(outputSignals: SignalCollection, output: Signals) {
    super()
    this.setOutput = output
    this.connectOutput(outputSignals.red, 'red')
    this.connectOutput(outputSignals.green, 'green')
  }

  tock(): void {
    this.signalNetworkManager.addSignals('red', this.setOutput)
    this.signalNetworkManager.addSignals('green', this.setOutput)
  }
}
