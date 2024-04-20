import {Request, Response} from "express";
import { getManager } from "typeorm";
import  os  from 'os';

export const HealthCheck = async (req: Request, res: Response) => {
    const currentDate = await getCurrentDate()
    const resp = {
        time: currentDate,
        id: os.hostname() //The container id.
    }

    res.send(resp);
}

async function getCurrentDate() {
    try {      
      const entityManager = getManager();    
      const result = await entityManager.query('SELECT CURRENT_TIMESTAMP as now');            
      return result[0].now; 
    } catch (error) {
      console.error('Failed to fetch current date and time:', error);
      throw error;
    }
  }