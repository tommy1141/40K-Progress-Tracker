<template>
  <div class="navbar  bg-primary text-primary-content">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost  text-xl">
        40K Progress Tracker
      </NuxtLink>
    </div>

    <div class="navbar-end">
      <AppThemeToggle />
      <AppAuthButton />
    </div>
  </div>
</template>
