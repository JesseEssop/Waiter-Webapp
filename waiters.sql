create table waiters(
	id serial not null primary key,
	waitername text not null
);

create table weekdays (
	id serial not null primary key,
	day text not null,
	waiter_id int,
	foreign key (waiter_id) references waiters(id)
);



-- create table workingdays (
--     id serial not null primary key,
--     waiter_id int references waiters(id),
--     workdays int references weekdays(id)
-- 