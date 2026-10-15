use gearnix;




create table role_permissions (
role_id bigint unsigned not null , 
permission_id bigint unsigned not null , 
created_at datetime not null default current_timestamp , 
primary key (role_id , permission_id),
foreign key (role_id) references roles (role_id),
foreign key (permission_id) references permissions(permission_id)
);
