<template functional>
  <section class="fileselect">
    <span class="fileselect__instructions"
      ><span>Drag and drop</span> a CSV file here or <span>click</span> to
      select one</span
    >
    <input
      type="file"
      v-on="listeners"
      accept=".csv"
      class="fileselect__input"
    />
  </section>
</template>

<script>
export default {
  name: 'FileSelect',
  data() {
    return {
      selectedFile: {},
    };
  },
};
</script>

<style scoped>
.fileselect {
  display: grid;
  border-radius: 5px;
  grid-template-columns: 1fr;
  justify-content: center;
  width: 100%;
  padding: 1.5rem 2rem;
  background-color: var(--color-shade-dark);
  color: var(--color-shade-light);
  cursor: pointer;
  align-items: center;
  position: relative;
  min-height: 150px;
}
.fileselect:hover {
  outline: 3px dashed var(--color-accent-light);
  outline-offset: -0.5rem;
}
.fileselect__instructions {
  justify-self: center;
  font-size: 1.5rem;
}
.fileselect__instructions span {
  text-decoration: underline;
}
.fileselect__input {
  justify-self: center;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
