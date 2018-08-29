import { SignalNetworkManager } from './SignalNetworkManager'
import { Signals } from './Signals'

export interface SignalCollection {
  red: string
  green: string
}

interface SignalConnection {
  outer: string
  inner: string
}

export class Module {
  protected signalNetworkManager: SignalNetworkManager

  private outputSignalConnections: SignalConnection[] = []
  private inputSignalConnections: SignalConnection[] = []
  private modules: Module[] = []

  constructor(describe: boolean = true) {
    this.signalNetworkManager = new SignalNetworkManager()

    if (describe) {
      this.describe()
    }
  }

  describe(): void {
    // describes the module, has to be implemented by the module
  }

  tick(): void {
    for (let module of this.modules) {
      for (const signalName of module.getInputs()) {
        if (this.signalNetworkManager.signalNames().indexOf(signalName) > -1) {
          module.addInputSignals(signalName, this.signalNetworkManager.getSignals(signalName))
        }
      }
    }

    for (let module of this.modules) {
      module.tick()
    }
  }

  tock(): void {
    for (let module of this.modules) {
      module.tock()
    }

    for (let module of this.modules) {
      for (const signalName of module.getOutputs()) {
        this.signalNetworkManager.registerSignal(signalName)
        this.signalNetworkManager.addSignals(signalName, module.getOutputSignals(signalName))
      }
    }
  }

  clearNetworks(): void {
    this.signalNetworkManager.clearNetworks()
    for (let module of this.modules) {
      module.clearNetworks()
    }
  }

  connectInput(outerSignal: string, innerSignal: string): void {
    this.inputSignalConnections.push({ outer: outerSignal, inner: innerSignal })
    this.signalNetworkManager.registerSignal(innerSignal)
  }

  connectOutput(outerSignal: string, innerSignal: string): void {
    this.outputSignalConnections.push({ outer: outerSignal, inner: innerSignal })
    this.signalNetworkManager.registerSignal(innerSignal)
  }

  register(module: Module): void {
    this.modules.push(module)
  }

  getOutputSignals(signal: string): Signals {
    let innerSignalName = ''

    for (const pair of this.outputSignalConnections) {
      if (pair.outer === signal) {
        innerSignalName = pair.inner
        break
      }
    }

    return this.signalNetworkManager.getSignals(innerSignalName)
  }

  getOutputs(): string[] {
    let outputs: string[] = []
    for (const pairs of this.outputSignalConnections) {
      outputs.push(pairs.outer)
    }

    return outputs
  }

  getInputs(): string[] {
    let inputs: string[] = []
    for (const pairs of this.inputSignalConnections) {
      inputs.push(pairs.outer)
    }

    return inputs
  }

  addInputSignals(signalName: string, signals: Signals) {
    let innerSignalName = ''

    for (const pair of this.inputSignalConnections) {
      if (pair.outer === signalName) {
        innerSignalName = pair.inner
        break
      }
    }

    this.signalNetworkManager.addSignals(innerSignalName, signals)
  }

  protected getSignals(signal: string): Signals {
    return this.signalNetworkManager.getSignals(signal)
  }
}
