<script>
import {
  calculateTotalWage,
  calculateTotalWorkHours,
} from '@wages/wage-calculations';

export default {
  functional: true,
  props: {
    data: { type: Object, required: true },
  },
  render(h, context) {
    const totalWage = calculateTotalWage(context.props.data.shifts).total;
    const hoursWorked = calculateTotalWorkHours(context.props.data.shifts);
    return [
      /*eslint-disable */
      h('span', context.props.data['person_id']),
      h('span', context.props.data['person_name']),
        h('span', `${hoursWorked.hours}`),
        h('span', `${totalWage} $`),
      /* eslint-enable */
    ];
  },
};
</script>
<style scoped>
span {
  padding-right: 1.5rem;
}
</style>
