exports.up = async knex => {
  await knex.raw(`
    CREATE TABLE "permission"
    (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      code character varying(255),
      description text,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT permission_pkey PRIMARY KEY (id),
      CONSTRAINT permission_code_unique UNIQUE (code)
    );
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "permission"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = async knex => {
  await knex.raw('DROP TABLE "permission"');
};
