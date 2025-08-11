import axios from 'axios';

class ApiService {
  api;
  baseURL;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: false, // Disable credentials to avoid CORS preflight issues
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('inventree_token');
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

  }

  // Generic GET request
  async get(endpoint, params) {
    try {
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic POST request
  async post(endpoint, data) {
    try {
      const response = await this.api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic PUT request
  async put(endpoint, data) {
    try {
      console.log('PUT Request:', endpoint, 'Data:', JSON.stringify(data, null, 2));
      const response = await this.api.put(endpoint, data);
      console.log('PUT Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('PUT Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  }

  // Generic PATCH request
  async patch(endpoint, data) {
    try {
      const response = await this.api.patch(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete(endpoint) {
    try {
      const response = await this.api.delete(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Authentication - Mock implementation for demo
  async login(username, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock authentication - accept demo/demo or any username/password
    if ((username === 'demo' && password === 'demo') || username.length > 0) {
      const mockToken = 'mock_jwt_token_' + Date.now();
      const mockUser = {
        id: 1,
        username: username,
        email: `${username}@inventree.demo`,
        first_name: username.charAt(0).toUpperCase() + username.slice(1),
        last_name: 'User',
        is_staff: true,
        is_active: true,
      };

      localStorage.setItem('inventree_token', mockToken);

      return {
        token: mockToken,
        user: mockUser,
      };
    } else {
      throw {
        detail: 'Invalid credentials. Use demo/demo or any username/password.',
      };
    }
  }

  async logout() {
    // Mock logout - just remove token
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.removeItem('inventree_token');
  }

  async getCurrentUser() {
    // Mock current user - return user based on stored token
    const token = localStorage.getItem('inventree_token');
    if (!token) {
      throw { detail: 'No authentication token found' };
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      id: 1,
      username: 'demo',
      email: 'demo@inventree.demo',
      first_name: 'Demo',
      last_name: 'User',
      is_staff: true,
      is_active: true,
    };
  }

 

  // Stock API
  async getStockItems(params) {
    return this.get('/stock/', params);
  }

  async getStockItem(id) {
    return this.get(`/stock/${id}/`);
  }

  async createStockItem(data) {
    return this.post('/stock/', data);
  }

  async updateStockItem(id, data) {
    return this.patch(`/stock/${id}/`, data);
  }

  async deleteStockItem(id) {
    return this.delete(`/stock/${id}/`);
  }

  // Locations API
  async getLocations(params) {
    return this.get('/Locations', params);
  }

  async getLocation(id) {
    return this.get(`/Locations/${id}`);
  }

  async createLocation(data) {
    return this.post('/Locations', data);
  }

  async updateLocation(id, data) {
    return this.put(`/Locations/${id}`, data);
  }

  async deleteLocation(id) {
    return this.delete(`/Locations/${id}`);
  }

  // Companies API (legacy - keeping for compatibility)
  async getCompaniesLegacy(params) {
    return this.get('/company/', params);
  }

  

  

  // Scrap API
async getScrapItems(params = {}) {
  return this.get('/Scraps', params); // Assuming your endpoint is /Scraps (not lowercase)
}

async getScrapItem(id) {
  return this.get(`/Scraps/${id}`);
}

async createScrapItem(data) {
  return this.post('/Scraps', data);
}

async updateScrapItem(id, data) {
  return this.put(`/Scraps/${id}`, {
    id: id,
    date: data.date,
    sheet: data.sheet,
    scrapItem: data.scrapItem,
    gsm: Number(data.gsm) || 0,
    size: data.size,
    weight: Number(data.weight) || 0,
    qty: Number(data.qty) || 0,
    unit: data.unit,
    reason: data.reason,
    remark: data.remark,
  });
}

async deleteScrapItem(id) {
  return this.delete(`/Scraps/${id}`);
}

async getScrapReports(params = {}) {
  return this.get('/Scraps/reports', params);
}
  // Units API
  async getUnits(params) {
    return this.get('/Units', params);
  }

  async getUnit(id) {
    return this.get(`/Units/${id}`);
  }

  async createUnit(data) {
    return this.post('/Units', data);
  }

  async updateUnit(id, data) {
    return this.put(`/Units/${id}`, data);
  }

  async deleteUnit(id) {
    return this.delete(`/Units/${id}`);
  }

  // Product API
  async getProducts(params) {
    return this.get('/Product', params);
  }

  async getProduct(id) {
    return this.get(`/Product/${id}`);
  }

  async createProduct(data) {
    return this.post('/Product', data);
  }

  async updateProduct(id, data) {
    return this.put(`/Product/${id}`, data);
  }

  async deleteProduct(id) {
    return this.delete(`/Product/${id}`);
  }

  // Company API
  async getCompanies(params) {
    return this.get('/Companies', params);
  }

  async getCompany(id) {
    return this.get(`/Companies/${id}`);
  }

  async createCompany(data) {
    return this.post('/Companies', data);
  }

  async updateCompany(id, data) {
    // Include the ID in the request body as some APIs expect it
    const requestData = {
      ...data,
      companyId: id
    };
    return this.put(`/Companies/${id}`, requestData);
  }

  async deleteCompany(id) {
    return this.delete(`/Companies/${id}`);
  }
  // Consumptions API
  async getConsumptions(params) {
    return this.get('/Consumptions', params);
  }

  async getConsumption(id) {
    return this.get(`/Consumptions/${id}`);
  }

  async createConsumption(data) {
    return this.post('/Consumptions', data);
  }

  async updateConsumption(id, data) {
    // Add more detailed logging to see what's being sent
    const requestData = {
      id: id,  // Include ID in the expected format
      consumptionDate: data.consumptionDate,
      sheet: data.sheet,
      consumptionItem: data.consumptionItem,
      qty: Number(data.qty),  // Ensure qty is a number
      unit: data.unit,
      remark: data.remark
    };
    console.log('Consumption Update Request Data:', requestData);
    return this.put(`/Consumptions/${id}`, requestData);
  }

  async deleteConsumption(id) {
    return this.delete(`/Consumptions/${id}`);
  }

  // Purchases API
  async getPurchases(params) {
    return this.get('/Purchase', params);
  }

  async getPurchase(id) {
    return this.get(`/Purchase/${id}`);
  }

  async createPurchase(data) {
    return this.post('/Purchase', data);
  }

  async updatePurchase(id, data) {
    const requestData = {
      id: id,
      date: data.date,
      sheet: data.sheet,
      purchaseItem: data.purchaseItem,
      gsm: Number(data.gsm) || 0,
      size: data.size,
      totalWeight: Number(data.totalWeight) || 0,
      qty: Number(data.qty) || 0,
      unit: data.unit,
      remark: data.remark,
      supplier: data.supplier,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate,
      receivedBy: data.receivedBy,
      status: data.status,
      purchasePrice: Number(data.purchasePrice) || 0,
      totalAmount: Number(data.totalAmount) || 0,
      warehouse: data.warehouse,
      expectedDeliveryDate: data.expectedDeliveryDate,
      createdBy: data.createdBy,
      creationDate: data.creationDate
    };
    return this.put(`/Purchase/${id}`, requestData);
  }

  async deletePurchase(id) {
    return this.delete(`/Purchase/${id}`);
  }

  // Sales API
  async getSales(params) {
    return this.get('/Sales', params);
  }

  async getSale(id) {
    return this.get(`/Sales/${id}`);
  }

  async createSale(data) {
    const requestData = {
      date: data.date,
      sheet: data.sheet,
      salesItem: data.salesItem,
      gsm: Number(data.gsm) || 0,
      size: data.size,
      totalWeight: Number(data.totalWeight) || 0,
      qty: Number(data.qty) || 0,
      unit: data.unit,
      remark: data.remark,
      status: data.status,
      customer: data.customer,
      supplier: data.supplier,
      orderStatus: data.orderStatus,
      startDate: data.startDate,
      targetDate: data.targetDate,
      responsible: data.responsible,
      totalPrice: Number(data.totalPrice) || 0,
      createdBy: data.createdBy || data.responsible // Fallback to responsible if createdBy not provided
    };
    return this.post('/Sales', requestData);
  }

  async updateSale(id, data) {
    const requestData = {
      id: id,
      date: data.date,
      sheet: data.sheet,
      salesItem: data.salesItem,
      gsm: Number(data.gsm) || 0,
      size: data.size,
      totalWeight: Number(data.totalWeight) || 0,
      qty: Number(data.qty) || 0,
      unit: data.unit,
      remark: data.remark,
      status: data.status,
      customer: data.customer,
      supplier: data.supplier,
      orderStatus: data.orderStatus,
      startDate: data.startDate,
      targetDate: data.targetDate,
      responsible: data.responsible,
      totalPrice: Number(data.totalPrice) || 0,
      createdBy: data.createdBy || data.responsible // Fallback to responsible if createdBy not provided
    };
    return this.put(`/Sales/${id}`, requestData);
  }

  async deleteSale(id) {
    return this.delete(`/Sales/${id}`);
  }

  // Suppliers API
  async getSuppliers(params) {
    return this.get('/Suppliers', params);
  }

  async getSupplier(id) {
    return this.get(`/Suppliers/${id}`);
  }

  async createSupplier(data) {
    return this.post('/Suppliers', data);
  }

  async updateSupplier(id, data) {
    return this.put(`/Suppliers/${id}`, data);
  }

  async deleteSupplier(id) {
    return this.delete(`/Suppliers/${id}`);
  }

  // Warehouses API (using Locations endpoint)
  async getWarehouses(params) {
    return this.get('/Locations', params);
  }

  async getWarehouse(id) {
    return this.get(`/Locations/${id}`);
  }

  async createWarehouse(data) {
    return this.post('/Locations', data);
  }

  async updateWarehouse(id, data) {
    return this.put(`/Locations/${id}`, data);
  }

  async deleteWarehouse(id) {
    return this.delete(`/Locations/${id}`);
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        detail: error.response.data?.detail || 'An error occurred',
        ...error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        detail: 'Network error - please check your connection',
      };
    } else {
      // Something else happened
      return {
        detail: error.message || 'An unexpected error occurred',
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;