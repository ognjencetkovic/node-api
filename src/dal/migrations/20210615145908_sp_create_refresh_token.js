exports.up = async knex => {
  await knex.raw(`
      DROP FUNCTION IF EXISTS sp_create_refresh_token;

      CREATE FUNCTION sp_create_refresh_token(
        _user_id uuid,
        _session_id varchar,
        _expires_at TIMESTAMPTZ
      )
      RETURNS TABLE (
        token uuid,
        user_id uuid,
        session_id varchar,
        expires_at TIMESTAMPTZ
      ) AS
      $body$
        DECLARE
          _token uuid := uuid_generate_v4();
        BEGIN
          INSERT INTO "refresh_token" (id, user_id, session_id, expires_at)
          VALUES(_token, _user_id, _session_id, _expires_at);
      
          RETURN QUERY
            SELECT 
              rt.id as token,
              rt.user_id,
              rt.session_id,
              rt.expires_at
            FROM "refresh_token" rt
            WHERE rt.id = _token;
        END;
      $body$
      LANGUAGE plpgsql;
    `);
};

exports.down = async knex => {
  await knex.raw('DROP PROCEDURE IF EXISTS sp_create_refresh_token');
};
