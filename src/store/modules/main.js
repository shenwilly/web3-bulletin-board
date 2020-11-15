import Box, { isLoggedIn } from '3box'

const initialState = {
    web3Enabled: true,
    threadAddress: '/orbitdb/zdpuB2ZwozqZkfSCKCgqY1mDC3CQ4B85rgbAe7NteWBWCMcoJ/3box.thread.myThread.myThread',
    spaceName: 'myThread',
    posts: [],
    accounts: [],
    isLoading: false,
    loadingLabel: "",
    isModerator: true,
    thread: null,
  };
  
  export const state = { ...initialState };
  
  export const actions = {
      async setLoading(context, value) {
        context.commit('setLoading', value);
      },

      async fetchPosts(context) {
        let posts;
        if (state.thread != null) {
          posts = await state.thread.getPosts()
        } else {
          posts = await Box.getThreadByAddress(state.threadAddress)
        }
        context.commit('fetchPosts', posts);
      },
      
      async connect(context) {
        context.commit('setLoadingLabel', "Connecting (1/3)");
        const box = await Box.create(window.ethereum)

        if (typeof window.ethereum == "undefined") {
          this.web3Enabled = false
          context.commit('enableWeb3', false);
        } else {
          window.ethereum.autoRefreshOnNetworkChange = false;
          context.commit('enableWeb3', true);
          const accounts = await window.ethereum.enable();
          context.commit('setAccounts', accounts);
        }

        if (state.accounts.length > 0) {
          context.commit('setLoadingLabel', "Authenticating (2/3)");
          
          await box.auth(['myThread'], {address: state.accounts[0] })
          // const isLoggedInx = isLoggedIn(this.accounts[0])
          // this.profile = await Box.getProfile(this.accounts[0])
          // console.log(isLoggedInx, "profile",)

          context.commit('setLoadingLabel', "Syncing (3/3)");
          
          const space = await box.openSpace(state.spaceName)
          const thread = await space.joinThreadByAddress('/orbitdb/zdpuB2ZwozqZkfSCKCgqY1mDC3CQ4B85rgbAe7NteWBWCMcoJ/3box.thread.myThread.myThread')
          context.commit('setThread', thread);
        }
      }
  };
  
  export const mutations = {
    enableWeb3(state, isEnabled) {
        state.web3Enabled = isEnabled
    },
    setAccounts(state, accounts) {
        state.accounts = accounts
    },
    fetchPosts(state, posts) {
        state.posts = posts
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setLoadingLabel(state, label) {
      state.loadingLabel = label
    },
    setThread(state, thread) {
      state.thread = thread
    }
  };
  
  const getters = {
    posts(state) {
      return state.posts
    },
    loggedIn(state) {
      if (state.accounts.length == 0) return false
      return isLoggedIn(state.accounts[0])
    },
    isLoading(state) {
      return state.isLoading
    },
    loadingLabel(state) {
      return state.loadingLabel
    },
    isModerator(state) {
      return state.isModerator
    },
    accounts(state) {
      return state.accounts
    },
    thread(state) {
      return state.thread
    }
  };
  
  export default {
    state,
    actions,
    mutations,
    getters
  };
  