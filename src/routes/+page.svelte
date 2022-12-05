<script lang="ts">
	import { createForm } from '$lib/form'
	import Hint from '$lib/Hint.svelte'
	import Validation from '$lib/Validation.svelte'

	async function isNameAvailable(value: string) {
		await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
		const valid = value.length > 5
		return valid ? null : `Name '${value}' not available`
	}

	const form = createForm()
	const email = form.field()
	const age = form.field()
	const name = form.field({ validator: isNameAvailable, onDirty: true })
	const number = form.field()
	const radio = form.field({ onDirty: true, onTouched: true })

	function onSubmit() {
		console.log('submit')
	}

	let drone: string
</script>

<form use:form class="m-4" on:submit|preventDefault={onSubmit}>
	<label for="name" class="text-sm text-gray-500">Username</label>
	<input id="name" use:name type="text" placeholder="unique name" required />
	<Validation for={name} class="m-1 text-xs text-red-700">
		<Hint valueMissing>Name is required</Hint>
		<Hint customError>Name not available</Hint>
	</Validation>

	<label for="email" class="mt-2 text-sm text-gray-500">Email</label>
	<input id="email" use:email type="email" placeholder="email address" required />
	<Validation for={email} class="m-1 text-xs text-red-700">
		<Hint valueMissing>Email address is required</Hint>
		<Hint typeMismatch>Not a valid email address</Hint>
	</Validation>

	<label for="age" class="mt-2 text-sm text-gray-500">Age</label>
	<input id="age" use:age type="number" required value="0" min="18" max="65" />
	<Validation for={age} class="m-1 text-xs text-red-700">
		<Hint valueMissing>You have to tell us your age</Hint>
		<Hint rangeUnderflow>You must be at least 18</Hint>
		<Hint rangeOverflow>You must be 65 or younger</Hint>
		<Hint stepMismatch>Whole years only</Hint>
	</Validation>

	<label for="random" class="mt-2 text-sm text-gray-500">Pick a number from, 1 to 10</label>
	<input id="random" use:number type="number" required value="0" min="1" max="10" />
	<Validation for={number} class="m-1 text-xs text-red-700" />

	<fieldset>
		<legend>Select a maintenance drone:</legend>

		<div>
			<input use:radio type="radio" id="huey" name="drone" value="huey" required bind:group={drone} />
			<label for="huey">Huey</label>
		</div>

		<div>
			<input use:radio type="radio" id="dewey" name="drone" value="dewey" required bind:group={drone} />
			<label for="dewey">Dewey</label>
		</div>

		<div>
			<input use:radio type="radio" id="louie" name="drone" value="louie" required bind:group={drone} />
			<label for="louie">Louie</label>
		</div>
	</fieldset>
	<Validation for={radio} class="m-1 text-xs text-red-700" />

	<button type="submit" class="block my-3 text-white bg-green-800 py-2 px-4 rounded disabled:bg-gray-400" disabled={!$form.valid}> Submit </button>
</form>

<pre class="text-xs">
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
