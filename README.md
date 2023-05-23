# Svelte Form Helper

Lightweight helper for form validation with Svelte

1.79 KB minified, 919 bytes gzipped (compression level 6)

## Features

- ✅ Tiny size (it could have been called `itsy-bitsy-teenie-weenie-svelte-form-validate-machiney`)
- ✅ Progressive enhancement of standard form validation
- ✅ Supports SSR only forms (with JS disabled, or if JS fails to load)
- ✅ Easy acces to validation state and control over messaging & styling when JS is enabled
- ✅ Support dynamic addition / removal of form fields
- ✅ Aggregate individual field into form-level state
- ✅ Add appropriate WIA-ARIA accessibility attributes for screen readers
- ✅ Works great with [SvelteKit Form actions](https://kit.svelte.dev/docs/form-actions)
- ✅ Supports all [HTMLElements that implement The Constraint Validation API](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#the_constraint_validation_api)

## Example

Online example coming soon, in the meantime checkout the [Basic Example](https://github.com/CaptainCodeman/svelte-form-helper/blob/master/src/routes/Example.svelte) or the [Component Example](https://github.com/CaptainCodeman/svelte-form-helper/blob/master/src/routes/ExampleHelpers.svelte)

## Usage

The important thing to remember is that we're not trying to _replace_ or _re-implement_ the browser native form validation, so you won't find JS versions of `required` or `minlength` - we build on top of what the browser already provides, to enhance it. So it's worth being familiar with the [validation attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation) available.

We also use the native browser [`ValidityState` model](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) to determine if and why validation failed and use those flags to determine what validation messages to show.

### Install from NPM

Install using your package manager of choice, e.g.:

    npm install svelte-form-helper
    pnpm i svelte-form-helper
    yarn add svelte-form-helper

### Create Form Instance

First import the `createForm` factory function in your component `<script>` block and create a form validator instance from it:

```ts
import { createForm } from 'svelte-form-helper'

const form = createForm()
```

### Create Field Instance(s)

Fields are created using the form instance `.field()` method. An options object can be passed to set:

- `onDirty` - a boolean flag of whether to show validation errors on `input` (default `false`)
- `onTouched` - a boolean flag of whether to show validation errors on `blur` (default `true`)
- `validator` - a custom validator function

```ts
const name = form.field({ validator: isNameAvailable, onDirty: true })
const email = form.field({ onDirty: true })
const title = form.field()
```

NOTE: The field is _always_ validated on `input` and `blur` (i.e. when dirty or touched) so the form validation state is always known and uptodate. This creates a better user experience as the form submit button will be enabled as soon as the form is valid, rather than requiring the user to tab out of the field first.

### Custom Validation Function

The custom validation function will be called if the field is otherwise valid (i.e. it won't be called if the input is set to `required` but is empty or hasn't yet met a required input length). It should accept a string value parameter and return a message if validation fails or else `null` if the value was valid. The validation function can be async to call a remote endpoint - if the input changes before the previous validation completed, the last one called will always win.

```ts
async function isNameAvailable(value: string) {
  const resp = await fetch('/checkname?name=' + value)
  return resp.status === 200 ? null : `Name not available`
}
```

NOTE: It will be ignored if used with a `HTMLFieldSetElement` (which represents a `<fieldset>` element) as this lacks a `value` property.

### Apply to HTMLFormElement

The `form` instance is a Svelte `use:action` directive so adding it to the `<form>` tag in the Svelte template associates it with the actual `HTMLFormElement` that is created in the browser:

```svelte
<form use:form on:submit={onSubmit}>
```

On the client the form action will set the `noValidate` property of the form to disable the native browser validation messages and provide us full control to provide and style our own. If JS is not available for any reason, the native browser validation will still be enabled.

### Access Form State

The `form` instance is _also_ a Svelte Readable Store and provides flags to indicate if the form is:

- `dirty` (_any_ field has been input)
- `touched` (the user has clicked on or tabbed to _any_ field)
- `valid` (_all_ of the fields attached to the form are valid)

The typical use for the state is to enable or disable the form submit button (which can also be reflected in its style to provide feedback to the user). Remember to use the `$` prefix to access the store value itself:

```svelte
<button type="submit" disabled={!$form.valid}>Submit</button>
```

This flag can also be used to prevent form submission in any `on:submit` event handler.

### Apply to HTMLInputElement(s)

The individual field instances are also Svelte `use:action` directives and should be added to the corresponding `<input>` tags in the template to associate them with the actual `HTMLInputElement`s in the browser:

```svelte
<input use:name type="text" placeholder="unique name" required minlength="5" maxlength="50"/>

<input use:email type="email" placeholder="email address" required />
```

### CSS `:valid` & `:invalid` Input Styling

The current field state is reflected to the HTML Element with `data-show`, `data-dirty` and `data-touched` attributes which can be used to style the input itself. You could apply a green or red border to indicate its valid or invalid state only when touched for instance. Note the reason for not using the `:valid` and `:invalid` CSS pseudo classes alone is that the styles would otherwise be applied to inputs on page load which is not a great user experience.

#### Svelte Style

A Svelte style based on the `data-touched` attribute needs to be made global to prevent it being removed:

<style global>
  input[data-touched]:valid {
    color: green;
    border-color: green;
  }

  input[data-touched]:invalid {
    color: red;
    border-color: red;
  }
</style>

#### TailwindCSS

If using TailwindCSS the styles can be added directly to the input element. e.g. to make the text and border red or green based on the state:

```html
<input
  use:email
  type="email"
  placeholder="email address"
  required
  class="
    data-[touched]:valid:text-green-700
    data-[touched]:valid:border-green-700
    data-[touched]:invalid:text-red-700
    data-[touched]:invalid:border-red-700
  "
/>
```

This can be made tidier by adding a custom variant using a TailwindCSS plugin defined in `tailwind.config.cjs`:

```ts
const plugin = require('tailwindcss/plugin')

// rest of config

plugins: [
  plugin(({ addVariant }) => {
    addVariant('touched', '&[data-touched]')
  }),
],
```

The previous classes applied to the input element can then be simplified to:

```html
<input
  use:email
  type="email"
  placeholder="email address"
  required
  class="
    touched:valid:text-green-700
    touched:valid:border-green-700
    touched:invalid:text-red-700
    touched:invalid:border-red-700
  "
/>
```

### Access Field State

Enough about styling the input elements themselves, what about adding additonal validation messages and hints?

The individual field instances are _also_ Svelte Readable Stores and provide easy access to the validation state of their associated `HTMLInputElement`. This can be used to decide what validation messages or hints to output. Whether the message should be shown is determined by the `show` flag.

This snippet will output the default validation message that the browser generates but allows control over where it is shown and how it is styled. Note the `id` being set on the message element - this allows the message to be linked to the `HTMLInputElement` by setting the appropriate `aria-invalid` and `aria-describedby` attributes on it (this happens automatically):

```svelte
{#if $name.show}
  <div id={$name.id} class="text-red-700">{$name.message}</div>
{/if}
```

But we also have access to the [`ValidityState` flags](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) so we're not limited to the message that the browser generates - we can decide exactly what custom message we want to show for each reason:

```svelte
{#if $name.show}
  <div id={$name.id} class="text-red-700">
    {#if $name.valueMissing}Name is required{/if}
    {#if $name.tooShort}Name must be at least 5 characters{/if}
    {#if $name.tooLong}Name can't be longer than 50 characters{/if}
    {#if $name.customError}Name not available{/if}
  </div>
{/if}
```

NOTE: instead of using the `{#if}` block another approach is to set the `hidden` attribute based on the `show` flag to control whether the validation message is shown:

```svelte
<div id={$name.id} class="text-red-700" hidden={!$name.show}>
  {#if $name.valueMissing}Name is required{/if}
  {#if $name.tooShort}Name must be at least 5 characters{/if}
  {#if $name.tooLong}Name can't be longer than 50 characters{/if}
  {#if $name.customError}Name not available{/if}
</div>
```

### Validation Component Wrappers

The use of `{#if}` blocks or `hidden` attributes helps keep the package size down and should be more efficient, but it's also possible to define some Svelte Components to make the outputting easier if preferred:

```svelte
<input use:email type="email" placeholder="email address" required />

<Validation for={email} class="text-red-700">
  <Hint valueMissing>Email address is required</Hint>
  <Hint typeMismatch>Not a valid email address</Hint>
</Validation>
```

#### Validation.svelte

The simplest message display just needs to reference the field:

```svelte
<Validation for={email} class="text-red-700" />
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

#### Hint.svelte

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
