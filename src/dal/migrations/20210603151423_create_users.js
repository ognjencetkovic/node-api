exports.up = async knex => {
  await knex.raw(`
    CREATE TABLE "user"
    (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      email character varying(255),
      password character varying(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT user_pkey PRIMARY KEY (id),
      CONSTRAINT user_email_unique UNIQUE (email)
    );
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = async knex => {
  await knex.raw('DROP TABLE "user"');
};
