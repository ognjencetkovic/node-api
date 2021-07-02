exports.up = async knex => {
  await knex.raw(`
    CREATE TABLE "refresh_token"
    (
      id uuid NOT NULL DEFAULT uuid_generate_v4(),
      session_id character varying(255),
      user_id uuid REFERENCES "user"(id) NOT NULL,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT refresh_token_pkey PRIMARY KEY (id)
    );
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "refresh_token"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = async knex => {
  await knex.raw('DROP TABLE "refresh_token"');
};
