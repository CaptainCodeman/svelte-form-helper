<script lang="ts">
	import { createForm } from '$lib'
	import Validation from './Validation.svelte'
	import Hint from './Hint.svelte'

	export let canToggle = false

	// is valid if > 5 characters, otherwise invalid, with random 0.5 - 1.5 second delay
	async function isNameAvailable(value: string) {
		await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
		const valid = value.length > 5
		return valid ? null : `Name '${value}' not available`
	}

	const form = createForm()
	const email = form.field()
	const age = form.field()
	const name = form.field({ validator: isNameAvailable })
	const random = form.field()
	const radio = form.field()

	let showForm = true
	let showEmail = true

	function onSubmit() {
		// whatever
	}

	let drone: string
</script>

{#if canToggle}
	<label class="flex items-center">
		<input class="mr-2" type="checkbox" bind:checked={showForm} />
		Show Form
	</label>
{/if}

{#if showForm}
	<form use:form on:submit|preventDefault={onSubmit}>
		<label for="name" class="text-sm text-gray-500">Username</label>
		<input
			id="name"
			class="touched:valid:text-green-700 touched:valid:border-green-700 touched:invalid:text-red-700 touched:invalid:border-red-700"
			use:name
			type="text"
			placeholder="unique name"
			required
		/>
		<Validation for={name} class="m-1 text-xs text-red-700">
			<Hint valueMissing>Name is required</Hint>
			<Hint customError>Name not available</Hint>
		</Validation>

		{#if canToggle}
			<label class="flex items-center">
				<input class="mr-2" type="checkbox" bind:checked={showEmail} />
				Include Email in Form
			</label>
		{/if}

		{#if showEmail}
			<label for="email" class="mt-2 text-sm text-gray-500">Email</label>
			<input
				id="email"
				class="touched:valid:text-green-700 touched:valid:border-green-700 touched:invalid:text-red-700 touched:invalid:border-red-700"
				use:email
				type="email"
				placeholder="email address"
				required
			/>
			<Validation for={email} class="m-1 text-xs text-red-700">
				<Hint valueMissing>Email address is required</Hint>
				<Hint typeMismatch>Not a valid email address</Hint>
			</Validation>
		{/if}

		<label for="age" class="mt-2 text-sm text-gray-500">Age</label>
		<input
			id="age"
			class="touched:valid:text-green-700 touched:valid:border-green-700 touched:invalid:text-red-700 touched:invalid:border-red-700"
			use:age
			type="number"
			required
			value="0"
			min="18"
			max="65"
		/>
		<Validation for={age} class="m-1 text-xs text-red-700">
			<Hint valueMissing>You have to tell us your age</Hint>
			<Hint rangeUnderflow>You must be at least 18</Hint>
			<Hint rangeOverflow>Sorry, no pensioners!</Hint>
			<Hint stepMismatch>Whole years only</Hint>
		</Validation>

		<label for="random" class="mt-2 text-sm text-gray-500">Pick a number from, 1 to 10</label>
		<input
			id="random"
			class="touched:valid:text-green-700 touched:valid:border-green-700 touched:invalid:text-red-700 touched:invalid:border-red-700"
			use:random
			type="number"
			required
			value="0"
			min="1"
			max="10"
		/>
		<Validation for={random} class="m-1 text-xs text-red-700" />

		<fieldset>
			<legend>Select a maintenance drone:</legend>

			<label class="flex items-center">
				<input use:radio type="radio" name="drone" value="huey" required bind:group={drone} />
				Huey
			</label>

			<label class="flex items-center">
				<input use:radio type="radio" name="drone" value="dewey" required bind:group={drone} />
				Dewey
			</label>

			<label class="flex items-center">
				<input use:radio type="radio" name="drone" value="louie" required bind:group={drone} />
				Louie
			</label>
		</fieldset>
		<Validation for={radio} class="m-1 text-xs text-red-700" />

		<button type="submit" class="block my-3 text-white bg-green-800 py-2 px-4 rounded disabled:bg-gray-400" disabled={!$form.valid}> Submit </button>
	</form>
{/if}

<pre class="text-xs mt-4">
form:   {JSON.stringify($form, null, 2)}
name:   {JSON.stringify($name, null, 2)}
email:  {JSON.stringify($email, null, 2)}
age:    {JSON.stringify($age, null, 2)}
number: {JSON.stringify($random, null, 2)}
radio : {JSON.stringify($radio, null, 2)}
</pre>

<style>
	label {
		display: block;
	}

	:global(input.touched:valid) {
		border-color: green;
	}

	:global(input.touched:invalid) {
		border-color: red;
	}
</style>
