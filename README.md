# Svelte Form Helper

Lightweight () helpers for form validation with Svelte

1.92 KB minified, 857 bytes gzipped

Alternative package name: `itsy-bitsy-teenie-weenie-svelte-form-validate-machiney`

## Goals

Use standard form and input validation wherever possible for compatibility with no-JS / pending-JS

Progressively enhance normal forms, but allow easier acces to validation state and more control over styling

Mostly to set valid / invalid styles and decide which messages to show and when

SSR compatible

## Options

Whether to re-evaluate validation on input (dirty), on touched (blur), or only for submit

## State

Whether each fields is dirty, touched, validating (to handle async), valid and if not, why not

Form state is aggregation of all the fields (valid if _all_ fields are valid, dirty or touched if _any_ fields are)

Form values will come from the form itself or by binding to variables, not our job ...
