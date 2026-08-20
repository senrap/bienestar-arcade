-- handle_new_user solo la usa el trigger de auth.users, y touch_updated_at solo
-- los triggers de las tablas. Que sean invocables como RPC desde la API publica
-- no aporta nada y suma superficie, asi que se les saca el permiso de ejecucion
-- a los roles que llegan por HTTP.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.touch_updated_at() from anon, authenticated, public;
