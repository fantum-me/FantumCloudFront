<script setup lang="ts">
import type Workspace from "~/types/Workspace";

const res = await useApiFetch("/workspaces")
const workspaces: Workspace[] = await res.json()
if (workspaces.length > 0) navigateTo("/workspace/" + workspaces[0].id)
else navigateTo("/workspace/new")
</script>

<template/>
