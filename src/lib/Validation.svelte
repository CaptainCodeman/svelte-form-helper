<script lang="ts" context="module">
	import type { FieldState } from './form'
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

	$: show = ($state.onDirty && $state.dirty) || ($state.onTouched && $state.touched)
</script>

{#if show}
	<slot><div id={$state.id} class={clazz}>{$state.validationMessage}</div></slot>
{/if}
