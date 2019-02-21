<template>
  <table class="table is-bordered is-narrow is-fullwidth">
    <thead>
      <tr>
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <th v-for="col in header">
          {{ col }}
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <tr
        v-for="row in rows"
        :class="row.class">
        <!-- eslint-disable-next-line vue/require-v-for-key -->
        <td
          v-for="cell in row.cells"
          :class="{'diff-changed': isCellChanged(cell)}">
          {{ cell }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const diffClasses = {
  '->': 'diff-changed',
  '---': 'diff-removed',
  '+++': 'diff-added'
}

export default {
  props: {
    diff: {
      type: Array,
      required: true
    }
  },
  computed: {
    header () {
      return this.diff[0]
    },
    rows () {
      const tail = this.diff.slice(1)
      return tail.map((cells) => ({
        class: diffClasses[cells[0]] || null,
        cells
      }))
    }
  },
  methods: {
    isCellChanged (cell) {
      return cell && cell.includes('->') && cell !== '->'
    }
  }
}
</script>

<style lang="sass">
$diff-changed: hsl(48, 100%, 67%)
$diff-added: hsl(217, 71%, 73%)
$diff-removed: hsl(348, 100%, 61%)

table th:first-child
  width: 45px

tr.diff-added
  background-color: $diff-added

tr.diff-removed
  background-color: $diff-removed

tr.diff-changed
  background-color: lighten($diff-changed, 20%)

td.diff-changed
  background-color: $diff-changed
</style>
