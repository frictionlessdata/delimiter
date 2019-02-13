<template>
  <table class="table is-bordered is-narrow is-fullwidth">
    <thead>
      <tr>
        <th v-for="col in head">
          {{ col }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in tail">
        <td
          v-for="col in row"
          :class="{'is-selected': col.includes('->')}">
          {{ col }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    diff: {
      type: Array,
      required: true
    }
  },
  computed: {
    head () {
      return this.diff[0]
    },
    tail () {
      return this.diff.slice(1)
    }
  }
}
</script>
