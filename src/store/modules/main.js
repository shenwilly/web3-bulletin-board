import Box from '3box'
import GTCRService from '@/services/gtcr'
import { IPFS_GATEWAY } from '@/env'

const initialState = {
    web3Enabled: true,
    // threadAddress: '/orbitdb/zdpuB2ZwozqZkfSCKCgqY1mDC3CQ4B85rgbAe7NteWBWCMcoJ/3box.thread.myThread.myThread',
    // spaceName: 'myThread',
    threadAddress: "/orbitdb/zdpuArtx5WfJ5TxqS5zZ2Lr6RDC6n1r3uXwkj7c8Q1s7vj7cn/3box.thread.Web3BB.firstBB",
    spaceName: 'Web3BB',
    posts: [],
    markedPostIds: [],
    blockedPostIds: [],
    accounts: [],
    isLoading: false,
    loadingLabel: "",
    profile: null,
    user: null,
    isModerator: false,
    thread: null,

    metaEvidence: null,
    submissionBaseDeposit: null,
    challengePeriodDuration: null,
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

        await this.dispatch("fetchBlockedPostIds")

        context.commit('setPosts', posts);
      },
      
      async fetchBlockedPostIds(context) {
        // console.log("fetch blockedPosts")
        let blockedPostIds = await GTCRService.fetchBlockedPosts();
        
        // console.log(blockedPostIds, "???")
        context.commit('setBlockedPostIds', blockedPostIds);
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
          
          await box.auth([state.spaceName], { address: state.accounts[0] })
          // console.log(box.DID)
          
          // const isLoggedInx = isLoggedIn(this.accounts[0])

          // const profile = await Box.getProfile(state.accounts[0])
          // context.commit('setProfile', profile);
          // console.log(isLoggedInx, "profile",)

          context.commit('setLoadingLabel', "Syncing (3/3)");
          
          const space = await box.openSpace(state.spaceName)
          context.commit('setUser', space.user);

          // OPEN NEW THREAD
          // const thread = await space.joinThread("firstBB")
          // console.log(thread, "<<<")

          const thread = await space.joinThreadByAddress(state.threadAddress)
          context.commit('setThread', thread);
          
          const moderatorAddresses = await GTCRService.fetchModerators()
          if (moderatorAddresses.find(address => address.toLowerCase() == state.accounts[0].toLowerCase()) != null) {
            context.commit('setModerator', true)
          }
        }
      },

      async fetchMetaEvidence(context) {
        const metaEvidence = await GTCRService.fetchPostMetaEvidence()
        // console.log(metaEvidence)
        context.commit('setMetaEvidence', metaEvidence)
      },

      async fetchTcrConfig(context) {
        // const submissionBaseDeposit = await GTCRService.fetchSubmissionBaseDeposit()
        // context.commit('setSubmissionBaseDeposit', submissionBaseDeposit)

        const challengePeriodDuration = await GTCRService.fetchChallengePeriodDuration()
        context.commit('setChallengePeriodDuration', challengePeriodDuration)
      },

      async markPostId(context, postId) {
        context.commit('markPostId', postId)
      }
  };
  
  export const mutations = {
    enableWeb3(state, isEnabled) {
        state.web3Enabled = isEnabled
    },
    setAccounts(state, accounts) {
        state.accounts = accounts
    },
    setPosts(state, posts) {
        state.posts = posts
    },
    setBlockedPostIds(state, postIds) {
        state.blockedPostIds = postIds
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
    },
    setMetaEvidence(state, metaEvidence) {
      state.metaEvidence = metaEvidence
    },
    setSubmissionBaseDeposit(state, submissionBaseDeposit) {
      state.submissionBaseDeposit = submissionBaseDeposit
    },
    setChallengePeriodDuration(state, challengePeriodDuration) {
      state.challengePeriodDuration = challengePeriodDuration
    },
    markPostId(state, postId) {
      state.markedPostIds.push(postId)
    }
  };
  
  const getters = {
    posts(state) {
      return state.posts
    },
    filteredPosts(state) {
      return state.posts.filter(post => {
        return !state.blockedPostIds.includes(post.postId) && !state.markedPostIds.includes(post.postId)
      });
    },
    markedPosts(state) {
      return state.posts.filter(post => {
        return state.markedPostIds.includes(post.postId)
      });
    },
    loggedIn(state) {
      // console.log(state.user, state.accounts, "???", isLoggedIn(state.accounts[0]))
      if (state.user == null) return false
      return true
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
    },
    policyUrl(state) {
      if (state.metaEvidence == null) return ""
      return IPFS_GATEWAY + state.metaEvidence[0].fileURI;
    }
  };
  
  export default {
    state,
    actions,
    mutations,
    getters
  };
  