import { Router } from 'express';
import { handleBfhl } from '../controllers/bfhlController.js';

export const bfhlRouter = Router();

// POST /bfhl — accepts { data: ["X->Y", ...] }
bfhlRouter.post('/', handleBfhl);
