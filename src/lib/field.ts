import { writable } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { Action } from 'svelte/action'
import type { FormInternal } from './form'

type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key]
}

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
  valid: true,
  valueMissing: false,
}

export type Validator = (value: string) => Promise<string | null>

export interface FieldOptionsInternal {
  onDirty: boolean
  onTouched: string
}

export interface FieldOptions extends FieldOptionsInternal {
  validator?: Validator
}

// Field store & use:action
export interface Field extends Readable<FieldState>, Action<HTMLInputElement> { }

export function createField(form: FormInternal, options: FieldOptions): Field {
  const id = newID()
  const { onDirty, onTouched, validator } = options
  const state = { id, ...defaultFieldState }
  const { subscribe, set } = writable<FieldState>(state)

  const action = (input: HTMLInputElement) => {
    form.add(field)
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

      dirty = state.dirty || dirty
      touched = state.touched || touched

      Object.assign(state, {
        dirty,
        touched,
        show: touched && !input.validity.valid,
        message: input.validationMessage,
        ...validityToObject(input.validity),
      })

      set(state)

      if (state.show) {
        input.setAttribute('aria-invalid', 'true')
        input.setAttribute('aria-describedby', id)
      } else {
        input.removeAttribute('aria-invalid')
        input.removeAttribute('aria-describedby')
      }

      input.classList.toggle(onTouched, touched)
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