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
