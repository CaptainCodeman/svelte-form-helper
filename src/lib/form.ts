import { derived, writable } from 'svelte/store'
import type { Readable, Unsubscriber } from 'svelte/store'
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

export interface FormInternal extends Form {
  add(field: Field): void
  del(field: Field): void
}

export function createForm(): Form {
  // default state (this would be used for SSR, so the form can be submitted)
  const { subscribe, set } = writable({ dirty: false, touched: false, valid: true })

  let fields: Field[] = []
  let unsubscribe: Unsubscriber | undefined

  // This is a little funky, what it does is create a derived store to aggregate
  // the field validation, and subscribe to it to update the form store and set
  // the state to use in onSubmit. Because we need to re-create it anytime a
  // field is added or removed we let the unsubscriber be passed back in and called
  function createAggregator(fields: Field[], unsubscribe?: Unsubscriber) {
    unsubscribe && unsubscribe()

    // derived store aggregates form state from all the fields
    const { subscribe } = derived(fields, $fields => {
      const valid = $fields.every(x => x.valid)
      const dirty = $fields.some(x => x.dirty)
      const touched = $fields.some(x => x.touched)
      return { dirty, touched, valid }
    })

    return subscribe(state => set(state))
  }

  const action = (form: HTMLFormElement) => {
    // prevent default browser validation messages when CSR is enabled
    form.noValidate = true

    // ensure aggregator is running (if form has been unmounted and remounted)
    unsubscribe = createAggregator(fields, unsubscribe)

    return {
      destroy() {
        unsubscribe && unsubscribe()
        unsubscribe = undefined
      },
    }
  }

  const field = (options?: FieldOptions) => {
    const field = createField(form, options)
    return field
  }

  const add = (field: Field) => {
    if (fields.includes(field)) return
    fields.push(field)
    unsubscribe = createAggregator(fields, unsubscribe)
  }

  const del = (field: Field) => {
    fields = fields.filter(f => f !== field)
    unsubscribe = createAggregator(fields, unsubscribe)
  }

  const form: FormInternal = Object.assign(action, { subscribe, field, add, del })

  return form
}
