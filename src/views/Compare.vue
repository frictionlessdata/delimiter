<template>
  <section class="section">
    <h2 class="title">
      Compare differences
    </h2>
    <DiffTable
      v-if="fileDiff && fileDiff.data.length > 1"
      :diff="fileDiff.data" />
    <div
      v-else-if="fileDiff && fileDiff.data.length < 2"
      class="notification">
      No diffs detected
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import pick from 'lodash/pick'
import isEqual from 'lodash/isEqual'

import DiffTable from '@/components/DiffTable'

export default {
  components: {
    DiffTable
  },
  computed: mapState({
    isFileLoaded (state) {
      return !!state.file.data && isEqual(this.routeFileLocation, state.file.location)
    },
    fileDiff: (state) => state.file.diff,
    routeFileLocation (state) {
      return pick(state.route.params, ['origin', 'repo', 'branch', 'path'])
    }
  }),
  created () {
    if (this.isFileLoaded) this.createDiff()
    // TODO: else redirect to /edit/
  },
  methods: {
    ...mapActions([
      'createDiff'
    ])
  }
}
</script>
