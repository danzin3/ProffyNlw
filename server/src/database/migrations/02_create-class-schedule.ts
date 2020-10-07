import Knex from 'knex';

export async function up (knex: Knex) {
    return knex.schema.createTable('class_schedule', table => {
        table.increments('id').primary();
        table.integer('week_day').notNullable();
        table.integer('from').notNullable();
        table.integer('to').notNullable();

        table.integer('class_id').notNullable().references('id').inTable('classes').onUpdate('CASCADE');
    });
};

export async function down (kenx: Knex) {
    return kenx.schema.dropTable('class_schedule');
};