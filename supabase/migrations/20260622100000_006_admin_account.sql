-- Creates (or updates) a single admin account with the requested
-- credentials, so /admin can be logged into immediately without going
-- through the public registration form.
--
-- Safe to re-run: it upserts on email, so running it twice does not create
-- duplicates or error out.

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'bilalyasir34@gmail.com';

    IF target_user_id IS NULL THEN
        target_user_id := gen_random_uuid();

        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at,
            raw_app_meta_data, raw_user_meta_data, confirmation_token,
            recovery_token, email_change_token_new, email_change
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', target_user_id, 'authenticated', 'authenticated',
            'bilalyasir34@gmail.com', crypt('LifeIscool4me', gen_salt('bf')),
            now(), now(), now(),
            '{"provider":"email","providers":["email"]}', '{}', '',
            '', '', ''
        );

        INSERT INTO auth.identities (
            id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
        ) VALUES (
            gen_random_uuid(), target_user_id, target_user_id,
            format('{"sub":"%s","email":"%s"}', target_user_id, 'bilalyasir34@gmail.com')::jsonb,
            'email', now(), now(), now()
        );
    ELSE
        -- Account already exists: just reset the password to the requested one.
        UPDATE auth.users
        SET encrypted_password = crypt('LifeIscool4me', gen_salt('bf')), updated_at = now()
        WHERE id = target_user_id;
    END IF;

    INSERT INTO profiles (id, email, first_name, last_name, role)
    VALUES (target_user_id, 'bilalyasir34@gmail.com', 'Bilal', 'Yasir', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
END $$;
