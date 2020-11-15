import Box, { isLoggedIn } from '3box'
import GTCRService from '@/services/gtcr'

const initialState = {
    web3Enabled: true,
    threadAddress: '/orbitdb/zdpuB2ZwozqZkfSCKCgqY1mDC3CQ4B85rgbAe7NteWBWCMcoJ/3box.thread.myThread.myThread',
    spaceName: 'myThread',
    posts: [],
    accounts: [],
    isLoading: false,
    loadingLabel: "",
    profile: null,
    user: null,
    isModerator: false,
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
        console.log(posts[0])
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
          
          await box.auth(['myThread'], { address: state.accounts[0] })
          // console.log(box.DID)
          
          // const isLoggedInx = isLoggedIn(this.accounts[0])

          // const profile = await Box.getProfile(state.accounts[0])
          // context.commit('setProfile', profile);
          // console.log(isLoggedInx, "profile",)

          context.commit('setLoadingLabel', "Syncing (3/3)");
          
          const space = await box.openSpace(state.spaceName)
          context.commit('setUser', space.user);

          const thread = await space.joinThreadByAddress('/orbitdb/zdpuB2ZwozqZkfSCKCgqY1mDC3CQ4B85rgbAe7NteWBWCMcoJ/3box.thread.myThread.myThread')
          context.commit('setThread', thread);
          
          const moderatorAddresses = await GTCRService.fetchModerators()
          if (moderatorAddresses.find(address => address.toLowerCase() == state.accounts[0].toLowerCase()) != null) {
            context.commit('setModerator', true)
          }
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
    },
    setProfile(state, profile) {
      state.profile = profile
    },
    setUser(state, user) {
      state.user = user
    },
    setModerator(state, isModerator) {
      state.isModerator = isModerator
    }
  };
  
  const getters = {
    posts(state) {
      return state.posts
    },
    loggedIn(state) {
      if (state.user == null) return false
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
    profile(state) {
      return state.profile
    },
    user(state) {
      return state.user
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
  