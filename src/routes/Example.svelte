<script lang="ts">
	import { createForm } from '$lib'

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
		<input id="name" use:name type="text" placeholder="unique name" required />
		<div id={$name.id} class="m-1 text-xs text-red-700" hidden={!$name.show}>
			{#if $name.valueMissing}Name is required{/if}
			{#if $name.customError}Name not available{/if}
		</div>

		{#if canToggle}
			<label class="flex items-center">
				<input class="mr-2" type="checkbox" bind:checked={showEmail} />
				Include Email in Form
			</label>
		{/if}

		{#if showEmail}
			<label for="email" class="mt-2 text-sm text-gray-500">Email</label>
			<input id="email" use:email type="email" placeholder="email address" required />
			<div id={$email.id} class="m-1 text-xs text-red-700" hidden={!$email.show}>
				{#if $email.valueMissing}Email address is required{/if}
				{#if $email.typeMismatch}Not a valid email address{/if}
			</div>
		{/if}

		<label for="age" class="mt-2 text-sm text-gray-500">Age</label>
		<input id="age" use:age type="number" required value="0" min="18" max="65" />
		<div id={$age.id} class="m-1 text-xs text-red-700" hidden={!$age.show}>
			{#if $age.valueMissing}You have to tell us your age{/if}
			{#if $age.rangeUnderflow}You must be at least 18{/if}
			{#if $age.rangeOverflow}Sorry, no pensioners!{/if}
			{#if $age.stepMismatch}Whole years only{/if}
		</div>

		<label for="random" class="mt-2 text-sm text-gray-500">Pick a number from, 1 to 10</label>
		<input id="random" use:random type="number" required value="0" min="1" max="10" />
		<div id={$random.id} class="m-1 text-xs text-red-700" hidden={!$random.show}>{$random.message}</div>

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
		<div id={$radio.id} class="m-1 text-xs text-red-700" hidden={!$radio.show}>{$radio.message}</div>

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
</style>
