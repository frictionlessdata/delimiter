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

import DiffTable from '@/components/DiffTable'

export default {
  components: {
    DiffTable
  },
  computed: mapState({
    isFileLoaded: (state) => !!state.fileData,
    fileDiff: (state) => state.fileDiff
  }),
  created () {
    if (this.isFileLoaded) this.createDiff()
  },
  methods: {
    ...mapActions([
      'createDiff'
    ])
  }
}
</script>
