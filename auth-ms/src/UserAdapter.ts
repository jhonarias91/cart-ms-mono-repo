import axios, { AxiosResponse } from 'axios';
import CircuitBraker from './breaker/CircuitBreaker';


class UserAdapter {
  private userServiceUrl: string;
  private circuitBreaker: CircuitBreaker;

  constructor(userServiceUrl: string, circuitBreakerOptions: CircuitBreakerOptions) {
    this.userServiceUrl = userServiceUrl;
    // El circuit breaker debe envolver el método que hace la petición HTTP, no `updateOrCreateUser`.
    this.circuitBreaker = new CircuitBreaker(
      this.updateOrCreateUserRequest.bind(this), // Corregido aquí
      circuitBreakerOptions
    );
  }

  // Esta es la función que realmente realiza la solicitud HTTP.
  private async updateOrCreateUserRequest(userData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.userServiceUrl}/api/users/login`, userData);
      return response.data; // Asegúrate de retornar solo la data necesaria
    } catch (error) {
      // Aquí puedes manejar errores específicos si es necesario antes de lanzarlos
      throw error;
    }
  }

  // Método expuesto para actualizar o crear el usuario, que pasa por el circuit breaker
  public async updateOrCreateUser(userData: any): Promise<any> {
    return this.circuitBreaker.call(userData);
  }
  
}

export default UserAdapter;
