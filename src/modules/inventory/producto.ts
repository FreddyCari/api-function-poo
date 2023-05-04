import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//inventory

@Entity()
export class Producto extends BaseEntity {
  @PrimaryGeneratedColumn()
  idProducto!: number;

  @Column()
  nombreProducto!: string;

  @Column()
  cantidad!: number;

  @Column()
  precio!: number;
}
