import axios from 'axios';
import {CircuitBreaker, CircuitBreakerOptions,UserData} from './breaker/CircuitBreaker';


class UserAdapter {
  private userServiceUrl: string;
  private circuitBreaker: CircuitBreaker;

  constructor(userServiceUrl: string, circuitBreakerOptions: CircuitBreakerOptions) {
    this.userServiceUrl = userServiceUrl;
    // El circuit breaker envuelve el método que hace la petición HTTP, no `updateOrCreateUser`.
    this.circuitBreaker = new CircuitBreaker(
      this.updateOrCreateUserRequest.bind(this), 
      circuitBreakerOptions
    );
  }

  // Función que realmente realiza la solicitud HTTP.
  private async updateOrCreateUserRequest(userData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.userServiceUrl}/api/users/updatecreate`, userData);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }
  
  public async updateOrCreateUser(userData: UserData): Promise<any> {
    return this.circuitBreaker.call(userData);
  }
}
export default UserAdapter;
