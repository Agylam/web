INSERT INTO public.school (uuid, name, director_id, auth_secret, timezone_offset)
VALUES  ('62235062-ec86-4d5e-aee9-c4b5bb6cbd51', 'Гимназия', 1, '123', 300);

INSERT INTO public.user (uuid, email, "passwordHash", "schoolUuid", "fullName")
VALUES  ('1d11baea-504b-4109-9969-53a4795d7e74', 'admin@yandex.ru', '$2b$10$OdYqpn/VW9yMLacWvxprN.OGF5TTpWGHniVeH6tlAc3ebEsaVSYOi', '62235062-ec86-4d5e-aee9-c4b5bb6cbd51', 'Иванов И.И.');

INSERT INTO public.refresh_token (uuid, created_at, "userUuid")
VALUES  ('e0124f29-abe4-4d44-85bf-5891c18eada6', '2023-11-23 10:46:48.666336', '1d11baea-504b-4109-9969-53a4795d7e74');

INSERT INTO public.role (id, name, description)
VALUES  (1, 'headteacher', 'Директор');

INSERT INTO public.sound (uuid, "schoolUuid")
VALUES  ('ed09f146-f946-4277-acdf-9c1586934377', '62235062-ec86-4d5e-aee9-c4b5bb6cbd51'),
        ('e3587b1a-0ae0-4443-9373-e37311cf2c3d', '62235062-ec86-4d5e-aee9-c4b5bb6cbd51');

INSERT INTO public.user_roles_role ("userUuid", "roleId")
VALUES  ('1d11baea-504b-4109-9969-53a4795d7e74', 1);
