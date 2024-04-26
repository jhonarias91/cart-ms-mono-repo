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

  // Obtiene la información actual de la memoria y la CPU
export const getSystemInfo = async (req: Request, res: Response): Promise<void> => {
  const totalMemory = os.totalmem() / (1024*1024);//Mbs
    const freeMemory = os.freemem()/ (1024*1024);//Mbs ;
    const usedMemory = totalMemory - freeMemory;

    const cpus = os.cpus();
    const loadAverages = os.loadavg(); // Carga promedio en los últimos 1, 5 y 15 minutos.

    const systemInfo = {
        memoryUsage: {
            totalMemory,
            freeMemory,
            usedMemory
        },
        cpuLoad: {
            model: cpus[0].model,
            speed: cpus[0].speed,
            loadAverages
        },
        system: {
            platform: os.platform(),
            release: os.release(),
            uptime: os.uptime()
        }
    };

    const response = {
        time: new Date().toISOString(),
        id: os.hostname(), 
        systemInfo
    };

    res.send(response); 

};