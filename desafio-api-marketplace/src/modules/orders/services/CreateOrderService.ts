import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IDictionary {
  [key: string]: Product;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exists!');
    }

    const productId = products.map(product => {
      return { id: product.id };
    });

    const findProduct = await this.productsRepository.findAllById(productId);

    if (findProduct.length !== productId.length) {
      throw new AppError('One or more products do not exist!');
    }

    const productMap = Object.assign(
      {},
      ...findProduct.map(product => {
        return { [product.id]: product };
      }),
    ) as IDictionary;

    const productQuantity = products.map(product => {
      if (product.quantity > productMap[product.id].quantity) {
        throw new AppError('This product is sold out!');
      }

      productMap[product.id].quantity -= product.quantity;

      const productInfo = {
        product_id: product.id,
        quantity: product.quantity,
        price: productMap[product.id].price,
      };

      return productInfo;
    });

    const order = await this.ordersRepository.create({
      customer,
      products: productQuantity,
    });

    await this.productsRepository.updateQuantity(findProduct);

    return order;
  }
}

export default CreateOrderService;
