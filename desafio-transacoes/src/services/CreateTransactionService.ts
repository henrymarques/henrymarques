import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const repository = getCustomRepository(TransactionsRepository);

    if ((await repository.getBalance()).total < value && type === 'outcome') {
      throw new AppError("You don't have this value");
    }

    const createCategory = new CreateCategoryService();
    const category = await createCategory.execute({
      title: categoryTitle,
    });

    const transaction = repository.create({
      title,
      type,
      value,
      category_id: category.id,
    });

    await repository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
