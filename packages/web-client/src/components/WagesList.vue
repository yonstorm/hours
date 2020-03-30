<template>
  <div class="wages">
    <span>
      <strong>Id</strong>
    </span>
    <span>
      <strong>Name</strong>
    </span>
    <span>
      <strong>Hours worked</strong>
    </span>
    <span>
      <strong>Total wage</strong>
    </span>
    <wage-list-row
      v-for="(entry, index) in shiftsById"
      :key="index"
      :data="entry"
    />
  </div>
</template>

<script>
import WageListRow from './WageListRow.vue';

export default {
  name: 'WagesList',
  components: {
    WageListRow,
  },
  props: {
    shifts: { type: Array, required: true },
  },
  computed: {
    shiftsById() {
      const results = this.shifts.reduce((acc, shift) => {
        if (acc[shift.person_id]) {
          return acc;
        }

        acc[shift.person_id] = {
          person_id: shift.person_id,
          person_name: shift.person_name,
          shifts: [],
        };
        return acc;
      }, {});

      this.shifts.forEach((shift) => {
        results[shift.person_id].shifts.push({
          startDate: shift.startDate,
          shiftStart: shift.shiftStart,
          shiftEnd: shift.shiftEnd,
          shiftDuration: shift.shiftDuration,
        });
      });

      return results;
    },
  },
};
</script>
<style scoped>
.wages {
  display: grid;
  grid-template-columns: max-content max-content max-content max-content;
}
span {
  padding: 0.5rem 1.5rem 0.5rem 0;
  text-align: left;
}
</style>
