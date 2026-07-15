import { Router, Request, Response } from 'express';
import {
  getCustomers, getCustomerById,
  addCustomer, updateCustomer, deleteCustomer
} from '../database';

const router = Router();

// GET /api/customers
router.get('/', (_req: Request, res: Response) => {
  try {
    const customers = getCustomers();
    res.json({ customers, total: customers.length });
  } catch (err) {
    console.error('Failed to get customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const customer = getCustomerById(id);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(customer);
  } catch (err) {
    console.error('Failed to get customer:', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST /api/customers
router.post('/', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, username, address, company, status } = req.body;
    if (!firstName || !lastName || !email) {
      res.status(400).json({ error: 'firstName, lastName, and email are required fields' });
      return;
    }
    const newCustomer = addCustomer({
      firstName,
      lastName,
      email,
      phone: phone || '',
      username: username || `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      image: '',
      address: {
        city: address?.city || 'Unknown',
        state: address?.state || '',
        country: address?.country || 'US',
      },
      company: { name: company?.name || 'Independent' },
      status: status || 'active',
    });
    res.status(201).json(newCustomer);
  } catch (err) {
    console.error('Failed to create customer:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT /api/customers/:id
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = updateCustomer(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error('Failed to update customer:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const success = deleteCustomer(id);
    if (!success) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ success: true, message: `Customer #${id} deleted` });
  } catch (err) {
    console.error('Failed to delete customer:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
