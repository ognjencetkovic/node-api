exports.up = async knex => {
  await knex.raw(`
    CREATE TABLE "user_role"
    (   
      user_id uuid REFERENCES "user"(id) NOT NULL,
      role_id uuid REFERENCES "role"(id) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, role_id)
    );
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "user_role"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = async knex => {
  await knex.raw('DROP TABLE "user_role"');
};
