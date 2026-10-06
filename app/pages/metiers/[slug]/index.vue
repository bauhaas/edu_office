<script setup lang="ts">
const { page } = await useJobPage(useSlugParam())
</script>

<template>
  <JobPage :page="page" />
</template>
