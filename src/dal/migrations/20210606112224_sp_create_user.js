exports.up = async knex => {
  await knex.raw(`
      DROP FUNCTION IF EXISTS sp_create_user;

      CREATE FUNCTION sp_create_user(
        _email varchar,
        _password varchar,
        _role_id uuid
      )
      RETURNS TABLE (
        user_id uuid,
        email varchar,
        roles jsonb
      ) AS
      $body$
        DECLARE
          _user_id uuid := uuid_generate_v4();
        BEGIN
          INSERT INTO "user" (id, email, password)
          VALUES(_user_id, _email, _password);
          INSERT INTO user_role (user_id, role_id)
          VALUES (_user_id, _role_id);
      
          RETURN QUERY
            SELECT 
              u.id as user_id,
              u.email,
              jsonb_agg(jsonb_build_object('role_id', r.id, 'name', r.name, 'description', r.description)) as roles
            FROM "user" u
            LEFT JOIN "user_role" ur ON ur.user_id = u.id
            LEFT JOIN "role" r ON ur.role_id = r.id
            WHERE u.id = _user_id
            GROUP BY u.id;
        END;
      $body$
      LANGUAGE plpgsql;
    `);
};

exports.down = async knex => {
  await knex.raw('DROP PROCEDURE IF EXISTS sp_create_user');
};
