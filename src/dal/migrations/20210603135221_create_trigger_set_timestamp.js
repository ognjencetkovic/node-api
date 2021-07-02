exports.up = async knex => {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `);
};

exports.down = async knex => {
  await knex.raw(`DROP FUNCTION trigger_set_timestamp`);
};
