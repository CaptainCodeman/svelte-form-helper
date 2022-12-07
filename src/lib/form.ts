import { derived } from 'svelte/store'
import type { Readable } from 'svelte/store'
import type { Action } from 'svelte/action'
import type { Field } from './field'

export interface FormState {
  dirty: boolean
  touched: boolean
  valid: boolean
}

// TODO: form level validators (multiple field combinations)

export interface Form extends Readable<FormState>, Action<HTMLFormElement> { }

export function createForm(...fields: Field[]): Form {
  const { subscribe } = derived(fields, $fields => {
    const valid = $fields.every(x => x.valid)
    const dirty = $fields.some(x => x.dirty)
    const touched = $fields.some(x => x.touched)
    return { dirty, touched, valid }
  })

  const action = (form: HTMLFormElement) => {
    // prevent default browser validation messages
    form.noValidate = true

    // keep track of form state (aggregation of all the fields)
    let state: FormState
    const unsub = subscribe(s => state = s)

    function onSubmit(e: SubmitEvent) {
      // prevent submit if not value (make optional?)
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

  return Object.assign(action, { subscribe })
}
