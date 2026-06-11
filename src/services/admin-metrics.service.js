import axios from '@/Axiosconfig';

/**
 * Super-admin server metrics API.
 * Access is enforced by the authenticated session (token + role 53); no extra
 * password/OTP step is required to view the report.
 */
class AdminMetricsService {
  report({ hours = 24, top = 10 } = {}) {
    return axios.post('admin/metrics/report', { hours, top });
  }
}

export default new AdminMetricsService();
