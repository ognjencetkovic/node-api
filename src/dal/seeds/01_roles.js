exports.seed = async knex => {
  await knex.raw(`
    INSERT INTO role(name) 
    VALUES('user')
    ON CONFLICT DO NOTHING;

    INSERT INTO role(name) 
    VALUES('admin')
    ON CONFLICT DO NOTHING;
  `);
};
