<template>
  <div class="home">
    <FileSelect @change="fileSelected" />
    <wages-list v-if="fileSelected" :shifts="shifts" />
  </div>
</template>

<script>
import Papa from 'papaparse';
import { createShift } from '@wages/wage-calculations';
import FileSelect from '../components/FileSelect.vue';
import WagesList from '../components/WagesList.vue';

export default {
  name: 'Home',
  components: {
    FileSelect,
    WagesList,
  },
  data() {
    return {
      parsedData: [],
    };
  },
  computed: {
    shifts() {
      const filtered = this.parsedData.filter((shift) => shift.person_id);
      return filtered.map((item) => {
        return { ...item, ...createShift(item) };
      });
    },
  },
  methods: {
    async fileSelected(e) {
      e.preventDefault();
      await Papa.parse(e.target.files[0], {
        header: true,
        /*eslint-disable */
        complete: (results, files) => {
          this.parsedData = [...results.data];
        },
        /* eslint-enable */
        transformHeader: (h) => {
          let header = h.toLowerCase().replace(' ', '_');
          switch (header) {
            case 'date':
              header = 'startDate';
              break;
            case 'start':
              header = 'startTime';
              break;
            case 'end':
              header = 'endTime';
              break;
            default:
              break;
          }
          return header;
        },
      });
    },
  },
};
</script>
<style scoped>
.main {
  width: 100%;
  max-width: 110ch;
}
</style>
