exports.up = async knex => {
  await knex.raw(`
    CREATE TABLE "user_permission"
    (   
      user_id uuid REFERENCES "user"(id) NOT NULL,
      permission_id uuid REFERENCES "permission"(id) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, permission_id)
    );
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "user_permission"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = async knex => {
  await knex.raw('DROP TABLE "user_permission"');
};
