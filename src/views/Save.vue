<template>
  <section
    v-if="hasChanges"
    class="section">
    <form
      v-if="isLoggedIn"
      @submit.prevent="onSubmit">
      <div class="field">
        <label for="summary">
          Summarise your changes
        </label>
        <div class="control">
          <textarea
            id="summary"
            v-model="summary"
            class="textarea"
            required />
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
            type="submit"
            class="button is-link">
            Save
          </button>
        </div>
        <div class="control">
          <router-link
            :to="editLink"
            class="button is-text">
            Cancel
          </router-link>
        </div>
      </div>
    </form>

    <div
      v-else
      class="notification">
      Please
      <router-link to="/login">
        Login
      </router-link>
      to continue.
    </div>

    <DiffTable :diff="fileDiff.data" />
  </section>

  <section
    v-else
    class="section">
    <div class="notification">
      No changes detected.
      <router-link :to="editLink">
        Edit this file
      </router-link>
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
  data () {
    return {
      summary: ''
    }
  },
  computed: mapState({
    isFileLoaded (state) {
      return !!state.file.data && isEqual(this.routeFileLocation, state.file.location)
    },
    fileDiff: (state) => state.file.diff,
    hasChanges (state) {
      return state.file.diff && state.file.diff.data.length > 1
    },
    routeFileLocation (state) {
      return pick(state.route.params, ['owner', 'repo', 'branch', 'path'])
    },
    editLink (state) {
      const { owner, repo, branch, path } = state.file.location
      return `/edit/${owner}/${repo}/${branch}/${path}`
    },
    isLoggedIn (state) {
      return !!state.user.authToken
    }
  }),
  created () {
    if (this.isFileLoaded) this.createDiff()
    // TODO: else redirect to /edit/
  },
  methods: {
    ...mapActions([
      'createDiff',
      'saveFile'
    ]),
    async onSubmit (event) {
      const loadingIndicator = this.$loading.open()
      try {
        const editLink = this.editLink // cache this since it will be reset by action
        const result = await this.saveFile(this.summary)
        this.$snackbar.open({
          message: 'Saved',
          actionText: 'View',
          onAction () {
            window.location.href = result.data.commit.html_url
          }
        })
        this.$router.push(editLink)
      } catch (err) {
        this.$snackbar.open({
          type: 'is-danger',
          message: 'We encountered an error whilst saving'
        })
        console.error(err)
      } finally {
        loadingIndicator.close()
      }
    }
  }
}
</script>

<style lang="sass">
form
  margin-bottom: 15px
</style>
