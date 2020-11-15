<template>
    <b-card>
      <b-row v-if="viewStatus">
        <b-col class="text-left">
          <b>Pending Execution</b>
        </b-col>
        <b-col class="text-right">
          <b-button variant="info" v-on:click="handleView">View on Curate</b-button>
        </b-col>
      </b-row>
      <b-row class="text-left">
        <b-col cols="12">
          <b-row>
            <!-- <b-col cols="2"> -->
              <!-- <b-row>
                <b-col cols="12"> -->
                  <!-- <b-avatar 
                    class="mr-2"
                    :src="'https://avatars.dicebear.com/api/identicon/' + author + '.svg'" /> -->
                  <!-- <label class="text-author mb-0"><i>{{ author | shorten }}</i></label> -->
                <!-- </b-col> -->
                <!-- <b-col cols="12">
                  <label class="text-date mb-0">{{ timestamp | moment("from") }}</label>
                </b-col> -->
              <!-- </b-row> -->
            <!-- </b-col> -->
            <b-col cols="5">
              <div class="d-flex flex-row">
                <b-avatar 
                    class="mr-2"
                    :size="47"
                    :src="'https://avatars.dicebear.com/api/identicon/' + author + '.svg'" />
                  <div class="row">
                    <b-col cols="12">
                      <label class="text-author mb-0"><i>{{ author | shorten }}</i></label>
                    </b-col>
                    <b-col cols="12">
                      <label class="text-date mb-0">{{ timestamp | moment("from") }}</label>
                    </b-col>
                  </div>
              </div>
              <!-- <b-row>
                <b-col cols="12">
                  <label class="text-author mb-0"><i>{{ author | shorten }}</i></label>
                </b-col>
                <b-col cols="12">
                  <label class="text-date mb-0">{{ timestamp | moment("from") }}</label>
                </b-col>
              </b-row> -->
            </b-col>
            <b-col cols="7" class="text-right">
              <label class="text-id">id: {{ id }}</label>
              <b-icon v-if="canReport" icon="flag-fill" class="ml-2 report-icon clickable" v-on:click="handleReport"></b-icon>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12">
          <label class="text-content pt-3 mb-0">{{ message }}</label>
        </b-col>
      </b-row>
    </b-card>
</template>

<script>
import { shortenAddress } from '@/utils/address'

export default {
  props: {
    post: Object,
    canReport: {
      default: false,
    },
    viewStatus: {
      default: false,
    }
  },
  computed: {
      id() {
        return this.post.postId;
      },
      author() {
        return this.post.author;
      },
      message() {
        return this.post.message;
      },
      timestamp() {
        return this.post.timestamp;
      },
  },
  methods: {
    handleReport() {
      this.$emit('onClickReport', this.post.postId)
    },
    handleView() {
      this.$emit('onClickView', this.post.postId)
    }
  },
  filters: {
    shorten: function (value) {
      return shortenAddress(value)
    }
  }
}
</script>

<style scoped>
  .text-author {
    font-size: 0.9em;
    color: #666;
  }
  .text-date {
    font-size: 0.75em;
    color: #888;
  }
  .text-content {
    font-size: 1em;
    color: #000;
    white-space: pre-line
  }
  .report-icon {
    font-size: 1em;
    color: #666;
  }
  .clickable {
    cursor: pointer;
  }
  .text-id {
    font-size: 0.6em;
  }
</style>