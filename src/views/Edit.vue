<template>
  <div id="hot-container">
    <Loading :active="isLoading" />
    <div
      v-if="error"
      class="notification is-danger">
      {{ error }}
    </div>
    <HotTable
      v-if="fileData"
      ref="hot"
      :data="fileData"
      :col-headers="true"
      :row-headers="true"
      stretch-h="all"
      :manual-column-resize="true"
      :manual-row-resize="true"
      col-widths="200px" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { HotTable } from '@handsontable/vue'
import { Loading } from 'buefy/dist/components/loading'
import pick from 'lodash/pick'
import isEqual from 'lodash/isEqual'

export default {
  components: {
    HotTable,
    Loading
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
  data () {
    return {
      isLoading: false,
      error: null
    }
  },
  computed: {
    ...mapState({
      fileData: (state) => state.file.data,
      isFileLoaded (state) {
        return !!this.fileData && isEqual(this.fileLocation, state.file.location)
      }
    }),
    fileLocation () {
      return pick(this, ['origin', 'repo', 'branch', 'path'])
    }
  },
  watch: {
    origin: 'fetch',
    repo: 'fetch',
    ref: 'fetch',
    path: 'fetch'
  },
  created () {
    if (!this.isFileLoaded) this.fetch()
  },
  methods: {
    ...mapActions([
      'getFileData'
    ]),
    async fetch () {
      this.isLoading = true
      this.error = null
      try {
        await this.getFileData(this.fileLocation)
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
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

.notification.is-danger
  width: 80%
  margin: 3% auto
</style>
