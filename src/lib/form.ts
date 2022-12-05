import { writable } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { Action } from 'svelte/action'

export type Validator = (value: string) => Promise<string | null>

export interface FormState {
  dirty: boolean
  touched: boolean
  valid: boolean
}

export interface FieldOptions {
  validator?: Validator
  onDirty?: boolean
  onTouched?: boolean
}

// Form store & use:action
export interface Form extends Readable<FormState>, Action<HTMLFormElement> {
  field: (options?: FieldOptions) => Field
}

export interface FieldState {
  id: string
  onDirty: boolean
  onTouched: boolean
  dirty: boolean
  touched: boolean
  valid: boolean
  validity?: ValidityState
  validationMessage?: string
}

// Field store & use:action
export interface Field extends Readable<FieldState>, Action<HTMLInputElement> { }

// TODO: options - validate on blur, on input or on submit
export function createForm(): Form {
  const state: FormState = { dirty: false, touched: false, valid: false }
  const { subscribe, set } = writable(state)
  const fields: { key: Object, valid: boolean }[] = []

  const action = (form: HTMLFormElement) => {
    // prevent default browser validation messages
    form.noValidate = true

    function onSubmit(e: SubmitEvent) {
      if (!state.valid) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    form.addEventListener('submit', onSubmit)

    return {
      destroy() {
        form.removeEventListener('submit', onSubmit)
      },
    }
  }

  const addField = (key: Object, valid: boolean) => fields.push({ key, valid })

  // TODO: we should be valid only if _all_ fields are valid, dirty and touched if _any_ fields are
  const updateForm = (key: Object, valid: boolean) => {
    fields.find(x => x.key === key)!.valid = valid
    state.valid = fields.every(x => x.valid)
    set(state)
  }

  const field = (options?: FieldOptions): Field => {
    const id = newID('form-helper')
    const { onDirty, onTouched, validator } = { onDirty: false, onTouched: true, ...options }
    const { subscribe, update } = writable<FieldState>({ id, onDirty, onTouched, dirty: false, touched: false, valid: false })
    const key = new Object()

    // TODO: do we need to check for group inputs like radio buttons?

    const action = (input: HTMLInputElement) => {
      const { validity, validationMessage } = input
      update(x => ({ ...x, validity, validationMessage }))

      let globalNonce: Object
      async function checkValidity() {
        // used to ignore potentially still pending async custom validation checks
        const localNonce = globalNonce = new Object()

        let valid = input.checkValidity()
        if (valid && validator) {
          const message = await validator(input.value)

          // if we're no longer the latest, abort
          if (localNonce !== globalNonce) return

          // set validation flag and message
          if (message) {
            valid = false
            input.setCustomValidity(message)
          }
        }
        input.classList.toggle('validated', true)
        input.setAttribute('aria-invalid', (!valid).toString())
        if (!valid) {
          input.setAttribute('aria-describedby', id)
        }

        // update store to trigger UI updates
        const { validity, validationMessage } = input
        update(x => ({ ...x, valid, validity, validationMessage }))
        updateForm(key, valid)
      }

      function onBlur(e: Event) {
        update(x => ({ ...x, touched: true }))
        // updateForm({ touched: true })
        if (onTouched) {
          checkValidity()
        }
      }

      function onInput(e: Event) {
        // clear previous validation state
        input.removeAttribute('aria-invalid')
        input.removeAttribute('aria-describedby')
        input.setCustomValidity('')
        const { validity, validationMessage } = input
        update(x => ({ ...x, dirty: true, validity, validationMessage }))
        // updateForm({ dirty: true })
        if (onDirty) {
          checkValidity()
        }
      }

      async function onChange(e: Event) {
        checkValidity()
      }

      input.addEventListener('blur', onBlur)
      input.addEventListener('input', onInput)
      input.addEventListener('change', onChange)

      return {
        destroy() {
          input.removeEventListener('blur', onBlur)
          input.removeEventListener('input', onInput)
          input.removeEventListener('change', onChange)
        },
      }
    }

    const result = Object.assign(action, {
      subscribe,
    })

    addField(key, false)

    return result
  }

  return Object.assign(action, {
    field,
    subscribe,
  })
}

let id = 0

export function newID(prefix: string) {
  return `${prefix}:${++id}`
}