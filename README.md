# Svelte Form Helper

Lightweight () helpers for form validation with Svelte

1.84 KB minified, 851 bytes gzipped (compression level 6)

Alternative package name: `itsy-bitsy-teenie-weenie-svelte-form-validate-machiney`

## Goals

- Small size
- Use standard form and input validation wherever possible for compatibility with no-JS / pending-JS
- Progressively enhance normal forms, but allow easier acces to validation state and more control over styling & messaging
- Mostly to set valid / invalid styles and decide which messages to show and when
- SSR compatible

## Usage

First import the factory functions (you can use field validation without a form, for one-off inputs that don't need to be submitted):

```ts
import { createField, createForm } from 'svelte-form-helper'
```

### Fields

Create a field instance:

```ts
const email = createField()
```

Options can be passed to define a custom validation (which can be async, and should return a message if invalid or null if valied) and whether to perform validation on input (dirty) or when touched (blur). Validation doesn't run on initial render to prevent failed messages appearing before any user interaction.

```ts
// is valid if > 5 characters, otherwise invalid, with random 0.5 - 1.5 second delay
async function isNameAvailable(value: string) {
	await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
	const valid = value.length > 5
	return valid ? null : `Name '${value}' not available`
}

const name = createField({ validator: isNameAvailable, onDirty: true })
```

The field instance is applies to an HTML Input Element as a `use:action` (it adds some WIA-ARIA handling):

```svelte
<input use:name type="text" placeholder="unique name" required />
```

The field instance is also a store and provides access to the validation information. Note the ID - this links the message to the input using the `aria-describedby` attribute:

```svelte
<div id={$name.id} class="m-1 text-xs text-red-700" hidden={!$name.show}>
  {#if $name.valueMissing}Name is required{/if}
  {#if $name.customError}Name not available{/if}
</div>
```

The state includes whether the field is valid and the message itself. The minimal use will display the default browser message (this uses am `{#if}` block instead of using a `hidden` attribute):

```svelte
{#if $field.show}
  <div id={$field.id} class="m-1 text-xs text-red-700">{$field.message}</div>
{/if}
```

It also has `ValidityState` flags which are [build into the browser](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) and used to decide which message to show:

```svelte
<input use:age type="number" required value="0" min="18" max="65" />
<div id={$age.id} class="m-1 text-xs text-red-700" hidden={!$age.show}>
  {#if $age.valueMissing}You have to tell us your age{/if}
  {#if $age.rangeUnderflow}You must be at least 18{/if}
  {#if $age.rangeOverflow}Sorry, no pensioners!{/if}
  {#if $age.stepMismatch}Whole years only{/if}
</div>
```

The use of `{#if}` blocks helps keep the package size down and should be more efficient, but it's also possible to define some Svelte Components to make the outputting easier if preferred (see below for implementation):

```svelte
<input use:email type="email" placeholder="email address" required />
<Validation for={email} class="m-1 text-xs text-red-700">
  <Hint valueMissing>Email address is required</Hint>
  <Hint typeMismatch>Not a valid email address</Hint>
</Validation>
```

### Forms

A form aggregates the state of the fields - a form is valid if all the fields are valid _and_ have been touched (by default, the ). Pass the fields into the function when creating the form instance:

```ts
const form = createForm(email, age, name, random)
```

Just like the fields, the form instance is applied to the HTML Form Element as a `use:action`

```svelte
<form use:form on:submit|preventDefault={onSubmit}>
```

The stats is accessed as a store to enable / disable submit buttons:

```svelte
<button type="submit" class="block my-3 text-white bg-green-800 py-2 px-4 rounded disabled:bg-gray-400" disabled={!$form.valid}>
  Submit
</button>
```

## Example Validation Components

The implementation for the validation component syntax shown earlier is below:

### Validation.svelte

The simplest message display just needs to reference the field:

```svelte
<Validation for={email} class="m-1 text-xs text-red-700" />
```

```svelte
<script lang="ts" context="module">
  import type { FieldState } from 'svelte-form-helper/field'

  export const key = {}
  export type Context = {
    state: Readable<FieldState>
    clazz: string
  }
</script>

<script lang="ts">
  import type { Readable } from 'svelte/store'

  import { setContext } from 'svelte'
  export { state as for }

  let state: Readable<FieldState>
  let clazz = $$props.class

  setContext<Context>(key, { state, clazz })
</script>

{#if $state.show}
  <slot><div id={$state.id} class={clazz}>{$state.message}</div></slot>
{/if}
```

### Hint.svelte

For separate validation messages per reason, nest one or more `<Hint>` components within a `<Validation>` component:

```svelte
<input use:email type="email" placeholder="email address" required />
<Validation for={email} class="m-1 text-xs text-red-700">
  <Hint valueMissing>Email address is required</Hint>
  <Hint typeMismatch>Not a valid email address</Hint>
</Validation>
```

```svelte
<script lang="ts">
  import { key } from './Validation.svelte'
  import type { Context } from './Validation.svelte'
  import { getContext } from 'svelte'

  export let badInput = false
  export let customError = false
  export let patternMismatch = false
  export let rangeOverflow = false
  export let rangeUnderflow = false
  export let stepMismatch = false
  export let tooLong = false
  export let tooShort = false
  export let typeMismatch = false
  export let valid = false
  export let valueMissing = false

  const { state, clazz } = getContext<Context>(key)

  // prettier-ignore
  $: show = ($state.badInput && badInput) ||
            ($state.customError && customError) ||
            ($state.patternMismatch && patternMismatch) ||
            ($state.rangeOverflow && rangeOverflow) ||
            ($state.rangeUnderflow && rangeUnderflow) ||
            ($state.stepMismatch && stepMismatch) ||
            ($state.tooLong && tooLong) ||
            ($state.tooShort && tooShort) ||
            ($state.typeMismatch && typeMismatch) ||
            ($state.valid && valid) ||
            ($state.valueMissing && valueMissing)
</script>

{#if show}
  <div id={$state.id} class={clazz}><slot message={$state.message} /></div>
{/if}
```
