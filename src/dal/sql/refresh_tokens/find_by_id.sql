SELECT 
    id as token,
    user_id,
    session_id,
    expires_at
FROM refresh_token
WHERE id = :id;