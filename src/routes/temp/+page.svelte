<script lang="ts">
	import { createForm } from '$lib'

	const form = createForm()
	const name = form.field({ onDirty: true })

	function onSubmit() {
		// whatever
	}
</script>

<form use:form on:submit|preventDefault={onSubmit}>
  <label for="name" class="text-sm text-gray-500">Username</label>
  <input
    id="name"
    class="validated:valid:text-green-700 validated:valid:border-green-700 validated:invalid:text-red-700 validated:invalid:border-red-700"
    use:name
    type="text"
    placeholder="unique name"
    required
    minlength="3"
    autocomplete="off"
  />
  <div id={$name.id} class="m-1 text-xs text-red-700" hidden={!$name.show}>
    {#if $name.valueMissing}Name is required{/if}
    {#if $name.tooShort}Name must be at least 3 characters{/if}
  </div>

  <button type="submit" class="block my-3 text-white bg-green-800 py-2 px-4 rounded disabled:bg-gray-400" disabled={!$form.valid}>
    Submit
  </button>
</form>

<pre class="text-xs mt-4">
form: {JSON.stringify($form, null, 2)}
name: {JSON.stringify($name, null, 2)}
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
