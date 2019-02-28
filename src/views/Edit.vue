<template>
  <div id="hot-container">
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
      :after-change="afterChange"
      :after-create-row="afterCreateRow"
      :after-remove-row="afterRemoveRow"
      :context-menu="true"
      :allow-insert-column="false"
      :allow-remove-column="false"
      :fixed-rows-top="1"
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
  computed: mapState({
    fileData: (state) => state.file.data,
    isFileLoaded (state) {
      return !!this.fileData && isEqual(this.fileLocation, state.file.location)
    },
    fileLocation (state) {
      return pick(state.route.params, ['owner', 'repo', 'branch', 'path'])
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
      setFileData: 'SET_FILE_DATA'
    }),
    async fetch () {
      const loadingIndicator = this.$loading.open()
      try {
        await this.fetchAndParseFile(this.fileLocation)
      } catch (err) {
        this.$snackbar.open({
          type: 'is-danger',
          message: 'We encountered an error whilst loading the file'
        })
        console.log(err)
        this.$router.push('/')
      } finally {
        loadingIndicator.close()
      }
    },
    afterChange (changes, source) {
      if (source !== 'loadData') this.handleChange()
    },
    afterCreateRow (index, amount, source) {
      if (source !== 'loadData') this.handleChange()
    },
    afterRemoveRow (index, amount, physicalRows, source) {
      if (source !== 'loadData') this.handleChange()
    },
    handleChange () {
      const hotInstance = this.$refs.hot.hotInstance
      if (hotInstance) {
        const data = hotInstance.getSourceData()
        this.setFileData(data)
      }
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
