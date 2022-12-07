import { writable } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { Action } from 'svelte/action'

export interface FieldState {
  id: string
  dirty: boolean
  touched: boolean
  show: boolean
  message: string
  badInput: boolean
  customError: boolean
  patternMismatch: boolean
  rangeOverflow: boolean
  rangeUnderflow: boolean
  stepMismatch: boolean
  tooLong: boolean
  tooShort: boolean
  typeMismatch: boolean
  valid: boolean
  valueMissing: boolean
}

const defaultFieldState = {
  dirty: false,
  touched: false,
  show: false,
  message: '',
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: true,
  valueMissing: false,
}

export type Validator = (value: string) => Promise<string | null>

export interface FieldOptions {
  validator?: Validator
  onDirty?: boolean
}

// Field store & use:action
export interface Field extends Readable<FieldState>, Action<HTMLInputElement> { }

export function createField(options?: FieldOptions): Field {
  const id = newID()
  const { onDirty, validator } = { onDirty: false, ...options }
  const { subscribe, update } = writable<FieldState>({ id, ...defaultFieldState })
  const readable = { subscribe }

  const action = (input: HTMLInputElement) => {
    let globalNonce: Object

    async function checkValidity(touched = false, dirty = false) {
      // used to ignore potentially still pending async custom validation checks
      const localNonce = globalNonce = new Object()

      // execute inbuild validity checks
      let valid = input.checkValidity()

      // if valid, and a custom validator defined, execute that
      if (valid && validator) {
        const message = await validator(input.value)

        // but if we're no longer the latest after the await, abort
        if (localNonce !== globalNonce) return

        // set validation flag and message
        if (message) {
          input.setCustomValidity(message)
        }
      }

      if (valid) {
        input.removeAttribute('aria-invalid')
        input.removeAttribute('aria-describedby')
      } else {
        input.setAttribute('aria-invalid', 'true')
        input.setAttribute('aria-describedby', id)
      }

      const { validity, validationMessage } = input

      update(x => {
        dirty = x.dirty || dirty
        touched = x.touched || touched
        return {
          id,
          dirty,
          touched,
          show: touched && !validity.valid,
          message: validationMessage,
          badInput: validity.badInput,
          customError: validity.customError,
          patternMismatch: validity.patternMismatch,
          rangeOverflow: validity.rangeOverflow,
          rangeUnderflow: validity.rangeUnderflow,
          stepMismatch: validity.stepMismatch,
          tooLong: validity.tooLong,
          tooShort: validity.tooShort,
          typeMismatch: validity.typeMismatch,
          valid: validity.valid,
          valueMissing: validity.valueMissing,
        }
      })
    }

    function onBlur(e: Event) {
      checkValidity(true, false)
    }

    function onInput(e: Event) {
      input.setCustomValidity('')
      if (onDirty) {
        checkValidity(true, true)
      }
    }

    checkValidity()

    input.addEventListener('blur', onBlur)
    input.addEventListener('input', onInput)

    return {
      destroy() {
        input.removeEventListener('blur', onBlur)
        input.removeEventListener('input', onInput)
      },
    }
  }

  return Object.assign(action, readable)
}

let id = 0
const newID = () => `form-help:${++id}`