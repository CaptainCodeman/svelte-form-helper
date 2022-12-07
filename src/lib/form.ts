import { derived, writable } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { Action } from 'svelte/action'
import { createField } from './field'
import type { Field, FieldOptions } from './field'

export interface FormState {
  dirty: boolean
  touched: boolean
  valid: boolean
}

// TODO: form level validators (multiple field combinations)

export interface Form extends Readable<FormState>, Action<HTMLFormElement> {
  field(options?: FieldOptions): Field
}

export function createForm(...fields: Field[]): Form {
  // default state (this would be used for SSR, so the form can be submitted)
  let state: FormState = { dirty: false, touched: false, valid: true }
  const { subscribe, set } = writable(state)

  const action = (form: HTMLFormElement) => {
    // prevent default browser validation messages when CSR is enabled
    form.noValidate = true

    // derived store aggregates form state from all the fields
    // TODO: we _could_ use a Set to ensure fields are all unique (they haven't used the
    // field method AND passed them into createForm), but the results should be identical
    const { subscribe } = derived(fields, $fields => {
      const valid = $fields.every(x => x.valid)
      const dirty = $fields.some(x => x.dirty)
      const touched = $fields.some(x => x.touched)
      return { dirty, touched, valid }
    })

    // pass that state on to the form store and keep a copy for use in onSubmit
    const unsub = subscribe(s => {
      state = s
      set(state)
    })

    function onSubmit(e: SubmitEvent) {
      // prevent form submit if not valid (make a configurable option?)
      if (!state.valid) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    form.addEventListener('submit', onSubmit)

    return {
      destroy() {
        unsub()
        form.removeEventListener('submit', onSubmit)
      },
    }
  }

  const field = (options?: FieldOptions) => {
    const field = createField(options)
    fields.push(field)
    return field
  }

  return Object.assign(action, { subscribe, field })
}
