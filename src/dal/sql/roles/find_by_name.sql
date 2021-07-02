SELECT 
    id as role_id,
    name,
    description
FROM "role" WHERE "name" = :name;