import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProductName = await this.ormRepository.findOne({
      where: { name },
    });

    return findProductName;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findProductsId = await this.ormRepository.findByIds(products);

    return findProductsId;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const findId = products.map(product => product.id);

    const productMap = Object.assign(
      {},
      ...products.map(product => ({ [product.id]: product.quantity })),
    );

    const findProducts = await this.ormRepository.find({
      where: {
        id: In(findId),
      },
    });

    for (let i = 0; i < findProducts.length; i += 1) {
      findProducts[i].quantity = productMap[findProducts[i].id];
    }

    await this.ormRepository.save(findProducts);

    return findProducts;
  }
}

export default ProductsRepository;
