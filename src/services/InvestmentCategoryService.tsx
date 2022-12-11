import api from '../auth/AuthService';

class InvestmentCategoryService {
  getInvestmentCategories() {
    return api.get('/investment-category');
  }

  getInvestmentCategoryById(id: string) {
    return api.get('/investment-category/' + id);
  }

  createInvestmentCategory(name: string, description: string) {
    return api.post('/investment-category', {'name': name, 'description': description});
  }

  editInvestmentCategory(id: string, name: string, description: string) {
    return api.patch('/investment-category', {'id': id, 'name': name, 'description': description});
  }

  deleteInvestmentCategory(id: string) {
    return api.delete('/investment-category/' + id);
  }

  publishInvestmentCategory(id: string) {
    return api.post('/investment-category/' + id + '/publish')
  }

  unpublishInvestmentCategory(id: string) {
    return api.post('/investment-category/' + id + '/unpublish')
  }
}

export default new InvestmentCategoryService();