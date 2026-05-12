import { notification } from 'ant-design-vue';
import vendorService from '@/services/procurement/vendor.service';
import bankAccountService from '@/services/procurement/vendor-bank-account.service';
import lsoService from '@/services/procurement/vendor-lso.service';
import lookupsService from '@/services/procurement/procurement-lookups.service';

const errMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || err?.message || fallback;

const unwrap = (response) => {
  // Backend usually returns { success, data } — surface `data`.
  // Pagination responses look like { success, data: { data: [...], meta, links } }.
  const payload = response?.data;
  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }
  return payload;
};

const state = () => ({
  vendors: [],
  pagination: { page: 1, perPage: 15, total: 0 },
  filters: {
    search: '',
    category: null,
    county_id: null,
    sub_county_id: null,
    is_active: null,
  },
  currentVendor: null,
  bankAccounts: [],
  lsos: [],
  banks: [],
  serviceTypes: [],
  counties: [],
  subcountiesByCounty: {}, // keyed by county_id
  loading: false,
  saving: false,
  error: null,
});

const mutations = {
  setLoading(state, v) { state.loading = v; },
  setSaving(state, v) { state.saving = v; },
  setError(state, v) { state.error = v; },

  setVendors(state, payload) {
    // Accepts either the paginator { data, meta } or a plain array.
    if (Array.isArray(payload)) {
      state.vendors = payload;
      state.pagination = { page: 1, perPage: payload.length, total: payload.length };
    } else if (payload && Array.isArray(payload.data)) {
      state.vendors = payload.data;
      state.pagination = {
        page: payload.current_page || payload.meta?.current_page || 1,
        perPage: payload.per_page || payload.meta?.per_page || 15,
        total: payload.total || payload.meta?.total || payload.data.length,
      };
    } else {
      state.vendors = [];
    }
  },

  setFilters(state, filters) {
    state.filters = { ...state.filters, ...filters };
  },
  resetFilters(state) {
    state.filters = {
      search: '',
      category: null,
      county_id: null,
      sub_county_id: null,
      is_active: null,
    };
  },

  setCurrentVendor(state, vendor) { state.currentVendor = vendor; },
  patchCurrentVendor(state, patch) {
    if (state.currentVendor) {
      state.currentVendor = { ...state.currentVendor, ...patch };
    }
  },

  setBankAccounts(state, list) { state.bankAccounts = Array.isArray(list) ? list : []; },
  upsertBankAccount(state, account) {
    const idx = state.bankAccounts.findIndex((a) => a.id === account.id);
    if (idx === -1) state.bankAccounts.push(account);
    else state.bankAccounts.splice(idx, 1, account);
  },
  removeBankAccount(state, id) {
    state.bankAccounts = state.bankAccounts.filter((a) => a.id !== id);
  },
  markBankAccountPrimary(state, id) {
    state.bankAccounts = state.bankAccounts.map((a) => ({
      ...a,
      is_primary: a.id === id,
    }));
  },

  setLsos(state, list) { state.lsos = Array.isArray(list) ? list : []; },
  upsertLso(state, lso) {
    const idx = state.lsos.findIndex((l) => l.id === lso.id);
    if (idx === -1) state.lsos.push(lso);
    else state.lsos.splice(idx, 1, lso);
  },
  removeLso(state, id) {
    state.lsos = state.lsos.filter((l) => l.id !== id);
  },

  setBanks(state, list) { state.banks = Array.isArray(list) ? list : []; },
  setServiceTypes(state, list) { state.serviceTypes = Array.isArray(list) ? list : []; },
  setCounties(state, list) { state.counties = Array.isArray(list) ? list : []; },
  setSubcountiesForCounty(state, { countyId, list }) {
    state.subcountiesByCounty = {
      ...state.subcountiesByCounty,
      [countyId || '_all']: Array.isArray(list) ? list : [],
    };
  },

  removeVendor(state, id) {
    state.vendors = state.vendors.filter((v) => v.id !== id);
  },
  upsertVendor(state, vendor) {
    const idx = state.vendors.findIndex((v) => v.id === vendor.id);
    if (idx === -1) state.vendors.unshift(vendor);
    else state.vendors.splice(idx, 1, vendor);
  },
};

const actions = {
  // ── Vendors ────────────────────────────────────────────────────────────
  async fetchVendors({ commit, state }, overrides = {}) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      // Strip UI-only keys (camelCase `perPage`/`page`) before merging so they
      // are not forwarded as query params alongside the snake_case versions.
      const restOverrides = { ...overrides };
      delete restOverrides.perPage;
      delete restOverrides.page;
      const params = {
        page: overrides.page || state.pagination.page,
        per_page: overrides.perPage || state.pagination.perPage,
        ...state.filters,
        ...restOverrides,
      };
      // strip null/empty
      Object.keys(params).forEach((k) => {
        if (params[k] === null || params[k] === '' || params[k] === undefined) {
          delete params[k];
        }
      });
      const response = await vendorService.list(params);
      commit('setVendors', unwrap(response));
    } catch (err) {
      commit('setError', errMessage(err, 'Unable to load vendors'));
      notification.error({ message: 'Unable to load vendors', description: errMessage(err) });
    } finally {
      commit('setLoading', false);
    }
  },

  async fetchVendor({ commit }, id) {
    commit('setLoading', true);
    try {
      const response = await vendorService.show(id);
      const vendor = unwrap(response);
      commit('setCurrentVendor', vendor);
      commit('setBankAccounts', vendor?.bank_accounts || vendor?.active_bank_accounts || []);
      commit('setLsos', vendor?.lsos || vendor?.active_lsos || []);
      return vendor;
    } catch (err) {
      notification.error({ message: 'Unable to load vendor', description: errMessage(err) });
      throw err;
    } finally {
      commit('setLoading', false);
    }
  },

  async createVendor({ commit }, payload) {
    commit('setSaving', true);
    try {
      const response = await vendorService.create(payload);
      const vendor = unwrap(response);
      commit('upsertVendor', vendor);
      notification.success({ message: 'Vendor created' });
      return vendor;
    } finally {
      commit('setSaving', false);
    }
  },

  async updateVendor({ commit }, { id, payload, withFile = false }) {
    commit('setSaving', true);
    try {
      const response = withFile
        ? await vendorService.updateWithFile(id, payload)
        : await vendorService.update(id, payload);
      const vendor = unwrap(response);
      commit('upsertVendor', vendor);
      commit('patchCurrentVendor', vendor);
      notification.success({ message: 'Vendor updated' });
      return vendor;
    } finally {
      commit('setSaving', false);
    }
  },

  async deleteVendor({ commit }, id) {
    try {
      await vendorService.destroy(id);
      commit('removeVendor', id);
      notification.success({ message: 'Vendor deleted' });
    } catch (err) {
      notification.error({ message: 'Unable to delete vendor', description: errMessage(err) });
      throw err;
    }
  },

  async toggleVendorStatus({ commit }, id) {
    try {
      const response = await vendorService.toggleStatus(id);
      const vendor = unwrap(response);
      commit('upsertVendor', vendor);
      commit('patchCurrentVendor', vendor);
      notification.success({ message: `Vendor ${vendor?.is_active ? 'activated' : 'deactivated'}` });
      return vendor;
    } catch (err) {
      notification.error({ message: 'Unable to toggle status', description: errMessage(err) });
      throw err;
    }
  },

  // ── Bank Accounts ──────────────────────────────────────────────────────
  async fetchBankAccounts({ commit }, vendorId) {
    try {
      const response = await bankAccountService.list(vendorId);
      commit('setBankAccounts', unwrap(response));
    } catch (err) {
      notification.error({ message: 'Unable to load bank accounts', description: errMessage(err) });
    }
  },

  async createBankAccount({ commit }, { vendorId, payload }) {
    try {
      const response = await bankAccountService.create(vendorId, payload);
      commit('upsertBankAccount', unwrap(response));
      notification.success({ message: 'Bank account added' });
    } catch (err) {
      notification.error({ message: 'Unable to add bank account', description: errMessage(err) });
      throw err;
    }
  },

  async updateBankAccount({ commit }, { vendorId, id, payload }) {
    try {
      const response = await bankAccountService.update(vendorId, id, payload);
      commit('upsertBankAccount', unwrap(response));
      notification.success({ message: 'Bank account updated' });
    } catch (err) {
      notification.error({ message: 'Unable to update bank account', description: errMessage(err) });
      throw err;
    }
  },

  async deleteBankAccount({ commit }, { vendorId, id }) {
    try {
      await bankAccountService.destroy(vendorId, id);
      commit('removeBankAccount', id);
      notification.success({ message: 'Bank account removed' });
    } catch (err) {
      notification.error({ message: 'Unable to remove bank account', description: errMessage(err) });
      throw err;
    }
  },

  async setPrimaryBankAccount({ commit }, { vendorId, id }) {
    try {
      await bankAccountService.setPrimary(vendorId, id);
      commit('markBankAccountPrimary', id);
      notification.success({ message: 'Primary bank account set' });
    } catch (err) {
      notification.error({ message: 'Unable to set primary', description: errMessage(err) });
      throw err;
    }
  },

  // ── LSOs ───────────────────────────────────────────────────────────────
  async fetchLsos({ commit }, { vendorId, params = {} }) {
    try {
      const response = await lsoService.list(vendorId, params);
      commit('setLsos', unwrap(response));
    } catch (err) {
      notification.error({ message: 'Unable to load LSOs', description: errMessage(err) });
    }
  },

  async createLso({ commit }, { vendorId, payload }) {
    try {
      const response = await lsoService.create(vendorId, payload);
      commit('upsertLso', unwrap(response));
      notification.success({ message: 'LSO uploaded' });
    } catch (err) {
      notification.error({ message: 'Unable to upload LSO', description: errMessage(err) });
      throw err;
    }
  },

  async updateLso({ commit }, { vendorId, id, payload }) {
    try {
      const response = await lsoService.update(vendorId, id, payload);
      commit('upsertLso', unwrap(response));
      notification.success({ message: 'LSO updated' });
    } catch (err) {
      notification.error({ message: 'Unable to update LSO', description: errMessage(err) });
      throw err;
    }
  },

  async deleteLso({ commit }, { vendorId, id }) {
    try {
      await lsoService.destroy(vendorId, id);
      commit('removeLso', id);
      notification.success({ message: 'LSO removed' });
    } catch (err) {
      notification.error({ message: 'Unable to remove LSO', description: errMessage(err) });
      throw err;
    }
  },

  // ── Lookups (memoised) ────────────────────────────────────────────────
  async fetchBanks({ commit, state }, force = false) {
    if (!force && state.banks.length) return state.banks;
    try {
      const response = await lookupsService.banks();
      commit('setBanks', unwrap(response));
      return state.banks;
    } catch (err) {
      notification.error({ message: 'Unable to load banks', description: errMessage(err) });
      return [];
    }
  },

  async fetchServiceTypes({ commit, state }, force = false) {
    if (!force && state.serviceTypes.length) return state.serviceTypes;
    try {
      const response = await lookupsService.serviceTypes();
      commit('setServiceTypes', unwrap(response));
      return state.serviceTypes;
    } catch (err) {
      notification.error({ message: 'Unable to load service types', description: errMessage(err) });
      return [];
    }
  },

  async fetchCounties({ commit, state }, force = false) {
    if (!force && state.counties.length) return state.counties;
    try {
      const response = await lookupsService.counties();
      commit('setCounties', unwrap(response));
      return state.counties;
    } catch (err) {
      notification.error({ message: 'Unable to load counties', description: errMessage(err) });
      return [];
    }
  },

  async fetchSubcounties({ commit, state }, { countyId = null, force = false } = {}) {
    const cacheKey = countyId || '_all';
    if (!force && state.subcountiesByCounty[cacheKey]) return state.subcountiesByCounty[cacheKey];
    try {
      const response = await lookupsService.subcounties(countyId);
      const list = unwrap(response);
      commit('setSubcountiesForCounty', { countyId: cacheKey, list });
      return list;
    } catch (err) {
      notification.error({ message: 'Unable to load sub-counties', description: errMessage(err) });
      return [];
    }
  },
};

const getters = {
  primaryBankAccount: (state) =>
    state.bankAccounts.find((a) => a.is_primary) || null,
  activeLsos: (state) =>
    state.lsos.filter((l) => l.is_active !== false),
  subcountiesFor: (state) => (countyId) =>
    state.subcountiesByCounty[countyId || '_all'] || [],
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
