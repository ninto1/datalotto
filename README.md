# datalotto
a simple lottery like software for which people can pay using some data

## Requirements

1. Install Postgresql (recommended version: 15)

2. execute in SQL: 
```SQL
CREATE DATABASE datalotto;

\c datalotto

CREATE TABLE IF NOT EXISTS public.dataset
(
    dsid bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 0 MINVALUE 0 MAXVALUE 9223372036854775807 CACHE 1 ),
    ip character varying COLLATE pg_catalog."default",
    browser character varying COLLATE pg_catalog."default",
    cookies character varying COLLATE pg_catalog."default",
    touch boolean,
    width numeric,
    height numeric,
    webgl boolean,
    localstorage boolean,
    battery character varying COLLATE pg_catalog."default",
    submittedat timestamp without time zone DEFAULT now(),
    os character varying COLLATE pg_catalog."default",
    fingerprint character varying COLLATE pg_catalog."default",
    CONSTRAINT dataset_pkey PRIMARY KEY (dsid)
);
```

3. Install Nodejs
4. Go to datalotto directory
5. Run `npm i`
6. Go to `src/client`
7. Run `npm i`

## Usage

To start: 

`npm start` in datalotto directory

The admin token will be printed in the console, it is randomly generated every restart

Admin panel is accessible at: [http://localhost:5000/admin](http://localhost:5000/admin)

Link to get a ticket: [http://localhost:5000/submit](http://localhost:5000/submit)

Public dashboard: [http://localhost:5000/](http://localhost:5000/)


### Drawing winners

There is an array of tickets, the so called pot, which gets reset every time the project starts. To clear the pot just restart (may add a button to the admin panel later).

Once a winner is drawn, only the winning ticket gets removed from the pot.


## Changes to the Dashboard

After changing the dashboard, the React project in `datalotto/src/client` needs to be recompiled.

Just run `npm run build` in `datalotto/src/client`
