/*
 * The MIT License (MIT)
 *
 * Copyright 2019 GitHub
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable no-prototype-builtins */

/**
 * Optional properties that can be sent with annotation commands (notice, error, and warning)
 * See: https://docs.github.com/en/rest/reference/checks#create-a-check-run for more information about annotations.
 */
export interface AnnotationProperties {
  /**
   * A title for the annotation.
   */
  title?: string

  /**
   * The path of the file for which the annotation should be created.
   */
  file?: string

  /**
   * The start line for the annotation.
   */
  startLine?: number

  /**
   * The end line for the annotation. Defaults to `startLine` when `startLine` is provided.
   */
  endLine?: number

  /**
   * The start column for the annotation. Cannot be sent when `startLine` and `endLine` are different values.
   */
  startColumn?: number

  /**
   * The end column for the annotation. Cannot be sent when `startLine` and `endLine` are different values.
   * Defaults to `startColumn` when `startColumn` is provided.
   */
  endColumn?: number
}

/**
 * Interface for getInput options
 */
export interface InputOptions {
  /** Optional. Whether the input is required. If required and not present, will throw. Defaults to false */
  required?: boolean

  /** Optional. Whether leading/trailing whitespace will be trimmed for the input. Defaults to true */
  trimWhitespace?: boolean
}

/**
 * The code to exit an action
 */
enum ExitCode {
  /**
   * A code indicating that the action was successful
   */
  Success = 0,

  /**
   * A code indicating that the action was a failure
   */
  Failure = 1
}

/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
export function getInput(name: string, options?: InputOptions): string {
  const val: string =
    process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || ''
  if (options && options.required && !val) {
    throw new Error(`Input required and not supplied: ${name}`)
  }

  if (options && options.trimWhitespace === false) {
    return val
  }

  return val.trim()
}

/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setOutput(name: string, value: any): void {
  const filePath = process.env['GITHUB_OUTPUT'] || ''
  if (filePath) {
    return issueFileCommand('OUTPUT', prepareKeyValueMessage(name, value))
  }

  process.stdout.write(os.EOL)
  issueCommand('set-output', { name }, toCommandValue(value))
}

/**
 * Writes info to log with console.log.
 * @param message info message
 */
export function info(message: string): void {
  process.stdout.write(message + os.EOL)
}

/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
export function warning(
  message: string | Error,
  properties: AnnotationProperties = {}
): void {
  issueCommand(
    'warning',
    toCommandProperties(properties),
    message instanceof Error ? message.toString() : message
  )
}

/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
export function error(
  message: string | Error,
  properties: AnnotationProperties = {}
): void {
  issueCommand(
    'error',
    toCommandProperties(properties),
    message instanceof Error ? message.toString() : message
  )
}

/**
 * Writes debug message to user log
 * @param message debug message
 */
export function debug(message: string): void {
  issueCommand('debug', {}, message)
}

/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
export function setFailed(message: string | Error): void {
  process.exitCode = ExitCode.Failure

  error(message)
}

/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
export function addPath(inputPath: string): void {
  const filePath = process.env['GITHUB_PATH'] || ''
  if (filePath) {
    issueFileCommand('PATH', inputPath)
  } else {
    issueCommand('add-path', {}, inputPath)
  }
  process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`
}

/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(
  annotationProperties: AnnotationProperties
): CommandProperties {
  if (!Object.keys(annotationProperties).length) {
    return {}
  }

  return {
    title: annotationProperties.title,
    file: annotationProperties.file,
    line: annotationProperties.startLine,
    endLine: annotationProperties.endLine,
    col: annotationProperties.startColumn,
    endColumn: annotationProperties.endColumn
  }
}

function issueFileCommand(command: string, message: any): void {
  const filePath = process.env[`GITHUB_${command}`]
  if (!filePath) {
    throw new Error(
      `Unable to find environment variable for file command ${command}`
    )
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file at path: ${filePath}`)
  }

  fs.appendFileSync(filePath, `${toCommandValue(message)}${os.EOL}`, {
    encoding: 'utf8'
  })
}

function prepareKeyValueMessage(key: string, value: any): string {
  const delimiter = `ghadelimiter_${crypto.randomUUID()}`
  const convertedValue = toCommandValue(value)

  // These should realistically never happen, but just in case someone finds a
  // way to exploit uuid generation let's not allow keys or values that contain
  // the delimiter.
  if (key.includes(delimiter)) {
    throw new Error(
      `Unexpected input: name should not contain the delimiter "${delimiter}"`
    )
  }

  if (convertedValue.includes(delimiter)) {
    throw new Error(
      `Unexpected input: value should not contain the delimiter "${delimiter}"`
    )
  }

  return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`
}

/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input: any): string {
  if (input === null || input === undefined) {
    return ''
  } else if (typeof input === 'string' || input instanceof String) {
    return input as string
  }
  return JSON.stringify(input)
}

interface CommandProperties {
  [key: string]: any
}

/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(
  command: string,
  properties: CommandProperties,
  message: any
): void {
  const cmd = new Command(command, properties, message)
  process.stdout.write(cmd.toString() + os.EOL)
}

const CMD_STRING = '::'

class Command {
  private readonly command: string
  private readonly message: string
  private readonly properties: CommandProperties

  constructor(command: string, properties: CommandProperties, message: string) {
    if (!command) {
      command = 'missing.command'
    }

    this.command = command
    this.properties = properties
    this.message = message
  }

  toString(): string {
    let cmdStr = CMD_STRING + this.command

    if (this.properties && Object.keys(this.properties).length > 0) {
      cmdStr += ' '
      let first = true
      for (const key in this.properties) {
        if (this.properties.hasOwnProperty(key)) {
          const val = this.properties[key]
          if (val) {
            if (first) {
              first = false
            } else {
              cmdStr += ','
            }

            cmdStr += `${key}=${escapeProperty(val)}`
          }
        }
      }
    }

    cmdStr += `${CMD_STRING}${escapeData(this.message)}`
    return cmdStr
  }
}

function escapeData(s: any): string {
  return toCommandValue(s)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
}

function escapeProperty(s: any): string {
  return toCommandValue(s)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
    .replace(/:/g, '%3A')
    .replace(/,/g, '%2C')
}
