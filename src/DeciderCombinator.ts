import { Module, SignalCollection } from './Module'
import { Signals, SpecialSignals, getSignalCount, mergeSignals } from './Signals'

export enum Operations {
  EQUAL,
  NOT_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL
}

export class DeciderCombinator extends Module {
  private operation: Operations
  private leftOperand: string | SpecialSignals | number
  private rightOperand: string | number
  private outputType: string | SpecialSignals
  private one: boolean
  private inputs: Signals = {}
  private outputs: Signals = {}

  constructor(
    inputSignals: SignalCollection,
    outputSignals: SignalCollection,
    leftOperand: string | SpecialSignals,
    operation: Operations,
    rightOperand: string | SpecialSignals | number,
    output: string | SpecialSignals,
    one: boolean = false
  ) {
    super()

    // check for the right combination of operands and output
    if (output === SpecialSignals.EACH && leftOperand !== SpecialSignals.EACH) {
      throw new Error('DeciderCombinator: output can only be each if input is also each!')
    }

    if (output === SpecialSignals.ANYTHING) {
      throw new Error('DeciderCombinator: output can not be anything')
    }

    this.operation = operation
    this.leftOperand = leftOperand
    this.rightOperand = rightOperand
    this.outputType = output
    this.one = one

    this.connectInput(inputSignals.red, 'redInput')
    this.connectInput(inputSignals.green, 'greenInput')

    this.connectOutput(outputSignals.red, 'redOutput')
    this.connectOutput(outputSignals.green, 'greenOutput')
  }

  tick(): void {
    let green = this.signalNetworkManager.getSignals('greenInput')
    let red = this.signalNetworkManager.getSignals('redInput')
    this.inputs = mergeSignals(red, green)
    this.outputs = {}
  }

  tock(): void {
    const rightOperand: number = this.operandToNumber(this.rightOperand)

    if (this.leftOperand === SpecialSignals.EVERYTHING) {
      // special signal everything
      for (const name of Object.keys(this.inputs)) {
        const leftOperand = this.operandToNumber(name)
        if (!this.evaluateOperation(leftOperand, rightOperand)) {
          return
        }
      }

      // only reach if everything is true
      this.addSignalToOutput()
    } else if (this.leftOperand === SpecialSignals.ANYTHING) {
      // special signal anything
      for (const name of Object.keys(this.inputs)) {
        const leftOperand = this.operandToNumber(name)
        if (this.evaluateOperation(leftOperand, rightOperand)) {
          this.addSignalToOutput()
          break
        }
      }
    } else if (this.leftOperand === SpecialSignals.EACH) {
      // special signal each
      for (const name of Object.keys(this.inputs)) {
        const leftOperand = this.operandToNumber(name)
        if (this.evaluateOperation(leftOperand, rightOperand)) {
          if (this.outputType === SpecialSignals.EACH) {
            this.addNormalSignalToOutput(name, name)
          } else {
            this.addNormalSignalToOutput(this.outputType as string, name)
          }
        }
      }
    } else {
      const leftOperand: number = this.operandToNumber(this.leftOperand)
      if (this.evaluateOperation(leftOperand, rightOperand)) {
        this.addSignalToOutput()
      }
    }

    this.signalNetworkManager.addSignals('redOutput', this.outputs)
    this.signalNetworkManager.addSignals('greenOutput', this.outputs)
  }

  private operandToNumber(operand: string | SpecialSignals | number): number {
    switch (typeof operand) {
      case 'number':
        return operand as number

      case 'string':
        return getSignalCount(operand as string, this.inputs)

      default:
        throw new Error('DeciderCombinator: operand not string or number!')
    }
  }

  private evaluateOperation(leftOperand: number, rightOperand: number): boolean {
    switch (this.operation) {
      case Operations.EQUAL:
        return leftOperand === rightOperand

      case Operations.NOT_EQUAL:
        return leftOperand !== rightOperand

      case Operations.GREATER:
        return leftOperand > rightOperand

      case Operations.GREATER_EQUAL:
        return leftOperand >= rightOperand

      case Operations.LESS:
        return leftOperand < rightOperand

      case Operations.LESS_EQUAL:
        return leftOperand <= rightOperand

      default:
        throw new Error('DeciderCombinator: unknown operation!')
    }
  }

  // adds this signal (not including special signals) to the output (according to the settings of the combinator)
  private addNormalSignalToOutput(signalName: string, sourceSignalName: string) {
    let newSignals: Signals = {}
    if (this.one) {
      newSignals[signalName] = 1
    } else {
      newSignals[signalName] = getSignalCount(sourceSignalName, this.inputs)
    }
    this.outputs = mergeSignals(this.outputs, newSignals)
  }

  // adds this signal, also special signals, to the output (according to the settings of the combinator)
  private addSignalToOutput() {
    if (this.outputType === SpecialSignals.EVERYTHING) {
      for (const name of Object.keys(this.inputs)) {
        this.addNormalSignalToOutput(name, name)
      }
    } else {
      this.addNormalSignalToOutput(this.outputType as string, this.outputType as string)
    }
  }
}
