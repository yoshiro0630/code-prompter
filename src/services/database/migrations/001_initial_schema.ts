import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('documents', (table) => {
    table.uuid('id').primary();
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.text('content').notNullable();
    table.jsonb('metadata').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['project_id']); // Only one document per project
  });

  await knex.schema.createTable('prompts', (table) => {
    table.uuid('id').primary();
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.integer('stage').notNullable();
    table.text('content').notNullable();
    table.jsonb('metadata');
    table.boolean('completed').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('prompts');
  await knex.schema.dropTable('documents');
  await knex.schema.dropTable('projects');
}