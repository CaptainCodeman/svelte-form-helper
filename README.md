# Svelte Form Helper

Lightweight helpers for form validation with Svelte

`itsy-bitsy-teenie-weenie-svelte-form-validate-machiney`

## Goals

Use standard form and input validation wherever possible for no-JS approach

Progressively enhance normal forms, but allow better styling and interaction

Provide a light dusting of extra features for reactive handling of validation state

Mostly to set valid / invalid styles and decide which messages to show and when

https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation

## Options

Whether to re-evaluate validation on input (dirty), on touched (blur), or only for submit

## State

Whether each fields is dirty, touched, validating (to handle async), valid and if not, why not

Form state is aggregation of all the fields

Form values will come from the form itself or by binding to variables, not our job ...
