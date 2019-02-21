<template>
  <div id="hot-container">
    <BLoading :active="isLoading" />
    <div
      v-if="error"
      class="notification is-danger">
      {{ error }}
    </div>
    <HotTable
      v-if="fileData"
      ref="hot"
      class="is-family-secondary"
      :data="fileData"
      :col-headers="true"
      :row-headers="true"
      stretch-h="all"
      :manual-column-resize="true"
      :manual-row-resize="true"
      :after-change="onChange"
      col-widths="200px" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { HotTable } from '@handsontable/vue'
import pick from 'lodash/pick'
import isEqual from 'lodash/isEqual'

export default {
  components: {
    HotTable
  },
  data () {
    return {
      isLoading: false,
      error: null
    }
  },
  computed: mapState({
    fileData: (state) => state.file.data,
    isFileLoaded (state) {
      return !!this.fileData && isEqual(this.fileLocation, state.file.location)
    },
    fileLocation (state) {
      return pick(state.route.params, ['origin', 'repo', 'branch', 'path'])
    },
    fileName (state) {
      const path = state.file.location.path
      if (!path) return ''
      const parts = path.split('/')
      return parts[parts.length - 1]
    }
  }),
  watch: {
    fileLocation: 'fetch'
  },
  created () {
    if (!this.isFileLoaded) this.fetch()
  },
  methods: {
    ...mapActions([
      'fetchAndParseFile'
    ]),
    ...mapMutations({
      simulateFileDataUpdate: 'SIMULATE_FILE_DATA_UPDATE'
    }),
    async fetch () {
      this.isLoading = true
      this.error = null
      try {
        await this.fetchAndParseFile(this.fileLocation)
      } catch (err) {
        this.error = err.message
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    onChange () {
      // Handsontable mutates the `data` object passed to it,
      // so this isn't for traditional flux-style updates. Rather,
      // it's only necessary to persist the data to sessionStorage.
      this.simulateFileDataUpdate()
    }
  }
}
</script>

<style lang="sass">
@import "~handsontable/dist/handsontable.css"

#hot-container
  width: 100vw
  height: calc(100vh - 52px) // minus navbar height
  overflow: hidden

.notification.is-danger
  width: 80%
  margin: 3% auto
</style>
