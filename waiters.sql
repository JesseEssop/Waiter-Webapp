create table weekdays(
	id serial not null primary key,
	days text not null
);

create table waiters(
	id serial not null primary key,
	waitername text not null
);

create table shifts(
	id serial not null primary key,
	waiter_id int,
	day_id int

);