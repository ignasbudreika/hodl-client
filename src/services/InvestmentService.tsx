import api from '../auth/AuthService';

class InvestmentService {
  getInvestments() {
    return api.get('/investment');
  }

  getInvestmentsByBrokerId(brokerId: string) {
    return api.get('/investment?brokerId=' + brokerId);
  }

  getInvestmentsByICId(icId: string) {
    return api.get('/investment?investmentCategoryId=' + icId);
  }

  getInvestmentById(id: string) {
    return api.get('/investment/' + id);
  }

  createInvestment(brokerId: string, name: string, investedAmount: number, quantity: number, type: string, currentAmount: number, description: string) {
    return api.post('/investment', {'broker_id': brokerId, 'name': name, 'invested_amount': investedAmount, 'quantity': quantity, 'type': type, 'current_amount': currentAmount, 'description': description});
  }

  editInvestment(id: string, name: string, investedAmount: number, quantity: number, currentAmount: number, description: string) {
    return api.patch('/investment', {'id': id, 'name': name, 'invested_amount': investedAmount, 'quantity': quantity, 'current_amount': currentAmount, 'description': description});
  }

  deleteInvestment(id: string) {
    return api.delete('/investment/' + id);
  }
}

export default new InvestmentService();