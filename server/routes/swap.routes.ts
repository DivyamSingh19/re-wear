import { Router } from 'express';
import {
  requestSwap,
  cancelSwap,
  completeSwap,
  getMySwaps,
  getSwapById
} from '../controllers/swap.controller';
import { Request,Response } from 'express';
const swaprouter = Router();
  
swaprouter.post('/request', async (req:Request,res:Response) => {
    requestSwap
});

 
swaprouter.post('/:id/cancel', async (req:Request,res:Response) => {
    cancelSwap
});

 
swaprouter.post('/:id/complete', async (req:Request,res:Response) => {
    completeSwap
});


swaprouter.get('/my-swaps', async (req:Request,res:Response) => {
    getMySwaps
});

 
swaprouter.get('/:id', async (req:Request,res:Response) => {
    getSwapById
});

export default swaprouter;