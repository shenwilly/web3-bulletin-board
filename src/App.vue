<template>
  <div id="app">
    <b-overlay :show="isLoading" :absolute="false" no-center>
      <template #overlay>
        <div class="center-loading">
          <b-spinner variant="primary"></b-spinner>
          <br>
          <label class="mt-3">{{ loadingLabel }}</label>
        </div>
      </template>

      <b-navbar type="dark" style="background-color: rgb(77, 0, 180)">
        <b-navbar-brand :to="{ name: 'index' }" >Web3BB</b-navbar-brand>

        <b-navbar-nav v-if="isModerator && loggedIn">
          <b-nav-item :to="{ name: 'index' }" :class="currentRouteName == 'index' ? 'active' : ''">Home</b-nav-item>
          <b-nav-item :to="{ name: 'reports' }" :class="currentRouteName == 'reports' ? 'active' : ''">My Reports</b-nav-item>
          <b-nav-item href="https://kovan-gtcr.netlify.app/" target="_blank">Policy</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav v-else-if="!isModerator && loggedIn">
          <b-nav-item href="#" class="active" :class="currentRouteName == 'index' ? 'active' : ''">Home</b-nav-item>
          <b-nav-item href="#" class="" :class="currentRouteName == 'myPosts' ? 'active' : ''">My Posts</b-nav-item>
          <b-nav-item href="https://kovan-gtcr.netlify.app/" target="_blank">Policy</b-nav-item>
          <b-nav-item href="https://kovan-gtcr.netlify.app/" target="_blank">Apply as Moderator</b-nav-item>
        </b-navbar-nav>

        <b-button v-if="!loggedIn" variant="primary" class="ml-auto" type="button" v-on:click="connect">🦊 Connect</b-button>
        <div v-else class="ml-auto">
          <!-- <label v-if="isModerator" style="color: white" class="mb-0">{{ selectedAccount }} (Moderator)</label>
          <label v-else style="color: white" class="mb-0">{{ selectedAccount }}</label> -->
          <label v-if="isModerator" style="color: white" class="mb-0">{{ user.DID | shorten }} (Moderator)</label>
          <label v-else style="color: white" class="mb-0">{{ user.DID | shorten }}</label>
        </div>
      </b-navbar>

      <router-view class="view"></router-view>
    </b-overlay>
  </div>
</template>

<script>
// import Box from '3box'
// import { Resolver } from 'did-resolver'
// import { getResolver } from '3id-resolver'
import { shortenAddress } from '@/utils/address'

import GTCRService from '@/services/gtcr'

export default {
  computed: {
    isLoading() {
      return this.$store.getters.isLoading
    },
    loadingLabel() {
      return this.$store.getters.loadingLabel
    },
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    isModerator() {
      return this.$store.getters.isModerator
    },
    // selectedAccount() {
    //   return this.$store.getters.accounts[0];
    // },
    user() {
      return this.$store.getters.user;
    },
    currentRouteName() {
        return this.$route.name;
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    // this.init3Box()
    // Box.getIPFS()
    // this.resolve()
    GTCRService.getItems()
  },
  methods: {
    // async getAddressFromMetaMask() {
    //   if (typeof window.ethereum == "undefined") {
    //     this.web3Enabled = false
    //   } else {
    //     window.ethereum.autoRefreshOnNetworkChange = true;
    //     this.accounts = await window.ethereum.enable();
    //   }
    // },
    
    async connect() {
      this.$store.dispatch("setLoading", true);
      await this.$store.dispatch("connect");
      await this.$store.dispatch("fetchPosts");
      this.$store.dispatch("setLoading", false);
      // this.loadingLabel = "Connecting (1/3)"
      // this.isLoading = true
      // this.box = await Box.create(window.ethereum)
      // // await box.syncDone

      // await this.getAddressFromMetaMask()
      // if (this.accounts.length > 0) {
      //   this.loadingLabel = "Authenticating (2/3)"
      //   await this.box.auth(['myThread'], {address: this.accounts[0] })
      //   // const isLoggedInx = isLoggedIn(this.accounts[0])
      //   // this.profile = await Box.getProfile(this.accounts[0])
      //   // console.log(isLoggedInx, "profile",)

      //   this.loadingLabel = "Syncing (3/3)"
      //   const space = await this.box.openSpace('myThread')
      //   this.thread = await space.joinThreadByAddress('/orbitdb/zdpuB2ZwozqZkfSCKCgqY1mDC3CQ4B85rgbAe7NteWBWCMcoJ/3box.thread.myThread.myThread')
      //   this.posts = await this.thread.getPosts()
      // }
      // this.isLoading = false
    },

    // async resolve() {
    //   console.log('resolve')
    //   try {
    //     const ipfs = await Box.getIPFS();
    //     console.log('resolve1')
    //     this.resolver = new Resolver(getResolver(ipfs));
    //     console.log(ipfs)
    //     this.resolver.resolve('did:3:bafyreiafl6hkddmgztmy776huuy7l7423cpcte73o7kojilp7cfollzfze').then((doc) => console.log(doc))
    //   } catch(e) {
    //     console.log(e)
    //   }
    // },

    // async post() {
    //   this.inputErrorMessage = ""

    //   if (this.thread == null) {
    //     this.inputErrorMessage = "Please connect first."
    //     return
    //   }

    //   if (this.text.length == 0){
    //     this.inputErrorMessage = "Please input your message."
    //     return
    //   }

    //   console.log("posting")
    //   await this.thread.post(this.text)
    //   this.text = ""
    //   this.posts = await this.thread.getPosts()
    // },

    // async reportPost(postId) {
    //   console.log(postId)
    // }

  },
  filters: {
    shorten: function (value) {
      return shortenAddress(value)
    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style scoped>
  .center-loading{
    position: fixed;
    top: 50%;
    left: 45%;
    /* transform: translate(-50%, -50%); */
  }
</style>