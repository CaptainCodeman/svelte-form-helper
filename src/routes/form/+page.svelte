<script lang="ts">
	import { createField, createForm } from '$lib'

	async function isNameAvailable(value: string) {
		await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
		const valid = value.length > 5
		return valid ? null : `Name '${value}' not available`
	}

	const email = createField()
	const age = createField()
	const name = createField({ validator: isNameAvailable, onDirty: true })
	const number = createField()
	const radio = createField({ onDirty: true, onTouched: true })

	// TODO: try to remove the need to populate the form with the fields by keeping track as they are added to the DOM
	const form = createForm(email, age, name, number, radio)

	function onSubmit() {
		console.log('submit')
	}

	let drone: string
</script>

<form use:form on:submit|preventDefault={onSubmit}>
	<label for="name" class="text-sm text-gray-500">Username</label>
	<input id="name" use:name type="text" placeholder="unique name" required />
	<div id={$name.id} class="m-1 text-xs text-red-700" hidden={!$name.show}>
		{#if $name.valueMissing}Name is required{/if}
		{#if $name.customError}Name not available{/if}
	</div>

	<label for="email" class="mt-2 text-sm text-gray-500">Email</label>
	<input id="email" use:email type="email" placeholder="email address" required />
	<div id={$email.id} class="m-1 text-xs text-red-700" hidden={!$email.show}>
		{#if $email.valueMissing}Email address is required{/if}
		{#if $email.typeMismatch}Not a valid email address{/if}
	</div>

	<label for="age" class="mt-2 text-sm text-gray-500">Age</label>
	<input id="age" use:age type="number" required value="0" min="18" max="65" />
	<div id={$age.id} class="m-1 text-xs text-red-700" hidden={!$age.show}>
		{#if $age.valueMissing}You have to tell us your age{/if}
		{#if $age.rangeUnderflow}You must be at least 18{/if}
		{#if $age.rangeOverflow}Sorry, no pensioners!{/if}
		{#if $age.stepMismatch}Whole years only{/if}
	</div>

	<label for="random" class="mt-2 text-sm text-gray-500">Pick a number from, 1 to 10</label>
	<input id="random" use:number type="number" required value="0" min="1" max="10" />
	<div id={$number.id} class="m-1 text-xs text-red-700" hidden={!$number.show}>{$number.message}</div>

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

<pre class="text-xs mt-4">
form:   {JSON.stringify($form, null, 2)}
name:   {JSON.stringify($name, null, 2)}
email:  {JSON.stringify($email, null, 2)}
age:    {JSON.stringify($age, null, 2)}
number: {JSON.stringify($number, null, 2)}
radio : {JSON.stringify($number, null, 2)}
</pre>

<style>
	label {
		display: block;
	}

	:global(input.validated):valid {
		border-color: green;
	}

	:global(input.validated):invalid {
		border-color: red;
	}
</style>
