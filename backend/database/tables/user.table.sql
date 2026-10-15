use gearnix;

create table users (
user_id bigint unsigned not null auto_increment , 
role_id bigint unsigned not null ,
username varchar(50)  not null , 
email varchar(255) not null , 
password_hash varchar(255) not null ,
profile_image varchar(500) null ,
status varchar(30) not null default "active" , 
is_email_verfied tinyint(1) not null default 0 , 
created_at datetime not null default current_timestamp , 
updated_at datetime not null default current_timestamp on update current_timestamp, 
deleted_at datetime null,
primary key (user_id),
unique key uq_user_username (username) , 
unique key uq_user_email (email) , 
key idx_user_role_id (role_id),
key idx_user_status (status)
);


alter table users
add constraint fk_users_role
foreign key (role_id) references roles(role_id) ;