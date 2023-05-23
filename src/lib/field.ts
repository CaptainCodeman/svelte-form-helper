import { writable } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { Action } from 'svelte/action'
import type { FormInternal } from './form'

type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key]
}

type InputElement = HTMLButtonElement
                  | HTMLFieldSetElement
                  | HTMLInputElement
                  | HTMLOutputElement
                  | HTMLSelectElement
                  | HTMLTextAreaElement

export interface FieldState extends Mutable<ValidityState> {
  id: string
  dirty: boolean
  touched: boolean
  show: boolean
  message: string
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
  valid: false,
  valueMissing: false,
}

type MaybePromise<T> = T | Promise<T>

export type Validator = (value: string) => MaybePromise<string | null>

export interface FieldOptions {
  validator?: Validator
  onDirty?: boolean
  onTouched?: boolean
}

// Field store & use:action
export interface Field extends Readable<FieldState>, Action<InputElement> { }

export function createField(form: FormInternal, options?: FieldOptions): Field {
  const id = newID()
  const { onDirty, onTouched, validator } = { onDirty: false, onTouched: true, ...options }
  const state = { id, ...defaultFieldState }
  const { subscribe, set } = writable<FieldState>(state)

  const action = (input: InputElement) => {
    form.add(field)
    let globalNonce: Object

    async function checkValidity(setTouched = false, setDirty = false) {
      // used to ignore potentially still pending async custom validation checks
      const localNonce = globalNonce = new Object()

      // execute inbuilt validity checks
      let valid = input.checkValidity()

      // if valid, and a custom validator is defined, execute it
      if (valid && validator && !(input instanceof HTMLFieldSetElement)) {
        const message = await validator(input.value)

        // but if we're no longer the latest after the await, abort
        if (localNonce !== globalNonce) return

        // set validation flag and message
        if (message) {
          input.setCustomValidity(message)
        }
      }

      state.dirty = state.dirty || setDirty
      state.touched = state.touched || setTouched
      state.show = !input.validity.valid && ((onDirty && state.dirty) || (onTouched && state.touched))

      Object.assign(state, {
        message: input.validationMessage,
        ...validityToObject(input.validity),
      })

      set(state)

      setAttribute(input, state.show, 'data-show')
      setAttribute(input, state.dirty, 'data-dirty')
      setAttribute(input, state.touched, 'data-touched')

      setAttribute(input, state.show, 'aria-invalid', 'true')
      setAttribute(input, state.show, 'aria-describedby', id)
    }

    function onBlur(_e: Event) {
      checkValidity(true, false)
    }

    function onInput(_e: Event) {
      input.setCustomValidity('')
      checkValidity(false, true)
    }

    checkValidity()

    input.addEventListener('blur', onBlur)
    input.addEventListener('input', onInput)

    return {
      destroy() {
        form.del(field)
        input.removeEventListener('blur', onBlur)
        input.removeEventListener('input', onInput)
      },
    }
  }

  const field = Object.assign(action, { subscribe })

  return field
}

function validityToObject(validity: ValidityState) {
  const result = {} as Mutable<ValidityState>
  for (const key in validity) {
    result[key as keyof ValidityState] = validity[key as keyof ValidityState]
  }
  return result
}

let id = 0
const newID = () => `form-help:${++id}`

const setAttribute = (input: InputElement, flag: boolean, name: string, value: string = '') => {
  if (flag) {
    input.setAttribute(name, value)
  } else {
    input.removeAttribute(name)
  }
}