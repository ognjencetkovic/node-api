exports.seed = async knex => {
  await knex.raw(`
    INSERT INTO permission(code, description) 
    VALUES('SU', 'Super user permission')
    ON CONFLICT DO NOTHING;
  `);
};
