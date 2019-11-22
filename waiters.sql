create table weekdays(
	id serial not null primary key,
	days text not null
);

create table waiters(
	id serial not null primary key,
	waitername text not null,
	day_id int,
	foreign key (day_id) references weekdays(id)
);
