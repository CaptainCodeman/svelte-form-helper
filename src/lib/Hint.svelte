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

	$: validity = $state.validity

	// prettier-ignore
	$: show = validity && (
		(validity.badInput && badInput) ||
		(validity.customError && customError) ||
		(validity.patternMismatch && patternMismatch) ||
		(validity.rangeOverflow && rangeOverflow) ||
		(validity.rangeUnderflow && rangeUnderflow) ||
		(validity.stepMismatch && stepMismatch) ||
		(validity.tooLong && tooLong) ||
		(validity.tooShort && tooShort) ||
		(validity.typeMismatch && typeMismatch) ||
		(validity.valid && valid) ||
		(validity.valueMissing && valueMissing)
	)
</script>

{#if show}
	<div id={$state.id} class={clazz}><slot message={$state.validationMessage} /></div>
{/if}
