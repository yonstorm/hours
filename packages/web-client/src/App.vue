<template>
  <div id="app">
    <header class="site-header">
      <span class="logo"> Wages<strong>Hours</strong> </span>
      <nav class="site-navigation">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </nav>
    </header>
    <keep-alive>
      <router-view class="main" />
    </keep-alive>
    <footer>footer here</footer>
    >>>>>>> refactor/classifiers
  </div>
</template>

<style>
:root {
  --color-primary: #1b4295;
  --color-accent-light: #7aaac7;
  --color-accent-dark: #4479ae;
  --color-shade-light: #e8e6e1;
  --color-shade-dark: #2b2224;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
}
#app {
  background-color: var(--color-shade-light);
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content 1fr min-content;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.site-header {
  display: grid;
  grid-template-columns: max-content 1fr;
  width: 100%;
  max-width: 1200px;
  justify-self: center;
  margin: 0rem auto 1rem auto;
  padding: 0.7rem 1rem;
}

.site-navigation {
  justify-self: end;
  align-self: center;
}

.main {
  justify-self: center;
}

.site-navigation a.router-link-exact-active {
  color: #42b983;
}

.logo {
  font-size: 3rem;
  text-transform: uppercase;
  text-align: left;
}
</style>
