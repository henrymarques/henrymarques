import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterAppointmentField1586898264533
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointment', 'provider');
    await queryRunner.addColumn(
      'appointment',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'appointment',
      new TableForeignKey({
        name: 'AppointmentProvider',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointment', 'AppointmentProvider');
    await queryRunner.dropColumn('appointments', 'provider_id');

    await queryRunner.addColumn(
      'appointment',
      new TableColumn({
        name: 'provider',
        type: 'varchar',
      }),
    );
  }
}
