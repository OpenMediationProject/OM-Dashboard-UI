const publisher = {
  state: {
    currentOrgId: localStorage.getItem('currentOrgId') || '',
    searchApp: localStorage.getItem('searchApp') || '',
    searchPlacement: localStorage.getItem('searchPlacement') || '',
    searchPlacementName: localStorage.getItem('searchPlacementName') || '',
    searchPlacementType: localStorage.getItem('searchPlacementType') || 0,
    searchPlacementAbt: localStorage.getItem('searchPlacementAbt') || 0,
    updateList: '',
    useUnity: false
  },

  mutations: {
    SET_ORG: (state, orgId) => {
      state.currentOrgId = orgId
      localStorage.setItem('currentOrgId', orgId)
    },
    SET_APP: (state, appId) => {
      state.searchApp = appId
      localStorage.setItem('searchApp', appId)
    },
    SET_PLACEMENT: (state, params) => {
      if (params) {
        state.searchPlacement = params.id
        state.searchPlacementName = params.name
        state.searchPlacementType = params.adType
        state.searchPlacementAbt = params.abTestModel
        localStorage.setItem('searchPlacement', params.id)
        localStorage.setItem('searchPlacementName', params.name)
        localStorage.setItem('searchPlacementType', params.adType)
        localStorage.setItem('searchPlacementAbt', params.abTestModel)
      } else {
        state.searchPlacement = undefined
        state.searchPlacementName = undefined
        state.searchPlacementType = undefined
        state.searchPlacementAbt = undefined
      }
    },
    UPDATESELECTLIST: (state, val) => {
      state.updateList = val
    },
    SET_USEUNITY: (state, val) => {
      state.useUnity = val
    }
  }
}

export default publisher
