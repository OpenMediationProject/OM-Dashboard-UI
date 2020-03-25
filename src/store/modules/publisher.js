const publisher = {
  state: {
    currentOrgId: localStorage.getItem('currentOrgId') || '',
    searchApp: localStorage.getItem('searchApp') || '',
    searchPlacement: localStorage.getItem('searchPlacement') || '',
    searchPlacementName: localStorage.getItem('searchPlacementName') || '',
    searchPlacementType: localStorage.getItem('searchPlacementType') || 0,
    updateList: ''
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
        localStorage.setItem('searchPlacement', params.id)
        localStorage.setItem('searchPlacementName', params.name)
        localStorage.setItem('searchPlacementType', params.adType)
      }
    },
    UPDATESELECTLIST: (state, val) => {
      state.updateList = val
    }
  }
}

export default publisher
