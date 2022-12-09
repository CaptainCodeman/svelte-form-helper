<script lang="ts" context="module">
	import type { FieldState } from '$lib/field'

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
