import { createStore } from "vuex";
import themeLayout from "./modules/themeLayout/actionCreator";
import crud from "./modules/crud/axios/actionCreator";
import auth from "./modules/authentication/axios/actionCreator";

export default createStore({
  state: {
    user: null,
    otp: "",
    loading: false,
    isError: false,
    errorMessage: null,
    errorDescription: null,
    isSubmitting: false,
    isGenerating: false,
    isPaying: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setOtp(state, otp) {
      state.otp = otp;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setIsSubmitting(state, isSubmitting) {
      state.isSubmitting = isSubmitting;
    },
    setIsGenerating(state, isGenerating) {
      state.isGenerating = isGenerating;
    },
    setIsPaying(state, isPaying) {
      state.isPaying = isPaying;
    },
    setIsError(state, isError) {
      state.isError = isError;
    },
    setErrorMessage(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
    setErrorDescription(state, errorDescription) {
      state.errorDescription = errorDescription;
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    setIsSubmitting({ commit }, isSubmitting) {
      commit("setIsSubmitting", isSubmitting);
    },
    setIsGenerating({ commit }, isGenerating) {
      commit("setIsGenerating", isGenerating);
    },
    setIsPaying({ commit }, isPaying) {
      commit("setIsPaying", isPaying);
    },
  },
  modules: {
    themeLayout,
    crud,
    auth,
  },
});
