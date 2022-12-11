import api from '../auth/AuthService';

class AdminService {
    getPublishedInvestmentCategories() {
        return api.get('/admin/published');
    }

    unpublishInvestmentCategory(id: string) {
        return api.post('/admin/published/' + id + '/unpublish');
    }

    declineInvestmentCategory(id: string) {
        return api.post('/admin/published/' + id + '/decline');
    }

    approveInvestmentCategory(id: string) {
        return api.post('/admin/published/' + id + '/approve');
    }
}

export default new AdminService();