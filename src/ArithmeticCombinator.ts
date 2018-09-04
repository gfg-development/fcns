import { Module, SignalCollection } from './Module'
import { Signals, SpecialSignals, getSignalCount, mergeSignals } from './Signals'

export enum Operations {
  ADD,
  SUB,
  MUL,
  DIV,
  MOD,
  AND,
  OR,
  XOR,
  LSHIFT,
  RSHIFT,
  EXP
}

export class ArithmeticCombinator extends Module {
  private operation: Operations
  private leftOperand: string | SpecialSignals | number
  private rightOperand: string | number
  private outputType: string | SpecialSignals
  private inputs: Signals = {}
  private outputs: Signals = {}

  constructor(
    inputSignals: SignalCollection,
    outputSignals: SignalCollection,
    leftOperand: string | SpecialSignals,
    operation: Operations,
    rightOperand: string | SpecialSignals | number,
    output: string | SpecialSignals
  ) {
    super()

    // check for the right combination of operands and output
    if (output === SpecialSignals.EACH && leftOperand !== SpecialSignals.EACH) {
      throw new Error('ArithmeticCombinator: output can only be each if input is also each!')
    }

    if (output === SpecialSignals.ANYTHING) {
      throw new Error('ArithmeticCombinator: output can not be anything')
    }

    if (output === SpecialSignals.EVERYTHING) {
      throw new Error('ArithmeticCombinator: output can not be everything')
    }

    if (output === SpecialSignals.ANYTHING) {
      throw new Error('ArithmeticCombinator: input can not be anything')
    }

    if (output === SpecialSignals.EVERYTHING) {
      throw new Error('ArithmeticCombinator: input can not be everything')
    }

    this.operation = operation
    this.leftOperand = leftOperand
    this.rightOperand = rightOperand
    this.outputType = output

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

    if (this.leftOperand === SpecialSignals.EACH) {
      // handle special signal each
      for (const name of Object.keys(this.inputs)) {
        const leftOperand = this.operandToNumber(name)
        const result = this.evaluateOperation(leftOperand, rightOperand)

        if (this.outputType === SpecialSignals.EACH) {
          this.addSignalToOutput(name, result)
        } else {
          this.addSignalToOutput(this.outputType as string, result)
        }
      }
    } else {
      const leftOperand = this.operandToNumber(this.leftOperand)
      const result = this.evaluateOperation(leftOperand, rightOperand)
      this.addSignalToOutput(this.outputType as string, result)
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

  private evaluateOperation(leftOperand: number, rightOperand: number): number {
    switch (this.operation) {
      case Operations.ADD:
        return leftOperand + rightOperand

      case Operations.SUB:
        return leftOperand - rightOperand

      case Operations.MUL:
        return leftOperand * rightOperand

      case Operations.DIV:
        if (rightOperand === 0) {
          return 0
        } else {
          return Math.floor(leftOperand / rightOperand)
        }

      case Operations.MOD:
        if (rightOperand === 0) {
          return 0
        } else {
          return leftOperand % rightOperand
        }

      case Operations.EXP:
        if (rightOperand <= 0) {
          return 0
        } else {
          return Math.pow(leftOperand, rightOperand)
        }

      case Operations.LSHIFT:
        if (rightOperand >= 0) {
          return leftOperand * Math.pow(2, rightOperand)
        } else {
          return 0
        }

      case Operations.RSHIFT:
        if (rightOperand >= 0) {
          return Math.floor(leftOperand / Math.pow(2, rightOperand))
        } else {
          return 0
        }

      case Operations.AND:
        return leftOperand & rightOperand

      case Operations.OR:
        return leftOperand | rightOperand

      case Operations.XOR:
        return leftOperand ^ rightOperand

      default:
        throw new Error('ArithmeticCombinator: unknown operation!')
    }
  }

  private addSignalToOutput(signalName: string, count: number) {
    let newSignals: Signals = {}
    newSignals[signalName] = count
    this.outputs = mergeSignals(this.outputs, newSignals)
  }
}
