use gearnix;

create table roles (
 role_id bigint unsigned not null  auto_increment, 
 role_name varchar(50) not null , 
 description varchar(255) null,
 is_system_role tinyint (1) not null default 1 ,
 created_at datetime not null default current_timestamp , 
 updated_at datetime not null default current_timestamp on update current_timestamp , 
 primary key (role_id),
 unique key uq_roles_role_name (role_name)
);