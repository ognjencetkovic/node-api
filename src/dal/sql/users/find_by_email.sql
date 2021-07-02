SELECT 
    u.id as user_id,
    u.email,
    u.password,
    COALESCE(jsonb_agg(jsonb_build_object('role_id', r.id, 'name', r.name, 'description', r.description)) FILTER (WHERE r.id IS NOT NULL), '[]') as roles,
    COALESCE(jsonb_agg(jsonb_build_object('permission_id', p.id, 'code', p.code, 'description', p.description)) FILTER (WHERE p.id IS NOT NULL), '[]') as permissions
FROM "user" u
LEFT JOIN "user_role" ur ON ur.user_id = u.id
LEFT JOIN "role" r ON ur.role_id = r.id
LEFT JOIN "user_permission" up ON up.user_id = u.id
LEFT JOIN "permission" p ON up.permission_id = p.id
WHERE email = :email
GROUP BY u.id;