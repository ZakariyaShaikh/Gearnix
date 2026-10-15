use gearnix;




create table user_role_history (
 history_id bigint unsigned not null auto_increment , 
 user_id bigint unsigned not null , 
 old_role_id bigint unsigned null , 
 new_role_id bigint unsigned not null , 
 changed_by bigint unsigned not null , 
 reason varchar(255) null ,
 created_at datetime not null default current_timestamp , 
 primary key (history_id),
 key idx_role_history_user (user_id) , 
 key idx_role_history_changed_by (changed_by),
 foreign key (user_id) references users(user_id),
 FOREIGN KEY (old_role_id) REFERENCES roles(role_id),
 FOREIGN KEY (new_role_id) REFERENCES roles(role_id),
 FOREIGN KEY (changed_by) REFERENCES users(user_id)
 );