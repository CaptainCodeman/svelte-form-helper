import { derived, writable } from 'svelte/store'
import type { Readable, Unsubscriber } from 'svelte/store'
import type { Action } from 'svelte/action'
import { createField } from './field'
import type { Field, FieldOptions, FieldInternal } from './field'

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

export function createForm(...fields: Field[]): Form {
  // default state (this would be used for SSR, so the form can be submitted)
  let state: FormState = { dirty: false, touched: false, valid: true }
  const { subscribe, set } = writable(state)
  let unsubscribe = createAggregator(fields)

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

    return subscribe(s => set(state = s))
  }

  const action = (form: HTMLFormElement) => {
    // prevent default browser validation messages when CSR is enabled
    form.noValidate = true

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
        unsubscribe()
        form.removeEventListener('submit', onSubmit)
      },
    }
  }

  const field = (options?: FieldOptions) => {
    const field = createField(options, form)
    add(field)
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

  fields.forEach(f => (f as FieldInternal).form = form)

  return form
}
