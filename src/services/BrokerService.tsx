import api from '../auth/AuthService';

class BrokerService {
  getBrokers() {
    return api.get('/broker');
  }

  getBrokersByICId(icId: string) {
    return api.get('/broker?investmentCategoryId=' + icId)
  }

  getBrokerById(id: string) {
    return api.get('/broker/' + id);
  }

  createBroker(icId:string, name: string, url: string, description: string) {
    return api.post('/broker', {'investment_category_id': icId, 'name': name, 'url': url, 'description': description});
  }

  editBroker(id: string, name: string, url: string, description: string) {
    return api.patch('/broker', {'id': id, 'name': name, 'url': url, 'description': description});
  }

  deleteBroker(id: string) {
    return api.delete('/broker/' + id);
  }
}

export default new BrokerService();