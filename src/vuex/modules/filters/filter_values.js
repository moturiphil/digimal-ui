
const state = () => ({
    county_id: 17,
    sub_county_id: 60,
});

const actions = {
    async getCountyId({ commit }, id) {
        commit('setCountyId', id); // Pass the mutation type as a string
    },
    async getSubCountyId({ commit }, id) {
        commit('setSubCountyId', id); // Pass the mutation type as a string
    }
};
const mutations = {
    async setCountyId(state, id) {
        state.county_id = id;
    },
    async setSubCountyId(state, id) {
        state.sub_county_id = id;
    }
}
export default {
    namespaced: false,
    state,
    actions,
    mutations,
};