// src/modules/product/domain/entities/product.entity.ts
export class Product {
  constructor(
    public id: number,
    public name: string,
    public userId: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
