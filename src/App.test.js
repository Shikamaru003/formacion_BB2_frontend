
import axios from 'axios'
import { products } from './products';

jest.mock('axios');

it('test call to api/products', async () => {
  axios.get.mockResolvedValue('api/products', {
    params: {
        page: 0,
        size: 10,
        sortField: '',
        sortOrder: 1
    },
});
  
  await expect(products('react')).resolves.toHaveLength(10)
});