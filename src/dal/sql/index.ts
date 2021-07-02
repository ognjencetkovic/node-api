import fs from 'fs';

const load = (file: string) => {
    const sqlQuery = fs
        .readFileSync(`${__dirname}/${file}`)
        .toString()
        .replace(/(\r\n|\n|\r)/gm, ` `)
        .replace(/\s+/g, ` `);
    return sqlQuery;
};

export default {
    users: {
        findById: load(`users/find_by_id.sql`),
        findByEmail: load(`users/find_by_email.sql`),
        register: load(`users/register.sql`),
    },
    roles: {
        findByName: load(`roles/find_by_name.sql`),
    },
    refresh_tokens: {
        create: load(`refresh_tokens/create.sql`),
        findById: load(`refresh_tokens/find_by_id.sql`),
    },
};
