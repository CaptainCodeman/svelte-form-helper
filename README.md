# Svelte Form Helper

Lightweight () helpers for form validation with Svelte

1.92 KB minified, 857 bytes gzipped

Alternative package name: `itsy-bitsy-teenie-weenie-svelte-form-validate-machiney`

## Goals

Use standard form and input validation wherever possible for compatibility with no-JS / pending-JS

Progressively enhance normal forms, but allow easier acces to validation state and more control over styling

Mostly to set valid / invalid styles and decide which messages to show and when

SSR compatible

## Options

Whether to re-evaluate validation on input (dirty), on touched (blur), or only for submit

## State

Whether each fields is dirty, touched, validating (to handle async), valid and if not, why not

Form state is aggregation of all the fields (valid if _all_ fields are valid, dirty or touched if _any_ fields are)

Form values will come from the form itself or by binding to variables, not our job ...

## Usage

import:

```ts
import { createField, createForm } from 'svelte-form-helper'
```

create a field:

```ts
const email = createField()
```

options for custom validation (can be async) and whether to validate on input (dirty) or touched (blur)

```ts
// is valid if > 5 characters, otherwise invalid, with random 0.5 - 1.5 second delay
async function isNameAvailable(value: string) {
	await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
	const valid = value.length > 5
	return valid ? null : `Name '${value}' not available`
}

const name = createField({ validator: isNameAvailable, onDirty: true })
```

apply to an input as a `use:action` (it adds some WIA-ARIA handling) and access the state as a store:

```svelte
<input id="name" use:name type="text" placeholder="unique name" required />
<div id={$name.id} class="m-1 text-xs text-red-700" hidden={!$name.show}>
  {#if $name.valueMissing}Name is required{/if}
  {#if $name.customError}Name not available{/if}
</div>
```

(this validation message handling could easily be wrapped into Message / Hint components)

The state includes whether the message should be show and the message itself. The minimal use will display the default browser message:

```svelte
{#if $field.show}
  <div id={$field.id} class="m-1 text-xs text-red-700">{$field.message}</div>
{/if}
```

It also has `ValidityState` flags which are [build into the browser](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) and used to decide which message to show:

```svelte
<input id="age" use:age type="number" required value="0" min="18" max="65" />
<div id={$age.id} class="m-1 text-xs text-red-700" hidden={!$age.show}>
  {#if $age.valueMissing}You have to tell us your age{/if}
  {#if $age.rangeUnderflow}You must be at least 18{/if}
  {#if $age.rangeOverflow}Sorry, no pensioners!{/if}
  {#if $age.stepMismatch}Whole years only{/if}
</div>
```

a form can aggregate the state of the fields:

```ts
const form = createForm(email, age, name, random)
```

again applied to the form as a `use:action`

```svelte
<form use:form on:submit|preventDefault={onSubmit}>
```

and accessed as a store to enable / disable submit buttons:

```svelte
<button type="submit" class="block my-3 text-white bg-green-800 py-2 px-4 rounded disabled:bg-gray-400" disabled={!$form.valid}>
  Submit
</button>
```
