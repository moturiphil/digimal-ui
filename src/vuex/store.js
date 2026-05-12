import { createStore } from "vuex";
import themeLayout from "./modules/themeLayout/actionCreator";
import crud from "./modules/crud/axios/actionCreator";
import auth from "./modules/authentication/axios/actionCreator";
import filters from "./modules/filters/filter_values";
import procurement from "./modules/procurement";

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
    isDisabled: false,
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
    setIsDisabled(state, isDisabled) {
      state.isDisabled = isDisabled;
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
    setIsDisabled({ commit }, isDisabled) {
      commit("setIsDisabled", isDisabled);
    },
    setIsPaying({ commit }, isPaying) {
      commit("setIsPaying", isPaying);
    },
  },
  modules: {
    themeLayout,
    crud,
    auth,
    filters,
    procurement,
  },
});
