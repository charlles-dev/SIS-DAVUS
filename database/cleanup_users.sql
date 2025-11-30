-- Remove Manager and Operator users
delete from auth.users
where
    email in (
        'manager@davus.com',
        'operator@davus.com'
    );