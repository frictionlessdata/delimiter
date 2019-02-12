<template>
  <div id="hot-container">
    <HotTable
      ref="hot"
      :data="fileContents"
      :col-headers="true"
      :row-headers="true"
      stretch-h="all"
      :manual-column-resize="true"
      :manual-row-resize="true"
      col-widths="200px"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { HotTable } from '@handsontable/vue'

export default {
  components: {
    HotTable
  },
  props: {
    origin: {
      type: String,
      required: true
    },
    repo: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  computed: mapState({
    fileContents: (state) => state.fileContents
  }),
  watch: {
    origin: 'fetch',
    repo: 'fetch',
    ref: 'fetch',
    path: 'fetch'
  },
  created () {
    this.fetch()
  },
  methods: {
    ...mapActions([
      'getFileContents'
    ]),
    async fetch () {
      await this.getFileContents({
        origin: this.origin,
        repo: this.repo,
        branch: this.branch,
        path: this.path
      })
    }
  }
}
</script>

<style lang="sass">
@import "~handsontable/dist/handsontable.css"

#hot-container
  width: 100vw
  height: 100vh
  overflow: hidden
</style>
