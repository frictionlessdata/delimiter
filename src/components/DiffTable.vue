<template>
  <table class="table is-bordered is-narrow is-fullwidth">
    <thead>
      <tr>
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <th v-for="col in head">
          {{ col }}
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <tr v-for="row in tail">
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <td
          v-for="col in row"
          :class="{'is-selected': col && col.includes('->')}">
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
