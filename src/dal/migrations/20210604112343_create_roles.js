exports.up = async knex => {
  await knex.raw(`
    CREATE TABLE "role"
    (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      name character varying(255),
      description text,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT role_pkey PRIMARY KEY (id),
      CONSTRAINT role_name_unique UNIQUE (code)
    );
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "role"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = async knex => {
  await knex.raw('DROP TABLE "role"');
};
