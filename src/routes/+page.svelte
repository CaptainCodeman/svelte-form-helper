<script lang="ts">
	import { createForm } from '$lib'

	import TouchedIcon from './TouchedIcon.svelte'
	import Validation from './Validation.svelte'
	import Hint from './Hint.svelte'

	const form = createForm()
	const name = form.field()
	const email = form.field()
	const password = form.field()

	const inputClass = `block w-full text-sm rounded-md pr-10 border-gray-300 shadow-sm
	focus:border-indigo-500 focus:ring-indigo-500
	touched:invalid:border-red-300 touched:invalid:text-red-900 touched:invalid:placeholder-red-300 touched:invalid:focus:border-red-500 touched:invalid:focus:ring-red-500
	touched:valid:border-green-400 touched:valid:text-green-900 touched:valid:placeholder-green-400 touched:valid:focus:border-green-600 touched:valid:focus:ring-green-600`

	let showDebug = false
</script>

<h1 class="font-bold text-gray-700 text-3xl tracking-tighter">svelte-form-helper</h1>
<p class="mt-2 text-gray-700">Example form to show functionality</p>

<h2 class="font-bold text-gray-500 text-xl tracking-tighter mt-6">Registration Form</h2>

<label class="mt-4 flex items-center text-sm text-gray-500">
	<input class="mr-1.5 rounded outline-2" type="checkbox" bind:checked={showDebug} />
	Show Validation Models
</label>

<form class="mt-4" autocomplete="off" use:form on:submit|preventDefault={() => {}}>
	<div class="mt-4">
		<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
		<div class="relative mt-1 rounded-md shadow-sm w-64">
			<input
				id="name"
				type="text"
				name="name"
				class={inputClass}
				placeholder="your fullname"
				required
				minlength="3"
				maxlength="30"
				pattern="[a-zA-Z\s]+"
				use:name
			/>
			<TouchedIcon field={name} />
		</div>
		<Validation for={name} class="mt-2 text-sm text-red-600">
			<Hint valueMissing>Name is required</Hint>
			<Hint tooShort>Name has to be at least 3 characters</Hint>
			<Hint tooLong>Name cannot be more than 30 characters</Hint>
			<Hint patternMismatch>Name can only contain alpha characters</Hint>
		</Validation>
	</div>

	{#if showDebug}
		<pre class="mt-2 text-xs">{JSON.stringify($name, null, 2)}</pre>
	{/if}

	<div class="mt-4">
		<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
		<div class="relative mt-1 rounded-md shadow-sm w-64">
			<input id="email" type="email" name="email" class={inputClass} placeholder="you@example.com" required use:email />
			<TouchedIcon field={email} />
		</div>
		<p id={$email.id} class="mt-2 text-sm text-red-600" hidden={!$email.show}>{$email.message}</p>
	</div>

	{#if showDebug}
		<pre class="mt-2 text-xs">{JSON.stringify($email, null, 2)}</pre>
	{/if}

	<div class="mt-4">
		<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
		<div class="relative mt-1 rounded-md shadow-sm w-64">
			<input id="password" type="password" name="password" class={inputClass} required minlength="8" maxlength="64" use:password />
			<TouchedIcon field={password} />
		</div>
		<p id={$password.id} class="mt-2 text-sm text-red-600" hidden={!$password.show}>{$password.message}</p>
	</div>

	{#if showDebug}
		<pre class="mt-2 text-xs">{JSON.stringify($password, null, 2)}</pre>
	{/if}

	<button class="fadeIn mt-4 text-white bg-green-800 disabled:bg-gray-400 px-4 py-2 rounded" type="submit" disabled={!$form.valid}>Register</button>

	{#if showDebug}
		<pre class="mt-2 text-xs">{JSON.stringify($form, null, 2)}</pre>
	{/if}
</form>

<style>
</style>
