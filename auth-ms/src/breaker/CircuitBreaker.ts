export class CircuitBreaker {

  private requestFunction: (...args: any[]) => Promise<string>;
  private state: BREACKER_STATE;
  private failureThreshold: number;
  private failureCount: number;
  private baseTimeout: number;
  private maxTimeout: number;
  private nextAttempt: number;

  constructor(requestFunction: () => Promise<any>, options: CircuitBreakerOptions) {
    this.requestFunction = requestFunction;
    this.state =BREACKER_STATE.CLOSED;
    this.failureThreshold = options.failureThreshold;
    this.failureCount = 0;
    this.baseTimeout = options.baseTimeout;
    this.maxTimeout = options.maxTimeout;
    this.nextAttempt = Date.now();
  }

  public async call(...args: any[]): Promise<any> {
    if (this.state === BREACKER_STATE.OPEN) {
      const currentTime = Date.now();
      //If next attemp is past, so it's time to half-open the circuit
      if (this.nextAttempt <= currentTime) {
        this.state = BREACKER_STATE.HALF_OPEN;  
      }else{
        throw new Error(`Circuit suspended. It will try later. Retry in ${(this.nextAttempt - currentTime) / 1000} seconds`);
      }      
    }

    try {
      const response = await this.requestFunction(...args);
      this.onSuccess();
      return response;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === BREACKER_STATE.CLOSED) {
      this.state = BREACKER_STATE.HALF_OPEN;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    if (this.failureCount > this.failureThreshold) {
      this.state = BREACKER_STATE.OPEN;
      const timeout = Math.min(this.baseTimeout * (2 ** this.failureCount), this.maxTimeout);
      this.nextAttempt = Date.now() + timeout;
    }
  }
}

enum BREACKER_STATE{
  OPEN,
  HALF_OPEN,
  CLOSED
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  baseTimeout: number; 
  maxTimeout: number;
}

export interface UserData {
  first_name: string;
  last_name?: string;
  email: string;
  uid: string;
  provider: string;
  is_ambassador: boolean;
}