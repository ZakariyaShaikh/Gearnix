use gearnix;


create table permissions (
permission_id bigint unsigned not null auto_increment , 
permission_key varchar (100 ) not null , 
permission_name varchar (100) not null , 
module varchar (50) not null  , 
description varchar ( 255 ) null , 
is_active tinyint (1) not null default 1 , 
created_at datetime not null default current_timestamp , 
updated_at datetime not null default current_timestamp on update current_timestamp , 
primary key (permission_id),
unique key uq_permission_key (permission_key)
);