--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- Name: test; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA test;


--
-- Name: period_name; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.period_name AS ENUM (
    'breakfast',
    'brunch',
    'dinner',
    'latenight',
    'lunch'
);


--
-- Name: restaurant_id_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.restaurant_id_enum AS ENUM (
    '3056',
    '3314'
);


--
-- Name: restaurant_name; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.restaurant_name AS ENUM (
    'anteatery',
    'brandywine'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: diet_restrictions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diet_restrictions (
    dish_id text NOT NULL,
    contains_eggs boolean,
    contains_fish boolean,
    contains_milk boolean,
    contains_peanuts boolean,
    contains_sesame boolean,
    contains_shellfish boolean,
    contains_soy boolean,
    contains_tree_nuts boolean,
    contains_wheat boolean,
    is_gluten_free boolean,
    is_halal boolean,
    is_kosher boolean,
    is_locally_grown boolean,
    is_organic boolean,
    is_vegan boolean,
    is_vegetarian boolean,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP(3)
);


--
-- Name: dish_menu_station_joint; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dish_menu_station_joint (
    dish_id text NOT NULL,
    menu_id text NOT NULL,
    station_id text NOT NULL
);


--
-- Name: dishes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dishes (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP(3)
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    title text NOT NULL,
    image text,
    restaurant_id public.restaurant_id_enum NOT NULL,
    short_description text,
    long_description text,
    start timestamp without time zone NOT NULL,
    "end" timestamp without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP(3)
);


--
-- Name: menus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menus (
    id text NOT NULL,
    date date NOT NULL,
    restaurant_id public.restaurant_id_enum NOT NULL,
    start timestamp(3) without time zone NOT NULL,
    "end" timestamp(3) without time zone NOT NULL,
    price text NOT NULL,
    period public.period_name NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP(3)
);


--
-- Name: nutrition_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nutrition_info (
    dish_id text NOT NULL,
    serving_size text,
    serving_unit text,
    calories text,
    calories_from_fat text,
    total_fat_g text,
    trans_fat_g text,
    saturated_fat_g text,
    cholesterol_mg text,
    sodium_mg text,
    total_carbs_g text,
    dietary_fiber_g text,
    sugars_mg text,
    protein_g text,
    vitamin_a_iu text,
    vitamin_c_iu text,
    calcium_mg text,
    iron_mg text,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP(3)
);


--
-- Name: push_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.push_token (
    token text NOT NULL
);


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurants (
    id public.restaurant_id_enum NOT NULL,
    name public.restaurant_name NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP(3)
);


--
-- Name: stations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stations (
    id text NOT NULL,
    name text NOT NULL,
    restaurant_id public.restaurant_id_enum NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP(3)
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	c7f5ddb0173786c5655b1d278a606193da9cd8b153b4f0e9ede549307af364b0	1715635112745
2	c7f5ddb0173786c5655b1d278a606193da9cd8b153b4f0e9ede549307af364b0	1715908383219
3	c7f5ddb0173786c5655b1d278a606193da9cd8b153b4f0e9ede549307af364b0	1715918773893
\.


--
-- Data for Name: diet_restrictions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.diet_restrictions (dish_id, contains_eggs, contains_fish, contains_milk, contains_peanuts, contains_sesame, contains_shellfish, contains_soy, contains_tree_nuts, contains_wheat, is_gluten_free, is_halal, is_kosher, is_locally_grown, is_organic, is_vegan, is_vegetarian, created_at, updated_at) FROM stdin;
A1219_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:41.552	2024-05-13 21:21:41.552
M4100_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-18 00:00:09.442	2024-05-18 00:00:09.442
M35731_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:33.719	2024-05-19 00:01:33.719
M32680_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:33.78	2024-05-19 00:01:33.78
M37923_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:33.841	2024-05-19 00:01:33.841
M20719_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.133	2024-05-19 00:01:04.133
M32660_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 21:21:41.57	2024-05-13 21:21:41.57
M600_3314	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-21 00:00:08.329	2024-05-21 00:00:08.329
M40987_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.025	2024-05-13 21:21:40.025
M19952_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:31.509	2024-05-13 22:02:31.509
M36741_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:32.318	2024-05-13 22:02:32.318
M21677_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:11.985	2024-05-13 22:03:11.985
M21568_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.557	2024-05-19 00:01:04.557
M21920_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:35.269	2024-05-19 00:01:35.269
M34434_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:12.588	2024-05-19 00:01:12.588
M40942_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:03.227	2024-05-19 00:01:03.227
M21926_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:24.1	2024-05-19 00:01:24.1
M33324_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.852	2024-05-13 22:03:08.852
M32572_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.222	2024-05-13 22:03:08.222
M36069_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.404	2024-05-13 21:21:39.404
A212_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:46.087	2024-05-13 22:01:46.087
M2908_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:12.111	2024-05-13 22:03:12.111
M40743_3056	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:12.359	2024-05-13 22:03:12.359
M34048_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-17 00:00:16.567	2024-05-17 00:00:16.567
M20851_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:13.118	2024-05-13 22:02:13.118
M14344_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:40.024	2024-05-13 21:21:40.024
M19998_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.225	2024-05-13 21:21:40.225
M18804_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.526	2024-05-19 00:01:12.526
A1221_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:41.565	2024-05-13 21:21:41.565
A3204_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.838	2024-05-19 00:01:12.838
M19739_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:03:09.102	2024-05-13 22:03:09.102
M19060_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:50.954	2024-05-13 22:02:50.954
M20651_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.431	2024-05-13 21:21:42.431
M3223_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:08.665	2024-05-13 22:03:08.665
M36582_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:07.604	2024-05-13 22:03:07.604
A1219_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:55.824	2024-05-13 22:01:55.824
M10521_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-18 00:00:19.846	2024-05-18 00:00:19.846
M40376_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:08.347	2024-05-13 22:03:08.347
M39263_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:24.167	2024-05-19 00:01:24.167
M10569_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:40.235	2024-05-13 21:21:40.235
M20555_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:51.2	2024-05-13 22:02:51.2
M14456_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:27.679	2024-05-19 00:01:27.679
M14979_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:41.546	2024-05-13 21:21:41.546
M1057_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:51.016	2024-05-13 22:02:51.016
M20110_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:27.741	2024-05-19 00:01:27.741
M21627_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:08.411	2024-05-13 22:03:08.411
A1221_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:07.227	2024-05-13 22:03:07.227
M32623_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:22.246	2024-05-19 00:01:22.246
M20277_3056	f	f	t	f	f	f	t	f	t	f	f	t	f	f	f	t	2024-05-13 21:21:39.439	2024-05-13 21:21:39.439
M40484_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:09.476	2024-05-13 22:02:09.476
M20403_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-22 00:00:09.256	2024-05-22 00:00:09.256
M18537_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-20 00:00:09.133	2024-05-20 00:00:09.133
M41480_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.393	2024-05-19 00:01:36.393
M40913_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-20 22:46:21.507	2024-05-20 22:46:21.507
M40876_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:37.023	2024-05-19 00:01:37.023
M33772_3056	f	t	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:12.464	2024-05-19 00:01:12.464
M3016_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:11.342	2024-05-13 22:03:11.342
M37134_3314	t	f	f	f	f	f	f	f	f	t	\N	t	f	f	f	t	2024-05-13 22:03:08.727	2024-05-13 22:03:08.727
L81261_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:20.406	2024-05-20 22:46:20.406
M40910_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:14.439	2024-05-13 22:03:14.439
M2182_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:20.712	2024-05-20 22:46:20.712
M12961_3314	t	f	t	f	f	f	t	f	t	f	f	\N	f	f	f	t	2024-05-13 22:03:13.924	2024-05-13 22:03:13.924
M40818_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	f	f	f	f	f	2024-05-20 00:00:08.756	2024-05-20 00:00:08.756
M21681_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-24 00:00:15.877	2024-05-24 00:00:15.877
M14113_3056	t	f	t	f	f	f	t	f	t	f	f	\N	f	f	f	t	2024-05-13 22:01:46.15	2024-05-13 22:01:46.15
L227710_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:40.235	2024-05-13 21:21:40.235
M21855_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:14.173	2024-05-13 22:03:14.173
M4906_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:27.237	2024-05-13 22:01:27.237
M40411_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:15.712	2024-05-13 22:03:15.712
M39649_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:14.236	2024-05-13 22:03:14.236
M19741_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:03.786	2024-05-13 22:02:03.786
M10550_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.998	2024-05-13 22:03:17.998
M32745_3314	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:40.086	2024-05-13 21:21:40.086
M9906_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:12.484	2024-05-13 22:03:12.484
M21946_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:31.075	2024-05-13 22:02:31.075
M33862_3314	f	f	f	f	f	f	t	f	t	f	f	\N	f	f	t	t	2024-05-13 22:03:15.65	2024-05-13 22:03:15.65
A41_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.366	2024-05-13 21:21:42.366
M14364_3314	t	f	f	f	f	f	f	f	f	t	\N	t	f	f	f	t	2024-05-13 22:03:15.713	2024-05-13 22:03:15.713
M11411_3314	f	t	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-22 00:00:14.753	2024-05-22 00:00:14.753
A2938_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:08.032	2024-05-13 22:03:08.032
L100755_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:40.047	2024-05-13 21:21:40.047
A3068_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:16.056	2024-05-13 22:03:16.056
M40468_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:40.109	2024-05-13 21:21:40.109
A81_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:16.219	2024-05-13 22:03:16.219
M21923_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:16.346	2024-05-13 22:02:16.346
M39654_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.825	2024-05-13 22:02:33.825
A1146_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.258	2024-05-13 22:03:17.258
M32500_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.713	2024-05-13 22:03:17.713
M35340_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:21.292	2024-05-13 22:02:21.292
M14090_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:27.299	2024-05-13 22:01:27.299
A5808_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:40.213	2024-05-13 21:21:40.213
M34360_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 21:21:40.224	2024-05-13 21:21:40.224
M16020_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.163	2024-05-13 21:21:42.163
L322479_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:39.549	2024-05-13 21:21:39.549
M32303_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:40.08	2024-05-13 21:21:40.08
M21276_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:39.398	2024-05-13 21:21:39.398
M40883_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:14.01	2024-05-13 22:02:14.01
M9751_3314	t	f	t	f	f	f	f	f	f	t	f	\N	f	f	f	t	2024-05-13 22:02:14.136	2024-05-13 22:02:14.136
M34579_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 21:21:40.087	2024-05-13 21:21:40.087
M34844_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 21:21:40.088	2024-05-13 21:21:40.088
M19926_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 21:21:40.1	2024-05-13 21:21:40.1
M40808_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.268	2024-05-13 21:21:40.268
M40451_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:33.753	2024-05-19 00:01:33.753
M34997_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.359	2024-05-13 22:02:33.359
M14278_3314	f	f	f	f	f	f	f	f	f	t	\N	f	f	f	f	f	2024-05-13 22:02:03.715	2024-05-13 22:02:03.715
M41402_3056	t	f	t	f	f	f	t	t	t	f	f	f	f	f	f	t	2024-05-13 22:01:24.998	2024-05-13 22:01:24.998
M35269_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-22 00:00:11.327	2024-05-22 00:00:11.327
A41_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:57.635	2024-05-13 22:02:57.635
M6929_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-24 00:00:09.058	2024-05-24 00:00:09.058
A1222_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:57.697	2024-05-13 22:02:57.697
M599_3056	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:09.559	2024-05-13 22:02:09.559
M38232_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:22.247	2024-05-19 00:01:22.247
M32949_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	f	f	2024-05-13 22:02:58.252	2024-05-13 22:02:58.252
M41120_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 21:21:42.426	2024-05-13 21:21:42.426
M34484_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:07.846	2024-05-13 22:03:07.846
M6363_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:03.298	2024-05-19 00:01:03.298
M14226_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 21:21:41.607	2024-05-13 21:21:41.607
M508_3056	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-19 00:01:04.27	2024-05-19 00:01:04.27
M34522_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:04.479	2024-05-19 00:01:04.479
M18832_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.787	2024-05-13 22:02:33.787
M34456_3314	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-13 22:03:08.502	2024-05-13 22:03:08.502
M40946_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:30.476	2024-05-13 22:02:30.476
M12901_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:33.848	2024-05-13 22:02:33.848
M41518_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:13.616	2024-05-13 22:02:13.616
M41141_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 21:21:41.789	2024-05-13 21:21:41.789
M21424_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:18.735	2024-05-13 22:02:18.735
M17308_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:46.801	2024-05-13 22:01:46.801
M41104_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:58.958	2024-05-13 22:02:58.958
M40484_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:57.238	2024-05-13 22:02:57.238
M38830_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-18 00:00:15.958	2024-05-18 00:00:15.958
M40451_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:55.831	2024-05-13 22:01:55.831
M32631_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:52.679	2024-05-13 22:02:52.679
M10463_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:33.816	2024-05-19 00:01:33.816
A1950_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:22.561	2024-05-19 00:01:22.561
M40846_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:14.016	2024-05-13 22:02:14.016
M9746_3314	f	f	t	f	f	f	f	f	f	t	\N	\N	f	f	f	t	2024-05-13 22:02:14.14	2024-05-13 22:02:14.14
M32253_3056	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	2024-05-19 00:01:27.568	2024-05-19 00:01:27.568
M20846_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:08.691	2024-05-13 22:03:08.691
M33537_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:27.691	2024-05-19 00:01:27.691
M40046_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-19 00:01:27.876	2024-05-19 00:01:27.876
M13263_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:52.976	2024-05-13 22:02:52.976
M21903_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:20.23	2024-05-13 22:02:20.23
M19845_3056	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-19 00:01:34.011	2024-05-19 00:01:34.011
M9894_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:20.417	2024-05-13 22:02:20.417
M20719_3314	f	f	t	f	f	t	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:17.502	2024-05-13 22:02:17.502
M14864_3314	f	f	f	f	f	f	f	f	t	f	\N	\N	f	f	t	t	2024-05-13 22:02:20.292	2024-05-13 22:02:20.292
M41612_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-22 00:00:17.389	2024-05-22 00:00:17.389
M2677_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:28.388	2024-05-19 00:01:28.388
M40715_3314	f	f	f	f	t	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:08.124	2024-05-13 22:03:08.124
M35627_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:09.876	2024-05-13 22:02:09.876
M40764_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:00:53.388	2024-05-19 00:00:53.388
M19446_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:28.638	2024-05-19 00:01:28.638
M41511_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:34.075	2024-05-19 00:01:34.075
M4929_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:18.428	2024-05-13 22:02:18.428
M19595_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:24.479	2024-05-19 00:01:24.479
M2323_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:35.331	2024-05-19 00:01:35.331
M19391_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:58.708	2024-05-13 22:02:58.708
M40798_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:14.187	2024-05-13 22:03:14.187
M20658_3056	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:03.229	2024-05-19 00:01:03.229
M32623_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:13.098	2024-05-13 22:02:13.098
M34515_3314	f	f	f	f	f	f	t	f	t	f	f	\N	f	f	t	t	2024-05-13 22:02:49.963	2024-05-13 22:02:49.963
M41105_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:03:07.328	2024-05-13 22:03:07.328
M13601_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:58.33	2024-05-13 22:02:58.33
M41021_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:57.308	2024-05-13 22:02:57.308
M21511_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.082	2024-05-19 00:01:36.082
M37047_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:48.493	2024-05-13 22:01:48.493
A5800_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:27.431	2024-05-13 22:01:27.431
A486_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:28.434	2024-05-13 22:02:28.434
M40924_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:12.028	2024-05-13 22:03:12.028
M32944_3314	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:52.556	2024-05-13 22:02:52.556
M1842_3056	t	f	t	f	f	f	f	t	t	f	f	\N	f	f	f	t	2024-05-13 22:02:33.91	2024-05-13 22:02:33.91
M20397_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:58.711	2024-05-13 22:02:58.711
A714_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:34.133	2024-05-13 22:02:34.133
M21159_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:07.707	2024-05-13 22:03:07.707
M34023_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.188	2024-05-13 22:03:08.188
M40437_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.25	2024-05-13 22:03:08.25
M20692_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:09.07	2024-05-13 22:03:09.07
M34957_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:17.81	2024-05-13 22:02:17.81
M9934_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:08.881	2024-05-13 22:03:08.881
L366315_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:20.408	2024-05-20 22:46:20.408
M33322_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:58.436	2024-05-13 22:02:58.436
M20110_3314	f	f	f	f	f	f	t	f	t	f	f	t	f	f	f	t	2024-05-13 22:02:52.723	2024-05-13 22:02:52.723
M20423_3056	\N	f	t	f	\N	f	t	f	t	f	f	f	f	f	f	t	2024-05-20 22:46:22.019	2024-05-20 22:46:22.019
L364409_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:22.24	2024-05-20 22:46:22.24
A2937_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.394	2024-05-19 00:01:36.394
M33398_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:09.259	2024-05-13 22:03:09.259
A1938_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:13.997	2024-05-13 22:03:13.997
M437_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:10.06	2024-05-13 22:03:10.06
M33510_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 00:00:08.772	2024-05-20 00:00:08.772
M40467_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-24 00:00:15.918	2024-05-24 00:00:15.918
M34504_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-20 00:00:09.342	2024-05-20 00:00:09.342
M35394_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:05.573	2024-05-13 22:03:05.573
M2194_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:10.762	2024-05-13 22:03:10.762
M20732_3314	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-21 00:00:11.277	2024-05-21 00:00:11.277
M34376_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:11.395	2024-05-13 22:03:11.395
M5768_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:48.964	2024-05-13 22:02:48.964
A1146_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:58.393	2024-05-13 22:02:58.393
M32603_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.408	2024-05-13 22:03:12.408
M33396_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:17.44	2024-05-13 22:02:17.44
M19910_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:17.564	2024-05-13 22:02:17.564
M19834_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:50.954	2024-05-13 22:02:50.954
M40348_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:20.285	2024-05-13 22:02:20.285
M33548_3314	f	f	f	f	f	f	t	t	t	f	f	f	f	f	t	t	2024-05-13 22:03:07.454	2024-05-13 22:03:07.454
A350_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:17.833	2024-05-13 22:02:17.833
M40441_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:10.628	2024-05-13 22:02:10.628
M34480_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:03.838	2024-05-13 22:02:03.838
M16559_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:22.248	2024-05-19 00:01:22.248
M20187_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:59.419	2024-05-13 22:02:59.419
M4878_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:08.652	2024-05-13 22:03:08.652
M32878_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.327	2024-05-13 22:02:33.327
M32657_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:31.447	2024-05-13 22:02:31.447
M34997_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:11.347	2024-05-13 22:03:11.347
M859_3056	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:39.57	2024-05-13 21:21:39.57
M2030_3056	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:42.164	2024-05-13 21:21:42.164
M40851_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:08.9	2024-05-13 22:03:08.9
A293_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.495	2024-05-19 00:01:04.495
M18832_3314	f	t	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:52.673	2024-05-13 22:02:52.673
M2722_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-20 00:00:08.814	2024-05-20 00:00:08.814
A1227_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:52.735	2024-05-13 22:02:52.735
M7968_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.527	2024-05-13 22:03:08.527
M15134_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:08.217	2024-05-13 22:03:08.217
A3503_3056	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:49.519	2024-05-13 22:02:49.519
M40779_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:52.858	2024-05-13 22:02:52.858
M5794_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:09.023	2024-05-13 22:03:09.023
M32348_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:09.085	2024-05-13 22:03:09.085
M2488_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:02:13.718	2024-05-13 22:02:13.718
M40749_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:20.416	2024-05-13 22:02:20.416
M34487_3056	\N	\N	\N	\N	\N	\N	\N	\N	t	f	f	f	f	f	f	f	2024-05-19 00:01:04.226	2024-05-19 00:01:04.226
M10040_3056	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:16.386	2024-05-13 22:02:16.386
M39901_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:07.607	2024-05-19 00:01:07.607
M40851_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:12.527	2024-05-19 00:01:12.527
M33263_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.59	2024-05-19 00:01:12.59
M34532_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:13.539	2024-05-13 22:02:13.539
M32306_3056	f	f	f	f	t	f	t	f	\N	t	f	f	f	f	f	f	2024-05-13 22:03:08.016	2024-05-13 22:03:08.016
M21678_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-21 00:00:11.279	2024-05-21 00:00:11.279
M16738_3314	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-20 22:46:20.413	2024-05-20 22:46:20.413
M20888_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:17.546	2024-05-13 22:02:17.546
M34592_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-22 00:00:11.556	2024-05-22 00:00:11.556
M15121_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:11.983	2024-05-13 22:03:11.983
M19878_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.045	2024-05-13 22:03:12.045
M40802_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:03.655	2024-05-13 22:02:03.655
M599_3314	f	f	t	f	f	f	t	f	t	f	f	\N	f	f	f	t	2024-05-13 22:01:27.095	2024-05-13 22:01:27.095
M32981_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:23.311	2024-05-20 22:46:23.311
M21336_3056	f	f	t	f	f	f	f	f	t	f	f	\N	f	f	f	t	2024-05-13 22:02:18.542	2024-05-13 22:02:18.542
M20394_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:33.754	2024-05-19 00:01:33.754
M36741_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:20.988	2024-05-13 22:03:20.988
M40733_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:32.281	2024-05-19 00:01:32.281
M40854_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:00:14.694	2024-05-19 00:00:14.694
M10094_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:14.139	2024-05-13 22:02:14.139
M34445_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:07.334	2024-05-13 22:03:07.334
M32216_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:17.794	2024-05-13 22:02:17.794
M12296_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.735	2024-05-13 22:01:17.735
M20987_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:55.836	2024-05-13 22:01:55.836
M34596_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:03:21.115	2024-05-13 22:03:21.115
M4883_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:07.459	2024-05-13 22:03:07.459
M9520_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:17.826	2024-05-13 22:03:17.826
M14861-166386_3056	f	f	f	f	f	f	f	f	t	\N	\N	\N	f	f	t	t	2024-05-13 22:03:12.295	2024-05-13 22:03:12.295
A3228_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 22:03:10.976	2024-05-13 22:03:10.976
M41602_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-22 00:00:14.765	2024-05-22 00:00:14.765
M10690_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-22 00:00:14.995	2024-05-22 00:00:14.995
M4846_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:07.707	2024-05-13 22:03:07.707
M40529_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:03:14.224	2024-05-13 22:03:14.224
M40079_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:20.229	2024-05-13 22:02:20.229
M41604_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:21.356	2024-05-13 22:02:21.356
M33519_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:16.024	2024-05-13 22:03:16.024
M41036_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:20.269	2024-05-13 22:02:20.269
M39262_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:13.419	2024-05-13 22:02:13.419
M38848_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.093	2024-05-13 22:03:08.093
M34750_3314	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:16.086	2024-05-13 22:03:16.086
M10588_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:50.019	2024-05-13 22:02:50.019
M34504_3056	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-19 00:01:36.145	2024-05-19 00:01:36.145
M34755_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:34.088	2024-05-13 22:02:34.088
M1884_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:27.282	2024-05-13 22:01:27.282
A1076_3314	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:58.235	2024-05-13 22:02:58.235
M33409_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.368	2024-05-13 21:21:42.368
M34754_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.777	2024-05-19 00:01:36.777
M4878_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:04.591	2024-05-13 22:03:04.591
M9619_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:16.211	2024-05-13 22:03:16.211
M33729_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:51.004	2024-05-13 22:02:51.004
M21890_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:32.261	2024-05-13 22:02:32.261
M40905_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:10.78	2024-05-13 22:02:10.78
M34201_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:51.067	2024-05-13 22:02:51.067
M19281_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:04.56	2024-05-19 00:01:04.56
M21934_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:08.838	2024-05-13 22:03:08.838
M32256_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:46.858	2024-05-13 22:01:46.858
M38678_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:35.581	2024-05-19 00:01:35.581
M32954_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:35.578	2024-05-19 00:01:35.578
M41061_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:09.27	2024-05-13 22:03:09.27
M32321_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:35.641	2024-05-19 00:01:35.641
M40089_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:10.476	2024-05-13 22:03:10.476
M13844_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.497	2024-05-13 21:21:39.497
M35609_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-23 00:00:06.143	2024-05-23 00:00:06.143
M20114_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.148	2024-05-13 21:21:40.148
M38088_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:20.292	2024-05-13 22:02:20.292
M32554_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:03.899	2024-05-19 00:01:03.899
M19924_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:16.323	2024-05-13 22:02:16.323
M2969_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:09.979	2024-05-13 22:03:09.979
M32303_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-23 00:00:09.948	2024-05-23 00:00:09.948
M40676_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:46.49	2024-05-13 22:01:46.49
M34458_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.901	2024-05-13 22:02:33.901
M33009_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-23 00:00:16.841	2024-05-23 00:00:16.841
M20912_3056	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:59.296	2024-05-13 22:02:59.296
M34710_3056	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:02:51.191	2024-05-13 22:02:51.191
M40794_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-24 00:00:12.351	2024-05-24 00:00:12.351
M7975_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-24 00:00:16.126	2024-05-24 00:00:16.126
M19739_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:01:46.8	2024-05-13 22:01:46.8
M40358_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:20.99	2024-05-13 22:03:20.99
M19661_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:11.178	2024-05-13 22:03:11.178
M33856_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:12.409	2024-05-13 22:03:12.409
M20954_3314	f	f	f	f	f	f	t	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:20.405	2024-05-13 22:02:20.405
A721_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 00:00:08.815	2024-05-20 00:00:08.815
M21511_3314	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:10.631	2024-05-13 22:02:10.631
M20170_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:57.577	2024-05-13 22:02:57.577
M39531_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:57.639	2024-05-13 22:02:57.639
M4702_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.208	2024-05-19 00:01:04.208
M40494_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.483	2024-05-19 00:01:04.483
M8170_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:33.774	2024-05-19 00:01:33.774
M40785_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:33.329	2024-05-13 22:02:33.329
M33932_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-16 00:00:12.155	2024-05-16 00:00:12.155
M3411_3314	f	f	f	f	t	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:03.657	2024-05-13 22:02:03.657
M35479_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:52.668	2024-05-13 22:02:52.668
M40453_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:52.729	2024-05-13 22:02:52.729
M32660_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:10.781	2024-05-13 22:02:10.781
M33400_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:13.537	2024-05-13 22:02:13.537
M34447_3314	t	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:08.506	2024-05-13 22:03:08.506
M32499_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.997	2024-05-13 22:03:08.997
A1275_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:52.913	2024-05-13 22:02:52.913
M33769_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:32.268	2024-05-13 22:02:32.268
M20399_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:13.866	2024-05-13 22:02:13.866
M32988_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.553	2024-05-19 00:01:04.553
L341952_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.685	2024-05-13 21:21:42.685
M38765_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:22.31	2024-05-19 00:01:22.31
M3030_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:13.714	2024-05-13 22:02:13.714
M14304_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.478	2024-05-13 22:01:17.478
M20749_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.839	2024-05-13 22:02:33.839
M20956_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:02:20.332	2024-05-13 22:02:20.332
M40762_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:17.696	2024-05-13 22:02:17.696
M2349_3056	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:33.902	2024-05-13 22:02:33.902
M40151_3056	f	f	f	f	f	f	t	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:12.651	2024-05-19 00:01:12.651
M34477_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:52.974	2024-05-13 22:02:52.974
A229_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.899	2024-05-19 00:01:12.899
M38834_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:21.36	2024-05-13 22:02:21.36
A2863_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:59.584	2024-05-13 22:02:59.584
M11563_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:13.409	2024-05-13 22:02:13.409
M3685_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:27.558	2024-05-19 00:01:27.558
M41369_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:35.513	2024-05-19 00:01:35.513
M36582_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:27.619	2024-05-19 00:01:27.619
M19548_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:27.68	2024-05-19 00:01:27.68
M35805_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-20 00:00:09.131	2024-05-20 00:00:09.131
M41411_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:34.02	2024-05-19 00:01:34.02
M40859_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:34.081	2024-05-19 00:01:34.081
M19593_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:10.75	2024-05-13 22:03:10.75
M32355_3056	f	f	f	f	t	f	t	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:07.725	2024-05-13 22:03:07.725
M40674_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:42.304	2024-05-13 21:21:42.304
M40904_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:28.427	2024-05-19 00:01:28.427
M41526_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:52.606	2024-05-13 22:02:52.606
M14081_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:20.467	2024-05-13 22:02:20.467
M14535_3056	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:10.811	2024-05-13 22:03:10.811
M9906_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:21.485	2024-05-13 22:02:21.485
M33549_3314	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:58.254	2024-05-13 22:02:58.254
M21905_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:03:07.418	2024-05-13 22:03:07.418
M16589_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:03:16.025	2024-05-13 22:03:16.025
M8321_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:41.566	2024-05-13 21:21:41.566
A1058_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:10.995	2024-05-13 22:03:10.995
A3576_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:16.564	2024-05-13 22:02:16.564
M21939_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.765	2024-05-13 22:01:17.765
M12961_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-19 00:01:35.637	2024-05-19 00:01:35.637
L363988_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:20.621	2024-05-20 22:46:20.621
M20840_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:24.412	2024-05-19 00:01:24.412
M35726_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:57.331	2024-05-13 22:02:57.331
M32654_3314	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:08.199	2024-05-13 22:03:08.199
L341668_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:23.648	2024-05-20 22:46:23.648
M40765_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:02:17.509	2024-05-13 22:02:17.509
M40463_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.472	2024-05-13 22:03:12.472
M1883_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.276	2024-05-19 00:01:04.276
L340205_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:20.472	2024-05-20 22:46:20.472
M15119_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:16.211	2024-05-13 22:03:16.211
M38765_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:03:17.998	2024-05-13 22:03:17.998
M9744_3314	f	f	t	f	f	f	f	f	f	t	\N	\N	f	f	f	t	2024-05-13 22:03:16.273	2024-05-13 22:03:16.273
M33770_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:09.302	2024-05-13 22:03:09.302
M17308_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:17.821	2024-05-13 22:02:17.821
M16592_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:01:27.24	2024-05-13 22:01:27.24
A347_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:20.218	2024-05-13 22:02:20.218
M21804_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:03.92	2024-05-19 00:01:03.92
M40843_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:14.138	2024-05-13 22:02:14.138
M10182_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:01:46.862	2024-05-13 22:01:46.862
M3854_3314	f	f	f	f	f	f	f	f	t	f	\N	\N	f	f	t	t	2024-05-13 22:02:20.28	2024-05-13 22:02:20.28
M40547_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:05.757	2024-05-13 22:03:05.757
M33727_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:51.005	2024-05-13 22:02:51.005
M36641_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:08.382	2024-05-13 22:03:08.382
A3028_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:02:51.192	2024-05-13 22:02:51.192
M10090_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	f	f	f	t	t	2024-05-22 00:00:11.575	2024-05-22 00:00:11.575
M35731_3314	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:05.905	2024-05-13 22:02:05.905
M32573_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:11.092	2024-05-13 22:03:11.092
M18841_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-21 00:00:11.308	2024-05-21 00:00:11.308
M21975_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-21 00:00:12.93	2024-05-21 00:00:12.93
M32349_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:00:53.633	2024-05-19 00:00:53.633
M40931_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:10.636	2024-05-13 22:03:10.636
M33398_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:18.52	2024-05-13 22:02:18.52
M6847-165894_3056	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-23 00:00:07.361	2024-05-23 00:00:07.361
A368_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:08.629	2024-05-13 22:03:08.629
M36703_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:02:12.975	2024-05-13 22:02:12.975
M21578_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-24 00:00:12.352	2024-05-24 00:00:12.352
M289_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:27.106	2024-05-13 22:01:27.106
M14863_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-20 00:00:09.152	2024-05-20 00:00:09.152
M39656_3056	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-19 00:01:04.209	2024-05-19 00:01:04.209
M36628_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-19 00:01:07.91	2024-05-19 00:01:07.91
M2775_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:10.626	2024-05-13 22:03:10.626
M32316_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:27.271	2024-05-13 22:01:27.271
M41515_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:10.995	2024-05-13 22:03:10.995
A2815_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.867	2024-05-19 00:01:12.867
M34895_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	f	f	2024-05-13 22:02:03.662	2024-05-13 22:02:03.662
M9636_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:14.14	2024-05-13 22:02:14.14
M9615_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:33.806	2024-05-19 00:01:33.806
A2944_3314	f	f	f	f	f	f	t	f	t	f	\N	\N	f	f	t	t	2024-05-13 22:02:13.158	2024-05-13 22:02:13.158
M19488_3314	f	f	f	f	f	f	f	f	t	f	f	\N	f	f	t	t	2024-05-13 22:02:13.776	2024-05-13 22:02:13.776
M32737_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-23 00:00:09.947	2024-05-23 00:00:09.947
M22100_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:16.892	2024-05-19 00:01:16.892
M508_3314	f	f	t	f	f	f	f	f	t	f	f	\N	f	f	f	t	2024-05-13 22:02:52.575	2024-05-13 22:02:52.575
M10274_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:22.312	2024-05-19 00:01:22.312
M32651_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:24.086	2024-05-19 00:01:24.086
M14384_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:35.247	2024-05-19 00:01:35.247
A3043_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:14.449	2024-05-13 22:03:14.449
M33116_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-16 00:00:13.753	2024-05-16 00:00:13.753
M40955_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:20.415	2024-05-13 22:02:20.415
M14113_3314	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:42.663	2024-05-13 21:21:42.663
M37045_3314	f	f	t	f	f	f	f	f	f	f	f	f	f	f	f	t	2024-05-13 22:02:56.921	2024-05-13 22:02:56.921
M2340_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:20.225	2024-05-13 22:02:20.225
M1709_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:27.687	2024-05-19 00:01:27.687
M5722_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:28.204	2024-05-13 22:02:28.204
M32642_3056	\N	\N	\N	\N	\N	\N	\N	\N	t	f	f	f	f	f	f	f	2024-05-19 00:01:28.6	2024-05-19 00:01:28.6
M34527_3314	t	t	f	f	\N	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:52.888	2024-05-13 22:02:52.888
M15554_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:03.789	2024-05-13 22:02:03.789
M40342_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:13.031	2024-05-13 22:02:13.031
M22052_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.14	2024-05-19 00:01:36.14
M10587_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 21:21:42.787	2024-05-13 21:21:42.787
M1925_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.203	2024-05-19 00:01:36.203
M41126_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:13.419	2024-05-13 22:02:13.419
M19801_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:31.45	2024-05-13 22:02:31.45
M32380_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.779	2024-05-19 00:01:36.779
M36325_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.759	2024-05-13 22:03:17.759
M14820_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.826	2024-05-13 22:03:17.826
M368_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:46.149	2024-05-13 22:01:46.149
M39194_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:59.6	2024-05-13 22:02:59.6
M40825_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:15.648	2024-05-13 22:03:15.648
M20133_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:11.984	2024-05-13 22:03:11.984
M21943_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:09.525	2024-05-13 22:02:09.525
M35425_3056	\N	\N	\N	\N	t	\N	t	\N	t	f	f	\N	f	f	f	f	2024-05-13 22:02:33.838	2024-05-13 22:02:33.838
M32248_3314	f	f	f	f	\N	f	f	f	f	f	f	f	f	f	f	f	2024-05-13 22:03:16.033	2024-05-13 22:03:16.033
M34970_3314	f	f	f	f	f	f	t	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.725	2024-05-13 21:21:42.725
M20899_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:10.005	2024-05-13 22:03:10.005
L276724_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:20.64	2024-05-20 22:46:20.64
M40806_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-23 00:00:15.957	2024-05-23 00:00:15.957
M38230_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-20 22:46:21.96	2024-05-20 22:46:21.96
M41017_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:20.162	2024-05-13 22:02:20.162
M41058_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-20 22:46:22.26	2024-05-20 22:46:22.26
M21986_3314	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:03:07.442	2024-05-13 22:03:07.442
M18839_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:03:14.202	2024-05-13 22:03:14.202
M35575_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:51.012	2024-05-13 22:02:51.012
M32307_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:07.823	2024-05-13 22:03:07.823
M9876_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:33.859	2024-05-13 22:02:33.859
M40479_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-21 00:00:12.736	2024-05-21 00:00:12.736
M21332_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:56.09	2024-05-13 22:02:56.09
M2594_3314	\N	\N	t	\N	\N	\N	\N	\N	t	f	f	f	f	f	f	f	2024-05-13 22:02:58.238	2024-05-13 22:02:58.238
M9866_3314	f	f	t	f	f	f	f	f	f	t	\N	\N	f	f	f	t	2024-05-13 22:02:58.425	2024-05-13 22:02:58.425
M15286_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:14.028	2024-05-13 22:02:14.028
M19647_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-20 22:46:23.612	2024-05-20 22:46:23.612
M33367_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:58.71	2024-05-13 22:02:58.71
M19759_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:08.403	2024-05-13 22:03:08.403
M34535_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:15.965	2024-05-13 22:03:15.965
M32597_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:58.961	2024-05-13 22:02:58.961
M19952_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	f	f	f	f	2024-05-13 22:02:17.42	2024-05-13 22:02:17.42
M32256_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:03:21.134	2024-05-13 22:03:21.134
M18810_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:59.35	2024-05-13 22:02:59.35
M34755_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:08.157	2024-05-13 22:03:08.157
M32657_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 21:21:39.569	2024-05-13 21:21:39.569
M19746_3314	f	t	t	f	\N	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:08.218	2024-05-13 22:03:08.218
A5825_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 00:00:09.012	2024-05-20 00:00:09.012
M39018_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.652	2024-05-13 22:03:08.652
M15521_3314	f	f	t	f	f	f	f	f	f	t	f	\N	f	f	f	t	2024-05-13 22:02:52.951	2024-05-13 22:02:52.951
M33409_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:21.36	2024-05-13 22:02:21.36
M34461_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-21 00:00:11.546	2024-05-21 00:00:11.546
M20993_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:09.084	2024-05-13 22:03:09.084
M41010_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:16.274	2024-05-13 22:03:16.274
M17086_3314	t	f	t	f	f	t	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:52.7	2024-05-13 22:02:52.7
M39853_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:10.687	2024-05-13 22:03:10.687
M10734_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-22 00:00:11.575	2024-05-22 00:00:11.575
M40067_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-22 00:00:15.092	2024-05-22 00:00:15.092
M32360_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-20 00:00:08.882	2024-05-20 00:00:08.882
M35618_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-24 00:00:12.642	2024-05-24 00:00:12.642
A2184_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.356	2024-05-13 22:03:12.356
M40016_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:27.456	2024-05-13 22:01:27.456
M12320_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:13.956	2024-05-13 22:03:13.956
M35634_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:12.968	2024-05-13 22:02:12.968
M9722_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:14.079	2024-05-13 22:03:14.079
A1938_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:51.2	2024-05-13 22:02:51.2
M2787_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:08.221	2024-05-13 22:03:08.221
M20350_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.338	2024-05-19 00:01:04.338
M20104_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:17.548	2024-05-13 22:02:17.548
M41475_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.482	2024-05-19 00:01:04.482
M9513_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:57.027	2024-05-13 22:02:57.027
M36308_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:04.551	2024-05-19 00:01:04.551
M1997_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.439	2024-05-13 22:01:17.439
M2594_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:24.454	2024-05-13 22:01:24.454
A3192_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.375	2024-05-13 22:03:12.375
M36641_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:04.617	2024-05-19 00:01:04.617
M34431_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:04.269	2024-05-19 00:01:04.269
A5745_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:21.498	2024-05-13 22:02:21.498
M34474_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:33.492	2024-05-13 22:02:33.492
M37958_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:52.658	2024-05-13 22:02:52.658
M40879_3056	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:56.902	2024-05-13 22:02:56.902
M7975_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:31.465	2024-05-13 22:02:31.465
M21020_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:33.84	2024-05-19 00:01:33.84
M34865_3314	f	f	f	f	f	f	t	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:52.909	2024-05-13 22:02:52.909
M16488_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:33.872	2024-05-13 22:02:33.872
M20433_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:28.168	2024-05-13 22:02:28.168
M34425_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:28.231	2024-05-13 22:02:28.231
M14257_3314	f	f	f	f	f	f	t	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:52.783	2024-05-13 22:02:52.783
M20327_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:33.902	2024-05-19 00:01:33.902
M14864_3056	f	f	f	f	f	f	f	f	t	f	\N	\N	f	f	t	t	2024-05-13 22:02:28.295	2024-05-13 22:02:28.295
M32316_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:14.418	2024-05-13 22:03:14.418
M16625_3314	f	f	t	f	f	t	t	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:13.773	2024-05-13 22:02:13.773
M14858_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:13.875	2024-05-13 22:02:13.875
M2488_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:12.448	2024-05-19 00:01:12.448
M32678_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.51	2024-05-19 00:01:12.51
M398_3314	t	f	t	f	f	f	t	f	t	f	\N	\N	f	f	f	t	2024-05-13 21:21:42.644	2024-05-13 21:21:42.644
M36071_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:16.322	2024-05-13 22:02:16.322
A2008_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.885	2024-05-19 00:01:12.885
M4595_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:42.458	2024-05-13 21:21:42.458
M19998_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:05.587	2024-05-13 22:03:05.587
M16684_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:46.104	2024-05-13 22:01:46.104
M21584_3056	f	f	f	f	f	f	t	f	f	f	f	f	f	f	t	t	2024-05-20 22:46:21.953	2024-05-20 22:46:21.953
M19303_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:11.996	2024-05-13 22:03:11.996
M34461_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.572	2024-05-19 00:01:12.572
L97521_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:20.679	2024-05-20 22:46:20.679
M9958_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:10.781	2024-05-13 22:02:10.781
M33534_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 21:21:41.628	2024-05-13 21:21:41.628
M11770_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:04.417	2024-05-19 00:01:04.417
M32414_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:08.026	2024-05-13 22:03:08.026
M3863_3056	t	f	f	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-19 00:01:24.085	2024-05-19 00:01:24.085
M38600_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:18.458	2024-05-13 22:02:18.458
M20732_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:10.666	2024-05-13 22:03:10.666
M36073_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-20 00:00:09.008	2024-05-20 00:00:09.008
M36204_3314	f	f	f	f	f	f	f	t	f	f	f	f	f	f	t	t	2024-05-13 22:03:08.667	2024-05-13 22:03:08.667
M10569_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:24.151	2024-05-19 00:01:24.151
M40850_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:51.028	2024-05-13 22:02:51.028
M34605_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:21.153	2024-05-13 22:03:21.153
M16360_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:59.291	2024-05-13 22:02:59.291
M40803_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:28.598	2024-05-19 00:01:28.598
M41118_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:24.838	2024-05-13 22:01:24.838
M40455_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:21.372	2024-05-13 22:02:21.372
M9513_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:09.486	2024-05-13 22:02:09.486
M34112_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-21 00:00:12.598	2024-05-21 00:00:12.598
M32329_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:24.856	2024-05-13 22:01:24.856
A3193_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:59.541	2024-05-13 22:02:59.541
M41549_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:03:17.262	2024-05-13 22:03:17.262
M21866_3056	f	f	f	f	\N	f	t	f	t	f	f	f	f	f	t	t	2024-05-19 00:01:24.525	2024-05-19 00:01:24.525
M40399_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:16.057	2024-05-13 22:03:16.057
M20954_3056	f	f	f	f	f	f	t	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:24.706	2024-05-13 22:01:24.706
M4906_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:03.662	2024-05-13 22:02:03.662
M4318_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:15.649	2024-05-13 22:03:15.649
M35249_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:00:54.737	2024-05-13 22:00:54.737
A209_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:17.649	2024-05-13 22:02:17.649
M36792_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-23 00:00:15.686	2024-05-23 00:00:15.686
M18879_3314	f	f	t	f	f	t	f	f	f	\N	f	f	f	f	f	f	2024-05-13 22:03:09.111	2024-05-13 22:03:09.111
M21053_3056	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:33.809	2024-05-13 22:02:33.809
M39852_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:07.674	2024-05-19 00:01:07.674
M33009_3056	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:11.046	2024-05-13 22:03:11.046
A787_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:34.133	2024-05-13 22:02:34.133
M33411_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:51.158	2024-05-13 22:02:51.158
M20555_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:48.872	2024-05-13 22:02:48.872
M14255_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-20 00:00:08.82	2024-05-20 00:00:08.82
M21748_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:33.935	2024-05-13 22:02:33.935
A3044_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-22 00:00:11.595	2024-05-22 00:00:11.595
M40392_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:17.485	2024-05-13 22:02:17.485
M19631_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:07.455	2024-05-13 22:03:07.455
M34201_3314	t	f	t	f	f	f	t	f	t	f	f	\N	f	f	f	t	2024-05-13 22:02:09.735	2024-05-13 22:02:09.735
M21257_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:20.414	2024-05-13 22:02:20.414
M21061_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.007	2024-05-13 22:03:17.007
M3501_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:57.276	2024-05-13 22:02:57.276
M40906_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-23 00:00:16.673	2024-05-23 00:00:16.673
M34358_3056	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:12.059	2024-05-13 22:03:12.059
M9651_3056	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:07.707	2024-05-13 22:03:07.707
M33103_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:07.776	2024-05-13 22:03:07.776
M32322_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:48.561	2024-05-13 22:01:48.561
M9729_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:48.712	2024-05-13 22:02:48.712
M19967_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:16.247	2024-05-13 22:03:16.247
M14342_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-20 00:00:08.898	2024-05-20 00:00:08.898
M36310_3056	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	2024-05-13 22:02:58.71	2024-05-13 22:02:58.71
A4290_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.823	2024-05-19 00:01:12.823
M33279_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:04.276	2024-05-19 00:01:04.276
M39587_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	f	t	2024-05-13 22:02:48.863	2024-05-13 22:02:48.863
A347_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:01:25.025	2024-05-13 22:01:25.025
M4214_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.462	2024-05-13 21:21:42.462
M32205_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 21:21:42.586	2024-05-13 21:21:42.586
L352998_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.336	2024-05-13 21:21:42.336
M3828_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:03:20.301	2024-05-13 22:03:20.301
M38834_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:32.318	2024-05-13 22:02:32.318
M19921_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:56.641	2024-05-13 22:02:56.641
M36809_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.634	2024-05-19 00:01:12.634
M40908_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:16.277	2024-05-13 22:03:16.277
M40758_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-21 00:00:11.498	2024-05-21 00:00:11.498
M12296_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:20.417	2024-05-13 22:02:20.417
M9791_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:03:16.215	2024-05-13 22:03:16.215
M40795_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:20.55	2024-05-13 22:03:20.55
L284444_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.711	2024-05-13 21:21:42.711
M41514_3056	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:12.885	2024-05-19 00:01:12.885
M17162_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:33.842	2024-05-19 00:01:33.842
M20983_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:27.584	2024-05-19 00:01:27.584
M21330_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:46.106	2024-05-13 22:01:46.106
M41617_3056	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-19 00:01:08.128	2024-05-19 00:01:08.128
A3040_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:14.156	2024-05-13 22:02:14.156
M39263_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:21.153	2024-05-13 22:03:21.153
M10015_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:14.039	2024-05-13 22:02:14.039
M40459_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:18.488	2024-05-13 22:02:18.488
M21076_3314	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-13 22:02:17.429	2024-05-13 22:02:17.429
M40999_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:17.491	2024-05-13 22:02:17.491
M21036_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-21 00:00:12.684	2024-05-21 00:00:12.684
M16226_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:21.946	2024-05-20 22:46:21.946
M10266_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:24.152	2024-05-19 00:01:24.152
M33147_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:12.055	2024-05-13 22:03:12.055
M10734_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:24.52	2024-05-13 22:01:24.52
M33093_3314	f	f	t	f	f	f	f	f	f	t	\N	\N	f	f	f	t	2024-05-13 22:02:30.584	2024-05-13 22:02:30.584
M20924_3056	f	f	f	f	f	f	f	f	t	f	f	\N	f	f	t	t	2024-05-13 22:03:12.117	2024-05-13 22:03:12.117
M596_3056	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:39.467	2024-05-13 21:21:39.467
M41055_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:52.707	2024-05-13 22:02:52.707
M3040_3056	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	2024-05-13 21:21:41.552	2024-05-13 21:21:41.552
A1143_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.366	2024-05-13 22:03:12.366
M34685_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:03:10.246	2024-05-13 22:03:10.246
M40141_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:42.079	2024-05-13 21:21:42.079
M20398_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:05.539	2024-05-13 22:03:05.539
M15674_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:09.996	2024-05-13 22:03:09.996
M2328_3056	f	f	t	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:03:05.602	2024-05-13 22:03:05.602
M21053_3314	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:03:08.248	2024-05-13 22:03:08.248
M21070_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-19 00:01:35.456	2024-05-19 00:01:35.456
M40920_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:17.996	2024-05-13 22:02:17.996
M39850_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-22 00:00:14.68	2024-05-22 00:00:14.68
M37959_3056	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:33.796	2024-05-13 22:02:33.796
M37808_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 00:00:09.137	2024-05-20 00:00:09.137
M9497_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-20 00:00:09.323	2024-05-20 00:00:09.323
M14330_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:10.746	2024-05-13 22:03:10.746
M3872_3314	f	f	f	f	f	f	f	f	t	f	\N	\N	f	f	t	t	2024-05-13 22:03:07.458	2024-05-13 22:03:07.458
M19891_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-22 00:00:14.754	2024-05-22 00:00:14.754
M20861_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.143	2024-05-19 00:01:36.143
M35576_3056	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-19 00:01:36.205	2024-05-19 00:01:36.205
M32949_3056	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	f	f	2024-05-13 22:03:07.708	2024-05-13 22:03:07.708
M9894_3056	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:07.771	2024-05-13 22:03:07.771
M41066_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.499	2024-05-19 00:01:04.499
M32304_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:15.569	2024-05-13 22:03:15.569
M20195_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:03:12.49	2024-05-13 22:03:12.49
M32354_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-23 00:00:15.72	2024-05-23 00:00:15.72
M20912_3314	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:03:15.648	2024-05-13 22:03:15.648
M38830_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:30.46	2024-05-13 22:02:30.46
M38581_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:59.541	2024-05-13 22:02:59.541
A1054_3056	f	f	f	f	f	t	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:02:59.604	2024-05-13 22:02:59.604
M41612_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-23 00:00:15.908	2024-05-23 00:00:15.908
A5762_3056	t	f	f	f	f	t	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:05.799	2024-05-13 22:03:05.799
M19760_3314	f	f	f	f	f	f	f	f	t	f	f	t	f	f	t	t	2024-05-13 22:02:10.539	2024-05-13 22:02:10.539
M33147_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:07.645	2024-05-13 22:03:07.645
M14638_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.528	2024-05-13 21:21:39.528
M40924_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:10.63	2024-05-13 22:02:10.63
M14599_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.499	2024-05-13 21:21:39.499
M14343_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.695	2024-05-13 21:21:41.695
M10076_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:03.831	2024-05-13 22:02:03.831
M34753_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:16.029	2024-05-13 22:03:16.029
M5804_3056	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:42.141	2024-05-13 21:21:42.141
A5808_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:14.925	2024-05-13 22:03:14.925
A435_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:12.294	2024-05-13 22:03:12.294
M21957_3056	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:34.008	2024-05-19 00:01:34.008
M33876_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-20 00:00:09.138	2024-05-20 00:00:09.138
M10645_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:52.968	2024-05-13 22:02:52.968
M41549_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-21 00:00:11.545	2024-05-21 00:00:11.545
A3044_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:08.06	2024-05-13 22:03:08.06
M9665_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:20.362	2024-05-13 22:03:20.362
M40715_3056	f	f	f	f	t	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:04.417	2024-05-19 00:01:04.417
M40998_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:04.482	2024-05-19 00:01:04.482
M40917_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:04.549	2024-05-19 00:01:04.549
M36071_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:21.354	2024-05-13 22:02:21.354
M39651_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:12.509	2024-05-19 00:01:12.509
M20023_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.144	2024-05-13 21:21:42.144
M6479_3056	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-19 00:01:12.571	2024-05-19 00:01:12.571
M19824_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.633	2024-05-19 00:01:12.633
M15078_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.092	2024-05-13 22:03:12.092
A283_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-19 00:01:12.822	2024-05-19 00:01:12.822
A721_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:59.019	2024-05-13 22:02:59.019
M3863_3314	t	f	f	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:52.661	2024-05-13 22:02:52.661
M9294_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:20.4	2024-05-13 22:02:20.4
M32323_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:16.883	2024-05-19 00:01:16.883
M40425_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:03:12.029	2024-05-13 22:03:12.029
M40042_3314	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 21:21:42.718	2024-05-13 21:21:42.718
M32671_3314	t	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-21 00:00:12.685	2024-05-21 00:00:12.685
M35805_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:36.086	2024-05-19 00:01:36.086
M40310_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:12.942	2024-05-13 22:02:12.942
M13972_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:03:10.011	2024-05-13 22:03:10.011
M34584_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:56.642	2024-05-13 22:02:56.642
A2858_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.345	2024-05-13 22:03:12.345
A197_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:17.667	2024-05-13 22:02:17.667
M12519_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:03:03.121	2024-05-13 22:03:03.121
M21047_3056	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:18.472	2024-05-13 22:02:18.472
M10060_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:27.644	2024-05-19 00:01:27.644
M21890_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:21.951	2024-05-20 22:46:21.951
M14883_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:13.976	2024-05-13 22:03:13.976
M32231_3314	f	f	f	f	\N	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:07.459	2024-05-13 22:03:07.459
M35575_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:48.902	2024-05-13 22:02:48.902
A611_3314	f	f	t	f	f	f	f	f	f	t	f	\N	f	f	f	t	2024-05-13 22:03:07.583	2024-05-13 22:03:07.583
M19949_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:10.636	2024-05-13 22:03:10.636
M35618_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:48.735	2024-05-13 22:02:48.735
M40427_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-23 00:00:15.768	2024-05-23 00:00:15.768
M19288_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:57.639	2024-05-13 22:02:57.639
M11315_3056	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:33.9	2024-05-13 22:02:33.9
M10274_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:57.27	2024-05-13 22:02:57.27
M13541_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:10.776	2024-05-13 22:02:10.776
M21926_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:58.252	2024-05-13 22:02:58.252
M6529_3314	f	f	f	f	f	f	f	f	t	f	f	\N	f	f	t	t	2024-05-13 22:03:08.375	2024-05-13 22:03:08.375
M2007_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.438	2024-05-13 21:21:39.438
M34422_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:58.437	2024-05-13 22:02:58.437
M713_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:24.535	2024-05-13 22:01:24.535
M40710_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:13.853	2024-05-13 22:02:13.853
M40801_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:08.5	2024-05-13 22:03:08.5
M32948_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:03:08.562	2024-05-13 22:03:08.562
M36753_3314	t	t	t	f	\N	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:26.642	2024-05-13 22:03:26.642
M33275_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:24.479	2024-05-19 00:01:24.479
M21921_3314	t	f	f	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-22 00:00:14.767	2024-05-22 00:00:14.767
M20595_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-20 00:00:09.324	2024-05-20 00:00:09.324
M33401_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:08.749	2024-05-13 22:03:08.749
M32832_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:10.699	2024-05-13 22:03:10.699
M36727_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:17.977	2024-05-13 22:02:17.977
M9958_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:10.717	2024-05-13 22:03:10.717
M40821_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:15.843	2024-05-13 22:03:15.843
M9615_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.593	2024-05-13 21:21:42.593
M40749_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:46.516	2024-05-13 22:01:46.516
M36624_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:03:11.016	2024-05-13 22:03:11.016
M40004_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:31.014	2024-05-13 22:02:31.014
M33279_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:02:13.614	2024-05-13 22:02:13.614
M3379_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.805	2024-05-13 22:03:17.805
M40079_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:42.34	2024-05-13 21:21:42.34
M34419_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:14.01	2024-05-13 22:02:14.01
M21372_3314	f	f	t	f	f	f	f	f	f	t	f	t	f	f	f	t	2024-05-13 22:02:52.6	2024-05-13 22:02:52.6
M6475_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:07.776	2024-05-13 22:03:07.776
M33627_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:16.031	2024-05-13 22:03:16.031
M35425_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:53.029	2024-05-13 22:02:53.029
M33496_3314	f	f	f	f	t	f	t	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:09.065	2024-05-13 22:03:09.065
M32348_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:01:27.218	2024-05-13 22:01:27.218
M19585_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:10.54	2024-05-13 22:02:10.54
M13237_3056	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:01:27.281	2024-05-13 22:01:27.281
A5800_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:10.777	2024-05-13 22:02:10.777
M32830_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:14.349	2024-05-13 22:03:14.349
M6479_3314	t	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	t	2024-05-13 22:02:13.297	2024-05-13 22:02:13.297
M2345_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-16 00:00:11.909	2024-05-16 00:00:11.909
M40496_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:03.833	2024-05-13 22:02:03.833
M34943_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-16 00:00:12.077	2024-05-16 00:00:12.077
A3043_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:14.942	2024-05-13 22:03:14.942
M39630_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:02:56.209	2024-05-13 22:02:56.209
M3742_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:20.279	2024-05-13 22:02:20.279
M21356_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:10.62	2024-05-13 22:03:10.62
M9650_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.592	2024-05-13 21:21:42.592
L335737_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-20 22:46:22.182	2024-05-20 22:46:22.182
M22115_3314	f	f	f	f	f	f	t	f	t	f	f	\N	f	f	t	t	2024-05-13 22:02:48.902	2024-05-13 22:02:48.902
M32404_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:58.96	2024-05-13 22:02:58.96
M35609_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:51.094	2024-05-13 22:02:51.094
M37127_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.462	2024-05-19 00:01:12.462
M41200_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.327	2024-05-13 22:02:33.327
M4214_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:42.081	2024-05-13 21:21:42.081
M40934_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:16.274	2024-05-13 22:03:16.274
M20013_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:42.146	2024-05-13 21:21:42.146
M40947_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:12.896	2024-05-19 00:01:12.896
M7449_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:10.682	2024-05-13 22:03:10.682
A2865_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:34.044	2024-05-19 00:01:34.044
M40908_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:01:27.643	2024-05-19 00:01:27.643
M34425_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:15.902	2024-05-13 22:03:15.902
M41494_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:27.891	2024-05-19 00:01:27.891
M19848_3056	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:02:28.395	2024-05-13 22:02:28.395
M36146_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:11.983	2024-05-13 22:03:11.983
M38387_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:33.775	2024-05-13 22:02:33.775
M34546_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:11.544	2024-05-13 22:03:11.544
M9786_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:25.317	2024-05-13 22:01:25.317
M20953_3314	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:17.508	2024-05-13 22:02:17.508
M40090_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.046	2024-05-13 22:03:12.046
M37394_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:35.513	2024-05-19 00:01:35.513
M2194_3314	t	f	t	f	f	f	t	f	t	f	f	\N	f	f	f	t	2024-05-13 22:03:17.771	2024-05-13 22:03:17.771
M40511_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:10.251	2024-05-13 22:03:10.251
M41138_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:30.452	2024-05-13 22:02:30.452
M35013_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:35.574	2024-05-19 00:01:35.574
M40967_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:08.91	2024-05-13 22:03:08.91
M2340_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-15 00:00:13.356	2024-05-15 00:00:13.356
M21327_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:31.602	2024-05-19 00:01:31.602
M40919_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:17.695	2024-05-13 22:02:17.695
A4385_3056	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:12.355	2024-05-13 22:03:12.355
M37958_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.081	2024-05-19 00:01:36.081
M9616_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-19 00:01:36.144	2024-05-19 00:01:36.144
A2941_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:18.705	2024-05-13 22:02:18.705
M9650_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.571	2024-05-13 21:21:41.571
M34582_3314	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:52.657	2024-05-13 22:02:52.657
M40911_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:57.306	2024-05-13 22:02:57.306
M10588_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:01:45.988	2024-05-13 22:01:45.988
M16593_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:07.69	2024-05-13 22:03:07.69
M21677_3314	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-20 00:00:09.386	2024-05-20 00:00:09.386
A3046_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-21 00:00:11.547	2024-05-21 00:00:11.547
M21184_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:07.756	2024-05-13 22:03:07.756
M34442_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:14.448	2024-05-13 22:03:14.448
M10503_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:57.823	2024-05-13 22:02:57.823
M41604_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:31.639	2024-05-13 22:02:31.639
M21741_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:10.628	2024-05-13 22:03:10.628
M40528_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:16.565	2024-05-13 22:02:16.565
M15073_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:52.907	2024-05-13 22:02:52.907
M34957_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:46.806	2024-05-13 22:01:46.806
A3201_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:11.051	2024-05-13 22:03:11.051
M34450_3056	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-13 22:03:07.832	2024-05-13 22:03:07.832
M9766_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:03:14.756	2024-05-13 22:03:14.756
M21853_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:12.294	2024-05-13 22:03:12.294
M9905_3056	f	f	t	f	f	f	f	f	f	t	\N	\N	f	f	f	t	2024-05-13 22:02:58.772	2024-05-13 22:02:58.772
L221951_3314	t	f	t	f	f	f	f	f	f	t	f	\N	f	f	f	t	2024-05-13 22:03:13.934	2024-05-13 22:03:13.934
M20955_3314	f	f	f	f	f	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:03.842	2024-05-13 22:02:03.842
M32404_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-23 00:00:15.903	2024-05-23 00:00:15.903
M32743_3314	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-23 00:00:16.653	2024-05-23 00:00:16.653
M15122_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.471	2024-05-13 22:03:08.471
M36744_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:03:08.6	2024-05-13 22:03:08.6
M39007_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	f	f	2024-05-13 22:03:08.662	2024-05-13 22:03:08.662
M19856_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:52.844	2024-05-13 22:02:52.844
M15063_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:03:08.848	2024-05-13 22:03:08.848
M39457_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:46.502	2024-05-13 22:01:46.502
M33864_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:02:52.719	2024-05-13 22:02:52.719
M20842_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:27.241	2024-05-13 22:01:27.241
M21741_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:10.629	2024-05-13 22:02:10.629
M39640_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:51.219	2024-05-13 22:02:51.219
M19781_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:17.82	2024-05-13 22:02:17.82
M20846_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.017	2024-05-13 22:03:17.017
M36069_3314	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:15.649	2024-05-13 22:03:15.649
M32632_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:16.026	2024-05-13 22:03:16.026
A5762_3314	t	f	f	f	f	t	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:13.408	2024-05-13 22:02:13.408
M20174_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:13.536	2024-05-13 22:02:13.536
M12167_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:49.403	2024-05-13 22:02:49.403
M33496_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.377	2024-05-13 22:01:17.377
M33459_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:21.346	2024-05-13 22:02:21.346
M214_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:46.178	2024-05-13 22:01:46.178
M40319_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:09.965	2024-05-13 22:03:09.965
M20278_3314	t	f	t	f	\N	f	t	f	t	f	f	f	f	f	f	f	2024-05-13 21:21:42.656	2024-05-13 21:21:42.656
L363965_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 21:21:42.081	2024-05-13 21:21:42.081
M34463_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:36.149	2024-05-19 00:01:36.149
M9849_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:33.49	2024-05-13 22:02:33.49
M32244_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:01:36.779	2024-05-19 00:01:36.779
M40443_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.378	2024-05-13 22:01:17.378
M14912_3056	t	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	2024-05-13 22:02:18.643	2024-05-13 22:02:18.643
M38551_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:58.77	2024-05-13 22:02:58.77
M32501_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:52.577	2024-05-13 22:02:52.577
M32313_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:52.639	2024-05-13 22:02:52.639
M38042_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:52.702	2024-05-13 22:02:52.702
M32739_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:05.53	2024-05-13 22:03:05.53
M41017_3056	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:01:46.503	2024-05-13 22:01:46.503
M41036_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 21:21:41.757	2024-05-13 21:21:41.757
M2351_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.025	2024-05-13 21:21:40.025
M32679_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:59.288	2024-05-13 22:02:59.288
M4277_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-21 00:00:12.685	2024-05-21 00:00:12.685
M21084_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:51.146	2024-05-13 22:02:51.146
M20103_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:17.509	2024-05-13 22:02:17.509
M10072_3056	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:03:05.592	2024-05-13 22:03:05.592
M40068_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:18.703	2024-05-13 22:02:18.703
M14883_3056	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:03:10.903	2024-05-13 22:03:10.903
M21341_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.496	2024-05-19 00:01:12.496
M1942_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-15 00:00:13.36	2024-05-15 00:00:13.36
M19737-166513_3314	f	f	f	f	f	f	f	f	f	\N	\N	\N	f	f	t	t	2024-05-13 22:03:17.927	2024-05-13 22:03:17.927
M2361_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:12.622	2024-05-19 00:01:12.622
M2677_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	f	f	2024-05-13 22:02:13.726	2024-05-13 22:02:13.726
M32249_3056	f	f	f	f	\N	f	f	f	f	f	f	f	f	f	f	f	2024-05-13 22:03:20.302	2024-05-13 22:03:20.302
M40400_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:12.81	2024-05-19 00:01:12.81
M9706_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:02:33.887	2024-05-13 22:02:33.887
M10053_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:48.536	2024-05-13 22:01:48.536
M4892_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:57.231	2024-05-13 22:02:57.231
A3247_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:11.029	2024-05-13 22:03:11.029
M32582_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:18.114	2024-05-13 22:03:18.114
M19840_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:57.668	2024-05-13 22:02:57.668
M19908_3314	f	f	t	f	f	f	f	f	t	f	f	\N	f	f	f	t	2024-05-13 22:02:14.017	2024-05-13 22:02:14.017
M10401_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:17.696	2024-05-13 22:02:17.696
M34452_3314	\N	\N	\N	\N	\N	\N	\N	\N	t	f	f	f	f	f	f	f	2024-05-13 22:02:14.139	2024-05-13 22:02:14.139
M20943_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:33.797	2024-05-13 22:02:33.797
A3203_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:18.756	2024-05-13 22:02:18.756
M9519_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:01:27.179	2024-05-13 22:01:27.179
M14363_3314	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:02:52.764	2024-05-13 22:02:52.764
M14195_3056	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:02:18.516	2024-05-13 22:02:18.516
M32740_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:07.7	2024-05-13 22:03:07.7
M32349_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:14.174	2024-05-13 22:03:14.174
M19679_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:56.643	2024-05-13 22:02:56.643
M4277_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:01:27.891	2024-05-19 00:01:27.891
M10266_3314	t	f	f	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:58.361	2024-05-13 22:02:58.361
M20596_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.237	2024-05-13 22:03:08.237
M20174_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-15 00:00:13.542	2024-05-15 00:00:13.542
A4872_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:15.646	2024-05-13 22:03:15.646
M21375_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:58.236	2024-05-13 22:02:58.236
M34533_3314	f	f	f	f	f	f	f	f	f	t	\N	\N	f	f	t	t	2024-05-13 22:02:17.759	2024-05-13 22:02:17.759
M32554_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-21 00:00:12.916	2024-05-21 00:00:12.916
M19874_3314	t	\N	t	\N	\N	\N	\N	\N	t	f	f	f	f	f	f	t	2024-05-15 00:00:14.143	2024-05-15 00:00:14.143
M2983_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:17.822	2024-05-13 22:02:17.822
M36652_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-23 00:00:15.955	2024-05-23 00:00:15.955
M37189_3314	t	f	t	f	f	f	f	f	t	f	f	\N	f	f	f	t	2024-05-13 22:03:14.112	2024-05-13 22:03:14.112
M19864_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:58.832	2024-05-13 22:02:58.832
M9126_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.506	2024-05-13 22:01:17.506
M13924_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.428	2024-05-13 22:03:08.428
A2944_3056	f	f	f	f	f	f	t	f	t	f	\N	\N	f	f	t	t	2024-05-13 22:02:59.019	2024-05-13 22:02:59.019
M19842_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	t	t	2024-05-13 22:03:08.678	2024-05-13 22:03:08.678
M14861-166387_3056	f	f	f	f	f	f	f	f	t	\N	\N	\N	f	f	t	t	2024-05-13 22:03:12.296	2024-05-13 22:03:12.296
M861_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:12.972	2024-05-13 22:02:12.972
M40676_3314	f	f	t	f	f	f	f	f	t	f	\N	\N	f	f	f	t	2024-05-13 22:02:49.943	2024-05-13 22:02:49.943
A287_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:02:13.097	2024-05-13 22:02:13.097
M20696_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	t	2024-05-13 22:03:12.358	2024-05-13 22:03:12.358
M16572_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:12.421	2024-05-13 22:03:12.421
M9560_3314	f	f	f	f	f	f	f	f	f	t	f	\N	f	f	t	t	2024-05-13 22:02:52.952	2024-05-13 22:02:52.952
M21174_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:08.993	2024-05-13 22:03:08.993
M32306_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:14.362	2024-05-13 22:03:14.362
M39651_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:17.865	2024-05-13 22:03:17.865
M11539_3314	f	f	t	f	f	f	f	f	f	t	\N	\N	f	f	f	t	2024-05-13 22:03:14.424	2024-05-13 22:03:14.424
M14289_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:03:16.094	2024-05-13 22:03:16.094
M21938_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	2024-05-13 22:01:25.342	2024-05-13 22:01:25.342
M4949_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:16.364	2024-05-13 22:02:16.364
M179_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:33.775	2024-05-13 22:02:33.775
M19735_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.024	2024-05-13 21:21:40.024
M2027_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.025	2024-05-13 21:21:40.025
M34462_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:28.205	2024-05-13 22:02:28.205
M40418_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.102	2024-05-13 21:21:40.102
M8170_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.28	2024-05-13 21:21:40.28
M35712_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:41.566	2024-05-13 21:21:41.566
M14571_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.668	2024-05-13 21:21:41.668
L331357_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:51.061	2024-05-13 22:02:51.061
M1461_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:42.706	2024-05-13 21:21:42.706
M14342_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.68	2024-05-13 21:21:41.68
M6578_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.692	2024-05-13 21:21:41.692
M19735_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.729	2024-05-13 21:21:41.729
M32272_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-21 00:00:12.913	2024-05-21 00:00:12.913
M36634_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:58.708	2024-05-13 22:02:58.708
M20988_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:00:55.613	2024-05-19 00:00:55.613
M20953_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:01:17.701	2024-05-13 22:01:17.701
M14647_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:59.851	2024-05-13 22:02:59.851
M34479_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:58.775	2024-05-13 22:02:58.775
M398_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:00:54.656	2024-05-13 22:00:54.656
M32324_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:45.99	2024-05-13 22:01:45.99
A2935_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:00:55.86	2024-05-19 00:00:55.86
M10053_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:14.038	2024-05-13 22:02:14.038
M2787_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:12.417	2024-05-13 22:03:12.417
M19303_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-23 00:00:16.69	2024-05-23 00:00:16.69
M9636_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:48.533	2024-05-13 22:01:48.533
M6570_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:05.974	2024-05-13 22:02:05.974
A3459_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 22:03:17.22	2024-05-13 22:03:17.22
M34241_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.754	2024-05-13 21:21:41.754
M713_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:19.342	2024-05-13 22:02:19.342
A212_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:00:12.213	2024-05-19 00:00:12.213
M8004_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:20.457	2024-05-13 22:02:20.457
M34422_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:03:10.743	2024-05-13 22:03:10.743
M40472_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:24.802	2024-05-13 22:01:24.802
M20106_3056	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-13 22:01:24.98	2024-05-13 22:01:24.98
M2030_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.043	2024-05-13 21:21:40.043
M18748_3314	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 21:21:42.438	2024-05-13 21:21:42.438
M20662_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:18.456	2024-05-13 22:02:18.456
M39261_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:16.384	2024-05-13 22:02:16.384
M20595_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:59.354	2024-05-13 22:02:59.354
M19842_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:01:24.555	2024-05-13 22:01:24.555
M6943_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:09.711	2024-05-13 22:02:09.711
M14301_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:40.112	2024-05-13 21:21:40.112
A3040_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:02:16.575	2024-05-13 22:02:16.575
M39262_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.902	2024-05-13 22:02:33.902
M32320_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:48.717	2024-05-13 22:02:48.717
M14598_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.768	2024-05-13 21:21:42.768
M6578_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.174	2024-05-13 21:21:40.174
M40078_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:41.751	2024-05-13 21:21:41.751
M7941_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:40.27	2024-05-13 21:21:40.27
M21906_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:42.669	2024-05-13 21:21:42.669
M34519_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.423	2024-05-13 21:21:39.423
M33062_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:00:54.573	2024-05-13 22:00:54.573
M19054_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:00:54.457	2024-05-13 22:00:54.457
M16738_3056	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 22:01:17.444	2024-05-13 22:01:17.444
M40391_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:17.383	2024-05-13 22:01:17.383
M21375_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:41.547	2024-05-13 21:21:41.547
A1143_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:19.404	2024-05-13 22:02:19.404
M21503_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:18.457	2024-05-13 22:02:18.457
M20948_3314	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	f	2024-05-13 21:21:40.142	2024-05-13 21:21:40.142
M14599_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.747	2024-05-13 21:21:42.747
M21049_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:12.439	2024-05-13 22:03:12.439
M6574_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.209	2024-05-13 21:21:40.209
M8321_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.274	2024-05-13 21:21:40.274
M33062_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:42.682	2024-05-13 21:21:42.682
M34970_3056	f	f	f	f	f	f	t	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.418	2024-05-13 21:21:39.418
M33241_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:00:54.736	2024-05-13 22:00:54.736
M15668_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.521	2024-05-13 21:21:39.521
M2027_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:33.92	2024-05-13 22:02:33.92
M15473_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:00.317	2024-05-13 22:03:00.317
M9519_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:01:46.14	2024-05-13 22:01:46.14
A1087_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:58.715	2024-05-13 22:02:58.715
M14363_3056	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:41.627	2024-05-13 21:21:41.627
M6847_3056	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:41.63	2024-05-13 21:21:41.63
M20114_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.633	2024-05-13 21:21:41.633
M14574_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.694	2024-05-13 21:21:41.694
M14856_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:41.742	2024-05-13 21:21:41.742
M40029_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:03:17.071	2024-05-13 22:03:17.071
M14891_3056	t	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:41.751	2024-05-13 21:21:41.751
M41005_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-19 00:00:55.632	2024-05-19 00:00:55.632
M10587_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 21:21:39.434	2024-05-13 21:21:39.434
M32711_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:45.99	2024-05-13 22:01:45.99
M41558_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:20.216	2024-05-13 22:02:20.216
M600_3056	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 22:01:24.856	2024-05-13 22:01:24.856
M13499_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:20.395	2024-05-13 22:02:20.395
M34532_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:24.989	2024-05-13 22:01:24.989
M15939_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:09.488	2024-05-13 22:02:09.488
M32328_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.46	2024-05-13 21:21:39.46
M34961_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:19.392	2024-05-13 22:02:19.392
M20112_3056	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-13 22:03:10.92	2024-05-13 22:03:10.92
M14856_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.395	2024-05-13 21:21:42.395
M214_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:09.802	2024-05-13 22:02:09.802
M33241_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:42.717	2024-05-13 21:21:42.717
M11770_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.212	2024-05-13 21:21:40.212
M36015_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.15	2024-05-13 21:21:40.15
M8958_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.287	2024-05-13 21:21:40.287
M4880_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.429	2024-05-13 21:21:39.429
M32588_3314	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:02:30.46	2024-05-13 22:02:30.46
M33238_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:39.481	2024-05-13 21:21:39.481
M18660_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-16 00:00:15.655	2024-05-16 00:00:15.655
M21908_3314	f	f	f	f	f	f	t	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:09.807	2024-05-13 22:02:09.807
M14095_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:42.14	2024-05-13 21:21:42.14
M33196_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.756	2024-05-13 21:21:41.756
M41558_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:42.338	2024-05-13 21:21:42.338
M20885_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:31.698	2024-05-13 22:02:31.698
M41184_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:00:57.774	2024-05-19 00:00:57.774
M41405_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:48.81	2024-05-13 22:02:48.81
M14283_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.159	2024-05-13 21:21:40.159
M14343_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.205	2024-05-13 21:21:40.205
M3742_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:00:58.663	2024-05-19 00:00:58.663
M21942_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:00.328	2024-05-13 22:03:00.328
M15473_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.275	2024-05-13 21:21:40.275
M41609_3056	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:03:11.03	2024-05-13 22:03:11.03
M10583_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.78	2024-05-13 21:21:42.78
M10073_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:09.487	2024-05-13 22:02:09.487
M14278_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:01:48.596	2024-05-13 22:01:48.596
M9734_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.781	2024-05-13 21:21:42.781
M21578_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:58.709	2024-05-13 22:02:58.709
M19242_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:40.025	2024-05-13 21:21:40.025
M40911_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:19.418	2024-05-13 22:02:19.418
M13531_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.151	2024-05-13 21:21:40.151
M9879_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.22	2024-05-13 21:21:40.22
M2007_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:42.649	2024-05-13 21:21:42.649
M36024_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:02:12.947	2024-05-13 22:02:12.947
M14528_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 21:21:42.73	2024-05-13 21:21:42.73
M32538_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:13.004	2024-05-13 22:02:13.004
M34520_3056	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-13 21:21:39.426	2024-05-13 21:21:39.426
M38867_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.568	2024-05-13 21:21:39.568
M3316_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:01:45.96	2024-05-13 22:01:45.96
M21284_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.503	2024-05-13 21:21:39.503
M1461_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.543	2024-05-13 21:21:39.543
M1347_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:00:59.371	2024-05-19 00:00:59.371
M36652_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:33.901	2024-05-13 22:02:33.901
M21398_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:16.601	2024-05-13 22:02:16.601
M34477_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:58.774	2024-05-13 22:02:58.774
M21653_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 21:21:41.788	2024-05-13 21:21:41.788
M4595_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:24.784	2024-05-13 22:01:24.784
M19833_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:48.438	2024-05-13 22:01:48.438
M14647_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:01:24.854	2024-05-13 22:01:24.854
M2969_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:19.405	2024-05-13 22:02:19.405
M32686_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:07.709	2024-05-13 22:03:07.709
M14571_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.162	2024-05-13 21:21:40.162
M13770_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.225	2024-05-13 21:21:40.225
M6446_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:02:16.386	2024-05-13 22:02:16.386
M13850_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:42.736	2024-05-13 21:21:42.736
M20278_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.444	2024-05-13 22:01:17.444
M20044_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:13.011	2024-05-13 22:02:13.011
A4982_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.567	2024-05-13 21:21:39.567
M20403_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:00:54.681	2024-05-13 22:00:54.681
M18432_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:01:02.958	2024-05-19 00:01:02.958
M5630_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:42.091	2024-05-13 21:21:42.091
M4585_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:10.952	2024-05-13 22:03:10.952
M41061_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:00.324	2024-05-13 22:03:00.324
M9786_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.568	2024-05-13 21:21:41.568
M11563_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:24.855	2024-05-13 22:01:24.855
M10076_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:41.606	2024-05-13 21:21:41.606
M21662_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	f	2024-05-13 21:21:42.179	2024-05-13 21:21:42.179
M32205_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:48.556	2024-05-13 22:01:48.556
M14290_3056	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:02:16.431	2024-05-13 22:02:16.431
M20047_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:41.632	2024-05-13 21:21:41.632
M14336_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:16.487	2024-05-13 22:02:16.487
M38102_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:10.932	2024-05-13 22:03:10.932
A3503_3314	f	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:42.656	2024-05-13 21:21:42.656
A209_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:00:54.835	2024-05-13 22:00:54.835
M13972_3314	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 22:02:19.544	2024-05-13 22:02:19.544
M12103_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-19 00:00:57.574	2024-05-19 00:00:57.574
M21179_3314	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-13 22:02:19.418	2024-05-13 22:02:19.418
M14545_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.163	2024-05-13 21:21:40.163
M9955_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:12.483	2024-05-13 22:03:12.483
M39674_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-19 00:00:58.082	2024-05-19 00:00:58.082
M39438_3314	t	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:42.654	2024-05-13 21:21:42.654
M21938_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:03:00.296	2024-05-13 22:03:00.296
M13844_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:42.744	2024-05-13 21:21:42.744
M13850_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:39.491	2024-05-13 21:21:39.491
M40042_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:46.086	2024-05-13 22:01:46.086
M33400_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:09.727	2024-05-13 22:02:09.727
M13641_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:59.293	2024-05-13 22:02:59.293
M34448_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:03:10.73	2024-05-13 22:03:10.73
M2351_3056	t	f	t	f	f	f	t	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:41.617	2024-05-13 21:21:41.617
M21903_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-19 00:00:59.303	2024-05-19 00:00:59.303
M39971_3056	f	f	f	f	\N	f	t	f	t	f	f	f	f	f	t	t	2024-05-13 21:21:41.629	2024-05-13 21:21:41.629
M14598_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.501	2024-05-13 21:21:39.501
M13541_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.728	2024-05-13 21:21:41.728
M34533_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:16.558	2024-05-13 22:02:16.558
M9734_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:01:17.733	2024-05-13 22:01:17.733
M1344_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:00:54.835	2024-05-13 22:00:54.835
M39275_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:19.544	2024-05-13 22:02:19.544
M40391_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:40.101	2024-05-13 21:21:40.101
M11624_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.172	2024-05-13 21:21:40.172
M41561_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 21:21:41.752	2024-05-13 21:21:41.752
M5644_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:42.114	2024-05-13 21:21:42.114
A1223_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:48.499	2024-05-13 22:01:48.499
M2984_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:01:48.7	2024-05-13 22:01:48.7
M10583_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.433	2024-05-13 21:21:39.433
M35964_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:00:54.755	2024-05-13 22:00:54.755
M766_3314	t	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:42.719	2024-05-13 21:21:42.719
M6556_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.69	2024-05-13 21:21:41.69
M15668_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.779	2024-05-13 21:21:42.779
M20596_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:58.707	2024-05-13 22:02:58.707
M9895_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:09.49	2024-05-13 22:02:09.49
M39525_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	t	t	2024-05-13 22:02:09.734	2024-05-13 22:02:09.734
M21908_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:00:54.536	2024-05-13 22:00:54.536
M34518_3056	f	f	f	f	f	f	f	f	t	f	f	f	f	f	t	t	2024-05-13 22:00:54.458	2024-05-13 22:00:54.458
M14891_3314	t	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 21:21:40.024	2024-05-13 21:21:40.024
M6847_3314	f	f	t	f	f	f	f	f	t	f	f	f	f	f	f	t	2024-05-13 21:21:40.099	2024-05-13 21:21:40.099
M14258_3314	f	f	t	f	f	f	f	f	f	t	f	f	f	f	f	t	2024-05-13 22:02:05.931	2024-05-13 22:02:05.931
M36019_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:42.773	2024-05-13 21:21:42.773
M3223_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 22:02:28.168	2024-05-13 22:02:28.168
M14301_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:41.618	2024-05-13 21:21:41.618
M33003_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-19 00:00:59.235	2024-05-19 00:00:59.235
M289_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:39.486	2024-05-13 21:21:39.486
M20082_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 21:21:39.498	2024-05-13 21:21:39.498
M21645_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:40.163	2024-05-13 21:21:40.163
M14545_3056	f	f	f	f	f	f	f	f	f	t	f	f	f	f	t	t	2024-05-13 21:21:41.68	2024-05-13 21:21:41.68
M19242_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 21:21:41.742	2024-05-13 21:21:41.742
M14385_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	t	2024-05-13 22:02:51.071	2024-05-13 22:02:51.071
M34520_3314	f	f	f	f	f	f	f	f	f	f	f	f	f	f	t	t	2024-05-13 21:21:42.676	2024-05-13 21:21:42.676
M21113_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:02:59.339	2024-05-13 22:02:59.339
M40418_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	f	f	f	f	2024-05-13 22:01:17.392	2024-05-13 22:01:17.392
M34446_3314	f	f	f	f	f	f	f	f	f	t	f	f	f	f	f	f	2024-05-13 22:02:19.551	2024-05-13 22:02:19.551
\.


--
-- Data for Name: dish_menu_station_joint; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dish_menu_station_joint (dish_id, menu_id, station_id) FROM stdin;
M36069_3056	305605/14/2024108	23989
M34519_3056	305605/13/202449	30079
M34970_3056	305605/13/202449	23996
M10587_3056	305605/13/202449	23989
M20277_3056	305605/13/202449	23994
M596_3056	305605/13/202449	23994
M33238_3056	305605/13/202449	23996
M289_3056	305605/13/202449	23993
M15668_3056	305605/13/202449	23993
M1461_3056	305605/13/202449	23993
M38867_3056	305605/13/202449	23989
A4982_3056	305605/13/202449	23992
M14344_3314	331405/13/2024106	32802
M2351_3314	331405/13/2024106	32804
M2030_3314	331405/13/2024106	32804
M32303_3314	331405/13/2024106	32803
M34579_3314	331405/13/2024106	32808
M40391_3314	331405/13/2024106	32806
M40468_3314	331405/13/2024106	32806
M20948_3314	331405/13/2024106	32802
M20114_3314	331405/13/2024106	32805
M14545_3314	331405/13/2024106	32805
M11624_3314	331405/13/2024106	32802
M14343_3314	331405/13/2024106	32802
M6574_3314	331405/13/2024106	32805
M13770_3314	331405/13/2024106	32805
M10569_3314	331405/13/2024106	32801
M40808_3314	331405/13/2024106	32808
M7941_3314	331405/13/2024106	32802
M8958_3314	331405/13/2024106	32802
M14979_3056	305605/13/2024107	23995
M3040_3056	305605/13/2024107	23989
M8321_3056	305605/13/2024107	23990
M9650_3056	305605/13/2024107	23997
M10076_3056	305605/13/2024107	23989
M2351_3056	305605/13/2024107	23994
M14363_3056	305605/13/2024107	23993
M20114_3056	305605/13/2024107	23993
M14571_3056	305605/13/2024107	23993
M14342_3056	305605/13/2024107	23993
M14598_3056	305605/13/2024107	23993
M14343_3056	305605/13/2024107	23990
M13541_3056	305605/13/2024107	23990
M14856_3056	305605/13/2024107	23990
M14891_3056	305605/13/2024107	23993
M41036_3056	305605/13/2024107	23990
M21653_3056	305605/13/2024107	23990
M41141_3056	305605/13/2024107	23996
M4214_3056	305605/13/2024106	23989
M14095_3056	305605/13/2024106	23989
M20023_3056	305605/13/2024106	23997
M5804_3056	305605/13/2024106	23993
M9650_3056	305605/13/2024106	23989
M14363_3056	305605/13/2024106	23993
M20047_3056	305605/13/2024106	23990
M39971_3056	305605/13/2024106	23990
M20114_3056	305605/13/2024106	23993
M14574_3056	305605/13/2024106	23993
M21284_3056	305605/13/2024106	23993
M6578_3056	305605/13/2024106	23993
M14856_3056	305605/13/2024106	23990
L352998_3056	305605/13/2024106	23996
M41558_3056	305605/13/2024106	23994
M34241_3056	305605/13/2024106	23993
M33196_3056	305605/13/2024106	23990
M179_3056	305605/24/2024106	23997
M37959_3056	305605/24/2024106	23995
M12901_3056	305605/24/2024106	23989
M1842_3056	305605/24/2024106	23994
M20114_3056	305605/24/2024106	23993
M13541_3056	305605/24/2024106	23990
M41604_3056	305605/24/2024106	23997
M9729_3056	305605/22/202449	23989
M14599_3056	305605/22/202449	23993
M2007_3314	331405/24/202449	32804
M14528_3314	331405/24/202449	32805
M5768_3314	331405/24/202449	32801
M33238_3056	305605/17/202449	23996
A3503_3056	305605/17/202449	23994
M39438_3314	331405/20/202449	32804
M34970_3314	331405/20/202449	32803
M10588_3314	331405/20/202449	32801
M33062_3056	305605/23/202449	23993
M40676_3056	305605/23/202449	23989
M32329_3056	305605/23/202449	23994
M14599_3056	305605/23/202449	23993
M33400_3056	305605/23/202449	23995
M19735_3314	331405/24/2024106	32805
M3411_3314	331405/24/2024106	32810
M38042_3314	331405/24/2024106	32811
M14258_3314	331405/24/2024106	32805
M11624_3314	331405/24/2024106	32802
M34419_3314	331405/24/2024106	32803
M40843_3314	331405/24/2024106	32811
M14571_3056	305605/16/2024106	23993
M6578_3314	331405/16/2024108	32805
M14598_3056	305605/29/2024106	23993
M41561_3056	305605/29/2024106	23994
M21653_3056	305605/29/2024106	23990
M8321_3056	305605/29/2024107	23990
M14363_3056	305605/29/2024107	23993
M14598_3056	305605/29/2024107	23993
M14891_3056	305605/29/2024107	23993
M21908_3314	331405/23/202449	32810
M32404_3314	331405/23/2024106	32811
M21276_3056	305605/14/2024108	23989
M4880_3056	305605/13/202449	23991
M34520_3056	305605/13/202449	30079
M10583_3056	305605/13/202449	23989
M2007_3056	305605/13/202449	23994
M32328_3056	305605/13/202449	23994
M13850_3056	305605/13/202449	23993
M14598_3056	305605/13/202449	23993
M13844_3056	305605/13/202449	23993
M20082_3056	305605/13/202449	23993
M14599_3056	305605/13/202449	23993
M21284_3056	305605/13/202449	23993
M14638_3056	305605/13/202449	23993
L322479_3056	305605/13/202449	23992
M32657_3314	331405/14/2024108	32801
M859_3056	305605/13/202449	23989
M40987_3314	331405/13/2024106	32811
M19242_3314	331405/13/2024106	32805
M14891_3314	331405/13/2024106	32805
M2027_3314	331405/13/2024106	32804
M19735_3314	331405/13/2024106	32805
L100755_3314	331405/13/2024106	32807
M32745_3314	331405/13/2024106	32807
M34844_3314	331405/13/2024106	32801
M6847_3314	331405/13/2024106	32805
M19926_3314	331405/13/2024106	32810
M40418_3314	331405/13/2024106	32806
M14301_3314	331405/13/2024106	32802
M36015_3314	331405/13/2024106	32805
M13531_3314	331405/13/2024106	32805
M14571_3314	331405/13/2024106	32805
M14283_3314	331405/13/2024106	32805
M21645_3314	331405/13/2024106	32805
M6578_3314	331405/13/2024106	32805
M11770_3314	331405/13/2024106	32805
A5808_3314	331405/13/2024106	32809
M9879_3314	331405/13/2024106	32802
M34360_3314	331405/13/2024106	32810
M19998_3314	331405/13/2024106	32801
L227710_3314	331405/13/2024106	32808
M8321_3314	331405/13/2024106	32802
M15473_3314	331405/13/2024106	32802
M8170_3314	331405/13/2024106	32802
M21375_3056	305605/13/2024107	23997
A1221_3056	305605/13/2024107	23991
A1219_3056	305605/13/2024107	23991
M35712_3056	305605/13/2024107	23990
M9786_3056	305605/13/2024107	23990
M32660_3056	305605/13/2024107	23989
M14226_3056	305605/13/2024107	30079
M14301_3056	305605/13/2024107	23990
M33534_3056	305605/13/2024107	23990
M39971_3056	305605/13/2024107	23990
M6847_3056	305605/13/2024107	23993
M20047_3056	305605/13/2024107	23990
M14599_3056	305605/13/2024107	23993
M14545_3056	305605/13/2024107	23993
M6556_3056	305605/13/2024107	23993
M14574_3056	305605/13/2024107	23993
M6578_3056	305605/13/2024107	23993
M21284_3056	305605/13/2024107	23993
M19242_3056	305605/13/2024107	23993
M40078_3056	305605/13/2024107	23994
M19735_3056	305605/13/2024107	23993
M41561_3056	305605/13/2024107	23994
M34241_3056	305605/13/2024107	23993
M33196_3056	305605/13/2024107	23990
M40141_3056	305605/13/2024106	23990
L363965_3056	305605/13/2024106	23991
M8321_3056	305605/13/2024106	23990
M9786_3056	305605/13/2024106	23990
M5644_3056	305605/13/2024106	23991
M5630_3056	305605/13/2024106	23991
M20013_3056	305605/13/2024106	23994
M14226_3056	305605/13/2024106	30079
M16020_3056	305605/13/2024106	23994
M2030_3056	305605/13/2024106	23994
M21662_3056	305605/13/2024106	23990
M14301_3056	305605/13/2024106	23990
M6847_3056	305605/13/2024106	23993
M14599_3056	305605/13/2024106	23993
M14571_3056	305605/13/2024106	23993
M14342_3056	305605/13/2024106	23993
M14545_3056	305605/13/2024106	23993
M14598_3056	305605/13/2024106	23993
M6556_3056	305605/13/2024106	23993
M14343_3056	305605/13/2024106	23990
M13541_3056	305605/13/2024106	23990
M19735_3056	305605/13/2024106	23993
M19242_3056	305605/13/2024106	23993
M40674_3056	305605/13/2024106	23990
M14891_3056	305605/13/2024106	23993
M40079_3056	305605/13/2024106	23994
M21653_3056	305605/13/2024106	23990
A41_3056	305605/13/2024106	23995
M33409_3056	305605/13/2024106	23996
M14856_3314	331405/13/2024107	32802
M19735_3314	331405/13/2024107	32805
M19242_3314	331405/13/2024107	32805
M14891_3314	331405/13/2024107	32805
M2351_3314	331405/13/2024107	32804
M2027_3314	331405/13/2024107	32804
M2030_3314	331405/13/2024107	32804
M41120_3314	331405/13/2024107	32811
M20651_3314	331405/13/2024107	32803
M34579_3314	331405/13/2024107	32808
M18748_3314	331405/13/2024107	32807
M4595_3314	331405/13/2024107	32810
M4214_3314	331405/13/2024107	32801
M6847_3314	331405/13/2024107	32805
M40391_3314	331405/13/2024107	32806
M40418_3314	331405/13/2024107	32806
M14301_3314	331405/13/2024107	32802
M20948_3314	331405/13/2024107	32802
M20114_3314	331405/13/2024107	32805
M36015_3314	331405/13/2024107	32805
M13531_3314	331405/13/2024107	32805
M14283_3314	331405/13/2024107	32805
M14571_3314	331405/13/2024107	32805
M14545_3314	331405/13/2024107	32805
M21645_3314	331405/13/2024107	32805
M9615_3314	331405/13/2024107	32801
M39438_3314	331405/13/202449	32804
M33241_3314	331405/13/202449	32810
M10583_3314	331405/13/202449	32801
M19739_3056	305605/24/2024106	23989
M21053_3056	305605/24/2024106	23996
M9706_3056	305605/24/2024106	23997
M21748_3056	305605/24/2024106	23997
M14571_3056	305605/24/2024106	23993
M19242_3056	305605/24/2024106	23993
M21653_3056	305605/24/2024106	23990
M9734_3056	305605/22/202449	23989
M21284_3056	305605/22/202449	23993
M39438_3314	331405/24/202449	32804
M35575_3314	331405/24/202449	32803
M4880_3056	305605/17/202449	23991
M1461_3056	305605/17/202449	23993
M2007_3314	331405/20/202449	32804
M766_3314	331405/20/202449	32801
M10583_3314	331405/20/202449	32801
M19834_3056	305605/23/202449	23991
M35575_3056	305605/23/202449	23996
M33241_3056	305605/23/202449	23996
M15668_3056	305605/23/202449	23993
M40042_3056	305605/23/202449	23989
M19242_3314	331405/24/2024106	32805
M37958_3314	331405/24/2024106	32803
M40391_3314	331405/24/2024106	32806
M14545_3314	331405/24/2024106	32805
M34527_3314	331405/24/2024106	32801
M15521_3314	331405/24/2024106	32803
M8958_3314	331405/24/2024106	32802
M14598_3056	305605/16/2024106	23993
M32739_3056	305605/17/2024106	23995
M2030_3056	305605/17/2024107	23994
M14342_3056	305605/29/2024106	23993
M19242_3056	305605/29/2024106	23993
A2937_3056	305605/29/2024106	23992
M32256_3056	305605/29/2024107	23989
M14290_3056	305605/29/2024107	23993
M6556_3056	305605/29/2024107	23993
M40876_3056	305605/29/2024107	23995
M35609_3314	331405/23/202449	32801
M40427_3314	331405/23/2024106	32806
M19303_3314	331405/23/2024107	32801
M14599_3314	331405/23/2024107	32805
M40806_3314	331405/23/2024107	32808
M11624_3314	331405/13/2024107	32802
M40808_3314	331405/13/2024107	32808
M20278_3314	331405/13/202449	32804
M766_3314	331405/13/202449	32801
M9734_3314	331405/13/202449	32801
M38387_3056	305605/24/2024106	23989
M20943_3056	305605/24/2024106	23997
M9786_3056	305605/24/2024106	23990
M2027_3056	305605/24/2024106	23994
M14599_3056	305605/24/2024106	23993
M14343_3056	305605/24/2024106	23990
M41036_3056	305605/24/2024106	23990
M859_3056	305605/22/202449	23989
M20082_3056	305605/22/202449	23993
A4982_3056	305605/22/202449	23992
M34970_3314	331405/24/202449	32803
M13850_3314	331405/24/202449	32805
M859_3056	305605/17/202449	23989
M14638_3056	305605/17/202449	23993
M40676_3314	331405/20/202449	32801
M15668_3314	331405/20/202449	32805
M34970_3056	305605/23/202449	23996
M1057_3056	305605/23/202449	23989
M14385_3056	305605/23/202449	23994
M14598_3056	305605/23/202449	23993
A3028_3056	305605/23/202449	23995
M14856_3314	331405/24/2024106	32802
M34582_3314	331405/24/2024106	32801
M33864_3314	331405/24/2024106	32810
M20948_3314	331405/24/2024106	32802
M6578_3314	331405/24/2024106	32803
M9879_3314	331405/24/2024106	32802
M10645_3314	331405/24/2024106	32801
M35425_3314	331405/24/2024106	32806
M14545_3056	305605/16/2024106	23993
M34048_3056	305605/17/2024107	23996
M40818_3314	331405/20/2024107	32811
A5825_3314	331405/20/2024107	32808
M32360_3314	331405/20/2024106	32805
M21677_3314	331405/20/2024106	32807
L366315_3314	331405/20/202449	32804
M40913_3314	331405/21/2024108	32801
M2182_3056	305605/20/2024106	23994
M36204_3314	331405/20/2024106	32810
M9734_3314	331405/23/202449	32801
M2030_3056	305605/23/2024107	23994
M32360_3314	331405/23/2024106	32805
M40906_3314	331405/23/2024107	32811
M14598_3314	331405/23/2024107	32805
M36652_3314	331405/23/2024107	32808
M6578_3314	331405/13/2024107	32805
M7941_3314	331405/13/2024107	32802
M21906_3314	331405/13/202449	32805
M13850_3314	331405/13/202449	32805
M10587_3314	331405/13/202449	32801
M5630_3056	305605/24/2024106	23991
M34458_3056	305605/24/2024106	23995
M21662_3056	305605/24/2024106	23990
M6578_3056	305605/24/2024106	23993
M14891_3056	305605/24/2024106	23993
M34519_3056	305605/22/202449	30079
M33241_3056	305605/22/202449	23996
M15668_3056	305605/22/202449	23993
M33062_3314	331405/24/202449	32805
M36703_3314	331405/24/202449	32805
M34970_3056	305605/17/202449	23996
M13850_3056	305605/17/202449	23993
M21906_3314	331405/20/202449	32805
M14528_3314	331405/20/202449	32805
M34518_3056	305605/23/202449	30079
M34201_3056	305605/23/202449	23994
M20082_3056	305605/23/202449	23993
M1461_3056	305605/23/202449	23993
M508_3314	331405/24/2024106	32801
M2030_3314	331405/24/2024106	32804
M35479_3314	331405/24/2024106	32810
M14363_3314	331405/24/2024106	32805
M14283_3314	331405/24/2024106	32805
M11770_3314	331405/24/2024106	32805
M15286_3314	331405/24/2024106	32811
M15473_3314	331405/24/2024106	32802
M6578_3056	305605/16/2024106	23993
M40078_3056	305605/16/2024106	23994
M2027_3314	331405/20/2024106	32804
M33862_3314	331405/20/2024106	32810
M14364_3314	331405/20/2024106	32803
M13499_3314	331405/20/2024106	32803
M33769_3314	331405/20/2024106	32811
M32944_3314	331405/20/2024107	32808
M2030_3314	331405/20/2024107	32804
A3068_3314	331405/20/2024107	32811
M14258_3314	331405/20/2024107	32805
M6574_3314	331405/20/2024107	32805
M9650_3314	331405/20/2024107	32803
M7941_3314	331405/20/2024107	32802
M34997_3056	305605/26/2024107	23996
M39261_3056	305605/26/2024107	30079
M20047_3056	305605/26/2024107	23990
M13541_3056	305605/26/2024107	23990
M21653_3056	305605/26/2024107	23990
M2027_3314	331405/23/2024106	32804
M9520_3314	331405/23/2024106	32801
M14258_3314	331405/23/2024106	32805
M11624_3314	331405/23/2024106	32802
M13770_3314	331405/23/2024106	32805
M9636_3314	331405/23/2024106	32811
M32249_3056	305605/16/2024107	23989
M14301_3056	305605/16/2024107	23990
M14574_3056	305605/16/2024107	23993
M40078_3056	305605/16/2024107	23994
M14856_3314	331405/18/2024107	32802
M14301_3314	331405/18/2024107	32802
M14343_3314	331405/18/2024107	32802
M15473_3314	331405/18/2024107	32802
M20114_3314	331405/23/2024108	32805
M21076_3314	331405/18/202449	32801
M4100_3314	331405/18/202449	42378
M4878_3314	331405/18/2024107	32801
M9650_3314	331405/18/2024107	32801
M33510_3314	331405/20/2024107	32803
M36073_3314	331405/20/2024107	32801
M14599_3314	331405/20/2024106	32805
L81261_3314	331405/20/202449	32804
M2182_3056	305605/20/2024107	23994
M21890_3056	305605/20/2024106	23996
M19647_3314	331405/20/2024106	32801
M32737_3056	305605/23/2024107	23995
M38830_3314	331405/23/2024106	32801
M14598_3314	331405/23/2024106	32805
M10569_3314	331405/23/2024106	32811
M6574_3314	331405/13/2024107	32805
M8321_3314	331405/13/2024107	32802
M14113_3314	331405/13/202449	32804
M34970_3314	331405/13/202449	32810
M39654_3056	305605/24/2024106	23991
M9876_3056	305605/24/2024106	23989
M39971_3056	305605/24/2024106	23990
M14336_3056	305605/24/2024106	23993
M34755_3056	305605/24/2024106	23997
A787_3056	305605/24/2024106	23995
M34520_3056	305605/22/202449	30079
M13850_3056	305605/22/202449	23993
M41405_3056	305605/22/202449	23994
M20555_3314	331405/24/202449	32801
M32538_3314	331405/24/202449	32805
M12167_3056	305605/17/202449	23992
M13844_3056	305605/17/202449	23993
M33062_3314	331405/20/202449	32805
M36703_3314	331405/20/202449	32805
M19060_3056	305605/23/202449	23991
M40676_3056	305605/23/202449	23995
M596_3056	305605/23/202449	23994
M14638_3056	305605/23/202449	23993
M20555_3056	305605/23/202449	23995
M21372_3314	331405/24/2024106	32804
M18832_3314	331405/24/2024106	32801
M40453_3314	331405/24/2024106	32803
M36015_3314	331405/24/2024106	32805
M14343_3314	331405/24/2024106	32802
M13770_3314	331405/24/2024106	32805
M8321_3314	331405/24/2024106	32802
M21284_3056	305605/16/2024106	23993
M14343_3056	305605/16/2024106	23990
M41526_3314	331405/20/2024106	32804
M36069_3314	331405/20/2024106	32803
M20104_3314	331405/20/2024106	32809
M6578_3314	331405/20/2024106	32805
M33769_3314	331405/20/2024106	32801
M8170_3314	331405/20/2024106	32802
M2351_3314	331405/20/2024107	32804
M32248_3314	331405/20/2024107	32801
M20948_3314	331405/20/2024107	32802
M14343_3314	331405/20/2024107	32802
A81_3314	331405/20/2024107	32811
M34425_3314	331405/20/2024107	32808
M9786_3056	305605/26/2024107	23990
M14290_3056	305605/26/2024107	23993
M14342_3056	305605/26/2024107	23993
A3459_3056	305605/26/2024107	23989
M14856_3314	331405/23/2024106	32802
M2030_3314	331405/23/2024106	32804
M40391_3314	331405/23/2024106	32806
M13531_3314	331405/23/2024106	32805
M6574_3314	331405/23/2024106	32805
M9650_3314	331405/23/2024106	32803
M8958_3314	331405/23/2024106	32802
M9706_3056	305605/16/2024107	23997
M39971_3056	305605/16/2024107	23990
M14545_3056	305605/16/2024107	23993
M21653_3056	305605/16/2024107	23990
A1219_3314	331405/18/2024107	32806
M21645_3314	331405/18/2024107	32805
M34605_3314	331405/18/2024107	32801
M14258_3314	331405/23/2024108	32805
M6574_3314	331405/23/2024108	32805
A209_3314	331405/18/202449	32801
M4100_3314	331405/18/20242651	42378
M40987_3314	331405/18/2024107	32811
M2722_3314	331405/20/2024107	32801
M14342_3314	331405/20/2024107	32805
M35805_3314	331405/20/2024106	32811
M14255_3314	331405/20/2024106	32805
M14342_3314	331405/20/2024106	32805
M20595_3314	331405/20/2024106	32811
M16738_3314	331405/20/202449	32804
M40674_3056	305605/20/2024107	23990
M21584_3056	305605/20/2024106	23993
M6847-165894_3056	305605/23/2024107	23993
M32354_3314	331405/23/2024106	32807
M9879_3314	331405/13/2024107	32802
M15473_3314	331405/13/2024107	32802
M34520_3314	331405/13/202449	32808
M14528_3314	331405/13/202449	32805
M35425_3056	305605/24/2024106	23992
M36652_3056	305605/24/2024106	30079
M14290_3056	305605/24/2024106	23993
M14574_3056	305605/24/2024106	23993
M40079_3056	305605/24/2024106	23994
M32320_3056	305605/22/202449	23994
M14638_3056	305605/22/202449	23993
M1461_3314	331405/24/202449	32805
M13844_3314	331405/24/202449	32805
M9734_3056	305605/17/202449	23989
M14598_3056	305605/17/202449	23993
M36024_3314	331405/20/202449	32805
M32538_3314	331405/20/202449	32805
M33729_3056	305605/23/202449	23989
L331357_3056	305605/23/202449	23989
M13844_3056	305605/23/202449	23993
M34710_3056	305605/23/202449	23995
M32501_3314	331405/24/2024106	32802
M32313_3314	331405/24/2024106	32803
M41055_3314	331405/24/2024106	32811
A1227_3314	331405/24/2024106	32806
M21645_3314	331405/24/2024106	32805
M19741_3314	331405/24/2024106	32801
M9560_3314	331405/24/2024106	32801
M9849_3314	331405/24/2024106	32802
M6556_3056	305605/16/2024106	23993
A5808_3056	305605/16/2024106	23992
M21372_3314	331405/20/2024106	32804
M4318_3314	331405/20/2024106	32811
M14258_3314	331405/20/2024106	32805
M14343_3314	331405/20/2024106	32802
M9615_3314	331405/20/2024106	32801
M14856_3314	331405/20/2024107	32802
M21905_3314	331405/20/2024107	32804
M40399_3314	331405/20/2024107	32810
M13531_3314	331405/20/2024107	32805
M9619_3314	331405/20/2024107	32803
M19967_3314	331405/20/2024107	32810
M8321_3314	331405/20/2024107	32802
A1219_3056	305605/26/2024107	23991
M2351_3056	305605/26/2024107	23994
M14571_3056	305605/26/2024107	23993
M19735_3056	305605/26/2024107	23993
M41549_3056	305605/26/2024107	23989
M36325_3314	331405/23/2024106	32804
M14820_3314	331405/23/2024106	32803
M14257_3314	331405/23/2024106	32805
M6570_3314	331405/23/2024106	32805
M41061_3314	331405/23/2024106	32810
M8321_3314	331405/23/2024106	32802
M5630_3056	305605/16/2024107	23991
M14363_3056	305605/16/2024107	23993
M6556_3056	305605/16/2024107	23993
M34533_3056	305605/16/2024107	23989
M19242_3314	331405/18/2024107	32805
M36015_3314	331405/18/2024107	32805
M6574_3314	331405/18/2024107	32805
M8170_3314	331405/18/2024107	32802
M14283_3314	331405/23/2024108	32805
M40908_3314	331405/18/202449	32801
M40908_3314	331405/18/20242651	32801
M10053_3056	305605/18/2024107	23989
A721_3314	331405/20/2024107	32807
M9497_3314	331405/20/2024106	32801
M20278_3314	331405/20/202449	32804
M34970_3314	331405/20/202449	32810
L340205_3314	331405/20/202449	32808
L363988_3056	305605/20/2024107	23991
L97521_3056	305605/20/2024107	23994
M16738_3056	305605/20/202449	23994
M36792_3314	331405/23/2024106	32809
M2787_3314	331405/23/2024106	32811
M10053_3314	331405/23/2024106	32801
M14342_3314	331405/23/2024107	32805
M14343_3314	331405/13/2024107	32802
M8170_3314	331405/13/2024107	32802
M33062_3314	331405/13/202449	32805
M14599_3314	331405/13/202449	32805
M7975_3056	305605/24/2024106	23990
M39262_3056	305605/24/2024106	30079
M6847_3056	305605/24/2024106	23993
M6556_3056	305605/24/2024106	23993
M41561_3056	305605/24/2024106	23994
M35618_3056	305605/22/202449	23994
M1461_3056	305605/22/202449	23993
M34520_3314	331405/24/202449	32808
M22115_3314	331405/24/202449	32803
M33062_3056	305605/17/202449	23993
M15668_3056	305605/17/202449	23993
M1461_3314	331405/20/202449	32805
M20044_3314	331405/20/202449	32805
M859_3056	305605/23/202449	23989
M35609_3056	305605/23/202449	23989
M1344_3056	305605/23/202449	23993
M38867_3056	305605/23/202449	23989
M14891_3314	331405/24/2024106	32805
M36071_3314	331405/24/2024106	32803
M6847_3314	331405/24/2024106	32805
M20114_3314	331405/24/2024106	32805
M6578_3314	331405/24/2024106	32805
A1275_3314	331405/24/2024106	32803
M13263_3314	331405/24/2024106	32802
M14574_3056	305605/16/2024106	23993
M40079_3056	305605/16/2024106	23994
M2351_3314	331405/20/2024106	32804
M6847_3314	331405/20/2024106	32805
M20114_3314	331405/20/2024106	32805
M6574_3314	331405/20/2024106	32805
M9636_3314	331405/20/2024106	32801
M19735_3314	331405/20/2024107	32805
M33519_3314	331405/20/2024107	32803
M34750_3314	331405/20/2024107	32801
M20114_3314	331405/20/2024107	32805
M11770_3314	331405/20/2024107	32805
M15521_3314	331405/20/2024107	32801
M15473_3314	331405/20/2024107	32802
M33496_3056	305605/26/2024107	23989
M40029_3056	305605/26/2024107	30079
M6847_3056	305605/26/2024107	23993
M6578_3056	305605/26/2024107	23993
M14891_3056	305605/26/2024107	23993
M32500_3314	331405/23/2024106	32802
M2351_3314	331405/23/2024106	32804
M6847_3314	331405/23/2024106	32805
M14257_3314	331405/23/2024106	32810
M14343_3314	331405/23/2024106	32802
M15286_3314	331405/23/2024106	32811
M8170_3314	331405/23/2024106	32802
M8321_3056	305605/16/2024107	23990
M20047_3056	305605/16/2024107	23990
M13541_3056	305605/16/2024107	23990
A3043_3056	305605/16/2024107	30079
M6847_3314	331405/18/2024107	32805
M14545_3314	331405/18/2024107	32805
M32256_3314	331405/18/2024107	32801
M6847_3314	331405/23/2024108	32805
M11770_3314	331405/23/2024108	32805
M21076_3314	331405/18/20242651	32801
M38830_3056	305605/18/2024107	23989
M14255_3314	331405/20/2024107	32805
M32360_3314	331405/20/2024107	32805
M18537_3314	331405/20/2024106	32801
L276724_3056	305605/20/2024107	23993
M4880_3056	305605/20/202449	23991
M39261_3056	305605/20/2024106	30079
A2937_3056	305605/20/2024106	23992
M32981_3314	331405/20/2024106	32809
A368_3314	331405/23/2024106	32803
M14342_3314	331405/23/2024106	32805
M34957_3314	331405/23/2024107	32810
M32554_3314	331405/23/2024107	32811
M11770_3314	331405/13/2024107	32805
M8958_3314	331405/13/2024107	32802
L341952_3314	331405/13/202449	32805
M13844_3314	331405/13/202449	32805
M18832_3056	305605/24/2024106	23989
M16488_3056	305605/24/2024106	23989
M14301_3056	305605/24/2024106	23990
M14545_3056	305605/24/2024106	23993
M14856_3056	305605/24/2024106	23990
A714_3056	305605/24/2024106	23995
M3316_3056	305605/22/202449	23991
M14598_3056	305605/22/202449	23993
A3503_3314	331405/24/202449	32804
M766_3314	331405/24/202449	32801
M15668_3314	331405/24/202449	32805
M34519_3056	305605/17/202449	30079
M2007_3056	305605/17/202449	23994
M38867_3056	305605/17/202449	23989
A3503_3314	331405/20/202449	32804
M34515_3314	331405/20/202449	32803
M21908_3056	305605/23/202449	23996
M9734_3056	305605/23/202449	23989
M16738_3056	305605/23/202449	23994
M21284_3056	305605/23/202449	23993
A1938_3056	305605/23/202449	23995
M2027_3314	331405/24/2024106	32804
M3863_3314	331405/24/2024106	32801
M20110_3314	331405/24/2024106	32803
M14257_3314	331405/24/2024106	32805
M19856_3314	331405/24/2024106	32803
M15073_3314	331405/24/2024106	32801
M39275_3314	331405/24/2024106	32808
M14856_3056	305605/16/2024106	23990
M41561_3056	305605/16/2024106	23994
M32944_3314	331405/20/2024106	32808
M2030_3314	331405/20/2024106	32804
M20948_3314	331405/20/2024106	32802
M13531_3314	331405/20/2024106	32805
M34419_3314	331405/20/2024106	32803
M34446_3314	331405/20/2024106	32808
M14891_3314	331405/20/2024107	32805
M16589_3314	331405/20/2024107	32810
M6847_3314	331405/20/2024107	32805
M14283_3314	331405/20/2024107	32805
M15119_3314	331405/20/2024107	32811
M40934_3314	331405/20/2024107	32811
M8170_3314	331405/20/2024107	32802
M21061_3056	305605/26/2024107	23989
M34477_3056	305605/26/2024107	30079
M39971_3056	305605/26/2024107	23990
M6556_3056	305605/26/2024107	23993
M41558_3056	305605/26/2024107	23994
M19242_3314	331405/23/2024106	32805
M41138_3314	331405/23/2024106	32801
M39651_3314	331405/23/2024106	32806
M14283_3314	331405/23/2024106	32805
M11770_3314	331405/23/2024106	32805
M40967_3314	331405/23/2024106	32801
M32582_3314	331405/23/2024106	32802
M35712_3056	305605/16/2024107	23990
M20114_3056	305605/16/2024107	23993
M14343_3056	305605/16/2024107	23990
M14891_3056	305605/16/2024107	23993
M40358_3314	331405/18/2024107	32810
M14571_3314	331405/18/2024107	32805
M9879_3314	331405/18/2024107	32802
M36753_3314	331405/23/2024108	32801
M6578_3314	331405/23/2024108	32805
A209_3314	331405/18/20242651	32801
M10645_3314	331405/18/2024107	32801
M36015_3314	331405/20/2024107	32805
M9650_3314	331405/20/2024107	32811
M33241_3314	331405/20/202449	32810
M39261_3056	305605/20/2024107	30079
L97521_3056	305605/20/2024106	23994
L364409_3056	305605/20/2024106	23995
M41612_3314	331405/23/2024106	32811
M32360_3314	331405/23/2024107	32805
M13770_3314	331405/13/2024107	32805
M398_3314	331405/13/202449	32804
M1461_3314	331405/13/202449	32805
M14598_3314	331405/13/202449	32805
M5644_3056	305605/24/2024106	23991
M11315_3056	305605/24/2024106	23989
M14363_3056	305605/24/2024106	23993
M14342_3056	305605/24/2024106	23993
M19735_3056	305605/24/2024106	23993
M34970_3056	305605/22/202449	23996
M289_3056	305605/22/202449	23993
M1344_3056	305605/22/202449	23993
M39587_3314	331405/24/202449	32804
M20044_3314	331405/24/202449	32805
M14647_3056	305605/17/202449	23989
M14599_3056	305605/17/202449	23993
M34520_3314	331405/20/202449	32808
M13850_3314	331405/20/202449	32805
M34520_3056	305605/23/202449	30079
M40850_3056	305605/23/202449	23996
M13850_3056	305605/23/202449	23993
M33411_3056	305605/23/202449	23995
M39640_3056	305605/23/202449	23993
M2351_3314	331405/24/2024106	32804
M17086_3314	331405/24/2024106	32801
M40418_3314	331405/24/2024106	32806
M14571_3314	331405/24/2024106	32805
M40779_3314	331405/24/2024106	32803
M9650_3314	331405/24/2024106	32803
M8170_3314	331405/24/2024106	32802
A435_3056	305605/16/2024106	23997
A3043_3056	305605/16/2024106	30079
M14891_3314	331405/20/2024106	32805
M21375_3314	331405/20/2024106	32801
M14301_3314	331405/20/2024106	32802
M14571_3314	331405/20/2024106	32805
M13770_3314	331405/20/2024106	32805
M7941_3314	331405/20/2024106	32802
M34535_3314	331405/20/2024107	32811
M41055_3314	331405/20/2024107	32811
M40411_3314	331405/20/2024107	32806
M14545_3314	331405/20/2024107	32805
M21890_3314	331405/20/2024107	32811
M34446_3314	331405/20/2024107	32808
M10076_3056	305605/26/2024107	23989
M14599_3056	305605/26/2024107	23993
M14343_3056	305605/26/2024107	23990
M33196_3056	305605/26/2024107	23990
M41518_3314	331405/23/2024106	32804
M33548_3314	331405/23/2024106	32810
M20948_3314	331405/23/2024106	32802
M14545_3314	331405/23/2024106	32805
M9879_3314	331405/23/2024106	32802
A3043_3314	331405/23/2024106	32808
M3828_3056	305605/16/2024107	23995
M6847_3056	305605/16/2024107	23993
M6578_3056	305605/16/2024107	23993
M41561_3056	305605/16/2024107	23994
M14891_3314	331405/18/2024107	32805
M14283_3314	331405/18/2024107	32805
M11770_3314	331405/18/2024107	32805
M8958_3314	331405/18/2024107	32802
M14571_3314	331405/23/2024108	32805
M10521_3314	331405/18/2024107	32801
M14599_3314	331405/20/2024107	32805
M10076_3314	331405/20/2024107	32801
M14863_3314	331405/20/2024106	32801
M36015_3314	331405/20/2024106	32805
M14598_3314	331405/20/2024106	32805
M2030_3056	305605/20/2024107	23994
M38230_3056	305605/20/2024106	23994
L335737_3056	305605/20/2024106	23993
M33772_3056	305605/24/2024106	23989
M34448_3056	305605/24/2024106	30079
M6475_3056	305605/24/2024107	23993
M14598_3314	331405/24/2024107	32805
M34957_3314	331405/24/2024106	32810
M9650_3314	331405/24/2024106	32810
M32205_3314	331405/13/2024107	32801
M2007_3314	331405/13/202449	32804
L284444_3314	331405/13/202449	32805
M36019_3314	331405/13/202449	32805
M20749_3056	305605/24/2024106	23995
M2349_3056	305605/24/2024106	23994
M20047_3056	305605/24/2024106	23990
M14598_3056	305605/24/2024106	23993
M33196_3056	305605/24/2024106	23990
M33062_3056	305605/22/202449	23993
M13844_3056	305605/22/202449	23993
M21906_3314	331405/24/202449	32805
M36024_3314	331405/24/202449	32805
M9519_3314	331405/24/202449	32801
M34520_3056	305605/17/202449	30079
M21284_3056	305605/17/202449	23993
M214_3314	331405/20/202449	32804
M13844_3314	331405/20/202449	32805
M33727_3056	305605/23/202449	23995
M35249_3056	305605/23/202449	23993
M21084_3056	305605/23/202449	23995
M32944_3314	331405/24/2024106	32808
M41526_3314	331405/24/2024106	32804
M32631_3314	331405/24/2024106	32803
M14301_3314	331405/24/2024106	32802
M13531_3314	331405/24/2024106	32805
M6574_3314	331405/24/2024106	32805
M34865_3314	331405/24/2024106	32803
M34477_3314	331405/24/2024106	32808
M19735_3056	305605/16/2024106	23993
M34241_3056	305605/16/2024106	23993
M19735_3314	331405/20/2024106	32805
M20912_3314	331405/20/2024106	32810
M40418_3314	331405/20/2024106	32806
M14545_3314	331405/20/2024106	32805
M9879_3314	331405/20/2024106	32802
M8321_3314	331405/20/2024106	32802
M21372_3314	331405/20/2024107	32804
M34753_3314	331405/20/2024107	32811
M40418_3314	331405/20/2024107	32806
M21645_3314	331405/20/2024107	32805
M13770_3314	331405/20/2024107	32805
M33770_3314	331405/20/2024107	32801
M9650_3056	305605/26/2024107	23989
M20114_3056	305605/26/2024107	23993
M14574_3056	305605/26/2024107	23993
A1146_3056	305605/26/2024107	23989
M33279_3314	331405/23/2024106	32804
M3379_3314	331405/23/2024106	32803
M14363_3314	331405/23/2024106	32805
M21645_3314	331405/23/2024106	32805
M10550_3314	331405/23/2024106	32803
M7941_3314	331405/23/2024106	32802
M5644_3056	305605/16/2024107	23991
M33534_3056	305605/16/2024107	23990
M21284_3056	305605/16/2024107	23993
M34241_3056	305605/16/2024107	23993
M36741_3314	331405/18/2024107	32801
M13531_3314	331405/18/2024107	32805
M34596_3314	331405/18/2024107	32811
M19735_3314	331405/23/2024108	32805
M14545_3314	331405/23/2024108	32805
M713_3314	331405/19/202449	32801
M20956_3314	331405/19/202449	32810
M3223_3314	331405/19/2024107	32810
M32256_3314	331405/19/2024107	32801
M14598_3314	331405/20/2024107	32805
M37808_3314	331405/20/2024106	32803
M16226_3056	305605/20/2024106	23992
M40674_3056	305605/20/2024106	23990
M20912_3056	305605/24/2024106	23996
M6847-165894_3056	305605/24/2024107	23993
M9650_3314	331405/13/2024107	32811
A3503_3314	331405/13/202449	32804
M40042_3314	331405/13/202449	32801
M15668_3314	331405/13/202449	32805
M19054_3056	305605/21/202449	23991
M34518_3056	305605/21/202449	30079
M21908_3056	305605/21/202449	23996
M34520_3056	305605/21/202449	30079
M33062_3056	305605/21/202449	23993
M859_3056	305605/21/202449	23989
M10587_3056	305605/21/202449	23989
M398_3056	305605/21/202449	23994
M20403_3056	305605/21/202449	23994
M33241_3056	305605/21/202449	23996
M35249_3056	305605/21/202449	23993
M13844_3056	305605/21/202449	23993
M20082_3056	305605/21/202449	23993
M35964_3056	305605/21/202449	23994
M14599_3056	305605/21/202449	23993
M14598_3056	305605/21/202449	23993
M21284_3056	305605/21/202449	23993
M15668_3056	305605/21/202449	23993
M14638_3056	305605/21/202449	23993
M1344_3056	305605/21/202449	23993
M1461_3056	305605/21/202449	23993
A209_3056	305605/21/202449	23989
M13850_3056	305605/21/202449	23993
M33496_3056	305605/18/20242651	23989
M40443_3056	305605/18/20242651	23991
M40391_3056	305605/18/20242651	23991
M40418_3056	305605/18/20242651	23991
M9786_3056	305605/18/20242651	23990
M10076_3056	305605/18/20242651	23989
M9650_3056	305605/18/20242651	23989
M596_3056	305605/18/20242651	23994
M20278_3056	305605/18/20242651	23994
M1997_3056	305605/18/20242651	23994
M14301_3056	305605/18/20242651	23990
M16738_3056	305605/18/20242651	23994
M21662_3056	305605/18/20242651	23990
M14304_3056	305605/18/20242651	23990
M39971_3056	305605/18/20242651	23990
M20047_3056	305605/18/20242651	23990
M14343_3056	305605/18/20242651	23990
M13541_3056	305605/18/20242651	23990
M14856_3056	305605/18/20242651	23990
M9126_3056	305605/18/20242651	23989
M21653_3056	305605/18/20242651	23990
M33196_3056	305605/18/20242651	23990
M859_3056	305605/18/202449	23989
M33496_3056	305605/18/202449	23989
M21908_3056	305605/18/202449	23996
M40443_3056	305605/18/202449	23991
M4880_3056	305605/18/202449	23991
M20953_3056	305605/18/202449	23996
M40391_3056	305605/18/202449	23991
M40418_3056	305605/18/202449	23991
M9786_3056	305605/18/202449	23990
M9734_3056	305605/18/202449	23989
M12296_3056	305605/18/202449	23989
M9650_3056	305605/18/202449	23989
M10076_3056	305605/18/202449	23989
M596_3056	305605/18/202449	23994
M1997_3056	305605/18/202449	23994
M21939_3056	305605/18/202449	23994
M20278_3056	305605/18/202449	23994
M16738_3056	305605/18/202449	23994
M21662_3056	305605/18/202449	23990
M14301_3056	305605/18/202449	23990
M20953_3056	305605/18/20242651	23996
M33238_3056	305605/18/202449	23996
M14304_3056	305605/18/202449	23990
M39971_3056	305605/18/202449	23990
M13850_3056	305605/18/202449	23993
M14599_3056	305605/18/202449	23993
M20047_3056	305605/18/202449	23990
M13844_3056	305605/18/202449	23993
M14598_3056	305605/18/202449	23993
M21284_3056	305605/18/202449	23993
M15668_3056	305605/18/202449	23993
M14638_3056	305605/18/202449	23993
M14343_3056	305605/18/202449	23990
M14856_3056	305605/18/202449	23990
M9126_3056	305605/18/202449	23989
M13541_3056	305605/18/202449	23990
M21653_3056	305605/18/202449	23990
M33196_3056	305605/18/202449	23990
M1461_3056	305605/18/202449	23993
M2594_3056	305605/18/2024107	23989
A1219_3056	305605/18/2024107	23991
A1221_3056	305605/18/2024107	23991
M35712_3056	305605/18/2024107	23990
M9786_3056	305605/18/2024107	23990
M10076_3056	305605/18/2024107	23989
M10734_3056	305605/18/2024107	30079
M2351_3056	305605/18/2024107	23994
M713_3056	305605/18/2024107	23989
M14301_3056	305605/18/2024107	23990
M14363_3056	305605/18/2024107	23993
M33534_3056	305605/18/2024107	23990
M39971_3056	305605/18/2024107	23990
M19842_3056	305605/18/2024107	23996
M6847_3056	305605/18/2024107	23993
M20047_3056	305605/18/2024107	23990
M20114_3056	305605/18/2024107	23993
M14599_3056	305605/18/2024107	23993
M14571_3056	305605/18/2024107	23993
M14342_3056	305605/18/2024107	23993
M14545_3056	305605/18/2024107	23993
M14598_3056	305605/18/2024107	23993
M6556_3056	305605/18/2024107	23993
M6578_3056	305605/18/2024107	23993
M21284_3056	305605/18/2024107	23993
M14574_3056	305605/18/2024107	23993
M13541_3056	305605/18/2024107	23990
M14343_3056	305605/18/2024107	23990
M14856_3056	305605/18/2024107	23990
M19735_3056	305605/18/2024107	23993
M14891_3056	305605/18/2024107	23993
M19242_3056	305605/18/2024107	23993
M20954_3056	305605/18/2024107	23996
M859_3056	305605/19/202449	23989
M32329_3056	305605/19/202449	23994
M20047_3056	305605/19/202449	23990
M14343_3056	305605/19/202449	23990
M289_3314	331405/15/202449	32805
M14598_3314	331405/15/202449	32805
M9786_3056	305605/14/2024106	23990
M14363_3056	305605/14/2024106	23993
M14598_3056	305605/14/2024106	23993
A5800_3056	305605/14/2024106	23995
M34518_3056	305605/16/202449	30079
M14385_3056	305605/16/202449	23994
M1461_3056	305605/16/202449	23993
M34584_3056	305605/15/2024107	23989
M11563_3056	305605/15/2024107	23989
M14571_3056	305605/15/2024107	23993
M13541_3056	305605/15/2024107	23990
M21653_3056	305605/15/2024107	23990
M14528_3314	331405/17/202449	32805
M34970_3056	305605/15/202449	23996
M20278_3056	305605/15/202449	23994
A4982_3056	305605/15/202449	23992
M33409_3314	331405/25/20242651	32803
M10274_3314	331405/25/20242651	32801
M20170_3314	331405/17/2024106	32809
M39531_3314	331405/17/2024106	32803
M14301_3314	331405/17/2024106	32802
M13541_3314	331405/17/2024106	32802
M8321_3314	331405/17/2024106	32802
M19735_3314	331405/25/2024107	32805
M38834_3314	331405/25/2024107	32801
M36015_3314	331405/25/2024107	32805
M14545_3314	331405/25/2024107	32805
M34419_3314	331405/25/2024107	32803
M8958_3314	331405/25/2024107	32802
M3742_3314	331405/18/20242651	47692
M40418_3314	331405/18/20242651	32806
M8321_3314	331405/18/20242651	32802
M20397_3056	305605/20/2024107	23991
M2351_3056	305605/20/2024107	23994
M20114_3056	305605/20/2024107	23993
M14343_3056	305605/20/2024107	23990
M33196_3056	305605/20/2024107	23990
M16360_3056	305605/20/2024106	23995
M20953_3056	305605/20/2024106	23996
M39971_3056	305605/20/2024106	23990
M14598_3056	305605/20/2024106	23993
M38581_3056	305605/20/2024106	23997
A1054_3056	305605/20/2024106	23995
M34520_3314	331405/16/202449	32808
M14647_3314	331405/16/202449	32801
M40418_3056	305605/19/20242651	23991
M39971_3056	305605/19/20242651	23990
A347_3056	305605/19/20242651	23989
M14283_3314	331405/24/2024108	32805
M21375_3056	305605/26/20242651	23989
M32205_3056	305605/26/20242651	23989
M33196_3056	305605/26/20242651	23990
M10076_3056	305605/24/2024108	23989
M40946_3314	331405/19/20242651	47692
M10053_3314	331405/19/20242651	32801
M33062_3314	331405/22/202449	32805
M13844_3314	331405/22/202449	32805
M21906_3314	331405/26/202449	32805
M40911_3314	331405/26/202449	32801
M13844_3314	331405/26/202449	32805
M9513_3314	331405/26/202449	32801
M8170_3314	331405/26/202449	32802
M10072_3056	305605/15/2024106	23989
M20114_3056	305605/15/2024106	23993
M14891_3056	305605/15/2024106	23993
M19735_3314	331405/17/2024108	32805
M6574_3314	331405/17/2024108	32805
M38830_3314	331405/19/2024107	32801
M14571_3314	331405/19/2024107	32805
M9879_3314	331405/19/2024107	32802
M19242_3314	331405/26/2024107	32805
M19631_3314	331405/26/2024107	32803
M14257_3314	331405/26/2024107	32805
M14343_3314	331405/26/2024107	32802
M39275_3314	331405/26/2024107	32808
M4846_3056	305605/23/2024107	23995
M9894_3056	305605/23/2024107	23989
M14301_3056	305605/23/2024107	23990
M14342_3056	305605/23/2024107	23993
M19735_3056	305605/23/2024107	23993
M33196_3056	305605/23/2024107	23990
M14891_3314	331405/22/2024107	32805
M15134_3314	331405/22/2024107	32803
M40418_3314	331405/22/2024107	32806
M14571_3314	331405/22/2024107	32805
M36641_3314	331405/22/2024107	32801
M15122_3314	331405/22/2024107	32810
M7968_3314	331405/22/2024107	32802
M21372_3314	331405/22/2024106	32804
M4878_3314	331405/22/2024106	32801
M14301_3314	331405/22/2024106	32802
M14571_3314	331405/22/2024106	32805
M15063_3314	331405/22/2024106	32803
M9560_3314	331405/22/2024106	32811
M8170_3314	331405/22/2024106	32802
A287_3314	331405/24/2024107	32801
M32588_3314	331405/24/2024107	32803
M14257_3314	331405/24/2024107	32805
M6578_3314	331405/24/2024107	32805
M9650_3314	331405/24/2024107	32803
M8958_3314	331405/24/2024107	32802
M20899_3056	305605/24/2024107	23991
M14290_3056	305605/24/2024107	23993
M14599_3056	305605/24/2024107	23993
M14856_3056	305605/24/2024107	23990
M33409_3056	305605/24/2024107	23996
M41558_3314	331405/25/202449	32804
M40391_3314	331405/25/202449	32806
M20044_3314	331405/25/202449	32805
M19679_3056	305605/22/2024106	23995
M9786_3056	305605/22/2024106	23990
M14330_3056	305605/22/2024106	23994
M6847_3056	305605/22/2024106	23993
M40078_3056	305605/18/2024107	23994
M40472_3056	305605/19/202449	23991
M20278_3056	305605/19/202449	23994
M14598_3056	305605/19/202449	23993
M34532_3056	305605/19/202449	23989
M599_3314	331405/15/202449	32804
M13844_3314	331405/15/202449	32805
M4906_3056	305605/14/2024106	23997
M14090_3056	305605/14/2024106	23994
M14342_3056	305605/14/2024106	23993
M14856_3056	305605/14/2024106	23990
M21653_3056	305605/14/2024106	23990
M34520_3056	305605/16/202449	30079
M21284_3056	305605/16/202449	23993
M4595_3056	305605/15/2024107	23996
M14363_3056	305605/15/2024107	23993
M14545_3056	305605/15/2024107	23993
M14856_3056	305605/15/2024107	23990
M40879_3056	305605/15/2024107	23989
M14599_3314	331405/17/202449	32805
M10583_3056	305605/15/202449	23989
M13844_3056	305605/15/202449	23993
M14598_3056	305605/15/202449	23993
M40418_3314	331405/25/20242651	32806
M8004_3314	331405/25/20242651	32802
A41_3314	331405/17/2024106	32807
M40418_3314	331405/17/2024106	32806
M21645_3314	331405/17/2024106	32805
M34474_3314	331405/17/2024106	32808
M21375_3314	331405/25/2024107	32803
M14258_3314	331405/25/2024107	32805
M10266_3314	331405/25/2024107	32801
M13770_3314	331405/25/2024107	32805
M41017_3314	331405/18/20242651	32801
M3854_3314	331405/18/20242651	32801
M9294_3314	331405/18/20242651	32801
M36634_3056	305605/20/2024107	23995
A1219_3056	305605/20/2024107	23991
M14290_3056	305605/20/2024107	23993
M14342_3056	305605/20/2024107	23993
M14856_3056	305605/20/2024107	23990
M5644_3056	305605/20/2024106	23991
M21662_3056	305605/20/2024106	23990
M14545_3056	305605/20/2024106	23993
M14856_3056	305605/20/2024106	23990
M21653_3056	305605/20/2024106	23990
M33062_3314	331405/16/202449	32805
M14599_3314	331405/16/202449	32805
M41061_3056	305605/21/2024108	23989
M596_3056	305605/19/20242651	23994
M33196_3056	305605/19/20242651	23990
M14891_3314	331405/24/2024108	32805
M11770_3314	331405/24/2024108	32805
A1223_3056	305605/26/20242651	23991
M14343_3056	305605/26/20242651	23990
M9650_3056	305605/24/2024108	23989
M41036_3314	331405/19/20242651	32802
M8321_3314	331405/19/20242651	32802
M1461_3314	331405/22/202449	32805
M20044_3314	331405/22/202449	32805
M33062_3314	331405/26/202449	32805
M766_3314	331405/26/202449	32801
M11624_3314	331405/26/202449	32802
M32739_3056	305605/15/2024106	23995
M35394_3056	305605/15/2024106	23992
M39971_3056	305605/15/2024106	23990
M21284_3056	305605/15/2024106	23993
M14343_3056	305605/15/2024106	23990
M18748_3314	331405/17/2024108	32801
M14571_3314	331405/17/2024108	32805
M19242_3314	331405/19/2024107	32805
M14301_3314	331405/19/2024107	32802
M11624_3314	331405/19/2024107	32802
M15473_3314	331405/19/2024107	32802
M21905_3314	331405/26/2024107	32804
M14301_3314	331405/26/2024107	32802
M14283_3314	331405/26/2024107	32805
M36582_3314	331405/26/2024107	32810
M8958_3314	331405/26/2024107	32802
A1219_3056	305605/23/2024107	23991
M32307_3056	305605/23/2024107	23995
M20047_3056	305605/23/2024107	23990
M14343_3056	305605/23/2024107	23990
M41561_3056	305605/23/2024107	23994
M19242_3314	331405/22/2024107	32805
M34023_3314	331405/22/2024107	32803
M40437_3314	331405/22/2024107	32806
M36015_3314	331405/22/2024107	32805
M14343_3314	331405/22/2024107	32802
M9650_3314	331405/22/2024107	32803
M34456_3314	331405/22/2024107	32808
M14856_3314	331405/22/2024106	32802
M36204_3314	331405/22/2024106	32810
A2944_3314	331405/22/2024106	32810
M21645_3314	331405/22/2024106	32805
M19759_3314	331405/22/2024106	32810
M10645_3314	331405/22/2024106	32801
M8958_3314	331405/22/2024106	32802
M2030_3314	331405/24/2024107	32804
M33864_3314	331405/24/2024107	32810
M14258_3314	331405/24/2024107	32805
M14343_3314	331405/24/2024107	32802
M10094_3314	331405/24/2024107	32811
M15674_3056	305605/24/2024107	23989
M39262_3056	305605/24/2024107	30079
M20114_3056	305605/24/2024107	23993
M14574_3056	305605/24/2024107	23993
M21653_3056	305605/24/2024107	23990
M1461_3314	331405/25/202449	32805
M34515_3314	331405/25/202449	32803
M15668_3314	331405/25/202449	32805
M21356_3056	305605/22/2024106	23995
M7449_3056	305605/22/2024106	23992
M34422_3056	305605/22/2024106	30079
M20047_3056	305605/22/2024106	23990
M14343_3056	305605/22/2024106	23990
M4585_3056	305605/22/2024106	23997
A347_3056	305605/22/2024106	23997
M21938_3056	305605/17/2024108	23989
M13531_3314	331405/21/2024108	32805
M34241_3056	305605/18/2024107	23993
M41036_3056	305605/18/2024107	23990
M40418_3056	305605/19/202449	23991
M14301_3056	305605/19/202449	23990
M20082_3056	305605/19/202449	23993
M33196_3056	305605/19/202449	23990
M33241_3314	331405/15/202449	32810
M36019_3314	331405/15/202449	32805
M20842_3056	305605/14/2024106	23991
M39971_3056	305605/14/2024106	23990
M21284_3056	305605/14/2024106	23993
M40078_3056	305605/14/2024106	23994
M859_3056	305605/16/202449	23989
M14599_3056	305605/16/202449	23993
M8321_3056	305605/15/2024107	23990
M14342_3056	305605/15/2024107	23993
M14891_3056	305605/15/2024107	23993
M39438_3314	331405/17/202449	32804
M13850_3314	331405/17/202449	32805
M34520_3056	305605/15/202449	30079
M13850_3056	305605/15/202449	23993
M34520_3314	331405/25/20242651	32808
M40391_3314	331405/25/20242651	32806
M11563_3056	305605/16/2024108	23989
M2027_3314	331405/17/2024106	32804
M6847_3314	331405/17/2024106	32805
M14283_3314	331405/17/2024106	32805
M11770_3314	331405/17/2024106	32805
M15473_3314	331405/17/2024106	32802
M2027_3314	331405/25/2024107	32804
M33549_3314	331405/25/2024107	32810
M6570_3314	331405/25/2024107	32805
M9650_3314	331405/25/2024107	32803
A347_3314	331405/18/20242651	32801
M14864_3314	331405/18/20242651	32810
M9879_3314	331405/18/20242651	32802
M20596_3056	305605/20/2024107	23989
M9876_3056	305605/20/2024107	23989
M14363_3056	305605/20/2024107	23993
M14598_3056	305605/20/2024107	23993
M14891_3056	305605/20/2024107	23993
A721_3056	305605/20/2024107	23995
A1087_3056	305605/20/2024106	23991
M2027_3056	305605/20/2024106	23994
M14599_3056	305605/20/2024106	23993
M13541_3056	305605/20/2024106	23990
M41036_3056	305605/20/2024106	23990
A3503_3314	331405/16/202449	32804
M13850_3314	331405/16/202449	32805
M15473_3056	305605/21/2024108	23989
M11563_3056	305605/19/20242651	23989
M20106_3056	305605/19/20242651	23989
M14571_3314	331405/24/2024108	32805
M37047_3056	305605/26/20242651	23991
M16738_3056	305605/26/20242651	23994
M41558_3314	331405/19/20242651	32804
M40749_3314	331405/19/20242651	47692
M21906_3314	331405/22/202449	32805
M14528_3314	331405/22/202449	32805
M2007_3314	331405/26/202449	32804
M35634_3314	331405/26/202449	32803
M13850_3314	331405/26/202449	32805
M5768_3314	331405/26/202449	32801
M5630_3056	305605/15/2024106	23991
M39261_3056	305605/15/2024106	30079
M6847_3056	305605/15/2024106	23993
M14856_3056	305605/15/2024106	23990
M21653_3056	305605/15/2024106	23990
M14545_3314	331405/17/2024108	32805
M19735_3314	331405/19/2024107	32805
M6847_3314	331405/19/2024107	32805
M14545_3314	331405/19/2024107	32805
M10053_3314	331405/19/2024107	32801
M2027_3314	331405/26/2024107	32804
M4883_3314	331405/26/2024107	32801
M36015_3314	331405/26/2024107	32805
M11770_3314	331405/26/2024107	32805
M33147_3314	331405/26/2024107	32801
M9651_3056	305605/23/2024107	23995
M9786_3056	305605/23/2024107	23990
M39971_3056	305605/23/2024107	23990
M14336_3056	305605/23/2024107	23993
M19242_3056	305605/23/2024107	23993
M38848_3056	305605/23/2024107	23997
M21372_3314	331405/22/2024107	32804
M2787_3314	331405/22/2024107	32811
M14363_3314	331405/22/2024107	32805
M21645_3314	331405/22/2024107	32805
M34419_3314	331405/22/2024107	32803
M33322_3314	331405/22/2024107	32803
M8170_3314	331405/22/2024107	32802
M41526_3314	331405/22/2024106	32804
M3223_3314	331405/22/2024106	32811
M20948_3314	331405/22/2024106	32802
M14545_3314	331405/22/2024106	32805
M33324_3314	331405/22/2024106	32801
M40967_3314	331405/22/2024106	32803
M8321_3314	331405/22/2024106	32802
M5794_3314	331405/24/2024107	32801
M32348_3314	331405/24/2024107	32803
M20948_3314	331405/24/2024107	32802
M21645_3314	331405/24/2024107	32805
M41061_3314	331405/24/2024107	32803
M8321_3314	331405/24/2024107	32802
M13972_3056	305605/24/2024107	23989
M2351_3056	305605/24/2024107	23994
M14598_3056	305605/24/2024107	23993
M19242_3056	305605/24/2024107	23993
M39438_3314	331405/25/202449	32804
M40079_3314	331405/25/202449	32804
M36703_3314	331405/25/202449	32805
M10274_3314	331405/25/202449	32801
M21741_3056	305605/22/2024106	23989
M32660_3056	305605/22/2024106	23989
M1884_3056	305605/22/2024106	23994
M14535_3056	305605/22/2024106	23995
M6578_3056	305605/22/2024106	23993
M6943_3056	305605/22/2024106	23997
M21653_3056	305605/22/2024106	23990
M5644_3056	305605/17/2024108	23991
M41561_3056	305605/18/2024107	23994
M10583_3056	305605/19/202449	23989
M39971_3056	305605/19/202449	23990
M13541_3056	305605/19/202449	23990
M21906_3314	331405/15/202449	32805
M15668_3314	331405/15/202449	32805
M16592_3056	305605/14/2024106	23996
M6847_3056	305605/14/2024106	23993
M6556_3056	305605/14/2024106	23993
M14891_3056	305605/14/2024106	23993
M21332_3056	305605/16/202449	23991
M13844_3056	305605/16/202449	23993
M15668_3056	305605/16/202449	23993
M35712_3056	305605/15/2024107	23990
M20047_3056	305605/15/2024107	23990
M14343_3056	305605/15/2024107	23990
M41036_3056	305605/15/2024107	23990
M1461_3314	331405/17/202449	32805
M9513_3314	331405/17/202449	32801
M16738_3056	305605/15/202449	23994
M15668_3056	305605/15/202449	23993
M40079_3314	331405/25/20242651	32804
M8170_3314	331405/25/20242651	32802
M14344_3314	331405/17/2024106	32802
M19288_3314	331405/17/2024106	32811
M13531_3314	331405/17/2024106	32805
M6574_3314	331405/17/2024106	32805
M7941_3314	331405/17/2024106	32802
M14891_3314	331405/25/2024107	32805
M6847_3314	331405/25/2024107	32805
M14571_3314	331405/25/2024107	32805
M11770_3314	331405/25/2024107	32805
M7941_3314	331405/25/2024107	32802
M21903_3314	331405/18/20242651	32804
M40391_3314	331405/18/20242651	32806
M40749_3314	331405/18/20242651	32801
M36310_3056	305605/20/2024107	23997
M34477_3056	305605/20/2024107	30079
M20047_3056	305605/20/2024107	23990
M14574_3056	305605/20/2024107	23993
M41558_3056	305605/20/2024107	23994
M36634_3056	305605/20/2024106	23995
M20595_3056	305605/20/2024106	23989
M6847_3056	305605/20/2024106	23993
M6556_3056	305605/20/2024106	23993
A3193_3056	305605/20/2024106	23996
A41_3056	305605/20/2024106	23995
M766_3314	331405/16/202449	32801
M36019_3314	331405/16/202449	32805
M41118_3056	305605/19/20242651	23989
M13541_3056	305605/19/20242651	23990
M6847_3314	331405/24/2024108	32805
M19833_3056	305605/26/20242651	23989
M1997_3056	305605/26/20242651	23994
M2984_3056	305605/26/20242651	23989
M34520_3314	331405/19/20242651	32808
M4595_3314	331405/19/20242651	32810
M8004_3314	331405/19/20242651	32802
M39587_3314	331405/22/202449	32804
M13850_3314	331405/22/202449	32805
M41558_3314	331405/26/202449	32804
M861_3314	331405/26/202449	32801
M14528_3314	331405/26/202449	32805
M13499_3314	331405/26/202449	32802
M8321_3314	331405/26/202449	32802
M2328_3056	305605/15/2024106	23994
M14545_3056	305605/15/2024106	23993
M19242_3056	305605/15/2024106	23993
A5762_3056	305605/15/2024106	23997
M14283_3314	331405/17/2024108	32805
M2030_3314	331405/19/2024107	32804
M14283_3314	331405/19/2024107	32805
M13770_3314	331405/19/2024107	32805
M14891_3314	331405/26/2024107	32805
M3872_3314	331405/26/2024107	32803
M20114_3314	331405/26/2024107	32805
M6574_3314	331405/26/2024107	32805
M33769_3314	331405/26/2024107	32801
M32949_3056	305605/23/2024107	23989
M6475_3056	305605/23/2024107	23993
M21662_3056	305605/23/2024107	23990
M14598_3056	305605/23/2024107	23993
M14891_3056	305605/23/2024107	23993
M21653_3056	305605/23/2024107	23990
M34755_3314	331405/22/2024107	32803
M19746_3314	331405/22/2024107	32803
M14301_3314	331405/22/2024107	32802
M14545_3314	331405/22/2024107	32805
M19759_3314	331405/22/2024107	32810
M10053_3314	331405/22/2024107	32811
M8321_3314	331405/22/2024107	32802
M19242_3314	331405/22/2024106	32805
A368_3314	331405/22/2024106	32803
M20846_3314	331405/22/2024106	32806
M14283_3314	331405/22/2024106	32805
M11770_3314	331405/22/2024106	32805
M9650_3314	331405/22/2024106	32803
M7941_3314	331405/22/2024106	32802
M19242_3314	331405/24/2024107	32805
M20993_3314	331405/24/2024107	32810
M14301_3314	331405/24/2024107	32802
M14545_3314	331405/24/2024107	32805
M13770_3314	331405/24/2024107	32805
M15473_3314	331405/24/2024107	32802
A1221_3056	305605/24/2024107	23991
M14301_3056	305605/24/2024107	23990
M14545_3056	305605/24/2024107	23993
M14891_3056	305605/24/2024107	23993
M2007_3314	331405/25/202449	32804
M40676_3314	331405/25/202449	32801
M40484_3314	331405/25/202449	32806
M9879_3314	331405/25/202449	32802
M2775_3056	305605/22/2024106	23997
M39853_3056	305605/22/2024106	23992
M19593_3056	305605/22/2024106	23994
M20114_3056	305605/22/2024106	23993
M14574_3056	305605/22/2024106	23993
M33411_3056	305605/22/2024106	23997
A1058_3056	305605/22/2024106	23997
M20943_3056	305605/17/2024108	23989
M33196_3056	305605/18/2024107	23990
M4880_3056	305605/19/202449	23991
M600_3056	305605/19/202449	23994
M14599_3056	305605/19/202449	23993
M14856_3056	305605/19/202449	23990
M766_3314	331405/15/202449	32801
M14528_3314	331405/15/202449	32805
M5630_3056	305605/14/2024106	23991
M21662_3056	305605/14/2024106	23990
M14545_3056	305605/14/2024106	23993
M19242_3056	305605/14/2024106	23993
M21908_3056	305605/16/202449	23996
M13850_3056	305605/16/202449	23993
M39261_3056	305605/15/2024107	30079
M20114_3056	305605/15/2024107	23993
M6578_3056	305605/15/2024107	23993
M34241_3056	305605/15/2024107	23993
M21906_3314	331405/17/202449	32805
M14598_3314	331405/17/202449	32805
M859_3056	305605/15/202449	23989
M14599_3056	305605/15/202449	23993
M41558_3314	331405/25/20242651	32804
M11624_3314	331405/25/20242651	32802
M9879_3314	331405/25/20242651	32802
M35726_3056	305605/16/2024108	23989
M2030_3314	331405/17/2024106	32804
A1222_3314	331405/17/2024106	32806
M14545_3314	331405/17/2024106	32805
M15073_3314	331405/17/2024106	32801
M2594_3314	331405/25/2024107	32801
M14257_3314	331405/25/2024107	32805
M13601_3314	331405/25/2024107	32803
A1146_3314	331405/25/2024107	32801
M8321_3314	331405/25/2024107	32802
M40079_3314	331405/18/20242651	32804
M20956_3314	331405/18/20242651	32810
M40955_3314	331405/18/20242651	32801
M33367_3056	305605/20/2024107	23995
M14095_3056	305605/20/2024107	23989
M6847_3056	305605/20/2024107	23993
M6578_3056	305605/20/2024107	23993
M32597_3056	305605/20/2024107	23995
M32679_3056	305605/20/2024106	23997
M9786_3056	305605/20/2024106	23990
M14290_3056	305605/20/2024106	23993
M14336_3056	305605/20/2024106	23993
M14891_3056	305605/20/2024106	23993
A721_3056	305605/20/2024106	23995
M214_3314	331405/16/202449	32805
M15668_3314	331405/16/202449	32805
M4595_3056	305605/19/20242651	23996
M14301_3056	305605/19/20242651	23990
M21653_3056	305605/19/20242651	23990
M19735_3314	331405/24/2024108	32805
M6570_3314	331405/24/2024108	32805
M10053_3056	305605/26/20242651	23989
M20047_3056	305605/26/20242651	23990
M2030_3314	331405/19/20242651	32804
M11624_3314	331405/19/20242651	32802
M14081_3314	331405/19/20242651	32802
M34515_3314	331405/22/202449	32803
M14647_3314	331405/22/202449	32801
M36024_3314	331405/26/202449	32805
M21908_3314	331405/26/202449	32803
M20044_3314	331405/26/202449	32805
M40141_3056	305605/15/2024106	23990
M9786_3056	305605/15/2024106	23990
M14342_3056	305605/15/2024106	23993
M19735_3056	305605/15/2024106	23993
M40079_3056	305605/15/2024106	23994
M6847_3314	331405/17/2024108	32805
M2027_3314	331405/19/2024107	32804
M36015_3314	331405/19/2024107	32805
M6574_3314	331405/19/2024107	32805
M8958_3314	331405/19/2024107	32802
M34582_3314	331405/26/2024107	32801
M14363_3314	331405/26/2024107	32805
M21645_3314	331405/26/2024107	32805
M13770_3314	331405/26/2024107	32805
M16593_3056	305605/23/2024107	23995
M21184_3056	305605/23/2024107	23991
M2351_3056	305605/23/2024107	23994
M14599_3056	305605/23/2024107	23993
M14574_3056	305605/23/2024107	23993
A3576_3056	305605/23/2024107	23997
M32944_3314	331405/22/2024107	32808
M2351_3314	331405/22/2024107	32804
M20596_3314	331405/22/2024107	32803
M14257_3314	331405/22/2024107	32805
M6578_3314	331405/22/2024107	32805
M13924_3314	331405/22/2024107	32803
M9615_3314	331405/22/2024107	32803
M8958_3314	331405/22/2024107	32802
M2351_3314	331405/22/2024106	32804
M40391_3314	331405/22/2024106	32806
M33401_3314	331405/22/2024106	32801
M6578_3314	331405/22/2024106	32805
M13770_3314	331405/22/2024106	32805
M34447_3314	331405/22/2024106	32808
M32499_3314	331405/22/2024106	32802
M14891_3314	331405/24/2024107	32805
M40391_3314	331405/24/2024107	32806
M36015_3314	331405/24/2024107	32805
M11770_3314	331405/24/2024107	32805
M9849_3314	331405/24/2024107	32802
M19833_3056	305605/24/2024107	23989
M10053_3056	305605/24/2024107	23989
M39971_3056	305605/24/2024107	23990
M6578_3056	305605/24/2024107	23993
M19735_3056	305605/24/2024107	23993
M36024_3314	331405/25/202449	32805
M40089_3314	331405/25/202449	32803
M32538_3314	331405/25/202449	32805
M14081_3314	331405/25/202449	32802
M5644_3056	305605/22/2024106	23991
M34462_3056	305605/22/2024106	30079
M14363_3056	305605/22/2024106	23993
M14598_3056	305605/22/2024106	23993
M19242_3056	305605/22/2024106	23993
A3228_3056	305605/22/2024106	23994
M21653_3056	305605/18/2024107	23990
M4595_3056	305605/19/202449	23996
M14647_3056	305605/19/202449	23989
M13844_3056	305605/19/202449	23993
M1461_3056	305605/19/202449	23993
A347_3056	305605/19/202449	23989
M1461_3314	331405/15/202449	32805
M9519_3314	331405/15/202449	32801
M13237_3056	305605/14/2024106	23989
M20114_3056	305605/14/2024106	23993
M14343_3056	305605/14/2024106	23990
M40016_3056	305605/14/2024106	30079
L331357_3056	305605/16/202449	23989
M14598_3056	305605/16/202449	23993
M19679_3056	305605/15/2024107	23997
M14301_3056	305605/15/2024107	23990
M14598_3056	305605/15/2024107	23993
M40078_3056	305605/15/2024107	23994
M37045_3314	331405/17/202449	32805
M34970_3314	331405/17/202449	32810
M34519_3056	305605/15/202449	30079
M33238_3056	305605/15/202449	23996
M38867_3056	305605/15/202449	23989
M4892_3314	331405/25/20242651	32801
M3501_3314	331405/25/20242651	32801
M19242_3314	331405/17/2024106	32805
M19288_3314	331405/17/2024106	32801
M20948_3314	331405/17/2024106	32802
M11624_3314	331405/17/2024106	32802
M10503_3314	331405/17/2024106	32803
M2351_3314	331405/25/2024107	32804
M20948_3314	331405/25/2024107	32802
M11624_3314	331405/25/2024107	32802
M9879_3314	331405/25/2024107	32802
M8170_3314	331405/25/2024107	32802
M2030_3314	331405/18/20242651	32804
M11624_3314	331405/18/20242651	32802
M8004_3314	331405/18/20242651	32802
A1087_3056	305605/20/2024107	23991
M34479_3056	305605/20/2024107	30079
M14599_3056	305605/20/2024107	23993
M13541_3056	305605/20/2024107	23990
M41561_3056	305605/20/2024107	23994
M13641_3056	305605/20/2024106	23989
M10076_3056	305605/20/2024106	23989
M20187_3056	305605/20/2024106	23995
M6578_3056	305605/20/2024106	23993
M40079_3056	305605/20/2024106	23994
M2007_3314	331405/16/202449	32804
M21908_3314	331405/16/202449	32810
M21938_3056	305605/21/2024108	23989
M9786_3056	305605/19/20242651	23990
M14343_3056	305605/19/20242651	23990
M13531_3314	331405/24/2024108	32805
M4595_3056	305605/26/20242651	23996
M14301_3056	305605/26/20242651	23990
M21653_3056	305605/26/20242651	23990
M14856_3314	331405/19/20242651	32802
M40391_3314	331405/19/20242651	32806
M33093_3314	331405/19/20242651	47692
M34520_3314	331405/22/202449	32808
M36703_3314	331405/22/202449	32805
A3503_3314	331405/26/202449	32804
M21903_3314	331405/26/202449	32804
M36703_3314	331405/26/202449	32805
M33769_3314	331405/26/202449	32801
M5644_3056	305605/15/2024106	23991
M14301_3056	305605/15/2024106	23990
M14598_3056	305605/15/2024106	23993
M40078_3056	305605/15/2024106	23994
M14891_3314	331405/17/2024108	32805
M6578_3314	331405/17/2024108	32805
A1219_3314	331405/19/2024107	32806
M21645_3314	331405/19/2024107	32805
M34445_3314	331405/19/2024107	32808
M2351_3314	331405/26/2024107	32804
M32231_3314	331405/26/2024107	32803
M13531_3314	331405/26/2024107	32805
A611_3314	331405/26/2024107	32803
M8321_3314	331405/26/2024107	32802
M32686_3056	305605/23/2024107	23997
M33103_3056	305605/23/2024107	23989
M14363_3056	305605/23/2024107	23993
M14571_3056	305605/23/2024107	23993
M32306_3056	305605/23/2024107	23989
M19760_3314	331405/22/2024107	32803
M41526_3314	331405/22/2024107	32804
M32572_3314	331405/22/2024107	32803
M20948_3314	331405/22/2024107	32802
M11624_3314	331405/22/2024107	32802
M15073_3314	331405/22/2024107	32801
M15122_3314	331405/22/2024107	32811
M7941_3314	331405/22/2024107	32802
M36744_3314	331405/22/2024106	32803
M39007_3314	331405/22/2024106	32811
M37134_3314	331405/22/2024106	32803
M13531_3314	331405/22/2024106	32805
M21934_3314	331405/22/2024106	32803
M40851_3314	331405/22/2024106	32811
M15473_3314	331405/22/2024106	32802
M2027_3314	331405/24/2024107	32804
M19739_3314	331405/24/2024107	32811
M14363_3314	331405/24/2024107	32805
M11624_3314	331405/24/2024107	32802
M15286_3314	331405/24/2024107	32811
M8170_3314	331405/24/2024107	32802
M9786_3056	305605/24/2024107	23990
M6847_3056	305605/24/2024107	23993
M14336_3056	305605/24/2024107	23993
M41558_3056	305605/24/2024107	23994
M34520_3314	331405/25/202449	32808
M2030_3314	331405/25/202449	32804
M40418_3314	331405/25/202449	32806
M3501_3314	331405/25/202449	32801
M19949_3056	305605/22/2024106	23996
M9650_3056	305605/22/2024106	23996
M2194_3056	305605/22/2024106	23994
M14599_3056	305605/22/2024106	23993
M13541_3056	305605/22/2024106	23990
M38102_3056	305605/22/2024106	23997
M34970_3056	305605/19/202449	23996
M11563_3056	305605/19/202449	23989
M13850_3056	305605/19/202449	23993
M20106_3056	305605/19/202449	23989
M9786_3314	331405/15/2024108	32802
M40042_3314	331405/15/202449	32801
M10583_3314	331405/15/202449	32801
M32316_3056	305605/14/2024106	23989
M20047_3056	305605/14/2024106	23990
M14574_3056	305605/14/2024106	23993
M41561_3056	305605/14/2024106	23994
M9734_3056	305605/16/202449	23989
M14638_3056	305605/16/202449	23993
M19921_3056	305605/15/2024107	23995
M2351_3056	305605/15/2024107	23994
M14599_3056	305605/15/2024107	23993
M19735_3056	305605/15/2024107	23993
M20278_3314	331405/17/202449	32804
M13844_3314	331405/17/202449	32805
M3316_3056	305605/15/202449	23991
M289_3056	305605/15/202449	23993
M14856_3314	331405/25/20242651	32802
M40484_3314	331405/25/20242651	32806
M40911_3056	305605/16/2024108	23989
M2351_3314	331405/17/2024106	32804
M19840_3314	331405/17/2024106	32801
M36015_3314	331405/17/2024106	32805
M34527_3314	331405/17/2024106	32803
M8170_3314	331405/17/2024106	32802
M2030_3314	331405/25/2024107	32804
M14301_3314	331405/25/2024107	32802
M14283_3314	331405/25/2024107	32805
M6574_3314	331405/25/2024107	32805
M15473_3314	331405/25/2024107	32802
M41036_3314	331405/18/20242651	32802
M13499_3314	331405/18/20242651	32802
M14081_3314	331405/18/20242651	32802
A1221_3056	305605/20/2024107	23991
M19864_3056	305605/20/2024107	23989
M14336_3056	305605/20/2024107	23993
M41104_3056	305605/20/2024107	23995
M21113_3056	305605/20/2024106	23992
M14301_3056	305605/20/2024106	23990
M14571_3056	305605/20/2024106	23993
M19735_3056	305605/20/2024106	23993
A2863_3056	305605/20/2024106	23994
M21906_3314	331405/16/202449	32805
M13844_3314	331405/16/202449	32805
M9786_3056	305605/21/2024108	23989
M32329_3056	305605/19/20242651	23994
M14856_3056	305605/19/20242651	23990
M19242_3314	331405/24/2024108	32805
M6574_3314	331405/24/2024108	32805
M9786_3056	305605/26/20242651	23990
M39971_3056	305605/26/20242651	23990
M4878_3056	305605/24/2024108	23989
M41138_3314	331405/19/20242651	32803
M9879_3314	331405/19/20242651	32802
M36024_3314	331405/22/202449	32805
M32538_3314	331405/22/202449	32805
M34520_3314	331405/26/202449	32808
M40924_3314	331405/26/202449	32803
M15668_3314	331405/26/202449	32805
M8004_3314	331405/26/202449	32802
M8321_3056	305605/15/2024106	23990
M14363_3056	305605/15/2024106	23993
M6556_3056	305605/15/2024106	23993
M40547_3056	305605/15/2024106	23989
M19242_3314	331405/17/2024108	32805
M13531_3314	331405/17/2024108	32805
M14856_3314	331405/19/2024107	32802
A1221_3314	331405/19/2024107	32806
M6578_3314	331405/19/2024107	32805
M8321_3314	331405/19/2024107	32802
M2030_3314	331405/26/2024107	32804
M21511_3314	331405/26/2024107	32803
M14571_3314	331405/26/2024107	32805
M34419_3314	331405/26/2024107	32803
M15473_3314	331405/26/2024107	32802
A1221_3056	305605/23/2024107	23991
M34458_3056	305605/23/2024107	30079
M6847_3056	305605/23/2024107	23993
M6578_3056	305605/23/2024107	23993
M41558_3056	305605/23/2024107	23994
M14856_3314	331405/22/2024107	32802
M21905_3314	331405/22/2024107	32804
M40391_3314	331405/22/2024107	32806
M13531_3314	331405/22/2024107	32805
M6529_3314	331405/22/2024107	32803
M13770_3314	331405/22/2024107	32805
M40801_3314	331405/22/2024107	32811
M19735_3314	331405/22/2024106	32805
M2030_3314	331405/22/2024106	32804
M19842_3314	331405/22/2024106	32803
M14258_3314	331405/22/2024106	32805
M11624_3314	331405/22/2024106	32802
M40905_3314	331405/22/2024106	32810
M34456_3314	331405/22/2024106	32808
M32944_3314	331405/24/2024107	32808
M21372_3314	331405/24/2024107	32804
M20110_3314	331405/24/2024107	32801
M14571_3314	331405/24/2024107	32805
M9879_3314	331405/24/2024107	32802
M39275_3314	331405/24/2024107	32808
A1219_3056	305605/24/2024107	23991
M437_3056	305605/24/2024107	23989
M14571_3056	305605/24/2024107	23993
M13541_3056	305605/24/2024107	23990
M40511_3056	305605/24/2024107	23996
M2340_3314	331405/25/202449	32804
M14528_3314	331405/25/202449	32805
M13499_3314	331405/25/202449	32802
M40931_3056	305605/22/2024106	23996
M32832_3056	305605/22/2024106	23989
M14301_3056	305605/22/2024106	23990
M14571_3056	305605/22/2024106	23993
M19735_3056	305605/22/2024106	23993
M40079_3056	305605/22/2024106	23994
M36624_3056	305605/22/2024106	23996
M15473_3056	305605/17/2024108	23989
M40391_3056	305605/19/202449	23991
M596_3056	305605/19/202449	23994
M21284_3056	305605/19/202449	23993
M21653_3056	305605/19/202449	23990
M39438_3314	331405/15/202449	32804
M13850_3314	331405/15/202449	32805
M40141_3056	305605/14/2024106	23990
M8321_3056	305605/14/2024106	23990
M14571_3056	305605/14/2024106	23993
M19735_3056	305605/14/2024106	23993
M33196_3056	305605/14/2024106	23990
M20082_3056	305605/16/202449	23993
M39630_3056	305605/16/202449	23994
M5644_3056	305605/15/2024107	23991
M39971_3056	305605/15/2024107	23990
M21284_3056	305605/15/2024107	23993
M41561_3056	305605/15/2024107	23994
M14113_3314	331405/17/202449	32804
M40042_3314	331405/17/202449	32801
M10583_3314	331405/17/202449	32801
M20082_3056	305605/15/202449	23993
M21284_3056	305605/15/202449	23993
M41036_3314	331405/25/20242651	32802
M14081_3314	331405/25/20242651	32802
M41200_3314	331405/17/2024106	32808
M21179_3314	331405/17/2024106	32811
M6578_3314	331405/17/2024106	32805
M9650_3314	331405/17/2024106	32810
M19242_3314	331405/25/2024107	32805
M21926_3314	331405/25/2024107	32810
M10266_3314	331405/25/2024107	32803
M9866_3314	331405/25/2024107	32801
M14856_3314	331405/18/20242651	32802
M21179_3314	331405/18/20242651	47692
M20954_3314	331405/18/20242651	32810
M8170_3314	331405/18/20242651	32802
M9786_3056	305605/20/2024107	23990
M14301_3056	305605/20/2024107	23990
M14571_3056	305605/20/2024107	23993
M19735_3056	305605/20/2024107	23993
M21653_3056	305605/20/2024107	23990
M5630_3056	305605/20/2024106	23991
M34479_3056	305605/20/2024106	30079
M20114_3056	305605/20/2024106	23993
M14343_3056	305605/20/2024106	23990
M33196_3056	305605/20/2024106	23990
M39438_3314	331405/16/202449	32804
M14528_3314	331405/16/202449	32805
M9734_3314	331405/16/202449	32801
M20596_3056	305605/21/2024108	23989
M40391_3056	305605/19/20242651	23991
M20047_3056	305605/19/20242651	23990
M41402_3056	305605/19/20242651	23994
M14258_3314	331405/24/2024108	32805
M40418_3056	305605/26/20242651	23991
M21662_3056	305605/26/20242651	23990
M14856_3056	305605/26/20242651	23990
M14912_3056	305605/24/2024108	23989
M38830_3314	331405/19/20242651	32801
M13499_3314	331405/19/20242651	32802
A3503_3314	331405/22/202449	32804
M34970_3314	331405/22/202449	32803
M39438_3314	331405/26/202449	32804
M2030_3314	331405/26/202449	32804
M40418_3314	331405/26/202449	32806
M9879_3314	331405/26/202449	32802
M20398_3056	305605/15/2024106	23991
M21662_3056	305605/15/2024106	23990
M20047_3056	305605/15/2024106	23990
M14574_3056	305605/15/2024106	23993
M33196_3056	305605/15/2024106	23990
M6570_3314	331405/17/2024108	32805
M40987_3314	331405/19/2024107	32811
M13531_3314	331405/19/2024107	32805
M41105_3314	331405/19/2024107	32810
M14856_3314	331405/26/2024107	32802
M33548_3314	331405/26/2024107	32810
M14258_3314	331405/26/2024107	32805
M6578_3314	331405/26/2024107	32805
M19998_3314	331405/26/2024107	32801
M21159_3056	305605/23/2024107	23989
M32316_3056	305605/23/2024107	23989
M34484_3056	305605/23/2024107	30079
M14545_3056	305605/23/2024107	23993
M14856_3056	305605/23/2024107	23990
A3044_3056	305605/23/2024107	30079
M40715_3314	331405/22/2024107	32803
M32654_3314	331405/22/2024107	32801
M6847_3314	331405/22/2024107	32805
M14283_3314	331405/22/2024107	32805
M11770_3314	331405/22/2024107	32805
M40920_3314	331405/22/2024107	32811
M34447_3314	331405/22/2024107	32808
M32948_3314	331405/22/2024106	32803
M39018_3314	331405/22/2024106	32801
M14363_3314	331405/22/2024106	32805
M36015_3314	331405/22/2024106	32805
M14343_3314	331405/22/2024106	32802
M9934_3314	331405/22/2024106	32803
M7968_3314	331405/22/2024106	32802
M14856_3314	331405/24/2024107	32802
M33496_3314	331405/24/2024107	32801
M40418_3314	331405/24/2024107	32806
M14283_3314	331405/24/2024107	32805
M33398_3314	331405/24/2024107	32801
M34477_3314	331405/24/2024107	32808
M2969_3056	305605/24/2024107	23989
M36652_3056	305605/24/2024107	30079
M20047_3056	305605/24/2024107	23990
M14343_3056	305605/24/2024107	23990
M34685_3056	305605/24/2024107	23996
M14856_3314	331405/25/202449	32802
M4892_3314	331405/25/202449	32801
M11624_3314	331405/25/202449	32802
M8170_3314	331405/25/202449	32802
M20732_3056	305605/22/2024106	23997
M34448_3056	305605/22/2024106	30079
M39971_3056	305605/22/2024106	23990
M14336_3056	305605/22/2024106	23993
M20112_3056	305605/22/2024106	23997
M9786_3056	305605/19/202449	23990
M33238_3056	305605/19/202449	23996
M15668_3056	305605/19/202449	23993
M41402_3056	305605/19/202449	23994
M21938_3314	331405/15/2024108	32802
M34520_3314	331405/15/202449	32808
M14599_3314	331405/15/202449	32805
M5644_3056	305605/14/2024106	23991
M14301_3056	305605/14/2024106	23990
M6578_3056	305605/14/2024106	23993
M40079_3056	305605/14/2024106	23994
M214_3056	305605/16/202449	23993
M5630_3056	305605/15/2024107	23991
M33534_3056	305605/15/2024107	23990
M6556_3056	305605/15/2024107	23993
M19242_3056	305605/15/2024107	23993
M33196_3056	305605/15/2024107	23990
M289_3314	331405/17/202449	32805
M36019_3314	331405/17/202449	32805
M32322_3056	305605/15/202449	23994
M14638_3056	305605/15/202449	23993
M2030_3314	331405/25/20242651	32804
M13499_3314	331405/25/20242651	32802
M41021_3056	305605/16/2024108	23989
M19735_3314	331405/17/2024106	32805
M40391_3314	331405/17/2024106	32806
M14571_3314	331405/17/2024106	32805
M13770_3314	331405/17/2024106	32805
M14856_3314	331405/25/2024107	32802
M32949_3314	331405/25/2024107	32801
M13531_3314	331405/25/2024107	32805
M6578_3314	331405/25/2024107	32805
M33322_3314	331405/25/2024107	32801
M41558_3314	331405/18/20242651	32804
M38088_3314	331405/18/20242651	32803
M21257_3314	331405/18/20242651	32801
M19391_3056	305605/20/2024107	23995
M38551_3056	305605/20/2024107	23989
M21662_3056	305605/20/2024107	23990
M14545_3056	305605/20/2024107	23993
M19242_3056	305605/20/2024107	23993
A2944_3056	305605/20/2024107	23996
M20912_3056	305605/20/2024106	23996
M34477_3056	305605/20/2024106	30079
M20047_3056	305605/20/2024106	23990
M14574_3056	305605/20/2024106	23993
M41561_3056	305605/20/2024106	23994
M1461_3314	331405/16/202449	32805
M14598_3314	331405/16/202449	32805
M40472_3056	305605/19/20242651	23991
M21662_3056	305605/19/20242651	23990
M12519_3314	331405/24/2024108	32801
M6578_3314	331405/24/2024108	32805
M9636_3056	305605/26/20242651	23989
M13541_3056	305605/26/20242651	23990
M21903_3314	331405/19/20242651	32804
M9650_3314	331405/19/20242651	32810
M39438_3314	331405/22/202449	32804
M766_3314	331405/22/202449	32801
M5768_3314	331405/22/202449	32801
M14856_3314	331405/26/202449	32802
M41036_3314	331405/26/202449	32802
M32538_3314	331405/26/202449	32805
M20912_3056	305605/15/2024106	23996
M19998_3056	305605/15/2024106	23989
M14599_3056	305605/15/2024106	23993
M6578_3056	305605/15/2024106	23993
M41561_3056	305605/15/2024106	23994
M14258_3314	331405/17/2024108	32805
M14891_3314	331405/19/2024107	32805
M20948_3314	331405/19/2024107	32802
M14343_3314	331405/19/2024107	32802
M8170_3314	331405/19/2024107	32802
M21986_3314	331405/26/2024107	32810
M6847_3314	331405/26/2024107	32805
M14545_3314	331405/26/2024107	32805
M9879_3314	331405/26/2024107	32802
M8170_3314	331405/26/2024107	32802
M32355_3056	305605/23/2024107	23989
M5804_3056	305605/23/2024107	23993
M14290_3056	305605/23/2024107	23993
M6556_3056	305605/23/2024107	23993
M32414_3056	305605/23/2024107	23997
M19735_3314	331405/22/2024107	32805
M2027_3314	331405/22/2024107	32804
M766_3314	331405/22/2024107	32803
M20114_3314	331405/22/2024107	32805
M40376_3314	331405/22/2024107	32802
M21627_3314	331405/22/2024107	32803
M9615_3314	331405/22/2024107	32810
M15473_3314	331405/22/2024107	32802
M14891_3314	331405/22/2024106	32805
M21905_3314	331405/22/2024106	32804
M40418_3314	331405/22/2024106	32806
M20114_3314	331405/22/2024106	32805
M6574_3314	331405/22/2024106	32805
M9879_3314	331405/22/2024106	32802
M9636_3314	331405/22/2024106	32801
M19735_3314	331405/24/2024107	32805
M2351_3314	331405/24/2024107	32804
M6847_3314	331405/24/2024107	32805
M13531_3314	331405/24/2024107	32805
M34419_3314	331405/24/2024107	32803
M7941_3314	331405/24/2024107	32802
M40319_3056	305605/24/2024107	23989
M32256_3056	305605/24/2024107	23989
M14363_3056	305605/24/2024107	23993
M6556_3056	305605/24/2024107	23993
M41561_3056	305605/24/2024107	23994
M21906_3314	331405/25/202449	32805
M41036_3314	331405/25/202449	32802
M13850_3314	331405/25/202449	32805
M8004_3314	331405/25/202449	32802
M5630_3056	305605/22/2024106	23991
M10076_3056	305605/22/2024106	23989
M21662_3056	305605/22/2024106	23990
M14342_3056	305605/22/2024106	23993
M14883_3056	305605/22/2024106	23997
M40078_3056	305605/22/2024106	23994
A3247_3056	305605/22/2024106	23996
M41118_3056	305605/19/202449	23989
M21662_3056	305605/19/202449	23990
M14638_3056	305605/19/202449	23993
M33062_3314	331405/15/202449	32805
M34970_3314	331405/15/202449	32810
M32348_3056	305605/14/2024106	23989
M1884_3056	305605/14/2024106	23994
M14599_3056	305605/14/2024106	23993
M13541_3056	305605/14/2024106	23990
M34241_3056	305605/14/2024106	23993
M34970_3056	305605/20/202449	23996
M34519_3056	305605/20/202449	30079
M34520_3056	305605/20/202449	30079
M33062_3056	305605/20/202449	23993
M3316_3056	305605/20/202449	23991
M859_3056	305605/20/202449	23989
M10583_3056	305605/20/202449	23989
M10588_3056	305605/20/202449	23989
M32711_3056	305605/20/202449	23994
M20278_3056	305605/20/202449	23994
M33241_3056	305605/20/202449	23996
M13844_3056	305605/20/202449	23993
M32324_3056	305605/20/202449	23994
M20082_3056	305605/20/202449	23993
M13850_3056	305605/20/202449	23993
M289_3056	305605/20/202449	23993
M14599_3056	305605/20/202449	23993
M14598_3056	305605/20/202449	23993
M21284_3056	305605/20/202449	23993
M1461_3056	305605/20/202449	23993
M14638_3056	305605/20/202449	23993
M15668_3056	305605/20/202449	23993
M40042_3056	305605/20/202449	23989
M16684_3056	305605/22/2024108	23989
A4982_3056	305605/20/202449	23992
A212_3056	305605/22/2024108	23989
M21330_3056	305605/14/202449	23991
M34520_3056	305605/14/202449	30079
M34518_3056	305605/14/202449	30079
M21908_3056	305605/14/202449	23996
M9734_3056	305605/14/202449	23989
M368_3056	305605/14/202449	23994
M32324_3056	305605/14/202449	23994
M33238_3056	305605/14/202449	23996
M14113_3056	305605/14/202449	23994
M9519_3056	305605/14/202449	23989
M859_3056	305605/14/202449	23989
M13850_3056	305605/14/202449	23993
M214_3056	305605/14/202449	23993
M13844_3056	305605/14/202449	23993
M14638_3056	305605/14/202449	23993
M20082_3056	305605/14/202449	23993
M14599_3056	305605/14/202449	23993
M21284_3056	305605/14/202449	23993
M14598_3056	305605/14/202449	23993
M15668_3056	305605/14/202449	23993
M1461_3056	305605/14/202449	23993
M40749_3056	305605/15/2024108	23989
M40676_3056	305605/15/2024108	23989
A347_3056	305605/15/2024108	23989
M41017_3056	305605/15/2024108	23989
M39457_3056	305605/15/2024108	23989
M19739_3056	305605/14/2024107	23989
M17308_3056	305605/14/2024107	23995
M34957_3056	305605/14/2024107	23996
A1219_3056	305605/14/2024107	23991
A1221_3056	305605/14/2024107	23991
M35712_3056	305605/14/2024107	23990
M8321_3056	305605/14/2024107	23990
M16684_3056	305605/14/2024107	23997
M9786_3056	305605/14/2024107	23990
M32256_3056	305605/14/2024107	23989
M10182_3056	305605/14/2024107	23989
M2351_3056	305605/14/2024107	23994
M14301_3056	305605/14/2024107	23990
M14363_3056	305605/14/2024107	23993
M33534_3056	305605/14/2024107	23990
M39971_3056	305605/14/2024107	23990
M6847_3056	305605/14/2024107	23993
M20047_3056	305605/14/2024107	23990
M20114_3056	305605/14/2024107	23993
M14571_3056	305605/14/2024107	23993
M14599_3056	305605/14/2024107	23993
M14342_3056	305605/14/2024107	23993
M14545_3056	305605/14/2024107	23993
M14598_3056	305605/14/2024107	23993
M21284_3056	305605/14/2024107	23993
M6556_3056	305605/14/2024107	23993
M6578_3056	305605/14/2024107	23993
M14574_3056	305605/14/2024107	23993
M13541_3056	305605/14/2024107	23990
M14343_3056	305605/14/2024107	23990
M19735_3056	305605/14/2024107	23993
M19242_3056	305605/14/2024107	23993
M14856_3056	305605/14/2024107	23990
M14891_3056	305605/14/2024107	23993
M40078_3056	305605/14/2024107	23994
M41561_3056	305605/14/2024107	23994
M40016_3056	305605/14/2024107	30079
M34241_3056	305605/14/2024107	23993
M33196_3056	305605/14/2024107	23990
M41036_3056	305605/14/2024107	23990
M21653_3056	305605/14/2024107	23990
M19833_3056	305605/26/202449	23989
M21375_3056	305605/26/202449	23989
M4595_3056	305605/26/202449	23996
M34970_3056	305605/26/202449	23996
M34519_3056	305605/26/202449	30079
M34520_3056	305605/26/202449	30079
M33062_3056	305605/26/202449	23993
M859_3056	305605/26/202449	23989
M37047_3056	305605/26/202449	23991
A1223_3056	305605/26/202449	23991
M40391_3056	305605/26/202449	23991
M40418_3056	305605/26/202449	23991
M9786_3056	305605/26/202449	23990
M10583_3056	305605/26/202449	23989
M14647_3056	305605/26/202449	23989
M9636_3056	305605/26/202449	23989
M10053_3056	305605/26/202449	23989
M1997_3056	305605/26/202449	23994
M20047_3056	305605/26/202449	23990
M1344_3056	305605/26/202449	23993
M33238_3056	305605/16/202449	23996
M9786_3056	305605/15/2024107	23990
M6847_3056	305605/15/2024107	23993
M14574_3056	305605/15/2024107	23993
M34520_3314	331405/17/202449	32808
M766_3314	331405/17/202449	32801
M15668_3314	331405/17/202449	32805
M9513_3056	305605/15/202449	23989
M1461_3056	305605/15/202449	23993
M2340_3314	331405/25/20242651	32804
M8321_3314	331405/25/20242651	32802
M14891_3314	331405/17/2024106	32805
M4595_3314	331405/17/2024106	32810
M20114_3314	331405/17/2024106	32805
M9879_3314	331405/17/2024106	32802
M8958_3314	331405/17/2024106	32802
A1076_3314	331405/25/2024107	32803
M14363_3314	331405/25/2024107	32805
M21645_3314	331405/25/2024107	32805
M14343_3314	331405/25/2024107	32802
M34422_3314	331405/25/2024107	32808
M2340_3314	331405/18/20242651	32804
M40348_3314	331405/18/20242651	32801
M9894_3314	331405/18/20242651	32801
M21578_3056	305605/20/2024107	23996
M9905_3056	305605/20/2024107	23989
M39971_3056	305605/20/2024107	23990
M6556_3056	305605/20/2024107	23993
M32404_3056	305605/20/2024107	23989
M18810_3056	305605/20/2024106	23992
M14363_3056	305605/20/2024106	23993
M14342_3056	305605/20/2024106	23993
M19242_3056	305605/20/2024106	23993
M39194_3056	305605/20/2024106	23995
M33241_3314	331405/16/202449	32810
M21942_3056	305605/21/2024108	23989
M20278_3056	305605/19/20242651	23994
M34532_3056	305605/19/20242651	23989
M14545_3314	331405/24/2024108	32805
M40391_3056	305605/26/20242651	23991
M14278_3056	305605/26/20242651	23989
M40079_3314	331405/19/20242651	32804
M40418_3314	331405/19/20242651	32806
M8170_3314	331405/19/20242651	32802
M40676_3314	331405/22/202449	32801
M15668_3314	331405/22/202449	32805
M40079_3314	331405/26/202449	32804
M40391_3314	331405/26/202449	32806
M21890_3314	331405/26/202449	32801
M14081_3314	331405/26/202449	32802
M20013_3056	305605/15/2024106	23994
M14571_3056	305605/15/2024106	23993
M13541_3056	305605/15/2024106	23990
M34241_3056	305605/15/2024106	23993
M11770_3314	331405/17/2024108	32805
M2351_3314	331405/19/2024107	32804
M20114_3314	331405/19/2024107	32805
M11770_3314	331405/19/2024107	32805
M19735_3314	331405/26/2024107	32805
M40392_3314	331405/26/2024107	32810
M20948_3314	331405/26/2024107	32802
M11624_3314	331405/26/2024107	32802
M9650_3314	331405/26/2024107	32803
M32740_3056	305605/23/2024107	23995
M39654_3056	305605/23/2024107	23991
M34450_3056	305605/23/2024107	30079
M20114_3056	305605/23/2024107	23993
M13541_3056	305605/23/2024107	23990
A2938_3056	305605/23/2024107	23995
M19952_3314	331405/22/2024107	32801
M2030_3314	331405/22/2024107	32804
M21053_3314	331405/22/2024107	32810
M14258_3314	331405/22/2024107	32805
M6574_3314	331405/22/2024107	32805
M9879_3314	331405/22/2024107	32802
M33147_3314	331405/22/2024107	32801
M32944_3314	331405/22/2024106	32808
M2027_3314	331405/22/2024106	32804
M6847_3314	331405/22/2024106	32805
M14257_3314	331405/22/2024106	32805
M19856_3314	331405/22/2024106	32803
M34419_3314	331405/22/2024106	32803
M33322_3314	331405/22/2024106	32801
M21174_3314	331405/22/2024106	32803
M20692_3314	331405/24/2024107	32803
M18879_3314	331405/24/2024107	32801
M20114_3314	331405/24/2024107	32805
M6574_3314	331405/24/2024107	32805
M33770_3314	331405/24/2024107	32801
M35425_3314	331405/24/2024107	32806
M21503_3056	305605/24/2024107	23989
M10076_3056	305605/24/2024107	23989
M21662_3056	305605/24/2024107	23990
M14342_3056	305605/24/2024107	23993
M33196_3056	305605/24/2024107	23990
A3503_3314	331405/25/202449	32804
M33409_3314	331405/25/202449	32803
M13844_3314	331405/25/202449	32805
M8321_3314	331405/25/202449	32802
M20885_3056	305605/22/2024106	23991
M9958_3056	305605/22/2024106	23989
M14290_3056	305605/22/2024106	23993
M14545_3056	305605/22/2024106	23993
M14856_3056	305605/22/2024106	23990
M41561_3056	305605/22/2024106	23994
A5762_3056	305605/22/2024106	23997
M32573_3056	305605/17/2024108	23989
M14545_3314	331405/21/2024108	32805
M34997_3056	305605/19/2024107	23996
M14301_3056	305605/19/2024107	23990
M14598_3056	305605/19/2024107	23993
M14891_3056	305605/19/2024107	23993
M5630_3056	305605/23/2024106	23991
M15078_3056	305605/23/2024106	23992
M21662_3056	305605/23/2024106	23990
M14545_3056	305605/23/2024106	23993
M14343_3056	305605/23/2024106	23990
M32205_3056	305605/26/202449	23989
M13850_3056	305605/26/202449	23993
M14343_3056	305605/26/202449	23990
M6556_3056	305605/22/2024106	23993
M14891_3056	305605/22/2024106	23993
M41036_3056	305605/22/2024106	23990
A3201_3056	305605/22/2024106	23992
M14891_3314	331405/21/2024108	32805
M11770_3314	331405/21/2024108	32805
A1221_3056	305605/19/2024107	23991
M39971_3056	305605/19/2024107	23990
M21284_3056	305605/19/2024107	23993
M40078_3056	305605/19/2024107	23994
M21677_3056	305605/23/2024106	23995
M9786_3056	305605/23/2024106	23990
M2908_3056	305605/23/2024106	23994
M20114_3056	305605/23/2024106	23993
M19735_3056	305605/23/2024106	23993
A3044_3056	305605/23/2024106	30079
M40743_3056	305605/23/2024106	23989
M40463_3056	305605/22/2024107	23991
M34462_3056	305605/22/2024107	30079
M6847_3056	305605/22/2024107	23993
M14598_3056	305605/22/2024107	23993
M41558_3056	305605/22/2024107	23994
M39438_3314	331405/23/202449	32804
M33062_3314	331405/23/202449	32805
M14528_3314	331405/23/202449	32805
M9513_3314	331405/23/202449	32801
M14891_3314	331405/23/2024107	32805
M6847_3314	331405/23/2024107	32805
M14257_3314	331405/23/2024107	32805
M32830_3314	331405/23/2024107	32803
M10053_3314	331405/23/2024107	32811
M8321_3314	331405/23/2024107	32802
M14301_3056	305605/16/2024106	23990
M13541_3056	305605/16/2024106	23990
M33196_3056	305605/16/2024106	23990
M14856_3314	331405/20/2024106	32802
M21905_3314	331405/20/2024106	32804
M19910_3314	331405/20/2024106	32809
M14283_3314	331405/20/2024106	32805
M11770_3314	331405/20/2024106	32805
M34425_3314	331405/20/2024106	32808
M19242_3314	331405/20/2024107	32805
M32632_3314	331405/20/2024107	32803
M40391_3314	331405/20/2024107	32806
M14571_3314	331405/20/2024107	32805
M34419_3314	331405/20/2024107	32803
M9744_3314	331405/20/2024107	32801
M8958_3314	331405/20/2024107	32802
A1221_3056	305605/26/2024107	23991
M14301_3056	305605/26/2024107	23990
M14545_3056	305605/26/2024107	23993
M14856_3056	305605/26/2024107	23990
M32944_3314	331405/23/2024106	32808
M2194_3314	331405/23/2024106	32804
M40529_3314	331405/23/2024106	32810
M36015_3314	331405/23/2024106	32805
M6578_3314	331405/23/2024106	32805
M15286_3314	331405/23/2024106	32801
M15473_3314	331405/23/2024106	32802
M9786_3056	305605/16/2024107	23990
M14599_3056	305605/16/2024107	23993
M14598_3056	305605/16/2024107	23993
M14856_3056	305605/16/2024107	23990
M19735_3314	331405/18/2024107	32805
M21179_3314	331405/18/2024107	32811
M11624_3314	331405/18/2024107	32802
M39263_3314	331405/18/2024107	32808
M14891_3314	331405/23/2024108	32805
A212_3314	331405/19/202449	42378
M10076_3056	305605/19/2024107	23989
M20956_3314	331405/19/20242651	32810
M33876_3314	331405/20/2024106	32810
M34504_3314	331405/20/2024106	32801
M20423_3056	305605/20/2024106	23994
M40494_3056	305605/20/2024106	30079
M41058_3056	305605/20/2024106	23996
M18432_3056	305605/24/2024106	23989
M6929_3056	305605/24/2024106	23989
M40806_3314	331405/24/2024107	32808
M14342_3314	331405/24/2024106	32805
M7941_3314	331405/24/2024106	32802
M32322_3056	305605/26/202449	23994
M13844_3056	305605/26/202449	23993
M14856_3056	305605/26/202449	23990
M33196_3056	305605/22/2024106	23990
M33009_3056	305605/22/2024106	23996
M19242_3314	331405/21/2024108	32805
M6574_3314	331405/21/2024108	32805
A1219_3056	305605/19/2024107	23991
M14363_3056	305605/19/2024107	23993
M6556_3056	305605/19/2024107	23993
M34546_3056	305605/19/2024107	23989
M36146_3056	305605/23/2024106	23995
M19878_3056	305605/23/2024106	23992
M34450_3056	305605/23/2024106	30079
M6847_3056	305605/23/2024106	23993
M14574_3056	305605/23/2024106	23993
M14861-166386_3056	305605/23/2024106	23989
M41515_3056	305605/23/2024106	23994
M4214_3056	305605/22/2024107	23989
M32205_3056	305605/22/2024107	23989
M21662_3056	305605/22/2024107	23990
M14545_3056	305605/22/2024107	23993
M19242_3056	305605/22/2024107	23993
M599_3314	331405/23/202449	32804
M35634_3314	331405/23/202449	32803
M13844_3314	331405/23/202449	32805
M19735_3314	331405/23/2024107	32805
M2351_3314	331405/23/2024107	32804
M40391_3314	331405/23/2024107	32806
M14545_3314	331405/23/2024107	32805
M19759_3314	331405/23/2024107	32801
M40843_3314	331405/23/2024107	32811
M5630_3056	305605/16/2024106	23991
M39971_3056	305605/16/2024106	23990
M14891_3056	305605/16/2024106	23993
M39194_3056	305605/16/2024106	23995
M32304_3314	331405/20/2024106	32801
A4872_3314	331405/20/2024106	32803
M40391_3314	331405/20/2024106	32806
M11624_3314	331405/20/2024106	32802
M40821_3314	331405/20/2024106	32811
M15473_3314	331405/20/2024106	32802
M41526_3314	331405/20/2024107	32804
M33627_3314	331405/20/2024107	32803
M14301_3314	331405/20/2024107	32802
M11624_3314	331405/20/2024107	32802
M9791_3314	331405/20/2024107	32801
M41010_3314	331405/20/2024107	32810
M20846_3056	305605/26/2024107	23991
M21662_3056	305605/26/2024107	23990
M14336_3056	305605/26/2024107	23993
M41561_3056	305605/26/2024107	23994
M14891_3314	331405/23/2024106	32805
M20651_3314	331405/23/2024106	32801
M14301_3314	331405/23/2024106	32802
M19737-166513_3314	331405/23/2024106	32801
M34419_3314	331405/23/2024106	32803
M34442_3314	331405/23/2024106	32808
M36634_3056	305605/16/2024107	23995
M9665_3056	305605/16/2024107	23989
M14571_3056	305605/16/2024107	23993
M19735_3056	305605/16/2024107	23993
M40795_3056	305605/16/2024107	23997
A1221_3314	331405/18/2024107	32806
M6570_3314	331405/18/2024107	32805
M7941_3314	331405/18/2024107	32802
M19242_3314	331405/23/2024108	32805
M32657_3314	331405/19/202449	32801
M19739_3056	305605/19/2024107	23989
A5825_3314	331405/20/2024106	32808
M40042_3314	331405/20/202449	32801
M2030_3056	305605/20/2024106	23994
L341668_3314	331405/20/2024106	32808
M33398_3056	305605/24/2024106	23989
M40042_3314	331405/24/202449	32801
M14647_3314	331405/24/202449	32801
M32360_3314	331405/24/2024106	32805
M16738_3056	305605/26/202449	23994
M20082_3056	305605/26/202449	23993
M1461_3056	305605/26/202449	23993
M41515_3056	305605/22/2024106	23994
M5630_3056	305605/17/2024108	23991
M20114_3314	331405/21/2024108	32805
M32256_3056	305605/19/2024107	23989
M14599_3056	305605/19/2024107	23993
M14343_3056	305605/19/2024107	23990
M33196_3056	305605/19/2024107	23990
M40924_3056	305605/23/2024106	23996
M20023_3056	305605/23/2024106	23997
M14301_3056	305605/23/2024106	23990
M14571_3056	305605/23/2024106	23993
M14891_3056	305605/23/2024106	23993
M21653_3056	305605/23/2024106	23990
M33856_3056	305605/22/2024107	23995
M20885_3056	305605/22/2024107	23991
M34448_3056	305605/22/2024107	30079
M20114_3056	305605/22/2024107	23993
M19735_3056	305605/22/2024107	23993
M33196_3056	305605/22/2024107	23990
M14883_3314	331405/23/202449	32803
M35575_3314	331405/23/202449	32803
M10588_3314	331405/23/202449	32801
M2027_3314	331405/23/2024107	32804
M21511_3314	331405/23/2024107	32803
M14571_3314	331405/23/2024107	32805
M32306_3314	331405/23/2024107	32803
M11539_3314	331405/23/2024107	32801
M8958_3314	331405/23/2024107	32802
A1223_3056	305605/16/2024106	23991
M6847_3056	305605/16/2024106	23993
M19242_3056	305605/16/2024106	23993
M21653_3056	305605/16/2024106	23990
M19242_3314	331405/20/2024106	32805
M40825_3314	331405/20/2024106	32811
M40411_3314	331405/20/2024106	32806
M21645_3314	331405/20/2024106	32805
M9650_3314	331405/20/2024106	32803
M8958_3314	331405/20/2024106	32802
M2027_3314	331405/20/2024107	32804
M32949_3314	331405/20/2024107	32811
M14289_3314	331405/20/2024107	32801
M6578_3314	331405/20/2024107	32805
M9879_3314	331405/20/2024107	32802
M40908_3314	331405/20/2024107	32811
M9636_3056	305605/26/2024107	23996
M14363_3056	305605/26/2024107	23993
M14598_3056	305605/26/2024107	23993
M19242_3056	305605/26/2024107	23993
M19735_3314	331405/23/2024106	32805
M40802_3314	331405/23/2024106	32811
M40418_3314	331405/23/2024106	32806
M14571_3314	331405/23/2024106	32805
M38765_3314	331405/23/2024106	32801
M9636_3314	331405/23/2024106	32810
M20912_3056	305605/16/2024107	23996
M2351_3056	305605/16/2024107	23994
M14342_3056	305605/16/2024107	23993
M19242_3056	305605/16/2024107	23993
M33196_3056	305605/16/2024107	23990
M20948_3314	331405/18/2024107	32802
M6578_3314	331405/18/2024107	32805
M8321_3314	331405/18/2024107	32802
M13531_3314	331405/23/2024108	32805
M10588_3056	305605/19/202449	23989
M2007_3314	331405/21/202449	32804
M32248_3314	331405/21/2024107	32801
M34461_3314	331405/21/2024107	32808
M21036_3314	331405/21/2024106	32809
M14342_3314	331405/21/2024106	32805
M32272_3314	331405/21/2024106	32801
M6475_3056	305605/24/2024106	23993
M6847-165894_3056	305605/24/2024106	23993
M40794_3314	331405/24/2024107	32811
M9650_3314	331405/24/2024107	32801
M289_3314	331405/24/202449	32805
M3742_3314	331405/24/2024106	32801
M600_3056	305605/26/202449	23994
M14599_3056	305605/26/202449	23993
M33196_3056	305605/26/202449	23990
M41609_3056	305605/22/2024106	23997
M19735_3314	331405/21/2024108	32805
M6578_3314	331405/21/2024108	32805
M3016_3056	305605/19/2024107	23989
M2351_3056	305605/19/2024107	23994
M14342_3056	305605/19/2024107	23993
M19242_3056	305605/19/2024107	23993
M40425_3056	305605/23/2024106	23991
M6475_3056	305605/23/2024106	23993
M39971_3056	305605/23/2024106	23990
M14598_3056	305605/23/2024106	23993
M19242_3056	305605/23/2024106	23993
M33196_3056	305605/23/2024106	23990
A1143_3056	305605/23/2024106	23997
A1219_3056	305605/22/2024107	23991
M9906_3056	305605/22/2024107	23989
M14363_3056	305605/22/2024107	23993
M6556_3056	305605/22/2024107	23993
M38102_3056	305605/22/2024107	23997
M12320_3314	331405/23/202449	32804
M766_3314	331405/23/202449	32801
M15668_3314	331405/23/202449	32805
M33279_3314	331405/23/2024107	32804
M40765_3314	331405/23/2024107	32803
M20948_3314	331405/23/2024107	32802
M11624_3314	331405/23/2024107	32802
M34419_3314	331405/23/2024107	32803
M40910_3314	331405/23/2024107	32803
M9766_3056	305605/16/2024106	23989
M20114_3056	305605/16/2024106	23993
M5630_3056	305605/14/2024107	23991
M3030_3314	331405/19/2024107	32811
M600_3314	331405/21/202449	32804
M7941_3314	331405/21/2024107	32802
M32554_3314	331405/21/2024106	32801
M34448_3056	305605/24/2024107	30079
M35618_3314	331405/24/202449	32804
M21179_3314	331405/24/2024106	32811
M40806_3314	331405/24/2024106	32808
M14301_3056	305605/26/202449	23990
M14598_3056	305605/26/202449	23993
M2984_3056	305605/26/202449	23989
M9786_3056	305605/17/2024108	23989
M14571_3314	331405/21/2024108	32805
M34376_3056	305605/19/2024107	23989
M20114_3056	305605/19/2024107	23993
M13541_3056	305605/19/2024107	23990
M41036_3056	305605/19/2024107	23990
M20133_3056	305605/23/2024106	23995
M9706_3056	305605/23/2024106	23995
M34484_3056	305605/23/2024106	30079
M20047_3056	305605/23/2024106	23990
M6556_3056	305605/23/2024106	23993
M14861-166387_3056	305605/23/2024106	23989
M20696_3056	305605/23/2024106	23995
M16572_3056	305605/22/2024107	23997
M9955_3056	305605/22/2024107	23989
M14290_3056	305605/22/2024107	23993
M14336_3056	305605/22/2024107	23993
M14891_3056	305605/22/2024107	23993
A3503_3314	331405/23/202449	32804
M1461_3314	331405/23/202449	32805
M13850_3314	331405/23/202449	32805
M37189_3314	331405/23/2024107	32804
M21855_3314	331405/23/2024107	32801
M39649_3314	331405/23/2024107	32806
M14283_3314	331405/23/2024107	32805
M14343_3314	331405/23/2024107	32802
M32316_3314	331405/23/2024107	32803
M15473_3314	331405/23/2024107	32802
M34957_3056	305605/16/2024106	23996
M21662_3056	305605/16/2024106	23990
M5644_3056	305605/14/2024107	23991
M36741_3314	331405/19/2024107	32801
A212_3314	331405/19/20242651	42378
M214_3314	331405/21/202449	32805
A1146_3314	331405/21/2024107	32801
M36015_3314	331405/21/2024106	32805
M21975_3314	331405/21/2024106	32807
M2030_3056	305605/21/2024107	23994
M2030_3056	305605/24/2024107	23994
M14342_3314	331405/24/2024107	32805
M10076_3314	331405/24/2024107	32801
M40911_3314	331405/24/2024106	32811
M36641_3314	331405/24/2024106	32801
M33241_3056	305605/26/202449	23996
M21284_3056	305605/26/202449	23993
M21653_3056	305605/26/202449	23990
M14258_3314	331405/21/2024108	32805
M35712_3056	305605/19/2024107	23990
M20047_3056	305605/19/2024107	23990
M14574_3056	305605/19/2024107	23993
M34241_3056	305605/19/2024107	23993
M19303_3056	305605/23/2024106	23989
M34358_3056	305605/23/2024106	23989
M2030_3056	305605/23/2024106	23994
M14342_3056	305605/23/2024106	23993
M14856_3056	305605/23/2024106	23990
A2858_3056	305605/23/2024106	23994
M38387_3056	305605/22/2024107	23989
M40931_3056	305605/22/2024107	23996
M34422_3056	305605/22/2024107	30079
M14599_3056	305605/22/2024107	23993
M14343_3056	305605/22/2024107	23990
M33409_3056	305605/22/2024107	23996
M12961_3314	331405/23/202449	32804
M36024_3314	331405/23/202449	32805
M36703_3314	331405/23/202449	32805
M32944_3314	331405/23/2024107	32808
M32349_3314	331405/23/2024107	32803
M40418_3314	331405/23/2024107	32806
M13531_3314	331405/23/2024107	32805
M11770_3314	331405/23/2024107	32805
M9650_3314	331405/23/2024107	32803
M8170_3314	331405/23/2024107	32802
M3040_3056	305605/16/2024106	23989
M14363_3056	305605/16/2024106	23993
M2030_3056	305605/14/2024107	23994
M34605_3314	331405/19/2024107	32801
M9876_3056	305605/19/2024107	23989
M32657_3314	331405/19/20242651	32801
M33241_3314	331405/21/202449	32810
M14342_3314	331405/21/2024107	32805
M40758_3314	331405/21/2024107	32811
M14598_3314	331405/21/2024106	32805
M21578_3314	331405/24/2024107	32810
M14599_3314	331405/24/2024107	32805
M34970_3314	331405/24/202449	32810
M21681_3314	331405/24/2024106	32807
M14598_3314	331405/24/2024106	32805
A3043_3314	331405/24/2024106	32808
M21662_3056	305605/26/202449	23990
M15668_3056	305605/26/202449	23993
M40042_3056	305605/26/202449	23989
M6847_3314	331405/21/2024108	32805
M19661_3314	331405/21/2024108	32801
M9786_3056	305605/19/2024107	23990
M6847_3056	305605/19/2024107	23993
M6578_3056	305605/19/2024107	23993
M41561_3056	305605/19/2024107	23994
M36146_3056	305605/23/2024106	23997
M33147_3056	305605/23/2024106	23989
M20924_3056	305605/23/2024106	23994
M14599_3056	305605/23/2024106	23993
M13541_3056	305605/23/2024106	23990
M40079_3056	305605/23/2024106	23994
A3192_3056	305605/23/2024106	23996
M21049_3056	305605/22/2024107	23996
M14095_3056	305605/22/2024107	23989
M20047_3056	305605/22/2024107	23990
M14574_3056	305605/22/2024107	23993
M41561_3056	305605/22/2024107	23994
M34520_3314	331405/23/202449	32808
M34515_3314	331405/23/202449	32803
M10583_3314	331405/23/202449	32801
M2030_3314	331405/23/2024107	32804
M40529_3314	331405/23/2024107	32810
M36015_3314	331405/23/2024107	32805
M6574_3314	331405/23/2024107	32805
M41061_3314	331405/23/2024107	32810
M7941_3314	331405/23/2024107	32802
M5804_3056	305605/16/2024106	23989
M20912_3056	305605/15/2024107	23996
M2030_3056	305605/15/2024107	23994
M40854_3314	331405/19/2024107	32811
M713_3314	331405/19/20242651	32801
M21908_3314	331405/21/202449	32810
M21678_3314	331405/21/2024107	32807
M32360_3314	331405/21/2024107	32805
M34112_3314	331405/21/2024106	32801
M4277_3314	331405/21/2024106	32807
M14255_3314	331405/21/2024106	32805
M32360_3314	331405/24/2024107	32805
A3043_3314	331405/24/2024107	32808
M10583_3314	331405/24/202449	32801
M14599_3314	331405/24/2024106	32805
M14278_3056	305605/26/202449	23989
M14638_3056	305605/26/202449	23993
M14283_3314	331405/21/2024108	32805
M33534_3056	305605/19/2024107	23990
M14545_3056	305605/19/2024107	23993
M14856_3056	305605/19/2024107	23990
M5644_3056	305605/23/2024106	23991
M5804_3056	305605/23/2024106	23993
M14363_3056	305605/23/2024106	23993
M14336_3056	305605/23/2024106	23993
M21853_3056	305605/23/2024106	23989
A4385_3056	305605/23/2024106	23994
M19921_3056	305605/22/2024107	23997
M9786_3056	305605/22/2024107	23990
M2351_3056	305605/22/2024107	23994
M14571_3056	305605/22/2024107	23993
M13541_3056	305605/22/2024107	23990
A486_3056	305605/22/2024107	23989
L221951_3314	331405/23/202449	32808
M861_3314	331405/23/202449	32801
M20044_3314	331405/23/202449	32805
M19242_3314	331405/23/2024107	32805
M32348_3314	331405/23/2024107	32803
M14301_3314	331405/23/2024107	32802
M6570_3314	331405/23/2024107	32805
M9879_3314	331405/23/2024107	32802
M33770_3314	331405/23/2024107	32801
M8321_3056	305605/16/2024106	23990
M14342_3056	305605/16/2024106	23993
M1942_3056	305605/15/2024106	23994
M10588_3056	305605/25/202449	23989
M40319_3056	305605/25/2024107	23989
M35712_3056	305605/21/2024107	23990
M713_3056	305605/21/2024107	23989
M41005_3056	305605/22/2024106	23996
M32686_3056	305605/20/2024107	23997
A1223_3056	305605/28/2024108	23991
M33062_3056	305605/27/202449	23993
M20082_3056	305605/27/202449	23993
M1347_3056	305605/27/202449	23993
M9734_3056	305605/21/202449	23989
M21356_3056	305605/23/2024106	23995
M36310_3056	305605/23/2024107	23997
M20912_3056	305605/27/2024106	23996
M9786_3056	305605/27/2024106	23990
M14363_3056	305605/27/2024106	23993
M14545_3056	305605/27/2024106	23993
M41475_3056	305605/27/2024106	23995
A293_3056	305605/27/2024106	23989
M39656_3056	305605/27/2024107	23993
M14290_3056	305605/27/2024107	23993
M14342_3056	305605/27/2024107	23993
M14856_3056	305605/27/2024107	23990
M36628_3056	305605/24/2024106	23996
M2007_3056	305605/28/202449	23994
M15668_3056	305605/28/202449	23993
M33772_3056	305605/28/2024106	23989
M32678_3056	305605/28/2024106	23990
M6363_3056	305605/28/2024106	23989
M14301_3056	305605/28/2024106	23990
M14571_3056	305605/28/2024106	23993
M14343_3056	305605/28/2024106	23990
M40079_3056	305605/28/2024106	23994
M41514_3056	305605/28/2024106	23992
M34520_3056	305605/31/202449	30079
M16738_3056	305605/31/202449	23994
M1347_3056	305605/31/202449	23993
M9786_3056	305605/28/2024107	23990
M14301_3056	305605/28/2024107	23990
M14545_3056	305605/28/2024107	23993
M19242_3056	305605/28/2024107	23993
M21653_3056	305605/28/2024107	23990
M5644_3056	305605/31/2024107	23991
M21662_3056	305605/31/2024107	23990
M14545_3056	305605/31/2024107	23993
M19242_3056	305605/31/2024107	23993
M15674_3056	305606/01/202449	23989
M15939_3056	305606/01/202449	23989
M33275_3056	305606/01/202449	23994
M20187_3056	305606/01/202449	23996
M1347_3056	305606/01/202449	23993
M21503_3056	305605/31/2024106	23995
M36582_3056	305605/31/2024106	23989
M1709_3056	305605/31/2024106	23994
M14545_3056	305605/31/2024106	23993
M19242_3056	305605/31/2024106	23993
M4277_3056	305605/31/2024106	23997
M9650_3056	305606/01/2024107	23989
M20114_3056	305606/01/2024107	23993
M13541_3056	305606/01/2024107	23990
M40079_3056	305606/01/2024107	23994
M34520_3056	305605/30/202449	30079
M35609_3056	305605/30/202449	23989
M38867_3056	305605/30/202449	23989
M20133_3056	305606/01/20242651	23989
M15939_3056	305606/01/20242651	23989
M13541_3056	305606/01/20242651	23990
A209_3056	305606/01/20242651	23989
M40451_3056	305605/30/2024106	23991
M10463_3056	305605/30/2024106	23995
M14363_3056	305605/30/2024106	23993
M14598_3056	305605/30/2024106	23993
M21957_3056	305605/30/2024106	23995
M39194_3056	305605/30/2024106	23995
M5644_3056	305605/30/2024107	23991
M21662_3056	305605/30/2024107	23990
M14598_3056	305605/30/2024107	23993
M19735_3056	305605/30/2024107	23993
M41411_3056	305605/30/2024107	23994
M38678_3056	305605/29/202449	23991
M20082_3056	305605/29/202449	23993
A4982_3056	305605/29/202449	23992
M179_3056	305605/29/2024106	23990
M9786_3056	305605/29/2024106	23990
M20732_3314	331405/21/2024107	32803
M40479_3314	331405/21/2024106	32806
M40467_3314	331405/24/2024106	32806
M39971_3056	305605/26/202449	23990
M13541_3056	305605/26/202449	23990
M40451_3314	331405/16/2024108	32806
A1219_3314	331405/16/2024108	32806
M20987_3314	331405/16/2024108	32806
M19735_3314	331405/15/2024107	32805
M14856_3314	331405/15/2024107	32802
M19242_3314	331405/15/2024107	32805
M2027_3314	331405/15/2024107	32804
M14891_3314	331405/15/2024107	32805
M2351_3314	331405/15/2024107	32804
M2030_3314	331405/15/2024107	32804
M40802_3314	331405/15/2024107	32811
M3411_3314	331405/15/2024107	32807
M34895_3314	331405/15/2024107	32801
M6847_3314	331405/15/2024107	32805
M4906_3314	331405/15/2024107	32803
M40391_3314	331405/15/2024107	32806
M40418_3314	331405/15/2024107	32806
M14301_3314	331405/15/2024107	32802
M14278_3314	331405/15/2024107	32807
M20114_3314	331405/15/2024107	32805
M20948_3314	331405/15/2024107	32802
M36015_3314	331405/15/2024107	32805
M14283_3314	331405/15/2024107	32805
M13531_3314	331405/15/2024107	32805
M14571_3314	331405/15/2024107	32805
M14545_3314	331405/15/2024107	32805
M21645_3314	331405/15/2024107	32805
M11624_3314	331405/15/2024107	32802
M6578_3314	331405/15/2024107	32805
M14343_3314	331405/15/2024107	32802
M6574_3314	331405/15/2024107	32805
M11770_3314	331405/15/2024107	32805
M19741_3314	331405/15/2024107	32801
M15554_3314	331405/15/2024107	32811
M9879_3314	331405/15/2024107	32802
M13770_3314	331405/15/2024107	32805
M10076_3314	331405/15/2024107	32801
M40496_3314	331405/15/2024107	32808
M34480_3314	331405/15/2024107	32808
M20955_3314	331405/15/2024107	32810
M7941_3314	331405/15/2024107	32802
M8321_3314	331405/15/2024107	32802
M15473_3314	331405/15/2024107	32802
M8170_3314	331405/15/2024107	32802
M8958_3314	331405/15/2024107	32802
M19735_3314	331405/22/2024108	32805
M19242_3314	331405/22/2024108	32805
M14891_3314	331405/22/2024108	32805
M35731_3314	331405/22/2024108	32801
M6847_3314	331405/22/2024108	32805
M14283_3314	331405/22/2024108	32805
M14258_3314	331405/22/2024108	32805
M13531_3314	331405/22/2024108	32805
M14571_3314	331405/22/2024108	32805
M6578_3314	331405/22/2024108	32805
M6570_3314	331405/22/2024108	32805
M11770_3314	331405/22/2024108	32805
M14545_3314	331405/22/2024108	32805
M6574_3314	331405/22/2024108	32805
M34518_3056	305605/25/202449	30079
M21908_3056	305605/25/202449	23996
M34520_3056	305605/25/202449	30079
M859_3056	305605/25/202449	23989
M33062_3056	305605/25/202449	23993
M40391_3056	305605/25/202449	23991
M40418_3056	305605/25/202449	23991
M9734_3056	305605/25/202449	23989
M15939_3056	305605/25/202449	23989
M20953_3056	305605/25/202449	23996
M9786_3056	305605/25/202449	23990
M9895_3056	305605/25/202449	23989
M9513_3056	305605/25/202449	23989
M40484_3056	305605/25/202449	23991
M10073_3056	305605/25/202449	23989
M21943_3056	305605/25/202449	23994
M14301_3056	305605/25/202449	23990
M13844_3056	305605/25/202449	23993
M599_3056	305605/25/202449	23994
M33241_3056	305605/25/202449	23996
M35964_3056	305605/25/202449	23994
M398_3056	305605/25/202449	23994
M21662_3056	305605/25/202449	23990
M13850_3056	305605/25/202449	23993
M39971_3056	305605/25/202449	23990
M20047_3056	305605/25/202449	23990
M20082_3056	305605/25/202449	23993
M14598_3056	305605/25/202449	23993
M14343_3056	305605/25/202449	23990
M14599_3056	305605/25/202449	23993
M14638_3056	305605/25/202449	23993
M21284_3056	305605/25/202449	23993
M15668_3056	305605/25/202449	23993
M13541_3056	305605/25/202449	23990
M14856_3056	305605/25/202449	23990
M1344_3056	305605/25/202449	23993
M1461_3056	305605/25/202449	23993
M6943_3056	305605/25/202449	23989
M33196_3056	305605/25/202449	23990
M40042_3056	305605/25/202449	23989
M33400_3056	305605/25/202449	23989
M21653_3056	305605/25/202449	23990
M39525_3056	305605/25/202449	23989
A209_3056	305605/25/202449	23989
M34201_3314	331405/14/202449	32804
M39438_3314	331405/14/202449	32804
M20278_3314	331405/14/202449	32804
M21906_3314	331405/14/202449	32805
M214_3314	331405/14/202449	32805
M34520_3314	331405/14/202449	32808
M33062_3314	331405/14/202449	32805
M21908_3314	331405/14/202449	32810
M33241_3314	331405/14/202449	32810
M1461_3314	331405/14/202449	32805
M14528_3314	331405/14/202449	32805
M766_3314	331405/14/202449	32801
M13844_3314	331405/14/202449	32805
M13850_3314	331405/14/202449	32805
M14599_3314	331405/14/202449	32805
M35627_3314	331405/14/202449	32801
M40924_3314	331405/15/2024106	32810
M6578_3314	331405/15/2024106	32805
M11770_3314	331405/15/2024106	32805
M40496_3314	331405/15/2024106	32808
M40310_3314	331405/21/202449	32803
M36703_3314	331405/21/202449	32805
M19735_3314	331405/14/2024106	32805
M32623_3314	331405/14/2024106	32807
A2944_3314	331405/14/2024106	32810
M6479_3314	331405/14/2024106	32801
M15473_3314	331405/14/2024106	32802
M33279_3314	331405/21/2024107	32804
M40710_3314	331405/21/2024107	32803
M14283_3314	331405/21/2024107	32805
M40883_3314	331405/21/2024107	32811
M9650_3314	331405/21/2024107	32803
M8170_3314	331405/21/2024107	32802
M39261_3056	305605/19/2024107	30079
M14571_3056	305605/19/2024107	23993
M19735_3056	305605/19/2024107	23993
M21653_3056	305605/19/2024107	23990
M15121_3056	305605/23/2024106	23995
M40090_3056	305605/23/2024106	23992
M34458_3056	305605/23/2024106	30079
M14290_3056	305605/23/2024106	23993
M6578_3056	305605/23/2024106	23993
A435_3056	305605/23/2024106	23997
A2184_3056	305605/23/2024106	23995
M2787_3056	305605/22/2024107	23989
M38551_3056	305605/22/2024107	23989
M14301_3056	305605/22/2024107	23990
M14342_3056	305605/22/2024107	23993
M14856_3056	305605/22/2024107	23990
M21653_3056	305605/22/2024107	23990
L221951_3314	331405/23/202449	32803
A1938_3314	331405/23/202449	32808
M32538_3314	331405/23/202449	32805
M14856_3314	331405/23/2024107	32802
M40798_3314	331405/23/2024107	32811
M14363_3314	331405/23/2024107	32805
M21645_3314	331405/23/2024107	32805
M13770_3314	331405/23/2024107	32805
A3043_3314	331405/23/2024107	32808
M9786_3056	305605/16/2024106	23990
M14599_3056	305605/16/2024106	23993
M2340_3056	305605/15/2024106	23994
M39194_3056	305605/15/2024106	23995
M10587_3056	305605/20/202449	23989
M40931_3056	305605/21/2024107	23996
M4585_3056	305605/21/2024106	23997
M5644_3056	305605/20/2024107	23991
M5644_3056	305605/28/2024108	23991
M3316_3056	305605/27/202449	23991
M20278_3056	305605/27/202449	23994
M38867_3056	305605/27/202449	23989
A2938_3056	305605/22/2024107	23995
M21804_3056	305605/23/2024107	23989
M21853_3056	305605/23/2024107	23989
M9906_3056	305605/27/2024106	23989
M34487_3056	305605/27/2024106	30079
M6847_3056	305605/27/2024106	23993
M40715_3056	305605/27/2024106	23996
M40998_3056	305605/27/2024106	23996
M41066_3056	305605/27/2024106	23990
A1221_3056	305605/27/2024107	23991
M20047_3056	305605/27/2024107	23990
M13541_3056	305605/27/2024107	23990
M20954_3056	305605/27/2024107	23996
M9955_3056	305605/23/2024108	23989
M32329_3056	305605/28/202449	23994
M14599_3056	305605/28/202449	23993
M41617_3056	305605/28/202449	23993
M36069_3056	305605/28/2024106	23995
M9786_3056	305605/28/2024106	23990
M20013_3056	305605/28/2024106	23994
M40151_3056	305605/28/2024106	23996
M14598_3056	305605/28/2024106	23993
M14856_3056	305605/28/2024106	23990
A3204_3056	305605/28/2024106	23996
M599_3056	305605/31/202449	23994
M13850_3056	305605/31/202449	23993
M17308_3056	305605/28/2024107	23995
M34434_3056	305605/28/2024107	30079
M14290_3056	305605/28/2024107	23993
M14343_3056	305605/28/2024107	23990
A4290_3056	305605/28/2024107	23995
M9906_3056	305605/31/2024107	23989
M39971_3056	305605/31/2024107	23990
M6578_3056	305605/31/2024107	23993
M40079_3056	305605/31/2024107	23994
M34520_3056	305606/01/202449	30079
M9734_3056	305606/01/202449	23989
M21866_3056	305606/01/202449	23990
M15668_3056	305606/01/202449	23993
M20954_3056	305606/01/202449	23996
M8321_3056	305605/31/2024106	23990
M10266_3056	305605/31/2024106	23993
M6847_3056	305605/31/2024106	23993
M6578_3056	305605/31/2024106	23993
M40078_3056	305605/31/2024106	23994
M14301_3056	305606/01/2024107	23990
M14545_3056	305606/01/2024107	23993
M14856_3056	305606/01/2024107	23990
M21653_3056	305606/01/2024107	23990
M2007_3056	305605/30/202449	23994
M14599_3056	305605/30/202449	23993
M40418_3056	305606/01/20242651	23991
M21662_3056	305606/01/20242651	23990
M40079_3056	305606/01/20242651	23994
M5644_3056	305605/30/2024106	23991
M39261_3056	305605/30/2024106	30079
M20114_3056	305605/30/2024106	23993
M14343_3056	305605/30/2024106	23990
M41411_3056	305605/30/2024106	23994
M4929_3056	305605/30/2024107	23989
M20195_3056	305605/30/2024107	23989
M14363_3056	305605/30/2024107	23993
M6578_3056	305605/30/2024107	23993
M14891_3056	305605/30/2024107	23993
M14598_3314	331405/14/202449	32805
M21511_3314	331405/15/2024106	32807
M14283_3314	331405/15/2024106	32805
M6574_3314	331405/15/2024106	32805
M7941_3314	331405/15/2024106	32802
M766_3314	331405/21/202449	32801
M13844_3314	331405/21/202449	32805
M2351_3314	331405/14/2024106	32804
M40418_3314	331405/14/2024106	32806
M6578_3314	331405/14/2024106	32805
M39262_3314	331405/14/2024106	32808
M14856_3314	331405/21/2024107	32802
M2030_3314	331405/21/2024107	32804
M14301_3314	331405/21/2024107	32802
M6574_3314	331405/21/2024107	32805
M19908_3314	331405/21/2024107	32802
M34452_3314	331405/21/2024107	32808
M40078_3056	305605/23/2024106	23994
M32603_3056	305605/22/2024107	23997
A1221_3056	305605/22/2024107	23991
M20195_3056	305605/22/2024107	23989
M39971_3056	305605/22/2024107	23990
M6578_3056	305605/22/2024107	23993
M40528_3056	305605/22/2024107	23997
M21906_3314	331405/23/202449	32805
M21908_3314	331405/23/202449	32803
M9722_3314	331405/23/202449	32801
M41518_3314	331405/23/2024107	32804
M18839_3314	331405/23/2024107	32811
M14258_3314	331405/23/2024107	32805
M6578_3314	331405/23/2024107	32805
M21890_3314	331405/23/2024107	32811
M34442_3314	331405/23/2024107	32808
M5644_3056	305605/16/2024106	23991
M20047_3056	305605/16/2024106	23990
M20174_3056	305605/15/2024106	23992
M19874_3314	331405/15/2024106	32807
M35712_3056	305605/25/2024107	23990
M10583_3056	305605/22/202449	23989
M33062_3056	305605/24/202449	23993
M20988_3056	305605/22/2024106	23991
M5630_3056	305605/26/2024107	23991
M20112_3056	305605/21/2024106	23997
M39674_3056	305605/20/2024107	23995
M5644_3056	305605/24/2024107	23991
M34520_3056	305605/27/202449	30079
M289_3056	305605/27/202449	23993
M14638_3056	305605/27/202449	23993
M35712_3056	305605/22/2024107	23990
M20658_3056	305605/23/2024106	23989
M33856_3056	305605/23/2024107	23995
M5630_3056	305605/23/2024107	23991
M32554_3056	305605/23/2024107	23989
M40924_3056	305605/27/2024106	23997
M34431_3056	305605/27/2024106	30079
M508_3056	305605/27/2024106	23997
M6578_3056	305605/27/2024106	23993
M14574_3056	305605/27/2024106	23993
M36308_3056	305605/27/2024106	23989
M8321_3056	305605/27/2024107	23990
M14363_3056	305605/27/2024107	23993
M14598_3056	305605/27/2024107	23993
M14891_3056	305605/27/2024107	23993
M21908_3056	305605/28/202449	23996
M16738_3056	305605/28/202449	23994
M14638_3056	305605/28/202449	23993
M5630_3056	305605/28/2024106	23991
M34461_3056	305605/28/2024106	30079
M2349_3056	305605/28/2024106	23994
M14599_3056	305605/28/2024106	23993
M19735_3056	305605/28/2024106	23993
A283_3056	305605/28/2024106	23989
A721_3056	305605/28/2024106	23995
M33062_3056	305605/31/202449	23993
M1344_3056	305605/31/202449	23993
M32660_3056	305605/28/2024107	23989
M39971_3056	305605/28/2024107	23990
M6578_3056	305605/28/2024107	23993
M34532_3056	305605/28/2024107	23989
A1950_3056	305605/28/2024107	23989
M3863_3056	305605/31/2024107	23989
M15939_3056	305605/31/2024107	23989
M14290_3056	305605/31/2024107	23993
M14598_3056	305605/31/2024107	23993
M14891_3056	305605/31/2024107	23993
M21908_3056	305606/01/202449	23996
M9786_3056	305606/01/202449	23990
M19595_3056	305606/01/202449	23994
M14599_3056	305606/01/202449	23993
M40079_3056	305606/01/202449	23994
M40425_3056	305605/31/2024106	23991
M9650_3056	305605/31/2024106	23997
M14363_3056	305605/31/2024106	23993
M14571_3056	305605/31/2024106	23993
M14891_3056	305605/31/2024106	23993
M21653_3056	305605/31/2024106	23990
M9786_3056	305606/01/2024107	23990
M39971_3056	305606/01/2024107	23990
M14343_3056	305606/01/2024107	23990
M40078_3056	305606/01/2024107	23994
M34518_3056	305605/30/202449	30079
M289_3056	305605/30/202449	23993
M1347_3056	305605/30/202449	23993
M40141_3056	305606/01/20242651	23990
M1883_3056	305606/01/20242651	23994
M14856_3056	305606/01/20242651	23990
M40733_3056	305605/31/2024108	23989
M20394_3056	305605/30/2024106	23991
M10266_3056	305605/30/2024106	23993
M14290_3056	305605/30/2024106	23993
M6556_3056	305605/30/2024106	23993
M14891_3056	305605/30/2024106	23993
M41511_3056	305605/30/2024106	23990
M9786_3056	305605/30/2024107	23990
M14301_3056	305605/30/2024107	23990
M14342_3056	305605/30/2024107	23993
M14856_3056	305605/30/2024107	23990
M41561_3056	305605/30/2024107	23994
M34519_3056	305605/29/202449	30079
M13844_3056	305605/29/202449	23993
M15668_3314	331405/14/202449	32805
M6847_3314	331405/15/2024106	32805
M14571_3314	331405/15/2024106	32805
M40905_3314	331405/15/2024106	32810
M8958_3314	331405/15/2024106	32802
M1461_3314	331405/21/202449	32805
M40342_3314	331405/21/202449	32803
M2030_3314	331405/14/2024106	32804
M13531_3314	331405/14/2024106	32805
M6570_3314	331405/14/2024106	32805
M7941_3314	331405/14/2024106	32802
M19242_3314	331405/21/2024107	32805
M16625_3314	331405/21/2024107	32803
M14858_3314	331405/21/2024107	32803
M11770_3314	331405/21/2024107	32805
M15286_3314	331405/21/2024107	32811
M15473_3314	331405/21/2024107	32802
M19054_3056	305605/16/202449	23991
M34997_3056	305605/25/2024107	23996
M2969_3056	305605/21/2024107	23989
M5644_3056	305605/26/2024107	23991
M6943_3056	305605/21/2024106	23997
M5630_3056	305605/28/2024108	23991
M11563_3056	305605/24/2024107	23989
M21398_3056	305605/24/2024107	23989
M34970_3056	305605/27/202449	23996
M14385_3056	305605/27/202449	23994
M14599_3056	305605/27/202449	23993
M5630_3056	305605/22/2024107	23991
M34957_3056	305605/23/2024107	23996
M5644_3056	305605/27/2024106	23991
M14301_3056	305605/27/2024106	23990
M14571_3056	305605/27/2024106	23993
M14343_3056	305605/27/2024106	23990
M40494_3056	305605/27/2024106	30079
M32988_3056	305605/27/2024106	23992
A1219_3056	305605/27/2024107	23991
M20114_3056	305605/27/2024107	23993
M14343_3056	305605/27/2024107	23990
M41561_3056	305605/27/2024107	23994
M21330_3056	305605/28/202449	23991
M21903_3056	305605/28/202449	23996
M1344_3056	305605/28/202449	23993
M5644_3056	305605/28/2024106	23991
M5804_3056	305605/28/2024106	23993
M36809_3056	305605/28/2024106	23994
M20114_3056	305605/28/2024106	23993
M11770_3056	305605/28/2024106	23993
M40078_3056	305605/28/2024106	23994
A2815_3056	305605/28/2024106	23992
M34519_3056	305605/31/202449	30079
M21903_3056	305605/31/202449	23996
M38867_3056	305605/31/202449	23989
M34461_3056	305605/28/2024107	30079
M6847_3056	305605/28/2024107	23993
M6556_3056	305605/28/2024107	23993
M32404_3056	305605/28/2024107	23996
A347_3056	305605/28/2024107	23989
M9786_3056	305605/31/2024107	23990
M14363_3056	305605/31/2024107	23993
M6556_3056	305605/31/2024107	23993
M40078_3056	305605/31/2024107	23994
M33062_3056	305606/01/202449	23993
M10073_3056	305606/01/202449	23989
M35964_3056	305606/01/202449	23994
M14343_3056	305606/01/202449	23990
M33196_3056	305606/01/202449	23990
M3685_3056	305605/31/2024106	23995
M40908_3056	305605/31/2024106	23996
M14456_3056	305605/31/2024106	23994
M14599_3056	305605/31/2024106	23993
M14343_3056	305605/31/2024106	23990
M40079_3056	305605/31/2024106	23994
M40904_3056	305606/01/2024107	23996
M14599_3056	305606/01/2024107	23993
M11770_3056	305606/01/2024107	23993
M41561_3056	305606/01/2024107	23994
M368_3056	305605/30/202449	23994
M13850_3056	305605/30/202449	23993
M15674_3056	305606/01/20242651	23989
M33275_3056	305606/01/20242651	23994
M6943_3056	305606/01/20242651	23989
M10076_3056	305605/31/2024108	23989
M5630_3056	305605/30/2024106	23991
M10734_3056	305605/30/2024106	30079
M6847_3056	305605/30/2024106	23993
M6578_3056	305605/30/2024106	23993
M19845_3056	305605/30/2024106	23995
M21653_3056	305605/30/2024106	23990
M40391_3056	305605/30/2024107	23991
M14290_3056	305605/30/2024107	23993
M14571_3056	305605/30/2024107	23993
M21070_3056	305605/30/2024107	23989
A2938_3056	305605/30/2024107	23995
M34520_3056	305605/29/202449	30079
M13850_3056	305605/29/202449	23993
M34957_3056	305605/29/2024106	23996
M34462_3056	305605/29/2024106	30079
M18841_3314	331405/21/2024107	32811
M36015_3314	331405/21/2024107	32805
M14598_3314	331405/21/2024107	32805
M9791_3314	331405/21/2024107	32801
M7975_3314	331405/24/2024106	32809
M36019_3314	331405/14/202449	32805
M40391_3314	331405/15/2024106	32806
M13531_3314	331405/15/2024106	32805
M32660_3314	331405/15/2024106	32801
M33062_3314	331405/21/202449	32805
M13850_3314	331405/21/202449	32805
M19242_3314	331405/14/2024106	32805
M14301_3314	331405/14/2024106	32802
M14545_3314	331405/14/2024106	32805
A5762_3314	331405/14/2024106	32803
M19735_3314	331405/21/2024107	32805
M2677_3314	331405/21/2024107	32801
M40418_3314	331405/21/2024107	32806
M11624_3314	331405/21/2024107	32802
M15286_3314	331405/21/2024107	32801
A3040_3314	331405/21/2024107	32808
M4595_3056	305605/16/2024107	23996
M5630_3056	305605/25/2024107	23991
M10053_3056	305605/21/2024107	23989
M179_3056	305605/20/2024107	23995
M5630_3056	305605/24/2024107	23991
M14647_3056	305605/27/202449	23989
M15668_3056	305605/27/202449	23993
M21424_3056	305605/23/2024106	23997
M4702_3056	305605/27/2024106	23997
M33279_3056	305605/27/2024106	23994
M20114_3056	305605/27/2024106	23993
M13541_3056	305605/27/2024106	23990
M40078_3056	305605/27/2024106	23994
M40917_3056	305605/27/2024106	23997
M34431_3056	305605/27/2024107	30079
M39971_3056	305605/27/2024107	23990
M11770_3056	305605/27/2024107	23993
M2787_3056	305605/23/2024108	23989
M39852_3056	305605/24/2024106	23992
M9734_3056	305605/28/202449	23989
M13844_3056	305605/28/202449	23993
M38867_3056	305605/28/202449	23989
M38834_3056	305605/28/2024106	23995
M40851_3056	305605/28/2024106	23996
M33263_3056	305605/28/2024106	23994
M14290_3056	305605/28/2024106	23993
M14912_3056	305605/28/2024106	23989
M14891_3056	305605/28/2024106	23993
M21424_3056	305605/28/2024106	23997
M9513_3056	305605/31/202449	23989
M20082_3056	305605/31/202449	23993
M16559_3056	305605/28/2024107	23995
M5804_3056	305605/28/2024107	23993
M20114_3056	305605/28/2024107	23993
M13541_3056	305605/28/2024107	23990
M40079_3056	305605/28/2024107	23994
M32651_3056	305605/31/2024107	23989
M10569_3056	305605/31/2024107	23989
M20047_3056	305605/31/2024107	23990
M14343_3056	305605/31/2024107	23990
M33196_3056	305605/31/2024107	23990
M859_3056	305606/01/202449	23989
M10588_3056	305606/01/202449	23989
M21662_3056	305606/01/202449	23990
M21284_3056	305606/01/202449	23993
M41558_3056	305606/01/202449	23994
M20983_3056	305605/31/2024106	23996
M39263_3056	305605/31/2024106	30079
M39971_3056	305605/31/2024106	23990
M6556_3056	305605/31/2024106	23993
M41066_3056	305605/31/2024106	23990
M19281_3056	305606/01/2024107	23990
M21662_3056	305606/01/2024107	23990
M14342_3056	305606/01/2024107	23993
M9126_3056	305606/01/2024107	23989
M33062_3056	305605/30/202449	23993
M20082_3056	305605/30/202449	23993
M20840_3056	305606/01/20242651	23991
M14301_3056	305606/01/20242651	23990
M41561_3056	305606/01/20242651	23994
M8321_3056	305605/30/2024106	23990
M21020_3056	305605/30/2024106	23994
M14599_3056	305605/30/2024106	23993
M13541_3056	305605/30/2024106	23990
M41561_3056	305605/30/2024106	23994
M14384_3056	305605/30/2024107	23989
M5722_3056	305605/30/2024107	23989
M20047_3056	305605/30/2024107	23990
M14574_3056	305605/30/2024107	23993
M41369_3056	305605/30/2024107	23997
M21653_3056	305605/30/2024107	23990
M10583_3056	305605/29/202449	23989
M14598_3056	305605/29/202449	23993
M179_3056	305605/29/2024106	23995
M8321_3056	305605/29/2024106	23990
M21662_3056	305605/29/2024106	23990
M14255_3314	331405/21/2024107	32805
A3046_3314	331405/21/2024107	32808
M14599_3314	331405/21/2024106	32805
M34461_3314	331405/21/2024106	32808
M9734_3314	331405/14/202449	32801
M14891_3314	331405/15/2024106	32805
M40418_3314	331405/15/2024106	32806
M14545_3314	331405/15/2024106	32805
M9879_3314	331405/15/2024106	32802
M36024_3314	331405/21/202449	32805
M32538_3314	331405/21/202449	32805
M14344_3314	331405/14/2024106	32802
M6847_3314	331405/14/2024106	32805
M21645_3314	331405/14/2024106	32805
M13770_3314	331405/14/2024106	32805
M20174_3314	331405/14/2024106	32809
M3030_3314	331405/21/2024107	32811
M20399_3314	331405/21/2024107	32806
M14343_3314	331405/21/2024107	32802
M9879_3314	331405/21/2024107	32802
M9746_3314	331405/21/2024107	32801
M2030_3056	305605/16/2024107	23994
M5644_3056	305605/25/2024107	23991
M38867_3056	305605/22/202449	23989
M9729_3056	305605/24/202449	23989
M32349_3056	305605/21/2024107	23997
M14363_3056	305605/21/2024107	23993
M19842_3056	305605/28/2024108	23989
M33003_3056	305605/27/202449	23991
M21903_3056	305605/27/202449	23996
A4982_3056	305605/27/202449	23992
M18432_3056	305605/22/2024107	23989
M6363_3056	305605/23/2024106	23989
M20885_3056	305605/27/2024106	23991
M33932_3056	305605/27/2024106	23994
M14598_3056	305605/27/2024106	23993
M6556_3056	305605/27/2024106	23993
M14891_3056	305605/27/2024106	23993
M21653_3056	305605/27/2024106	23990
M36641_3056	305605/27/2024107	23989
M19842_3056	305605/27/2024107	23989
M6578_3056	305605/27/2024107	23993
M40079_3056	305605/27/2024107	23994
M21942_3056	305605/29/2024108	23989
M33062_3056	305605/28/202449	23993
M20082_3056	305605/28/202449	23993
M2775_3056	305605/28/2024106	23995
M32316_3056	305605/28/2024106	23997
M1884_3056	305605/28/2024106	23994
M39971_3056	305605/28/2024106	23990
M6556_3056	305605/28/2024106	23993
M40400_3056	305605/28/2024106	23997
M40947_3056	305605/28/2024106	23995
M34970_3056	305605/31/202449	23996
M35249_3056	305605/31/202449	23993
M14638_3056	305605/31/202449	23993
M20953_3056	305605/28/2024107	23996
M34450_3056	305605/28/2024107	30079
M14571_3056	305605/28/2024107	23993
M20106_3056	305605/28/2024107	23989
M40078_3056	305605/28/2024107	23994
M21926_3056	305605/31/2024107	23996
M39263_3056	305605/31/2024107	30079
M14599_3056	305605/31/2024107	23993
M11770_3056	305605/31/2024107	23993
M21653_3056	305605/31/2024107	23990
M20840_3056	305606/01/202449	23991
M16738_3056	305606/01/202449	23994
M13844_3056	305606/01/202449	23993
M14856_3056	305606/01/202449	23990
M21653_3056	305606/01/202449	23990
M13641_3056	305605/31/2024106	23989
M9786_3056	305605/31/2024106	23990
M14301_3056	305605/31/2024106	23990
M20110_3056	305605/31/2024106	23995
M11770_3056	305605/31/2024106	23993
M40046_3056	305605/31/2024106	23989
M2677_3056	305606/01/2024107	23989
M14290_3056	305606/01/2024107	23993
M6556_3056	305606/01/2024107	23993
M19242_3056	305606/01/2024107	23993
M19446_3056	305606/01/2024107	23993
M9734_3056	305605/30/202449	23989
M14598_3056	305605/30/202449	23993
M9786_3056	305606/01/20242651	23990
M21866_3056	305606/01/20242651	23990
M41558_3056	305606/01/20242651	23994
M35731_3056	305605/30/2024106	23995
M32680_3056	305605/30/2024106	23992
M37923_3056	305605/30/2024106	23994
M20327_3056	305605/30/2024106	23989
M11770_3056	305605/30/2024106	23993
A2865_3056	305605/30/2024106	23994
M21920_3056	305605/30/2024107	23996
M36652_3056	305605/30/2024107	30079
M20114_3056	305605/30/2024107	23993
M14343_3056	305605/30/2024107	23990
M37394_3056	305605/30/2024107	23997
M35013_3056	305605/30/2024107	23989
M32321_3056	305605/29/202449	23994
M21284_3056	305605/29/202449	23993
M5644_3056	305605/29/2024106	23991
M35576_3056	305605/29/2024106	23994
M14599_3314	331405/21/2024107	32805
M41549_3314	331405/21/2024107	32811
M32671_3314	331405/21/2024106	32801
M14344_3314	331405/15/2024106	32802
M2030_3314	331405/15/2024106	32804
M20948_3314	331405/15/2024106	32802
M14343_3314	331405/15/2024106	32802
M13770_3314	331405/15/2024106	32805
A3503_3314	331405/21/202449	32804
M14528_3314	331405/21/202449	32805
M10587_3314	331405/21/202449	32801
A287_3314	331405/14/2024106	32811
M14571_3314	331405/14/2024106	32805
M9879_3314	331405/14/2024106	32802
M8958_3314	331405/14/2024106	32802
M2027_3314	331405/21/2024107	32804
M6847_3314	331405/21/2024107	32805
M14545_3314	331405/21/2024107	32805
M40846_3314	331405/21/2024107	32811
M40843_3314	331405/21/2024107	32811
M20885_3056	305605/16/2024106	23991
M32256_3056	305605/25/2024107	23989
M40764_3056	305605/22/2024108	23989
M5644_3056	305605/21/2024107	23991
M4595_3056	305605/26/2024107	23996
M12103_3056	305605/21/2024106	23989
M14363_3056	305605/21/2024106	23993
M5630_3056	305605/20/2024107	23991
M3223_3056	305605/24/2024107	23996
M10583_3056	305605/27/202449	23989
M13844_3056	305605/27/202449	23993
M9519_3056	305605/21/202449	23989
M5644_3056	305605/23/2024107	23991
M20719_3056	305605/27/2024106	23995
M10076_3056	305605/27/2024106	23989
M14290_3056	305605/27/2024106	23993
M14342_3056	305605/27/2024106	23993
M19242_3056	305605/27/2024106	23993
M33196_3056	305605/27/2024106	23990
M19921_3056	305605/27/2024107	23995
M34487_3056	305605/27/2024107	30079
M14545_3056	305605/27/2024107	23993
M19242_3056	305605/27/2024107	23993
M21653_3056	305605/27/2024107	23990
M859_3056	305605/28/202449	23989
M14598_3056	305605/28/202449	23993
M39651_3056	305605/28/2024106	23991
M6479_3056	305605/28/2024106	23989
M19824_3056	305605/28/2024106	23994
M20047_3056	305605/28/2024106	23990
M14574_3056	305605/28/2024106	23993
M32306_3056	305605/28/2024106	23997
M41066_3056	305605/28/2024106	23990
M40004_3056	305605/31/202449	23992
M859_3056	305605/31/202449	23989
M15668_3056	305605/31/202449	23993
M32623_3056	305605/28/2024107	23995
A1219_3056	305605/28/2024107	23991
M21662_3056	305605/28/2024107	23990
M14342_3056	305605/28/2024107	23993
M14856_3056	305605/28/2024107	23990
M33196_3056	305605/28/2024107	23990
M8321_3056	305605/31/2024107	23990
M40029_3056	305605/31/2024107	30079
M14342_3056	305605/31/2024107	23993
M19735_3056	305605/31/2024107	23993
M20133_3056	305606/01/202449	23989
M40418_3056	305606/01/202449	23991
M1883_3056	305606/01/202449	23994
M20047_3056	305606/01/202449	23990
M13541_3056	305606/01/202449	23990
A347_3056	305606/01/202449	23989
M32253_3056	305605/31/2024106	23989
M11563_3056	305605/31/2024106	23989
M33537_3056	305605/31/2024106	23994
M20114_3056	305605/31/2024106	23993
M13541_3056	305605/31/2024106	23990
M41561_3056	305605/31/2024106	23994
A1219_3056	305606/01/2024107	23991
M14363_3056	305606/01/2024107	23993
M14598_3056	305606/01/2024107	23993
M14891_3056	305606/01/2024107	23993
M21327_3056	305605/30/202449	23991
M20278_3056	305605/30/202449	23994
M15668_3056	305605/30/202449	23993
M10073_3056	305606/01/20242651	23989
M20187_3056	305606/01/20242651	23996
M21653_3056	305606/01/20242651	23990
M4214_3056	305605/30/2024106	23989
M9786_3056	305605/30/2024106	23990
M17162_3056	305605/30/2024106	23994
M14571_3056	305605/30/2024106	23993
M19735_3056	305605/30/2024106	23993
M33196_3056	305605/30/2024106	23990
M19281_3056	305605/30/2024107	23990
M10266_3056	305605/30/2024107	23993
M39971_3056	305605/30/2024107	23990
M6556_3056	305605/30/2024107	23993
M34546_3056	305605/30/2024107	23989
M40859_3056	305605/30/2024107	23993
L331357_3056	305605/29/202449	23989
M15668_3056	305605/29/202449	23993
M21511_3056	305605/29/2024106	23995
M20861_3056	305605/29/2024106	23991
M32360_3314	331405/21/2024106	32805
A3046_3314	331405/21/2024106	32808
M19585_3314	331405/15/2024106	32809
M2351_3314	331405/15/2024106	32804
M21741_3314	331405/15/2024106	32811
M21645_3314	331405/15/2024106	32805
M32660_3314	331405/15/2024106	32811
M39438_3314	331405/21/202449	32804
M861_3314	331405/21/202449	32801
M13770_3314	331405/21/202449	32804
M20851_3314	331405/14/2024106	32806
M11624_3314	331405/14/2024106	32802
M11563_3314	331405/14/2024106	32801
M33400_3314	331405/21/2024107	32803
M2488_3314	331405/21/2024107	32801
M20948_3314	331405/21/2024107	32802
M21645_3314	331405/21/2024107	32805
M13770_3314	331405/21/2024107	32805
M10094_3314	331405/21/2024107	32811
M2345_3056	305605/16/2024106	23994
M33932_3056	305605/16/2024106	23994
M20195_3056	305605/25/2024107	23989
M5630_3056	305605/21/2024107	23991
A2935_3056	305605/22/2024106	23995
M35712_3056	305605/20/2024107	23990
A3459_3056	305605/28/2024108	23989
M34533_3056	305605/24/2024107	23989
M13850_3056	305605/27/202449	23993
M21284_3056	305605/27/202449	23993
M9906_3056	305605/23/2024106	23989
M40068_3056	305605/23/2024106	23992
M8321_3056	305605/27/2024106	23990
M21662_3056	305605/27/2024106	23990
M20350_3056	305605/27/2024106	23989
M14856_3056	305605/27/2024106	23990
M40079_3056	305605/27/2024106	23994
M19281_3056	305605/27/2024107	23990
M21662_3056	305605/27/2024107	23990
M14599_3056	305605/27/2024107	23993
M19735_3056	305605/27/2024107	23993
M33196_3056	305605/27/2024107	23990
M11563_3056	305605/23/2024108	23989
M34518_3056	305605/28/202449	30079
M35964_3056	305605/28/202449	23994
M21341_3056	305605/28/2024106	23991
M9906_3056	305605/28/2024106	23989
M2361_3056	305605/28/2024106	23994
M6847_3056	305605/28/2024106	23993
M6578_3056	305605/28/2024106	23993
A4290_3056	305605/28/2024106	23997
M21653_3056	305605/28/2024106	23990
M33003_3056	305605/31/202449	23991
M10583_3056	305605/31/202449	23989
M14598_3056	305605/31/202449	23993
M8321_3056	305605/28/2024107	23990
M19281_3056	305605/28/2024107	23990
M14363_3056	305605/28/2024107	23993
M14598_3056	305605/28/2024107	23993
M19735_3056	305605/28/2024107	23993
M41561_3056	305605/28/2024107	23994
M40391_3056	305605/31/2024107	23991
M14301_3056	305605/31/2024107	23990
M14571_3056	305605/31/2024107	23993
M14856_3056	305605/31/2024107	23990
M40141_3056	305606/01/202449	23990
M8321_3056	305606/01/202449	23990
M21903_3056	305606/01/202449	23996
M20082_3056	305606/01/202449	23993
M1344_3056	305606/01/202449	23993
A209_3056	305606/01/202449	23989
M5630_3056	305605/31/2024106	23991
M10569_3056	305605/31/2024106	23989
M19548_3056	305605/31/2024106	23994
M14342_3056	305605/31/2024106	23993
M19735_3056	305605/31/2024106	23993
M33196_3056	305605/31/2024106	23990
M8321_3056	305606/01/2024107	23990
M20047_3056	305606/01/2024107	23990
M6578_3056	305606/01/2024107	23993
M40803_3056	305606/01/2024107	30079
M21939_3056	305605/30/202449	23994
M21284_3056	305605/30/202449	23993
M8321_3056	305606/01/20242651	23990
M20047_3056	305606/01/20242651	23990
M33196_3056	305606/01/20242651	23990
M19921_3056	305605/30/2024106	23995
M4949_3056	305605/30/2024106	23997
M14301_3056	305605/30/2024106	23990
M14342_3056	305605/30/2024106	23993
M14856_3056	305605/30/2024106	23990
M40079_3056	305605/30/2024106	23994
M20394_3056	305605/30/2024107	23991
M10734_3056	305605/30/2024107	30079
M6847_3056	305605/30/2024107	23993
M13541_3056	305605/30/2024107	23990
M40494_3056	305605/30/2024107	30079
M32954_3056	305605/29/202449	23991
M35618_3056	305605/29/202449	23994
M14638_3056	305605/29/202449	23993
M37958_3056	305605/29/2024106	23997
M34504_3056	305605/29/2024106	23989
M20403_3314	331405/22/202449	32804
M14598_3314	331405/22/2024107	32805
M10734_3314	331405/22/2024107	32808
M19891_3314	331405/22/2024106	32811
M41612_3056	305605/23/2024108	23989
M19760_3314	331405/15/2024106	32810
M2027_3314	331405/15/2024106	32804
M14301_3314	331405/15/2024106	32802
M11624_3314	331405/15/2024106	32802
M9958_3314	331405/15/2024106	32801
M34520_3314	331405/21/202449	32808
M20044_3314	331405/21/202449	32805
M2027_3314	331405/14/2024106	32804
M20948_3314	331405/14/2024106	32802
M6574_3314	331405/14/2024106	32805
M8321_3314	331405/14/2024106	32802
M34532_3314	331405/21/2024107	32803
M2351_3314	331405/21/2024107	32804
M14258_3314	331405/21/2024107	32805
M6578_3314	331405/21/2024107	32805
M10015_3314	331405/21/2024107	32801
M9636_3314	331405/21/2024107	32801
M34943_3056	305605/16/2024106	23995
L331357_3056	305605/22/202449	23989
M35609_3056	305605/24/202449	23989
M38387_3056	305605/22/2024108	23989
M14195_3056	305605/22/2024106	23992
M35712_3056	305605/26/2024107	23990
M3742_3056	305605/28/2024108	23989
M35712_3056	305605/24/2024107	23990
M34519_3056	305605/27/202449	30079
M32328_3056	305605/27/202449	23994
M1344_3056	305605/27/202449	23993
M5644_3056	305605/22/2024107	23991
M40942_3056	305605/22/2024107	23989
M35712_3056	305605/23/2024107	23990
M9665_3056	305605/27/2024106	23989
M1883_3056	305605/27/2024106	23994
M14599_3056	305605/27/2024106	23993
M11770_3056	305605/27/2024106	23993
M34522_3056	305605/27/2024106	23997
M3742_3056	305605/27/2024107	23989
M9786_3056	305605/27/2024107	23990
M6847_3056	305605/27/2024107	23993
M6556_3056	305605/27/2024107	23993
M40494_3056	305605/27/2024107	30079
M9786_3056	305605/29/2024108	23989
M9519_3056	305605/28/202449	23989
M21284_3056	305605/28/202449	23993
M37127_3056	305605/28/2024106	23989
M18804_3056	305605/28/2024106	23992
M34434_3056	305605/28/2024106	30079
M21662_3056	305605/28/2024106	23990
M14342_3056	305605/28/2024106	23993
M13541_3056	305605/28/2024106	23990
M33196_3056	305605/28/2024106	23990
A2008_3056	305605/28/2024106	23989
M32323_3056	305605/31/202449	23994
M14599_3056	305605/31/202449	23993
M21284_3056	305605/31/202449	23993
A1221_3056	305605/28/2024107	23991
M38765_3056	305605/28/2024107	23989
M14599_3056	305605/28/2024107	23993
M11770_3056	305605/28/2024107	23993
M14891_3056	305605/28/2024107	23993
M19281_3056	305605/31/2024107	23990
M10266_3056	305605/31/2024107	23993
M20114_3056	305605/31/2024107	23993
M13541_3056	305605/31/2024107	23990
M21398_3056	305605/31/2024107	23989
M40391_3056	305606/01/202449	23991
M21943_3056	305606/01/202449	23994
M13850_3056	305606/01/202449	23993
M14638_3056	305606/01/202449	23993
M41561_3056	305606/01/202449	23994
M32679_3056	305605/31/2024106	23997
M7449_3056	305605/31/2024106	23992
M40029_3056	305605/31/2024106	30079
M20047_3056	305605/31/2024106	23990
M14574_3056	305605/31/2024106	23993
M41494_3056	305605/31/2024106	23994
A1221_3056	305606/01/2024107	23991
M6847_3056	305606/01/2024107	23993
M14574_3056	305606/01/2024107	23993
M32642_3056	305606/01/2024107	30079
M21908_3056	305605/30/202449	23996
M21903_3056	305605/30/202449	23996
M14638_3056	305605/30/202449	23993
M713_3056	305606/01/20242651	23989
M14343_3056	305606/01/20242651	23990
A347_3056	305606/01/20242651	23989
M4595_3056	305605/30/2024106	23996
M9615_3056	305605/30/2024106	23989
M21662_3056	305605/30/2024106	23990
M14545_3056	305605/30/2024106	23993
M19242_3056	305605/30/2024106	23993
M41066_3056	305605/30/2024106	23990
M8321_3056	305605/30/2024107	23990
M39261_3056	305605/30/2024107	30079
M14599_3056	305605/30/2024107	23993
M11770_3056	305605/30/2024107	23993
M40078_3056	305605/30/2024107	23994
M34970_3056	305605/29/202449	23996
M12961_3056	305605/29/202449	23994
M1347_3056	305605/29/202449	23993
M35805_3056	305605/29/2024106	23989
M34463_3056	305605/29/2024106	30079
M289_3314	331405/22/202449	32805
M9519_3314	331405/22/202449	32801
M14598_3314	331405/22/2024106	32805
M10734_3314	331405/22/2024106	32808
M19735_3314	331405/15/2024106	32805
M40441_3314	331405/15/2024106	32806
M20114_3314	331405/15/2024106	32805
M13541_3314	331405/15/2024106	32802
M15473_3314	331405/15/2024106	32802
M599_3314	331405/21/202449	32804
M35634_3314	331405/21/202449	32803
M9734_3314	331405/21/202449	32801
A287_3314	331405/14/2024106	32801
M36015_3314	331405/14/2024106	32805
M13541_3314	331405/14/2024106	32802
M41126_3314	331405/14/2024106	32808
M14891_3314	331405/21/2024107	32805
M19488_3314	331405/21/2024107	32810
M13531_3314	331405/21/2024107	32805
M6570_3314	331405/21/2024107	32805
M10053_3314	331405/21/2024107	32801
M8321_3314	331405/21/2024107	32802
M33116_3314	331405/16/2024106	32811
M13972_3056	305605/21/2024107	23989
M9513_3056	305605/23/202449	23989
M20885_3056	305605/21/2024106	23991
M41184_3056	305605/21/2024106	23992
M41609_3056	305605/21/2024106	23997
M41549_3056	305605/28/2024108	23989
M859_3056	305605/27/202449	23989
M14598_3056	305605/27/202449	23993
M19303_3056	305605/23/2024107	23989
M5630_3056	305605/27/2024106	23991
M39656_3056	305605/27/2024106	23993
M39971_3056	305605/27/2024106	23990
M20047_3056	305605/27/2024106	23990
M19735_3056	305605/27/2024106	23993
M41561_3056	305605/27/2024106	23994
M21568_3056	305605/27/2024107	23997
M14301_3056	305605/27/2024107	23990
M14571_3056	305605/27/2024107	23993
M14574_3056	305605/27/2024107	23993
M40078_3056	305605/27/2024107	23994
M39901_3056	305605/29/2024108	23989
M34520_3056	305605/28/202449	30079
M13850_3056	305605/28/202449	23993
M1347_3056	305605/28/202449	23993
M2488_3056	305605/28/2024106	23989
M8321_3056	305605/28/2024106	23990
M34450_3056	305605/28/2024106	30079
M14363_3056	305605/28/2024106	23993
M14545_3056	305605/28/2024106	23993
M19242_3056	305605/28/2024106	23993
M41561_3056	305605/28/2024106	23994
A229_3056	305605/28/2024106	23996
M22100_3056	305605/31/202449	23991
M13844_3056	305605/31/202449	23993
M38232_3056	305605/28/2024107	23996
M10274_3056	305605/28/2024107	23989
M20047_3056	305605/28/2024107	23990
M14574_3056	305605/28/2024107	23993
M32414_3056	305605/28/2024107	23997
M10076_3056	305605/31/2024107	23989
M6847_3056	305605/31/2024107	23993
M14574_3056	305605/31/2024107	23993
M41561_3056	305605/31/2024107	23994
M34519_3056	305606/01/202449	30079
M713_3056	305606/01/202449	23989
M14301_3056	305606/01/202449	23990
M14598_3056	305606/01/202449	23993
M6943_3056	305606/01/202449	23989
M5644_3056	305605/31/2024106	23991
M10060_3056	305605/31/2024106	23989
M14290_3056	305605/31/2024106	23993
M14598_3056	305605/31/2024106	23993
M14856_3056	305605/31/2024106	23990
M10076_3056	305606/01/2024107	23989
M14571_3056	305606/01/2024107	23993
M19735_3056	305606/01/2024107	23993
M33196_3056	305606/01/2024107	23990
M859_3056	305605/30/202449	23989
M13844_3056	305605/30/202449	23993
M40391_3056	305606/01/20242651	23991
M19595_3056	305606/01/20242651	23994
M20954_3056	305606/01/20242651	23996
M41549_3056	305605/31/2024108	23989
M8170_3056	305605/30/2024106	23990
M36652_3056	305605/30/2024106	30079
M20047_3056	305605/30/2024106	23990
M14574_3056	305605/30/2024106	23993
M40494_3056	305605/30/2024106	30079
M40859_3056	305605/30/2024106	23993
M32256_3056	305605/30/2024107	23989
M2323_3056	305605/30/2024107	23994
M14545_3056	305605/30/2024107	23993
M19242_3056	305605/30/2024107	23993
M40079_3056	305605/30/2024107	23994
M33062_3056	305605/29/202449	23993
M21903_3056	305605/29/202449	23996
M22052_3056	305605/29/2024106	23991
M1884_3056	305605/29/2024106	23994
M40042_3314	331405/22/202449	32801
M10583_3314	331405/22/202449	32801
M21511_3314	331405/22/2024107	32807
M11411_3314	331405/22/2024106	32801
M35964_3056	305605/22/202449	23994
M39261_3056	305605/22/2024107	30079
M19242_3314	331405/15/2024106	32805
M21741_3314	331405/15/2024106	32801
M36015_3314	331405/15/2024106	32805
A5800_3314	331405/15/2024106	32803
M34480_3314	331405/15/2024106	32808
M21906_3314	331405/21/202449	32805
M15668_3314	331405/21/202449	32805
M14891_3314	331405/14/2024106	32805
M40391_3314	331405/14/2024106	32806
M14283_3314	331405/14/2024106	32805
M11770_3314	331405/14/2024106	32805
M8170_3314	331405/14/2024106	32802
M41518_3314	331405/21/2024107	32804
M40391_3314	331405/21/2024107	32806
M14571_3314	331405/21/2024107	32805
M34419_3314	331405/21/2024107	32803
M9751_3314	331405/21/2024107	32801
M8958_3314	331405/21/2024107	32802
M36071_3056	305605/21/2024107	23995
M19924_3056	305605/21/2024107	23995
M17308_3056	305605/21/2024107	23995
M21923_3056	305605/21/2024107	23996
A1219_3056	305605/21/2024107	23991
M4949_3056	305605/21/2024107	23995
A1221_3056	305605/21/2024107	23991
M9786_3056	305605/21/2024107	23990
M11563_3056	305605/21/2024107	23989
M10076_3056	305605/21/2024107	23989
M39261_3056	305605/21/2024107	30079
M6446_3056	305605/21/2024107	23993
M10040_3056	305605/21/2024107	23989
M21662_3056	305605/21/2024107	23990
M2351_3056	305605/21/2024107	23994
M14290_3056	305605/21/2024107	23993
M14301_3056	305605/21/2024107	23990
M39971_3056	305605/21/2024107	23990
M6847_3056	305605/21/2024107	23993
M20047_3056	305605/21/2024107	23990
M20114_3056	305605/21/2024107	23993
M14571_3056	305605/21/2024107	23993
M14599_3056	305605/21/2024107	23993
M14342_3056	305605/21/2024107	23993
M14545_3056	305605/21/2024107	23993
M14336_3056	305605/21/2024107	23993
M6556_3056	305605/21/2024107	23993
M14598_3056	305605/21/2024107	23993
M14574_3056	305605/21/2024107	23993
M6578_3056	305605/21/2024107	23993
M19735_3056	305605/21/2024107	23993
M13541_3056	305605/21/2024107	23990
M14343_3056	305605/21/2024107	23990
M14856_3056	305605/21/2024107	23990
M19242_3056	305605/21/2024107	23993
M14891_3056	305605/21/2024107	23993
M34533_3056	305605/21/2024107	23989
A3576_3056	305605/21/2024107	23997
M40528_3056	305605/21/2024107	23995
M41558_3056	305605/21/2024107	23994
M40528_3056	305605/21/2024107	23997
M41561_3056	305605/21/2024107	23994
A3040_3056	305605/21/2024107	30079
M33196_3056	305605/21/2024107	23990
M21398_3056	305605/21/2024107	23989
M21653_3056	305605/21/2024107	23990
M19952_3314	331405/21/2024106	32801
M14856_3314	331405/21/2024106	32802
M19735_3314	331405/21/2024106	32805
M21076_3314	331405/21/2024106	32803
M33396_3314	331405/21/2024106	32803
M14891_3314	331405/21/2024106	32805
M33279_3314	331405/21/2024106	32804
M19242_3314	331405/21/2024106	32805
M41518_3314	331405/21/2024106	32804
M2027_3314	331405/21/2024106	32804
M2030_3314	331405/21/2024106	32804
M20719_3314	331405/21/2024106	32801
M40999_3314	331405/21/2024106	32811
M2351_3314	331405/21/2024106	32804
M40392_3314	331405/21/2024106	32810
M40765_3314	331405/21/2024106	32803
M20953_3314	331405/21/2024106	32810
M6847_3314	331405/21/2024106	32805
M20103_3314	331405/21/2024106	32803
M40391_3314	331405/21/2024106	32806
M20888_3314	331405/21/2024106	32806
M40418_3314	331405/21/2024106	32806
M20104_3314	331405/21/2024106	32809
M19910_3314	331405/21/2024106	32809
M14301_3314	331405/21/2024106	32802
M20948_3314	331405/21/2024106	32802
M14258_3314	331405/21/2024106	32805
M13531_3314	331405/21/2024106	32805
M14283_3314	331405/21/2024106	32805
M14545_3314	331405/21/2024106	32805
M14571_3314	331405/21/2024106	32805
M21645_3314	331405/21/2024106	32805
M11624_3314	331405/21/2024106	32802
M6570_3314	331405/21/2024106	32805
M6578_3314	331405/21/2024106	32805
M14343_3314	331405/21/2024106	32802
M6574_3314	331405/21/2024106	32805
M11770_3314	331405/21/2024106	32805
A209_3314	331405/21/2024106	32803
A197_3314	331405/21/2024106	32803
M34419_3314	331405/21/2024106	32803
M9879_3314	331405/21/2024106	32802
M13770_3314	331405/21/2024106	32805
M19908_3314	331405/21/2024106	32802
M9650_3314	331405/21/2024106	32803
M40919_3314	331405/21/2024106	32811
M40762_3314	331405/21/2024106	32811
M10401_3314	331405/21/2024106	32801
M34452_3314	331405/21/2024106	32808
A3040_3314	331405/21/2024106	32808
M7941_3314	331405/21/2024106	32802
M15473_3314	331405/21/2024106	32802
M8321_3314	331405/21/2024106	32802
M8170_3314	331405/21/2024106	32802
M8958_3314	331405/21/2024106	32802
M19735_3314	331405/14/2024107	32805
M14856_3314	331405/14/2024107	32802
M17308_3314	331405/14/2024107	32807
M13531_3314	331405/14/2024107	32805
M6574_3314	331405/14/2024107	32805
M8170_3314	331405/14/2024107	32802
M20662_3056	305605/21/2024106	23989
M33398_3056	305605/21/2024106	23997
M6847_3056	305605/21/2024106	23993
M14912_3056	305605/21/2024106	23989
A2941_3056	305605/21/2024106	23997
M14856_3314	331405/16/2024107	32802
M6847_3314	331405/16/2024107	32805
M21645_3314	331405/16/2024107	32805
M13770_3314	331405/16/2024107	32805
M41017_3314	331405/18/202449	32801
M2340_3314	331405/18/202449	32804
M38088_3314	331405/18/202449	32803
M32538_3314	331405/18/202449	32805
M40955_3314	331405/18/202449	32801
M15939_3056	305605/25/20242651	23989
M13541_3056	305605/25/20242651	23990
M14344_3314	331405/16/2024106	32802
M38834_3314	331405/16/2024106	32801
M14283_3314	331405/16/2024106	32805
M9906_3314	331405/16/2024106	32801
M8958_3314	331405/16/2024106	32802
M3223_3056	305605/25/2024107	23996
M34425_3056	305605/25/2024107	30079
M20114_3056	305605/25/2024107	23993
M13541_3056	305605/25/2024107	23990
M33196_3056	305605/25/2024107	23990
M21906_3314	331405/19/202449	32805
M2030_3314	331405/19/202449	32804
M40391_3314	331405/19/202449	32806
M13499_3314	331405/19/202449	32802
M14081_3314	331405/19/202449	32802
M34970_3056	305605/24/202449	23996
M13850_3056	305605/24/202449	23993
M1461_3056	305605/24/202449	23993
M32657_3056	305605/17/2024106	23989
M39261_3056	305605/17/2024106	30079
M14545_3056	305605/17/2024106	23993
M21284_3056	305605/17/2024106	23993
M5630_3056	305605/23/2024108	23991
M34520_3314	331405/26/20242651	32808
M11624_3314	331405/26/20242651	32802
M38834_3056	305605/17/2024107	23989
M2351_3056	305605/17/2024107	23994
M14571_3056	305605/17/2024107	23993
M19735_3056	305605/17/2024107	23993
M19735_3314	331405/17/2024107	32805
M6847_3314	331405/17/2024107	32805
M14545_3314	331405/17/2024107	32805
M10569_3314	331405/17/2024107	32801
M18660_3314	331405/16/2024107	32807
M33196_3056	305605/30/2024107	23990
M859_3056	305605/29/202449	23989
M14599_3056	305605/29/202449	23993
M5630_3056	305605/29/2024106	23991
M1925_3056	305605/29/2024106	23994
M34970_3314	331405/22/202449	32810
M41055_3314	331405/22/2024107	32811
M38765_3314	331405/22/2024107	32801
M14599_3314	331405/22/2024106	32805
A3044_3314	331405/22/2024106	32808
M40942_3056	305605/23/2024108	23989
M34533_3314	331405/14/2024107	32801
M2983_3314	331405/14/2024107	32801
M14283_3314	331405/14/2024107	32805
M9879_3314	331405/14/2024107	32802
M15473_3314	331405/14/2024107	32802
M38600_3056	305605/21/2024106	23997
M6446_3056	305605/21/2024106	23993
M20047_3056	305605/21/2024106	23990
M14574_3056	305605/21/2024106	23993
M41561_3056	305605/21/2024106	23994
M2030_3314	331405/16/2024107	32804
M36015_3314	331405/16/2024107	32805
M14343_3314	331405/16/2024107	32802
M8321_3314	331405/16/2024107	32802
M34520_3314	331405/18/202449	32808
M2030_3314	331405/18/202449	32804
M14864_3314	331405/18/202449	32810
M20044_3314	331405/18/202449	32805
M12296_3314	331405/18/202449	32801
M9895_3056	305605/25/20242651	23989
M6943_3056	305605/25/20242651	23989
M14891_3314	331405/16/2024106	32805
M40455_3314	331405/16/2024106	32806
M14545_3314	331405/16/2024106	32805
M9879_3314	331405/16/2024106	32802
M9786_3056	305605/25/2024107	23990
M21662_3056	305605/25/2024107	23990
M14342_3056	305605/25/2024107	23993
M14856_3056	305605/25/2024107	23990
M34520_3314	331405/19/202449	32808
M21903_3314	331405/19/202449	32804
M14528_3314	331405/19/202449	32805
M10583_3314	331405/19/202449	32801
M10583_3056	305605/24/202449	23989
M20082_3056	305605/24/202449	23993
M9786_3056	305605/17/2024106	23990
M20114_3056	305605/17/2024106	23993
M14343_3056	305605/17/2024106	23990
M33196_3056	305605/17/2024106	23990
M2030_3314	331405/26/20242651	32804
M8321_3314	331405/26/20242651	32802
M9786_3056	305605/17/2024107	23990
M20114_3056	305605/17/2024107	23993
M14343_3056	305605/17/2024107	23990
M40078_3056	305605/17/2024107	23994
M14856_3314	331405/17/2024107	32802
M34997_3314	331405/17/2024107	32810
M11624_3314	331405/17/2024107	32802
M8321_3314	331405/17/2024107	32802
M21938_3056	305605/16/2024108	23989
M6847_3314	331405/16/2024108	32805
M38867_3056	305605/29/202449	23989
M32623_3056	305605/29/2024106	23995
M9616_3056	305605/29/2024106	23989
M35269_3314	331405/22/2024107	32801
M14342_3314	331405/22/2024107	32805
M32360_3314	331405/22/2024106	32805
M40067_3056	305605/22/2024106	23992
M6446_3056	305605/22/2024107	23993
M2984_3056	305605/22/2024107	23989
M19242_3314	331405/14/2024107	32805
A350_3314	331405/14/2024107	32811
M14545_3314	331405/14/2024107	32805
M36727_3314	331405/14/2024107	32801
M21047_3056	305605/21/2024106	23996
M39261_3056	305605/21/2024106	30079
M14342_3056	305605/21/2024106	23993
M14343_3056	305605/21/2024106	23990
M33196_3056	305605/21/2024106	23990
A1143_3314	331405/16/2024107	32803
M13531_3314	331405/16/2024107	32805
M11770_3314	331405/16/2024107	32805
M8958_3314	331405/16/2024107	32802
M2007_3314	331405/18/202449	32804
M1461_3314	331405/18/202449	32805
M40348_3314	331405/18/202449	32801
M40391_3314	331405/18/202449	32806
M21257_3314	331405/18/202449	32801
M10073_3056	305605/25/20242651	23989
M14856_3056	305605/25/20242651	23990
M19242_3314	331405/16/2024106	32805
M33409_3314	331405/16/2024106	32810
M14571_3314	331405/16/2024106	32805
M13770_3314	331405/16/2024106	32805
M40443_3056	305605/25/2024107	23991
M14363_3056	305605/25/2024107	23993
M14545_3056	305605/25/2024107	23993
M19242_3056	305605/25/2024107	23993
M1461_3314	331405/19/202449	32805
M4595_3314	331405/19/202449	32810
M20044_3314	331405/19/202449	32805
M8004_3314	331405/19/202449	32802
M3316_3056	305605/24/202449	23991
M13844_3056	305605/24/202449	23993
M40042_3056	305605/24/202449	23989
M5644_3056	305605/17/2024106	23991
M39971_3056	305605/17/2024106	23990
M19735_3056	305605/17/2024106	23993
M40078_3056	305605/17/2024106	23994
M40924_3314	331405/26/20242651	32803
M8004_3314	331405/26/20242651	32802
M35712_3056	305605/17/2024107	23990
M20047_3056	305605/17/2024107	23990
M14574_3056	305605/17/2024107	23993
M2030_3314	331405/17/2024107	32804
M13531_3314	331405/17/2024107	32805
M32660_3314	331405/17/2024107	32801
M9786_3056	305605/16/2024108	23989
M19242_3314	331405/16/2024108	32805
M14571_3314	331405/16/2024108	32805
M14301_3056	305605/29/2024106	23990
M14545_3056	305605/29/2024106	23993
M40079_3056	305605/29/2024106	23994
M21511_3056	305605/29/2024107	23995
M9786_3056	305605/29/2024107	23990
M39971_3056	305605/29/2024107	23990
M6578_3056	305605/29/2024107	23993
M40079_3056	305605/29/2024107	23994
M14255_3314	331405/22/2024107	32805
M34592_3314	331405/22/2024107	32801
M39850_3314	331405/22/2024106	32809
M21921_3314	331405/22/2024106	32810
M10503_3314	331405/22/2024106	32801
M14891_3314	331405/14/2024107	32805
M40710_3314	331405/14/2024107	32803
M14571_3314	331405/14/2024107	32805
M13770_3314	331405/14/2024107	32805
M8958_3314	331405/14/2024107	32802
M16592_3056	305605/21/2024106	23996
M2351_3056	305605/21/2024106	23994
M14599_3056	305605/21/2024106	23993
M13541_3056	305605/21/2024106	23990
A3040_3056	305605/21/2024106	30079
M34961_3314	331405/16/2024107	32810
M14301_3314	331405/16/2024107	32802
M14571_3314	331405/16/2024107	32805
M39275_3314	331405/16/2024107	32808
M39438_3314	331405/18/202449	32804
M36024_3314	331405/18/202449	32805
M766_3314	331405/18/202449	32801
M13850_3314	331405/18/202449	32805
M9894_3314	331405/18/202449	32801
M40484_3056	305605/25/20242651	23991
M14343_3056	305605/25/20242651	23990
M35340_3314	331405/16/2024106	32809
M36071_3314	331405/16/2024106	32807
M20948_3314	331405/16/2024106	32802
M13541_3314	331405/16/2024106	32802
M8321_3314	331405/16/2024106	32802
M20662_3056	305605/25/2024107	23989
M34462_3056	305605/25/2024107	30079
M20047_3056	305605/25/2024107	23990
M6556_3056	305605/25/2024107	23993
M14891_3056	305605/25/2024107	23993
M2007_3314	331405/19/202449	32804
M40079_3314	331405/19/202449	32804
M34970_3314	331405/19/202449	32810
M11624_3314	331405/19/202449	32802
M33093_3314	331405/19/202449	47692
M34519_3056	305605/24/202449	30079
M21946_3056	305605/24/202449	23994
M15668_3056	305605/24/202449	23993
M19952_3056	305605/17/2024106	23989
M14599_3056	305605/17/2024106	23993
M6578_3056	305605/17/2024106	23993
M40079_3056	305605/17/2024106	23994
M41036_3314	331405/26/20242651	32802
M14081_3314	331405/26/20242651	32802
M5804_3056	305605/17/2024107	23989
M14599_3056	305605/17/2024107	23993
M13541_3056	305605/17/2024107	23990
M19242_3056	305605/17/2024107	23993
M41200_3314	331405/17/2024107	32808
M40418_3314	331405/17/2024107	32806
M21645_3314	331405/17/2024107	32805
M13770_3314	331405/17/2024107	32805
M32573_3056	305605/16/2024108	23989
M18748_3314	331405/16/2024108	32801
M11770_3314	331405/16/2024108	32805
M6847_3056	305605/29/2024106	23993
M6578_3056	305605/29/2024106	23993
M11770_3056	305605/29/2024106	23993
M34754_3056	305605/29/2024107	23989
M9650_3056	305605/29/2024107	23997
M6847_3056	305605/29/2024107	23993
M14574_3056	305605/29/2024107	23993
M40078_3056	305605/29/2024107	23994
M32244_3056	305605/30/2024108	23989
M14599_3314	331405/22/2024107	32805
A3044_3314	331405/22/2024107	32808
M17086_3314	331405/22/2024106	32807
M14342_3314	331405/22/2024106	32805
M20595_3314	331405/22/2024106	32801
M6446_3056	305605/22/2024106	23993
M2984_3056	305605/23/2024108	23989
M32216_3314	331405/14/2024107	32803
M6847_3314	331405/14/2024107	32805
M21645_3314	331405/14/2024107	32805
M19998_3314	331405/14/2024107	32801
M5630_3056	305605/21/2024106	23991
M21336_3056	305605/21/2024106	23994
M14571_3056	305605/21/2024106	23993
M19735_3056	305605/21/2024106	23993
M41036_3056	305605/21/2024106	23990
M19242_3314	331405/16/2024107	32805
M40391_3314	331405/16/2024107	32806
M6570_3314	331405/16/2024107	32805
M8170_3314	331405/16/2024107	32802
A347_3314	331405/18/202449	32801
M3854_3314	331405/18/202449	32801
M14528_3314	331405/18/202449	32805
M20954_3314	331405/18/202449	32810
M14081_3314	331405/18/202449	32802
M20953_3056	305605/25/20242651	23996
M14301_3056	305605/25/20242651	23990
A209_3056	305605/25/20242651	23989
M33459_3314	331405/16/2024106	32811
M14301_3314	331405/16/2024106	32802
M6578_3314	331405/16/2024106	32805
M8170_3314	331405/16/2024106	32802
A1221_3056	305605/25/2024107	23991
M14290_3056	305605/25/2024107	23993
M14336_3056	305605/25/2024107	23993
M19848_3056	305605/25/2024107	23989
M36024_3314	331405/19/202449	32805
M38830_3314	331405/19/202449	32801
M32538_3314	331405/19/202449	32805
M10587_3314	331405/19/202449	32801
M40004_3056	305605/24/202449	23992
M20278_3056	305605/24/202449	23994
M14638_3056	305605/24/202449	23993
M5630_3056	305605/17/2024106	23991
M14363_3056	305605/17/2024106	23993
M14891_3056	305605/17/2024106	23993
M20954_3056	305605/17/2024106	23996
M40911_3314	331405/26/20242651	32801
M33769_3314	331405/26/20242651	32801
M8321_3056	305605/17/2024107	23990
M6847_3056	305605/17/2024107	23993
M6578_3056	305605/17/2024107	23993
M21653_3056	305605/17/2024107	23990
M32878_3314	331405/17/2024107	32801
M14283_3314	331405/17/2024107	32805
M9879_3314	331405/17/2024107	32802
M15473_3056	305605/16/2024108	23989
M14545_3314	331405/16/2024108	32805
M14290_3056	305605/29/2024106	23993
M14571_3056	305605/29/2024106	23993
M33196_3056	305605/29/2024106	23990
A1219_3056	305605/29/2024107	23991
M20195_3056	305605/29/2024107	23989
M20047_3056	305605/29/2024107	23990
M14343_3056	305605/29/2024107	23990
M21653_3056	305605/29/2024107	23990
M5630_3056	305605/30/2024108	23991
M32360_3314	331405/22/2024107	32805
M2027_3314	331405/14/2024107	32804
M40391_3314	331405/14/2024107	32806
M11624_3314	331405/14/2024107	32802
M40920_3314	331405/14/2024107	32811
M5644_3056	305605/21/2024106	23991
M21662_3056	305605/21/2024106	23990
M14336_3056	305605/21/2024106	23993
M19242_3056	305605/21/2024106	23993
M21424_3056	305605/21/2024106	23997
M14891_3314	331405/16/2024107	32805
M21179_3314	331405/16/2024107	32811
M11624_3314	331405/16/2024107	32802
M34446_3314	331405/16/2024107	32808
M14856_3314	331405/18/202449	32802
M33241_3314	331405/18/202449	32810
M40418_3314	331405/18/202449	32806
M9294_3314	331405/18/202449	32801
M8321_3314	331405/18/202449	32802
M40391_3056	305605/25/20242651	23991
M21662_3056	305605/25/20242651	23990
M21653_3056	305605/25/20242651	23990
M33459_3314	331405/16/2024106	32801
M40418_3314	331405/16/2024106	32806
M6570_3314	331405/16/2024106	32805
M39275_3314	331405/16/2024106	32808
M34957_3056	305605/25/2024107	23996
M2351_3056	305605/25/2024107	23994
M14571_3056	305605/25/2024107	23993
M19735_3056	305605/25/2024107	23993
M33409_3056	305605/25/2024107	23996
M14856_3314	331405/19/202449	32802
M32588_3314	331405/19/202449	32801
M13844_3314	331405/19/202449	32805
M40749_3314	331405/19/202449	47692
M1997_3056	305605/24/202449	23994
M21284_3056	305605/24/202449	23993
M40141_3056	305605/17/2024106	23990
M14301_3056	305605/17/2024106	23990
M14571_3056	305605/17/2024106	23993
M6556_3056	305605/17/2024106	23993
M20885_3056	305605/23/2024108	23991
M14856_3314	331405/26/20242651	32802
M40418_3314	331405/26/20242651	32806
M5630_3056	305605/17/2024107	23991
M14363_3056	305605/17/2024107	23993
M6556_3056	305605/17/2024107	23993
M33196_3056	305605/17/2024107	23990
M14891_3314	331405/17/2024107	32805
M20114_3314	331405/17/2024107	32805
M11770_3314	331405/17/2024107	32805
M8958_3314	331405/17/2024107	32802
M19735_3314	331405/16/2024108	32805
M6574_3314	331405/16/2024108	32805
M39971_3056	305605/29/2024106	23990
M14574_3056	305605/29/2024106	23993
M14891_3056	305605/29/2024106	23993
M4595_3056	305605/29/2024107	23996
M34462_3056	305605/29/2024107	30079
M14599_3056	305605/29/2024107	23993
M13541_3056	305605/29/2024107	23990
M39194_3056	305605/29/2024107	23995
M10076_3056	305605/30/2024108	23989
M10090_3314	331405/22/2024107	32801
M41602_3314	331405/22/2024106	32803
M14255_3314	331405/22/2024106	32805
M10690_3314	331405/22/2024106	32801
M39261_3056	305605/22/2024106	30079
M2351_3314	331405/14/2024107	32804
M20948_3314	331405/14/2024107	32802
M6570_3314	331405/14/2024107	32805
M39262_3314	331405/14/2024107	32808
M40459_3056	305605/21/2024106	23991
M14301_3056	305605/21/2024106	23990
M14545_3056	305605/21/2024106	23993
M14856_3056	305605/21/2024106	23990
M21653_3056	305605/21/2024106	23990
M713_3314	331405/16/2024107	32801
M40911_3314	331405/16/2024107	32811
M14545_3314	331405/16/2024107	32805
M13972_3314	331405/16/2024107	32801
M21906_3314	331405/18/202449	32805
M21903_3314	331405/18/202449	32804
M21179_3314	331405/18/202449	47692
M11624_3314	331405/18/202449	32802
M40749_3314	331405/18/202449	32801
M398_3056	305605/25/20242651	23994
M33196_3056	305605/25/20242651	23990
M2027_3314	331405/16/2024106	32804
M6847_3314	331405/16/2024106	32805
M21645_3314	331405/16/2024106	32805
A5745_3314	331405/16/2024106	32811
M20433_3056	305605/25/2024107	23989
M713_3056	305605/25/2024107	23989
M14864_3056	305605/25/2024107	23989
M14574_3056	305605/25/2024107	23993
M21653_3056	305605/25/2024107	23990
A3503_3314	331405/19/202449	32804
M33241_3314	331405/19/202449	32810
M40418_3314	331405/19/202449	32806
M9879_3314	331405/19/202449	32802
M8170_3314	331405/19/202449	32802
M859_3056	305605/24/202449	23989
M289_3056	305605/24/202449	23993
M8321_3056	305605/17/2024106	23990
M6847_3056	305605/17/2024106	23993
M14856_3056	305605/17/2024106	23990
M41604_3056	305605/17/2024106	23997
M40079_3314	331405/26/20242651	32804
M21890_3314	331405/26/20242651	32801
M4595_3056	305605/17/2024107	23996
M39971_3056	305605/17/2024107	23990
M21284_3056	305605/17/2024107	23993
M14856_3056	305605/17/2024107	23990
M19242_3314	331405/17/2024107	32805
M14301_3314	331405/17/2024107	32802
M14571_3314	331405/17/2024107	32805
M7941_3314	331405/17/2024107	32802
M14891_3314	331405/16/2024108	32805
M14258_3314	331405/16/2024108	32805
M14363_3056	305605/29/2024106	23993
M6556_3056	305605/29/2024106	23993
M14856_3056	305605/29/2024106	23990
M32380_3056	305605/29/2024107	23997
M10076_3056	305605/29/2024107	23989
M20114_3056	305605/29/2024107	23993
M19735_3056	305605/29/2024107	23993
M41561_3056	305605/29/2024107	23994
M5644_3056	305605/30/2024108	23991
M10266_3314	331405/22/2024106	32807
M2030_3056	305605/22/2024107	23994
M2030_3314	331405/14/2024107	32804
M40418_3314	331405/14/2024107	32806
M6578_3314	331405/14/2024107	32805
M7941_3314	331405/14/2024107	32802
M4949_3056	305605/21/2024106	23997
M39971_3056	305605/21/2024106	23990
M6556_3056	305605/21/2024106	23993
M40068_3056	305605/21/2024106	23992
M2027_3314	331405/16/2024107	32804
M40418_3314	331405/16/2024107	32806
M6574_3314	331405/16/2024107	32805
M15473_3314	331405/16/2024107	32802
M41558_3314	331405/18/202449	32804
M3742_3314	331405/18/202449	47692
M36703_3314	331405/18/202449	32805
M15668_3314	331405/18/202449	32805
M8170_3314	331405/18/202449	32802
M40418_3056	305605/25/20242651	23991
M39971_3056	305605/25/20242651	23990
M39525_3056	305605/25/20242651	23989
M2030_3314	331405/16/2024106	32804
M36015_3314	331405/16/2024106	32805
M11770_3314	331405/16/2024106	32805
M7941_3314	331405/16/2024106	32802
M5722_3056	305605/25/2024107	23989
M6847_3056	305605/25/2024107	23993
M6578_3056	305605/25/2024107	23993
M41558_3056	305605/25/2024107	23994
M39438_3314	331405/19/202449	32804
M41558_3314	331405/19/202449	32804
M40946_3314	331405/19/202449	47692
M15668_3314	331405/19/202449	32805
M8321_3314	331405/19/202449	32802
M34520_3056	305605/24/202449	30079
M33241_3056	305605/24/202449	23996
M1344_3056	305605/24/202449	23993
M19801_3056	305605/17/2024106	23991
M21662_3056	305605/17/2024106	23990
M14598_3056	305605/17/2024106	23993
M19242_3056	305605/17/2024106	23993
M21653_3056	305605/17/2024106	23990
M41558_3314	331405/26/20242651	32804
M13499_3314	331405/26/20242651	32802
M36741_3056	305605/17/2024107	23989
M14301_3056	305605/17/2024107	23990
M14598_3056	305605/17/2024107	23993
M41561_3056	305605/17/2024107	23994
M2351_3314	331405/17/2024107	32804
M36015_3314	331405/17/2024107	32805
M6574_3314	331405/17/2024107	32805
M8170_3314	331405/17/2024107	32802
M14283_3314	331405/16/2024108	32805
M20047_3056	305605/29/2024106	23990
M14343_3056	305605/29/2024106	23990
M40078_3056	305605/29/2024106	23994
M32244_3056	305605/29/2024107	23989
M34463_3056	305605/29/2024107	30079
M14571_3056	305605/29/2024107	23993
M11770_3056	305605/29/2024107	23993
M33196_3056	305605/29/2024107	23990
M600_3314	331405/23/202449	32804
M14599_3314	331405/23/2024106	32805
M40806_3314	331405/23/2024106	32808
M32743_3314	331405/23/2024107	32807
M32554_3314	331405/23/2024107	32801
M34957_3314	331405/14/2024107	32810
M36015_3314	331405/14/2024107	32805
M14343_3314	331405/14/2024107	32802
M41126_3314	331405/14/2024107	32808
M4929_3056	305605/21/2024106	23989
M14195_3056	305605/21/2024106	23992
M14290_3056	305605/21/2024106	23993
M14598_3056	305605/21/2024106	23993
M14891_3056	305605/21/2024106	23993
A3203_3056	305605/21/2024106	23996
M2351_3314	331405/16/2024107	32804
M20948_3314	331405/16/2024107	32802
M6578_3314	331405/16/2024107	32805
M7941_3314	331405/16/2024107	32802
M33062_3314	331405/18/202449	32805
M41036_3314	331405/18/202449	32802
M20956_3314	331405/18/202449	32810
M13499_3314	331405/18/202449	32802
M8004_3314	331405/18/202449	32802
M599_3056	305605/25/20242651	23994
M33400_3056	305605/25/20242651	23989
M2351_3314	331405/16/2024106	32804
M40391_3314	331405/16/2024106	32806
M11624_3314	331405/16/2024106	32802
M34446_3314	331405/16/2024106	32808
A1219_3056	305605/25/2024107	23991
M14301_3056	305605/25/2024107	23990
M14599_3056	305605/25/2024107	23993
M14343_3056	305605/25/2024107	23990
A486_3056	305605/25/2024107	23989
M41138_3314	331405/19/202449	32803
M36703_3314	331405/19/202449	32805
M9650_3314	331405/19/202449	32810
M9513_3056	305605/24/202449	23989
M14598_3056	305605/24/202449	23993
M10053_3056	305605/17/2024106	23989
M14342_3056	305605/17/2024106	23993
M13541_3056	305605/17/2024106	23990
M34241_3056	305605/17/2024106	23993
M40391_3314	331405/26/20242651	32806
M8170_3314	331405/26/20242651	32802
M39261_3056	305605/17/2024107	30079
M14342_3056	305605/17/2024107	23993
M14891_3056	305605/17/2024107	23993
M2027_3314	331405/17/2024107	32804
M20948_3314	331405/17/2024107	32802
M6578_3314	331405/17/2024107	32805
M34474_3314	331405/17/2024107	32808
M13531_3314	331405/16/2024108	32805
M20114_3056	305605/29/2024106	23993
M13541_3056	305605/29/2024106	23990
M41066_3056	305605/29/2024106	23990
M19281_3056	305605/29/2024107	23990
M14301_3056	305605/29/2024107	23990
M14342_3056	305605/29/2024107	23993
M14856_3056	305605/29/2024107	23990
A486_3056	305605/29/2024107	23989
A486_3056	305605/30/2024108	23989
M20278_3314	331405/23/202449	32804
M19391_3056	305605/23/2024106	23995
M19781_3314	331405/14/2024107	32803
M14301_3314	331405/14/2024107	32802
M11770_3314	331405/14/2024107	32805
M8321_3314	331405/14/2024107	32802
M21503_3056	305605/21/2024106	23995
M9786_3056	305605/21/2024106	23990
M20114_3056	305605/21/2024106	23993
M6578_3056	305605/21/2024106	23993
M40078_3056	305605/21/2024106	23994
M19735_3314	331405/16/2024107	32805
M2969_3314	331405/16/2024107	32801
M14283_3314	331405/16/2024107	32805
M9879_3314	331405/16/2024107	32802
A3503_3314	331405/18/202449	32804
M40079_3314	331405/18/202449	32804
M21908_3314	331405/18/202449	32810
M13844_3314	331405/18/202449	32805
M9879_3314	331405/18/202449	32802
M9786_3056	305605/25/20242651	23990
M20047_3056	305605/25/20242651	23990
M19735_3314	331405/16/2024106	32805
M41604_3314	331405/16/2024106	32803
M13531_3314	331405/16/2024106	32805
M6574_3314	331405/16/2024106	32805
M15473_3314	331405/16/2024106	32802
M10053_3056	305605/25/2024107	23989
M39971_3056	305605/25/2024107	23990
M14598_3056	305605/25/2024107	23993
M41561_3056	305605/25/2024107	23994
M33062_3314	331405/19/202449	32805
M41036_3314	331405/19/202449	32802
M13850_3314	331405/19/202449	32805
M10053_3314	331405/19/202449	32801
M9519_3056	305605/24/202449	23989
M14599_3056	305605/24/202449	23993
M7975_3056	305605/17/2024106	23992
M20047_3056	305605/17/2024106	23990
M14574_3056	305605/17/2024106	23993
M41561_3056	305605/17/2024106	23994
M5644_3056	305605/23/2024108	23991
M21903_3314	331405/26/20242651	32804
M9879_3314	331405/26/20242651	32802
M5644_3056	305605/17/2024107	23991
M33534_3056	305605/17/2024107	23990
M14545_3056	305605/17/2024107	23993
M34241_3056	305605/17/2024107	23993
M40785_3314	331405/17/2024107	32811
M40391_3314	331405/17/2024107	32806
M14343_3314	331405/17/2024107	32802
M9849_3314	331405/17/2024107	32811
M6570_3314	331405/16/2024108	32805
M14599_3056	305605/29/2024106	23993
M19735_3056	305605/29/2024106	23993
M41480_3056	305605/29/2024106	23995
A1221_3056	305605/29/2024107	23991
M21662_3056	305605/29/2024107	23990
M14545_3056	305605/29/2024107	23993
M19242_3056	305605/29/2024107	23993
M214_3314	331405/23/202449	32805
M6847-165894_3056	305605/23/2024106	23993
M32303_3056	305605/23/2024107	23997
M4595_3314	331405/23/2024106	32810
M36652_3314	331405/23/2024106	32808
M33009_3314	331405/23/2024107	32801
\.


--
-- Data for Name: dishes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dishes (id, name, description, category, created_at, updated_at) FROM stdin;
M35731_3056	Beefy Tomato Penne Casserole	Penne with simmered tomatoes, ground beef, carrots, celery, onion, peas and Parmesan cheese	Entrées	2024-05-19 00:01:19.158	2024-05-19 00:01:19.158
M34048_3056	Garam Masala Coconut Stew	Diced tomatoes, lentils, carrots, onion and red peppers simmered in coconut milk with toasted garam masala spice blend	Entrées	2024-05-17 00:00:14.416	2024-05-17 00:00:14.416
M40818_3314	Beef & Mushroom Pot Roast	Tender beef braised in a savory mushroom and onion sauce	Entrées	2024-05-20 00:00:07.516	2024-05-20 00:00:07.516
M32680_3056	Beef & Bean Burrito	Flour tortilla filled with Spanish rice, black beans, spicy ground beef, salsa and cheddar crema	Entrées	2024-05-19 00:01:19.219	2024-05-19 00:01:19.219
A1950_3056	Ropa Vieja Taco	A corn tortilla  filled with Cuban beef, roasted corn & bell peppers in a spicy tomato sauce then topped with cilantro, onions and cilantro-lime crema	Entrées	2024-05-19 00:01:07.194	2024-05-19 00:01:07.194
M37923_3056	Chocolate Almond Chia Parfait	Chocolate almond milk pudding with chia seeds and sliced almonds	Desserts	2024-05-19 00:01:19.28	2024-05-19 00:01:19.28
M32657_3314	Spaghetti with Meat Sauce	Hearty meat sauce served over spaghetti	Entrées	2024-05-13 21:21:36.895	2024-05-13 21:21:36.895
L322479_3056	Canadian Bacon, Egg & Cheese Muffin	Canadian bacon, fried egg and American cheese on a toasted English muffin	Sandwiches	2024-05-13 21:21:36.877	2024-05-13 21:21:36.877
M32623_3056	Chinese Sesame Noodle with Chicken	Long noodles, grilled chicken thigh, sesame peanut dressing and vegetables	Entrées	2024-05-19 00:01:06.872	2024-05-19 00:01:06.872
M20719_3056	Linguine with Lemon-Garlic Shrimp	Shrimp sauteed with onion, scallions, garlic and lemon-garlic vegetable broth tossed with linguine	Entrées	2024-05-19 00:00:49.649	2024-05-19 00:00:49.649
M20403_3314	Cranberry Orange Scone	Freshly baked scone with fresh cranberries and orange zest drizzled with vanilla icing	Breads	2024-05-22 00:00:07.367	2024-05-22 00:00:07.367
M14344_3314	Dill Pickle Spears (1  each)	Dill pickle spears	Condiments	2024-05-13 21:21:37.477	2024-05-13 21:21:37.477
M9497_3314	Tzatziki Sauce	Creamy blend of Greek yogurt and cucumber	Sauces	2024-05-20 00:00:08.016	2024-05-20 00:00:08.016
M19281_3056	Grilled Chicken Breast	Tender boneless chicken breast coated with a blend of paprika, garlic and onion	Entrées	2024-05-19 00:00:50.024	2024-05-19 00:00:50.024
M40987_3314	Arroz Con Pollo Plate	Chicken & rice simmered in Sazon spices with a side of Puerto Rican spicy cabbage salad	Entrées	2024-05-13 21:21:37.524	2024-05-13 21:21:37.524
L81261_3314	Assorted Muffins		Breads	2024-05-20 22:46:17.844	2024-05-20 22:46:17.844
M289_3314	Fresh Squeezed Orange Juice	Sweet, refreshing juice from fresh squeezed oranges	Cold Beverages	2024-05-13 22:01:09.076	2024-05-13 22:01:09.076
M40942_3056	Chimichurri	Green sauce made of finely chopped parsley, garlic, oregano, cilantro and vinegar	Sauces	2024-05-19 00:00:49.084	2024-05-19 00:00:49.084
M21681_3314	Beef Stroganoff Noodle Bowl	Meatballs, roasted mushrooms, green peas and fettuccine tossed in stroganoff sauce	Entrées	2024-05-24 00:00:15.299	2024-05-24 00:00:15.299
M41558_3314	Chocolate Chip Cookie	Chocolate Chip Cookie	Desserts	2024-05-13 22:01:35.06	2024-05-13 22:01:35.06
M33400_3056	Cilantro Onions	Combination of fresh chopped onion and cilantro	Condiments	2024-05-13 22:01:26.034	2024-05-13 22:01:26.034
A212_3314	Chicken Tinga Taco Platter	Pulled chicken corn taco served with frijoles negros, arroz rojo and platano maduro	Entrées	2024-05-19 00:00:08.875	2024-05-19 00:00:08.875
M14081_3314	Crispy Chicken Sandwich	Crispy breaded chicken, American cheese, lettuce, tomato, pickle slices and mayonnaise	Hot Sandwiches 	2024-05-13 22:01:35.341	2024-05-13 22:01:35.341
M21938_3314	Hamburger	Grilled quarter pound beef burger on a roll	Hot Sandwiches 	2024-05-13 22:01:06.192	2024-05-13 22:01:06.192
A1221_3056	Pepperoni Pizza	Pepperoni, mozzarella cheese & oregano sauce on a garlic herb crust	Pizza	2024-05-13 21:21:39.762	2024-05-13 21:21:39.762
M20114_3314	Baby Spinach	Fresh baby spinach	Salads	2024-05-13 21:21:37.613	2024-05-13 21:21:37.613
M10587_3056	Turkey Sausage Link	Golden brown savory turkey sausage link	Sides	2024-05-13 21:21:36.738	2024-05-13 21:21:36.738
M2787_3056	Latin Spiced Pork Roast	Oven-braised pork loin roast seasoned with coriander and cumin	Entrées	2024-05-13 22:02:40.239	2024-05-13 22:02:40.239
M21677_3314	Chicken Alfredo Cavatappi 	Chicken cavatappi with Alfredo sauce	Entrées	2024-05-20 00:00:07.829	2024-05-20 00:00:07.829
M40676_3056	Buttermilk Pancakes	Fluffy, golden brown buttermilk pancakes	Entrées	2024-05-13 22:01:19.065	2024-05-13 22:01:19.065
A3028_3056	Whipped Cream	Vegan whipped cream	Desserts	2024-05-13 22:02:17.368	2024-05-13 22:02:17.368
M2182_3056	Apple Cobbler		Desserts	2024-05-20 22:46:18.161	2024-05-20 22:46:18.161
M2775_3056	Sauteed Chorizo	Sauteed smoked pork sausage	Entrées	2024-05-13 22:02:38.205	2024-05-13 22:02:38.205
L100755_3314	Beef And Cheese Ravioli (100)		Entrées	2024-05-13 21:21:37.528	2024-05-13 21:21:37.528
M40913_3314	Grilled Spicy Lemon Chicken	Tender boneless chicken marinated in a blend of lemon juice, cayenne pepper, paprika and garlic	Entrées	2024-05-20 22:46:19.278	2024-05-20 22:46:19.278
M21276_3056	Buffalo Chicken Mac & Cheese	Cavatappi pasta tossed with creamy cheddar sauce, spicy Buffalo chicken and Asiago cheese	Entrées	2024-05-13 21:21:36.597	2024-05-13 21:21:36.597
M40067_3056	Roast Beef & Cheddar Sandwich	Roast beef, cheddar, lettuce, tomato & horseradish spread	Cold Sandwiches	2024-05-22 00:00:12.06	2024-05-22 00:00:12.06
A5800_3056	Lemongrass Chicken Banh Mi	Lemongrass & red curry marinated chicken, pickled daikon & carrots, cilantro and lime-coriander mayo on a light and crispy roll	Sandwiches	2024-05-13 22:01:09.392	2024-05-13 22:01:09.392
M21584_3056	Quinoa & Edamame Salad	Quinoa tossed with corn, edamame, diced tomato, lime juice, green onion, cilantro and garlic	Salads	2024-05-20 22:46:19.735	2024-05-20 22:46:19.735
M32737_3056	Mediterranean Cheese Tortellini	Cheese tortellini pan-sauteed with broccoli, fresh tomato, Kalamata olives, onion and garlic	Entrées	2024-05-23 00:00:09.444	2024-05-23 00:00:09.444
M19647_3314	Lemon-Caper Couscous	Toasted couscous tossed with lemon juice, roasted garlic, cumin, oregano, smoked paprika and capers	Sides	2024-05-20 22:46:21.432	2024-05-20 22:46:21.432
M32745_3314	Margherita Cheese Ravioli	Cheese ravioli pan-sauteed with fresh tomato, onion, garlic and fresh basil	Entrées	2024-05-13 21:21:37.544	2024-05-13 21:21:37.544
M40392_3314	Cauliflower Spaghetti Bowl	Cauliflower and spaghetti tossed with vegan butter, and parmesan	Entrées	2024-05-13 22:01:32.069	2024-05-13 22:01:32.069
A5808_3314	Five Spice Pork Sandwich	Braised pork,   mustard-kimchi slaw, fresh jalapeno, on a toasted roll	Sandwiches	2024-05-13 21:21:37.677	2024-05-13 21:21:37.677
M35340_3314	Buffalo Chicken Sub	Chicken, Buffalo sauce, ranch dressing, blue cheese, lettuce, tomato and onion	Cold Sandwiches	2024-05-13 22:01:36.287	2024-05-13 22:01:36.287
M32303_3314	Chicken Tikka Masala Rice Bowl	Basmati rice with chicken tikka masala, tikka chaat, tomato and mint chutneys and pickled onions	Entrées	2024-05-13 21:21:37.538	2024-05-13 21:21:37.538
M34844_3314	Mojo Grilled Chicken	Grilled chicken in a mojo marinade	Entrées	2024-05-13 21:21:37.545	2024-05-13 21:21:37.545
M19926_3314	Veggie & Black Bean Saute	Fresh vegetables and black beans served over brown rice	Entrées	2024-05-13 21:21:37.561	2024-05-13 21:21:37.561
M40468_3314	Sausage Pizza	Italian sausage, mozzarella cheese and tomato sauce	Pizza	2024-05-13 21:21:37.593	2024-05-13 21:21:37.593
M38232_3056	Eggplant Meatball	Eggplant meatball	Entrées	2024-05-19 00:01:06.893	2024-05-19 00:01:06.893
M508_3056	Grilled Naan	Freshly grilled Indian flatbread seasoned with toasted garam masala	Breads	2024-05-19 00:00:49.744	2024-05-19 00:00:49.744
M40998_3056	Fried Falafel		Entrées	2024-05-19 00:00:49.93	2024-05-19 00:00:49.93
M10463_3056	Sauteed Mushrooms	Sauteed sliced mushrooms	Sides	2024-05-19 00:01:19.229	2024-05-19 00:01:19.229
M38765_3056	Creamy Cheese Polenta	Creamy cheese polenta	Sides	2024-05-19 00:01:06.956	2024-05-19 00:01:06.956
M38830_3056	Pesto Alfredo Chicken & Tortellini	Grilled chicken breast, cheese filled tortellini, pesto alfredo sauce, shaved parmesan	Entrées	2024-05-18 00:00:13.986	2024-05-18 00:00:13.986
M34533_3314	Jalapeno-Mango Salsa	Fresh blend of mango, tomato, lime juice, jalapeno and cilantro	Condiments	2024-05-13 22:01:32.339	2024-05-13 22:01:32.339
M34434_3056	Hearty Lentil & Potato Soup (6  fl oz)	Lentils, potatoes, onion, bell pepper, celery, carrot, herbs and garlic in tomato-vegetable broth	Soups	2024-05-19 00:00:55.996	2024-05-19 00:00:55.996
M4100_3314	Spaghetti with Meat Sauce	Hearty meat sauce served over spaghetti	Entrées	2024-05-18 00:00:08.264	2024-05-18 00:00:08.264
M19845_3056	Marinara Sauce	Homemade sauce with tomatoes, onions, garlic, oregano and basil	Condiments	2024-05-19 00:01:19.417	2024-05-19 00:01:19.417
M21920_3056	Vegetable Jambalaya	Flavorful jambalaya with vegetables and cayenne pepper over red beans and rice	Entrées	2024-05-19 00:01:20.69	2024-05-19 00:01:20.69
M40472_3056	Grilled Vegetable Pizza	Grilled fresh vegetables tossed in balsamic vinaigrette, mozzarella and pizza sauce	Pizza	2024-05-13 22:01:04.998	2024-05-13 22:01:04.998
M18804_3056	Roast Beef & Provolone Panini	Seasoned roast beef, provolone cheese and sauteed bell peppers grilled on a whole grain flatbread	Hot Sandwiches	2024-05-19 00:00:55.935	2024-05-19 00:00:55.935
M40443_3056	Meat Lover's Pizza	Pepperoni, Italian sausage, Italian meatballs, mozzarella and pizza sauce	Pizza	2024-05-13 22:00:59.765	2024-05-13 22:00:59.765
M33400_3314	Cilantro Onions	Combination of fresh chopped onion and cilantro	Condiments	2024-05-13 22:01:27.886	2024-05-13 22:01:27.886
M10401_3314	Zucchini & Yellow Squash Saute	Fresh zucchini, yellow squash and onions seasoned with basil, parsley and thyme	Sides	2024-05-13 22:01:32.277	2024-05-13 22:01:32.277
M32316_3056	Kimchi Fried Rice	Pan-fried brown rice with spicy kimchi, ginger, garlic and green onions	Sides	2024-05-13 22:01:09.226	2024-05-13 22:01:09.226
M38088_3314	Vegan Chorizo Creole	Vegan chorizo mixed with tomatoes & creole seasoning	Entrées	2024-05-13 22:01:35.213	2024-05-13 22:01:35.213
M20394_3056	Chicken Parmesan Stromboli	Grilled chicken, mozzarella, fresh basil and pizza sauce wrapped in pizza crust	Pizza	2024-05-19 00:01:19.166	2024-05-19 00:01:19.166
A3576_3056	Turkey Bibimbap Bowl	Sticky rice with gochujang ground turkey, sesame spinach, pickled cucumbers, kimchi then topped with a fried egg, scallions & gochujang sauce	Entrées	2024-05-13 22:01:30.99	2024-05-13 22:01:30.99
M10734_3056	Beef & Rice Soup (8  fl oz)	Beef, rice and fresh vegetables simmered in a hearty herbed beef broth	Soups	2024-05-13 22:01:04.743	2024-05-13 22:01:04.743
M37394_3056	Sesame Shrimp Salad Bowl	Seasoned chopped shrimp, avocado and Carrot Daikon on sushi rice then topped with spicy sesame mayo & wonton straws	Salads	2024-05-19 00:01:20.941	2024-05-19 00:01:20.941
M20861_3056	Meat Lover's Pizza	Pepperoni, Italian sausage, Italian meatballs, mozzarella and pizza sauce	Pizza	2024-05-19 00:01:21.756	2024-05-19 00:01:21.756
M3030_3314	BBQ Chicken	Roasted chicken glazed with a tangy barbecue sauce	Entrées	2024-05-13 22:01:27.947	2024-05-13 22:01:27.947
L366315_3314	Assorted Scones	Freshly baked assorted scones	Breads	2024-05-20 22:46:17.855	2024-05-20 22:46:17.855
A212_3056	Chicken Tinga Taco Platter	Pulled chicken corn taco served with frijoles negros, arroz rojo and platano maduro	Entrées	2024-05-13 22:01:18.66	2024-05-13 22:01:18.66
A229_3056	Chipotle Mushrooms Taco	Corn tortilla with chipotle mushrooms, onions, red pickled cabbage, fire roasted salsa & cilantro	Sandwiches	2024-05-19 00:00:56.307	2024-05-19 00:00:56.307
M33510_3314	General Tso's Chicken	Stir-fried chicken, carrot, broccoli, bell pepper, water chestnuts and onions in spicy-sweet sauce	Entrées	2024-05-20 00:00:07.555	2024-05-20 00:00:07.555
M40674_3056	BURGER, BLACK BEAN, VEGAN CHEDDAR, VEGAN SAUCE, 4.26 OZ		Hot Sandwiches	2024-05-13 21:21:40.522	2024-05-13 21:21:40.522
M18537_3314	Grilled Lemon-Rosemary Chicken	Boneless chicken breast seasoned with lemon zest, fresh rosemary, garlic and pepper	Entrées	2024-05-20 00:00:07.865	2024-05-20 00:00:07.865
M40843_3314	Seasoned Rice	Long grain white rice seasoned with salt and pepper	Sides	2024-05-13 22:01:28.198	2024-05-13 22:01:28.198
M20987_3314	Pepperoni Pizza	Pepperoni, pizza sauce and mozzarella	Pizza	2024-05-13 22:01:24.308	2024-05-13 22:01:24.308
M21076_3314	Fire-Roasted Salsa	Char-grilled onions, bell peppers and jalapenos pureed with tomatoes, cilantro and garlic	Condiments	2024-05-13 22:01:32.007	2024-05-13 22:01:32.007
M21036_3314	Spicy Asian Burrito	Tortilla stuffed with spicy Asian slaw, basmati rice, snow peas and sriracha edamame	Entrées	2024-05-21 00:00:10.876	2024-05-21 00:00:10.876
M20103_3314	Flour Tortilla (1  each)	6-inch flour tortilla	Grains	2024-05-13 22:01:32.094	2024-05-13 22:01:32.094
M2983_3314	Grilled Jerk Chicken	Grilled boneless chicken thigh that has been marinated in a blend of jalapenos, spices and garlic	Entrées	2024-05-13 22:01:32.4	2024-05-13 22:01:32.4
M33772_3056	Mexican Baked Fish	Baked Pollock topped with tomato, corn, poblanos and cilantro	Entrées	2024-05-19 00:00:55.873	2024-05-19 00:00:55.873
M600_3314	Powdered Sugar Donut	Freshly baked donut coated with powdered sugar	Breads	2024-05-21 00:00:06.847	2024-05-21 00:00:06.847
M21903_3314	Vegan Carrot Spice Cake	Freshly-baked vegan carrot cake with raisins and walnuts spiced with cinnamon and nutmeg	Desserts	2024-05-13 22:01:35.136	2024-05-13 22:01:35.136
M40348_3314	Ropa Vieja Taco	Cuban beef topped with queso fresco, pickled red onions, diced avocado and ranchero sauce on a warm corn tortilla with fresh lime wedge	Entrées	2024-05-13 22:01:35.139	2024-05-13 22:01:35.139
M34360_3314	Cumin Roasted Cauliflower	Cumin Roasted Cauliflower	Sides	2024-05-13 21:21:37.699	2024-05-13 21:21:37.699
M40310_3314	Pico de Gallo Avocado Toast	Avocado toast topped with arugula & pico de gallo	Cold Sandwiches	2024-05-13 22:01:27.517	2024-05-13 22:01:27.517
M33398_3056	Esquites	Corn tossed in a mixture of mayonnaise, lime juice, smoked paprika and cayenne	Sides	2024-05-13 22:01:33.08	2024-05-13 22:01:33.08
M21257_3314	Italian Beef Meatball	Beef meatball with a blend of Italian cheese, Italian bread crumbs and spices	Sides	2024-05-13 22:01:35.28	2024-05-13 22:01:35.28
M37047_3056	Philadelphia Roast Pork Stromboli	Roasted pork, broccoli rabe, banana peppers and provolone cheese wrapped in pizza crust	Pizza	2024-05-13 22:01:21.126	2024-05-13 22:01:21.126
M40441_3314	Meatball Pizza	Sliced Italian meatballs, mozzarella and pizza sauce	Pizza	2024-05-13 22:01:26.285	2024-05-13 22:01:26.285
M9786_3314	Crispy Shoestring French Fries	Thin-cut potatoes, deep-fried to golden brown	Sides	2024-05-13 22:01:06.192	2024-05-13 22:01:06.192
M40016_3056	Cheesy Chicken Tortilla Soup (6  fl oz)	A rich tomato and cheese broth loaded with chicken and Mexican spices	Soups	2024-05-13 22:01:09.415	2024-05-13 22:01:09.415
M14113_3056	Donut Bites	A variety of fresh baked donuts coated with cocoa, cinnamon sugar or powdered sugar	Breads	2024-05-13 22:01:18.722	2024-05-13 22:01:18.722
M33116_3314	Roasted Root Vegetables	Roasted root vegetables	Sides	2024-05-16 00:00:11.547	2024-05-16 00:00:11.547
M16559_3056	Spicy Vegetable Lo Mein	Lo mein noodles stir-fried with fresh vegetables in a spicy chili garlic sauce	Sides	2024-05-19 00:01:06.894	2024-05-19 00:01:06.894
M40451_3056	Chicken Parmesan Pizza	Grilled seasoned chicken, mozzarella, Parmesan, fresh parsley and pizza sauce	Pizza	2024-05-19 00:01:19.171	2024-05-19 00:01:19.171
M32660_3314	Dirty Rice	Long grain white rice mixed with sauteed bacon, ground beef, onions and fresh plum tomatoes	Sides	2024-05-13 22:01:26.413	2024-05-13 22:01:26.413
M15668_3314	Raisins	Seedless raisins	Salads	2024-05-13 21:21:40.971	2024-05-13 21:21:40.971
A287_3314	Al Pastor	Boneless al pastor	Entrées	2024-05-13 22:01:27.674	2024-05-13 22:01:27.674
M40715_3056	Hummus	A dip of mashed chickpeas, tahini, lemon juice, oil and garlic	Condiments	2024-05-19 00:00:49.914	2024-05-19 00:00:49.914
A293_3056	Grilled  Mojo Chicken	Grilled   chicken marinated in orange juice, ancho chili lime & spices	Entrées	2024-05-19 00:00:49.976	2024-05-19 00:00:49.976
M34487_3056	Chili Con Carne (6  fl oz)	A Southwest spiced stew of ground beef, tomatoes, onion, green peppers, garlic and kidney beans	Soups	2024-05-19 00:00:49.732	2024-05-19 00:00:49.732
M10266_3056	Homestyle Macaroni Salad	Elbow macaroni, celery, bell pepper, green onions and eggs blended in a creamy mayonnaise dressing	Salads	2024-05-19 00:01:09.159	2024-05-19 00:01:09.159
M41120_3314	Chicken & Veggie Stir-Fry	Chicken with broccoli, onions, cabbage, carrots, & crushed red peppers mixed with beef sriracha chili sauce	Entrées	2024-05-13 21:21:40.606	2024-05-13 21:21:40.606
M40802_3314	Ancho Beef Chili	Tender beef, tomatoes, black beans and onion, simmered with ancho, chipotle and chili peppers	Entrées	2024-05-13 22:01:25.053	2024-05-13 22:01:25.053
M5722_3056	Sweet & Spicy Coleslaw	Shredded green cabbage and carrots tossed in a sweet and spicy vinaigrette	Salads	2024-05-13 22:01:45.733	2024-05-13 22:01:45.733
M16020_3056	Orange Cake		Desserts	2024-05-13 21:21:40.359	2024-05-13 21:21:40.359
M32554_3056	Turmeric & Quinoa Basmati Rice	Basmati rice mixed with turmeric, cinnamon and red quinoa	Sides	2024-05-19 00:00:49.426	2024-05-19 00:00:49.426
M10521_3314	Broccoli & Cauliflower	Steamed broccoli and cauliflower	Sides	2024-05-18 00:00:18.337	2024-05-18 00:00:18.337
M38834_3056	Mac & Cheese	White cheddar macaroni & cheese	Entrées	2024-05-13 22:01:50.839	2024-05-13 22:01:50.839
M16684_3056	Beef Taco	Taco beef, cheddar, lettuce, tomato, sour cream and jalapeno in a crispy taco shell	Entrées	2024-05-13 22:01:18.66	2024-05-13 22:01:18.66
M14979_3056	Cheesy Bacon Cavatappi	Cavatappi pasta with bacon, green peas and Parmesan in cheddar cheese sauce	Entrées	2024-05-13 21:21:39.735	2024-05-13 21:21:39.735
M39651_3056	Margherita Flatbread	Shredded mozzarella, vine ripe tomato, basil pesto	Pizza	2024-05-19 00:00:55.92	2024-05-19 00:00:55.92
M6479_3056	Jalapeno Coleslaw	Creamy coleslaw with a kick of fire roasted jalapenos, cilantro and cumin	Salads	2024-05-19 00:00:55.981	2024-05-19 00:00:55.981
M19824_3056	Ice Cream Cookie Sandwich	Rich vanilla ice cream sandwiched between two chocolate chip cookies	Desserts	2024-05-19 00:00:56.042	2024-05-19 00:00:56.042
M21511_3056	Tortellini Rose	Cheese tortellini sauteed with tomato cream sauce and garlic topped with Parmesan and basil	Entrées	2024-05-19 00:01:21.736	2024-05-19 00:01:21.736
M40762_3314	Yellow Rice	Savory long grain rice cooked in vegetable broth with turmeric	Sides	2024-05-13 22:01:32.277	2024-05-13 22:01:32.277
M34463_3056	Chicken Soup with Brown Rice (6  fl oz)	Tender chicken, brown rice and fresh vegetables in an herbed chicken broth	Soups	2024-05-19 00:01:21.861	2024-05-19 00:01:21.861
M35609_3314	Incogmeato™ Sausage Patty	Plant-based breakfast sausage	Protein	2024-05-23 00:00:06.012	2024-05-23 00:00:06.012
A283_3056	Grilled Pineapple Guacamole (1  fl oz)	Guacamole with grilled pineapple	Condiments	2024-05-19 00:00:56.226	2024-05-19 00:00:56.226
M32244_3056	Cajun Baked Chicken	Cajun-seasoned baked chicken leg quarter	Entrées	2024-05-19 00:01:22.626	2024-05-19 00:01:22.626
M41017_3314	Fire-Roasted Salsa	Char-grilled onions, bell peppers and jalapenos pureed with tomatoes, cilantro and garlic	Condiments	2024-05-13 22:01:34.975	2024-05-13 22:01:34.975
M16738_3314	Iced Cinnamon Roll	Freshly baked cinnamon roll with cream cheese icing	Breads	2024-05-20 22:46:17.869	2024-05-20 22:46:17.869
M14864_3314	Rotini	Chilled cooked spiral-shaped pasta	Grains	2024-05-13 22:01:35.214	2024-05-13 22:01:35.214
A2937_3056	Chipotle Turkey Sandwich	Turkey, Monterey Jack, lettuce, tomato, onion & chipotle mayo	Sandwiches	2024-05-19 00:01:22.247	2024-05-19 00:01:22.247
M19488_3314	Spicy Sweet Potato & Bean Taco	Roasted chili and cumin-seasoned sweet potatoes, black bean salsa and jicama slaw in flour tortilla	Entrées	2024-05-13 22:01:27.982	2024-05-13 22:01:27.982
M40765_3314	Pulled Pork	Slow braised pork butt with onion, garlic, cumin, chili powder, lime juice and cilantro	Entrées	2024-05-13 22:01:32.092	2024-05-13 22:01:32.092
M35269_3314	Italian-style Meatloaf	Flavorful, garlicky roll of ground beef, sautéed onions, Parmesan, breadcrumbs and Italian spices	Entrées	2024-05-22 00:00:09.7	2024-05-22 00:00:09.7
M40749_3314	Spanish Rice	Brown rice with tomatoes, onions, garlic and green peppers seasoned with cumin, oregano and sage	Sides	2024-05-13 22:01:35.336	2024-05-13 22:01:35.336
M2722_3314	Roast Pork Adobo	Center-cut pork loin marinated in cider vinegar, garlic, oregano and ground black pepper	Entrées	2024-05-20 00:00:07.557	2024-05-20 00:00:07.557
M32981_3314	Chicken Salad Sandwich	Chunky chicken salad with cheddar cheese on Wheat roll 	Cold Sandwiches	2024-05-20 22:46:21.082	2024-05-20 22:46:21.082
M17308_3314	Chicken Pho	Vietnamese Noodle soup loaded with chicken, bean sprouts, green onions, jalapenos, cilantro and basil	Entrées	2024-05-13 22:01:32.399	2024-05-13 22:01:32.399
M40479_3314	Mushroom & Sausage Pizza	Mozzarella cheese and pizza sauce	Pizza	2024-05-21 00:00:10.941	2024-05-21 00:00:10.941
M34461_3314	Chipotle Chicken Tortilla Soup (6  fl oz)	Chicken, corn tortillas, tomatoes, onion, garlic, chipotle pepper and cumin in a chicken broth	Soups	2024-05-21 00:00:09.527	2024-05-21 00:00:09.527
A2941_3056	Loaded Bulgogi Beef Fries	Bulgogi beef on top of French fries covered with spicy queso and topped with kimchi and pickled soy-sesame cucumbers	Entrées	2024-05-13 22:01:33.265	2024-05-13 22:01:33.265
M9894_3314	Steamed Broccoli Florets	Steamed broccoli florets tossed with garlic and black pepper	Sides	2024-05-13 22:01:35.337	2024-05-13 22:01:35.337
M861_3314	French Toast	Golden brown and fluffy cinnamon-spiced thick-cut French toast	Entrées	2024-05-13 22:01:27.551	2024-05-13 22:01:27.551
M21053_3056	Vegan Beef Stir-Fry Bowl	Vegan Beef Stir-Fry Bowl	Entrées	2024-05-13 22:01:53.196	2024-05-13 22:01:53.196
M33093_3314	Steamed Corn	Whole kernal corn with butter and seasoning	Sides	2024-05-13 22:01:47.975	2024-05-13 22:01:47.975
M32944_3314	Dinner Roll	Soft and delicious white dinner rolls	Breads	2024-05-13 22:02:18.766	2024-05-13 22:02:18.766
M20955_3314	Vegan Chili Con Carne (8  fl oz)	Southwest-spiced stew of tomatoes, onions, peppers, kidney beans and meatless beef crumbles	Soups	2024-05-13 22:01:25.239	2024-05-13 22:01:25.239
M5768_3314	Crispy Tater Tots	Deep-fried seasoned shredded potato bites	Sides	2024-05-13 22:02:14.551	2024-05-13 22:02:14.551
M32322_3056	Cranberry Orange Mini Muffin	Freshly baked muffin with orange and cranberries	Breads	2024-05-13 22:01:21.192	2024-05-13 22:01:21.192
M40451_3314	Chicken Parmesan Pizza	Grilled seasoned chicken, mozzarella, Parmesan, fresh parsley and pizza sauce	Pizza	2024-05-13 22:01:24.307	2024-05-13 22:01:24.307
M12167_3056	Ham, Egg & Cheese Bagel	Ham, scrambled egg, and American cheese on a plain bagel	Sandwiches	2024-05-13 22:02:15.256	2024-05-13 22:02:15.256
M40955_3314	Refried Beans	Refried beans	Sides	2024-05-13 22:01:35.318	2024-05-13 22:01:35.318
M32878_3314	Baked BBQ Chicken	Baked chicken with BBQ spice mix and Alabama BBQ sauce	Entrées	2024-05-13 22:01:52.691	2024-05-13 22:01:52.691
M19801_3056	Philly Cheesesteak Stromboli	Classic cheesesteak with onion, mozzarella and banana peppers wrapped in a golden brown crust	Pizza	2024-05-13 22:01:49.18	2024-05-13 22:01:49.18
M9519_3314	Bacon	Crisp, lightly smoked bacon strips	Sides	2024-05-13 22:01:09.141	2024-05-13 22:01:09.141
M32660_3056	Dirty Rice	Long grain white rice mixed with sauteed bacon, ground beef, onions and fresh plum tomatoes	Sides	2024-05-13 21:21:39.773	2024-05-13 21:21:39.773
M8170_3056	Grilled Black Bean Burger	Grilled black bean burger on a bun	Hot Sandwiches	2024-05-19 00:01:19.21	2024-05-19 00:01:19.21
M34452_3314	Italian Wedding Soup (6  fl oz)	Tiny meatballs, spinach, basil, onions, carrots, celery in rich chicken broth with ditalini pasta	Soups	2024-05-13 22:01:28.218	2024-05-13 22:01:28.218
M32303_3056	Chicken Tikka Masala Rice Bowl	Basmati rice with chicken tikka masala, tikka chaat, tomato and mint chutneys and pickled onions	Entrées	2024-05-23 00:00:09.445	2024-05-23 00:00:09.445
M10274_3056	Spanish Rice	Brown rice with tomatoes, onions, garlic and green peppers seasoned with cumin, oregano and sage	Sides	2024-05-19 00:01:06.943	2024-05-19 00:01:06.943
M41475_3056	Spicy Shrimp Volcano Bowl	Spicy shrimp salad with kimchi, jalapeno and scallions on sushi rice topped with spicy mayo, sweet chili sauce and nori	Entrées	2024-05-19 00:00:49.959	2024-05-19 00:00:49.959
M3742_3314	Chicken with Marsala Sauce	Oven-roasted chicken breast served with a light Marsala wine sauce with mushrooms	Entrées	2024-05-13 22:01:35.137	2024-05-13 22:01:35.137
M20433_3056	Honey BBQ Pork Chop	Grilled boneless pork chop marinated in a sweetened honey orange BBQ sauce	Entrées	2024-05-13 22:01:45.678	2024-05-13 22:01:45.678
M36308_3056	Sweet Plantain	Fried yellow plantains	Sides	2024-05-19 00:00:50.021	2024-05-19 00:00:50.021
M36641_3056	Balsamic Roasted Vegetables	Oven-roasted eggplant, squash, potato, bell pepper, tomato and mushrooms tossed in balsamic vinaigrette	Sides	2024-05-19 00:00:50.084	2024-05-19 00:00:50.084
A41_3056	Crispy Sesame Tofu Lo Mein Bowl	Crispy sesame tofu with mixed vegetable lo mein coated in sauce and topped with scallions	Entrées	2024-05-13 21:21:40.573	2024-05-13 21:21:40.573
M4929_3056	Smoked BBQ Pork Ribs	Slow smoked St. Louis-style ribs coated with a spicy barbecue rub	Entrées	2024-05-13 22:01:33.008	2024-05-13 22:01:33.008
M32651_3056	Salisbury Steak & Mushroom Sauce	Seasoned ground beef patty served with a savory mushroom-herb gravy	Entrées	2024-05-19 00:01:09.095	2024-05-19 00:01:09.095
M41411_3056	Almond Chocolate Cupcake	Yellow cake cupcake topped with chocolate icing, chocolate sauce and toasted almonds	Desserts	2024-05-19 00:01:19.459	2024-05-19 00:01:19.459
M22052_3056	Chicken Poblano Flatbread	Whole grain flatbread topped with chicken, poblano peppers, salsa verde and mozzarella	Pizza	2024-05-19 00:01:21.752	2024-05-19 00:01:21.752
M1925_3056	Red Velvet Cream Cheese Bar	Red velvet dessert bar layered with cream cheese filling	Desserts	2024-05-19 00:01:21.863	2024-05-19 00:01:21.863
M20651_3314	Chicken Pot Pie	Creamy chicken with potatoes, carrots, peas, celery and onion topped with a buttermilk biscuit	Entrées	2024-05-13 21:21:40.634	2024-05-13 21:21:40.634
M41066_3056	Grilled Chicken Breast	Grilled chicken breast	Entrées	2024-05-19 00:00:50.007	2024-05-19 00:00:50.007
M40342_3314	Vegan Breakfast Taco	Soft corn taco stuffed with a chickpea scramble, spinach & vegan cheddar cheese	Sandwiches	2024-05-13 22:01:27.604	2024-05-13 22:01:27.604
M20732_3314	Cheese Quesadilla	Cheddar cheese in a tortilla grilled to perfection	Entrées	2024-05-21 00:00:09.277	2024-05-21 00:00:09.277
M9876_3056	Roasted Garlic Potatoes	Oven-roasted red potatoes tossed with roasted garlic	Sides	2024-05-13 22:01:53.257	2024-05-13 22:01:53.257
M20749_3056	Shrimp Tostada	Chipotle shrimp and spicy black beans on crisp tortilla with lettuce, radish, avocado and jalapenos	Entrées	2024-05-13 22:01:53.245	2024-05-13 22:01:53.245
M12296_3056	Turkey Bacon	Crispy turkey bacon strip	Sides	2024-05-13 22:01:00.048	2024-05-13 22:01:00.048
M14864_3056	Rotini	Chilled cooked spiral-shaped pasta	Grains 	2024-05-13 22:01:45.802	2024-05-13 22:01:45.802
A787_3056	Cajun Shrimp & Grits	Cajun seasoned shrimp and grits with bacon, peppers and onion	Entrées	2024-05-13 22:01:53.507	2024-05-13 22:01:53.507
L340205_3314	Overnight Strawberry Oats	A creamy combination of oatmeal, milk, yogurt, honey and strawberries served chilled	Cereals	2024-05-20 22:46:17.908	2024-05-20 22:46:17.908
M40749_3056	Spanish Rice	Brown rice with tomatoes, onions, garlic and green peppers seasoned with cumin, oregano and sage	Sides	2024-05-13 22:01:19.083	2024-05-13 22:01:19.083
M35634_3314	Almond Milk French Toast	Texas toast dipped in cinnamon almond milk mixture topped with apple compote	Entrées	2024-05-13 22:01:27.543	2024-05-13 22:01:27.543
M16625_3314	Soft Ancho-Lime Shrimp Tacos	Ancho-lime shrimp, cheddar, lettuce, tomato, sour cream and jalapeno in a flour tortilla	Entrées	2024-05-13 22:01:27.972	2024-05-13 22:01:27.972
M39850_3314	Ham & Swiss Sandwich	Ham, Swiss, lettuce and tomato on whole wheat bread	Cold Sandwiches	2024-05-22 00:00:11.636	2024-05-22 00:00:11.636
M3685_3056	Thai Red Curry Chicken	Sauteed boneless chicken, onion, garlic, red curry paste and spices simmered in coconut milk	Entrées	2024-05-19 00:01:12.929	2024-05-19 00:01:12.929
A2944_3314	Plant-Based Meatball (1  each)	Roasted plant-based meatball	Protein	2024-05-13 22:01:27.727	2024-05-13 22:01:27.727
M14863_3314	Orzo	Chilled cooked rice-shaped pasta	Grains	2024-05-20 00:00:07.877	2024-05-20 00:00:07.877
M3863_3314	Egg Noodles	Fresh cooked wide egg noodles	Entrées	2024-05-13 22:02:18.857	2024-05-13 22:02:18.857
A5825_3314	Chili  Con Carne (6  fl oz)	A   Southwest spiced stew of ground beef, tomatoes, onion, green peppers, garlic   & kidney beans	Soups	2024-05-20 00:00:07.751	2024-05-20 00:00:07.751
M11315_3056	Roasted Carrots	Oven-roasted carrots tossed with steak seasoning, black pepper and salt	Sides	2024-05-13 22:01:53.258	2024-05-13 22:01:53.258
M34592_3314	Marinara Sauce	Homemade sauce with tomatoes, onions, garlic, oregano and basil	Sauces	2024-05-22 00:00:09.916	2024-05-22 00:00:09.916
M40919_3314	Kale with Caramelized Onions	Fresh kale simmered with balsamic caramelized onions	Sides	2024-05-13 22:01:32.275	2024-05-13 22:01:32.275
M40946_3314	Taco-Seasoned Grilled Chicken	Taco-seasoned grilled chicken thighs	Entrées	2024-05-13 22:01:47.869	2024-05-13 22:01:47.869
M1842_3056	Vanilla Iced Carrot Cake	Homemade carrot spice cake with raisins and walnuts frosted with creamy vanilla icing	Desserts	2024-05-13 22:01:53.308	2024-05-13 22:01:53.308
M34425_3056	Cream of Mushroom Soup (6  fl oz)	Homemade cream soup with fresh mushrooms, onion, garlic and herbs	Soups	2024-05-13 22:01:45.74	2024-05-13 22:01:45.74
A721_3314	Southern Spaghetti	Spaghetti tossed in a cheese sauce with green chilis and tomatoes	Pasta Entrées	2024-05-20 00:00:07.558	2024-05-20 00:00:07.558
M40453_3314	Udon Noodles ( 1/2 cup)	Udon noodles	Grains	2024-05-13 22:02:18.918	2024-05-13 22:02:18.918
M2340_3314	Crispy Cereal Bar	Crispy dessert bar with crisp rice cereal and marshmallows	Desserts	2024-05-13 22:01:35.134	2024-05-13 22:01:35.134
M21372_3314	Chocolate Pudding	Smooth & rich chocolate pudding	Dessert Toppings	2024-05-13 22:02:18.796	2024-05-13 22:02:18.796
M19998_3314	Red Beans & Rice	Tender rice and red beans simmered with green bell peppers, onion and garlic	Sides	2024-05-13 21:21:37.706	2024-05-13 21:21:37.706
M10569_3314	Southwest Roasted Corn	Oven-roasted corn tossed with taco seasoning	Sides	2024-05-13 21:21:37.718	2024-05-13 21:21:37.718
M9615_3056	Vegetable Fried Rice	Fried rice with pea pods, onion, green onion, garlic, ginger and soy sauce with scrambled eggs	Sides	2024-05-19 00:01:19.222	2024-05-19 00:01:19.222
M36741_3056	Fried Chicken	Deep fried chicken	Entrées	2024-05-13 22:01:50.842	2024-05-13 22:01:50.842
M32380_3056	Nam Tok Pork	Grilled pork loin tossed with lime juice, fish sauce, toasted rice, shallot and cilantro	Entrées	2024-05-19 00:01:22.624	2024-05-19 00:01:22.624
M32954_3056	Bacon & Cheddar Quiche-adilla	Baked mixture of egg, bacon, cheddar and green onion in a crispy tortilla shell	Entrées	2024-05-19 00:01:21.016	2024-05-19 00:01:21.016
M19908_3314	Crispy Onion Rings	Piping hot battered onion rings	Sides	2024-05-13 22:01:28.136	2024-05-13 22:01:28.136
M32321_3056	Maple Spice Mini Muffin	Freshly baked maple-flavored muffin with cinnamon and allspice	Breads	2024-05-19 00:01:21.077	2024-05-19 00:01:21.077
M40467_3314	Primavera Pizza	Sauteed fresh squash, mushrooms, red onion and bell peppers, mozzarella and pizza sauce	Pizza	2024-05-24 00:00:15.339	2024-05-24 00:00:15.339
M21678_3314	Green Curry Chicken Noodle Bowl	Grilled chicken vegetables and lo mein noodles in green thai curry topped with herbs	Entrées	2024-05-21 00:00:09.29	2024-05-21 00:00:09.29
M4702_3056	Aloo Gobi	Cauliflower and cumin roasted potatoes with onions, tomatoes and garlic in a rich curry sauce	Sides	2024-05-19 00:00:49.709	2024-05-19 00:00:49.709
M3863_3056	Egg Noodles	Fresh cooked wide egg noodles	Entrées	2024-05-19 00:01:09.095	2024-05-19 00:01:09.095
M19848_3056	Meat Sauce	Freshly made meat sauce	Condiments	2024-05-13 22:01:45.896	2024-05-13 22:01:45.896
L363988_3056	BBQ Ranch Pizza	Pulled pork, hot peppers & sauteed onions, mozzarella, alfredo sauce& ranch drizzle	Pizza	2024-05-20 22:46:18.056	2024-05-20 22:46:18.056
M10090_3314	Italian Roasted Vegetables	Oven-roasted fresh zucchini, onions and carrots seasoned with garlic and Italian seasoning	Sides	2024-05-22 00:00:09.934	2024-05-22 00:00:09.934
M20106_3056	Vegetarian Refried Beans	Hearty vegetarian refried beans	Salads	2024-05-13 22:01:05.196	2024-05-13 22:01:05.196
M32501_3314	Turkey BLT Biscuit Sandwich	Turkey, bacon, lettuce, tomato and lemon-pepper mayonnaise on a biscuit	Cold Sandwiches	2024-05-13 22:02:18.769	2024-05-13 22:02:18.769
M41602_3314	Huli-Huli Chicken with Creamy Pineapple Slaw	Huli-Huli grilled chicken served with rice and a creamy pineapple slaw	Entrées	2024-05-22 00:00:11.711	2024-05-22 00:00:11.711
M41200_3314	Chicken & Andouille Sausage Gumbo	Louisiana style gumbo with andouille sausage, peppers, onions, celery and okra over long grain rice	Entrées	2024-05-13 22:01:52.691	2024-05-13 22:01:52.691
M10588_3314	Pork Sausage Patty	Sizzling hot golden brown pork sausage patty	Sides	2024-05-13 22:02:16.189	2024-05-13 22:02:16.189
M14255_3314	Diced Ham	Diced ham	Protein	2024-05-20 00:00:07.577	2024-05-20 00:00:07.577
M32671_3314	Beef Kofta Kabob	Skewered Middle Eastern-style meatball	Entrées	2024-05-21 00:00:10.873	2024-05-21 00:00:10.873
M19834_3056	Breakfast Stromboli with Sausage	Scrambled eggs, cheddar and crumbled sausage stromboli	Entrées	2024-05-13 22:02:17.134	2024-05-13 22:02:17.134
M21748_3056	Beef Gyro Meat	Sliced beef gyro meat	Protein	2024-05-13 22:01:53.319	2024-05-13 22:01:53.319
M16488_3056	Grilled Zucchini Squash	Grilled zucchini squash slices	Sides	2024-05-13 22:01:53.257	2024-05-13 22:01:53.257
M20023_3056	Chicken Taco Salad Bowl	Grilled chicken and cheddar on romaine tossed with salsa ranch dressing in crisp tortilla bowl	Salads	2024-05-13 21:21:40.349	2024-05-13 21:21:40.349
M40794_3314	Chicken & Veggie Stir-Fry	Chicken, broccoli, water chestnuts, red pepper and onion stir-fry	Entrées	2024-05-24 00:00:11.441	2024-05-24 00:00:11.441
M7975_3056	Tuna Melt	Creamy tuna salad and American cheese on toasted English muffin	Hot Sandwiches	2024-05-13 22:01:49.197	2024-05-13 22:01:49.197
M20953_3056	Vegan Chipotle Chicken Taco	Flour tortilla with meatless chicken strips, lettuce, black bean-corn salsa and chipotle sauce	Entrées	2024-05-13 22:00:59.776	2024-05-13 22:00:59.776
M20423_3056	Maple Apple Cobbler	Warm maple-glazed apples and cranberries with a brown sugar-spice topping	Desserts	2024-05-20 22:46:19.745	2024-05-20 22:46:19.745
L364409_3056	Spaghetti with Marinara	Spaghetti with Marinara Sauce	Pasta Entrées	2024-05-20 22:46:19.966	2024-05-20 22:46:19.966
M35575_3314	Tofu Chilaquiles	Tofu, toasted pumpkin seeds, black bean corn salsa, red enchilada sauce and tortilla chips	Entrées	2024-05-13 22:02:14.466	2024-05-13 22:02:14.466
M6363_3056	Red Potato Salad	Red potatoes and chopped hard-cooked eggs in a creamy Dijon mayonnaise	Salads	2024-05-19 00:00:49.146	2024-05-19 00:00:49.146
A350_3314	Jerk Chicken Thighs	Baked chicken thighs with Caribbean jerk seasoning	Entrées	2024-05-13 22:01:32.409	2024-05-13 22:01:32.409
M10569_3056	Southwest Roasted Corn	Oven-roasted corn tossed with taco seasoning	Sides	2024-05-19 00:01:09.156	2024-05-19 00:01:09.156
M41017_3056	Fire-Roasted Salsa	Char-grilled onions, bell peppers and jalapenos pureed with tomatoes, cilantro and garlic	Condiments	2024-05-13 22:01:19.083	2024-05-13 22:01:19.083
M34895_3314	Beef Flank Steak	Seasoned and grilled flank steak	Entrées	2024-05-13 22:01:25.088	2024-05-13 22:01:25.088
M1057_3056	Belgian Waffle	Crispy, golden-brown waffle	Entrées	2024-05-13 22:02:17.197	2024-05-13 22:02:17.197
M2349_3056	Old-Fashioned Apple Pie	Freshly baked pie with chunks of tart apples in a flaky crust	Desserts	2024-05-13 22:01:53.308	2024-05-13 22:01:53.308
M21424_3056	Loaded BBQ Pork French Fries	Shoestring fries topped with Carolina BBQ pork, shredded cheddar and green onions on a bed of slaw	Entrées	2024-05-13 22:01:33.333	2024-05-13 22:01:33.333
M20851_3314	Margherita Pizza	Fresh sliced plum tomatoes and shredded basil with mozzarella and a sprinkle of Italian seasoning	Pizza	2024-05-13 22:01:27.686	2024-05-13 22:01:27.686
M9615_3314	Vegetable Fried Rice	Fried rice with pea pods, onion, green onion, garlic, ginger and soy sauce with scrambled eggs	Sides	2024-05-13 21:21:40.785	2024-05-13 21:21:40.785
M40764_3056	Herb Roasted Red Potatoes	Diced roasted red potatoes tossed with rosemary, thyme and marjoram	Sides	2024-05-19 00:00:41.834	2024-05-19 00:00:41.834
A209_3314	Chicken Tinga Taco	Corn tortilla filled with pulled chicken with chipotle adobo, salsa roja, pickled onions & cilantro	Sandwiches	2024-05-13 22:01:32.22	2024-05-13 22:01:32.22
M6929_3056	Papaya Salsa	Fresh blend of papaya, jalapeno, red and green bell peppers, lime juice, cilantro and garlic	Condiments	2024-05-24 00:00:08.108	2024-05-24 00:00:08.108
M3316_3056	Broccoli, Egg & Cheddar Strata	Savory egg and bread casserole with fresh broccoli, sauteed mushrooms, Cheddar, onion and garlic	Entrées	2024-05-13 22:01:18.53	2024-05-13 22:01:18.53
M39654_3056	Asian Chicken Flatbread	Grilled chicken, peanut sauce, roasted peppers and onions, topped with mixed greens, carrots, scallion, edamame and sesame dressing	Pizza	2024-05-13 22:01:53.196	2024-05-13 22:01:53.196
M6847-165894_3056	Croutons ( 1/4 cup)	Homestyle seasoned croutons	Breads	2024-05-23 00:00:07.052	2024-05-23 00:00:07.052
M599_3314	Cinnamon-Sugar Donut	Freshly baked donut coated with cinnamon sugar	Breads	2024-05-13 22:01:09.049	2024-05-13 22:01:09.049
M9636_3314	White Rice	Slow-simmered long grain white rice	Sides	2024-05-13 22:01:28.199	2024-05-13 22:01:28.199
M20842_3056	Chicken Fajita Pizza	Grilled chicken and green peppers, cheddar and salsa	Pizza	2024-05-13 22:01:09.196	2024-05-13 22:01:09.196
M19741_3314	Baked Potato Wedges	Baked seasoned potato wedges	Sides	2024-05-13 22:01:25.215	2024-05-13 22:01:25.215
M4214_3056	Szechuan Pork	Oven-roasted pork loin that has marinated in a spicy Szechuan-soy sauce blend	Entrées	2024-05-13 21:21:40.287	2024-05-13 21:21:40.287
M21020_3056	Chocolate Cupcake	Freshly baked chocolate cupcake frosted with creamy whipped icing	Desserts	2024-05-19 00:01:19.272	2024-05-19 00:01:19.272
M20658_3056	Buffalo-Style Chicken Wings	Buffalo-style chicken wings served with celery sticks and blue cheese dressing	Entrées	2024-05-19 00:00:49.084	2024-05-19 00:00:49.084
M40785_3314	Honey BBQ Turkey	Grilled turkey breast seasoned with barbecue seasoning and brushed with honey	Entrées	2024-05-13 22:01:52.694	2024-05-13 22:01:52.694
M21926_3056	Sweet Chili Tofu Saute	Tofu sauteed with Asian vegetables and pineapple in sweet chili sauce over almond-raisin rice	Entrées	2024-05-19 00:01:09.12	2024-05-19 00:01:09.12
M19679_3056	Thai Chicken Curry	Chicken, onions and bell peppers in a rich Thai curry sauce over rice	Entrées	2024-05-13 22:02:23.722	2024-05-13 22:02:23.722
M20327_3056	Broccoli Florets	Fresh broccoli florets	Salads	2024-05-19 00:01:19.334	2024-05-19 00:01:19.334
M10645_3314	Steamed Mixed Vegetables	Lightly seasoned steamed fresh green and yellow squash, broccoli, cauliflower and bell pepper	Sides	2024-05-13 22:02:19.152	2024-05-13 22:02:19.152
M34532_3056	Fire-Roasted Salsa	Char-grilled onions, bell peppers and jalapenos pureed with tomatoes, cilantro and garlic	Condiments	2024-05-13 22:01:05.206	2024-05-13 22:01:05.206
M32348_3056	Korean-Style Fried Chicken Drumstick	Crispy golden chicken drumstick	Entrées	2024-05-13 22:01:09.18	2024-05-13 22:01:09.18
M18841_3314	Rotisserie Chicken	Roasted bone-in chicken rubbed with salt, garlic, onion and paprika	Entrées	2024-05-21 00:00:09.303	2024-05-21 00:00:09.303
M20277_3056	Glazed Donut	Sugar-glazed donut	Breads	2024-05-13 21:21:36.777	2024-05-13 21:21:36.777
M32988_3056	Chicken Caesar Wrap	Chicken breast, romaine, Parmesan and creamy Caesar dressing on a flour tortilla	Cold Sandwiches	2024-05-19 00:00:50.022	2024-05-19 00:00:50.022
M35576_3056	Fudge Pudding Cake	Freshly baked vegan dessert made of a sugar-cocoa mixture and soy milk	Desserts	2024-05-19 00:01:21.88	2024-05-19 00:01:21.88
M10734_3314	Beef & Rice Soup (8  fl oz)	Beef, rice and fresh vegetables simmered in a hearty herbed beef broth	Soups	2024-05-22 00:00:09.947	2024-05-22 00:00:09.947
M3411_3314	Asian Teriyaki Noodles	Rice noodles tossed with sauteed carrots, mushrooms, bell pepper and sweet teriyaki sauce	Entrées	2024-05-13 22:01:25.064	2024-05-13 22:01:25.064
M40494_3056	Chicken Noodle Soup (16  fl oz)	Sautéed carrots, celery, onion, white meat chicken, wide egg noodles, chicken stock, thyme, bay leaf, black and white peppers	Soups	2024-05-19 00:00:49.959	2024-05-19 00:00:49.959
M37958_3314	California Sushi Rice Bowl	Seafood salad, avocado and cucumbers on sushi rice then topped with wonton straws, Japanese spice mix & spicy mayo	Entrées	2024-05-13 22:02:18.843	2024-05-13 22:02:18.843
M32253_3056	Mesquite Chicken	Baked chicken leg quarter coated with mesquite BBQ seasoning	Entrées	2024-05-19 00:01:12.946	2024-05-19 00:01:12.946
M20399_3314	Meatball Stromboli	Italian meatballs, mozzarella, grilled red onion, crushed red pepper wrapped in a house-made crust	Pizza	2024-05-13 22:01:27.999	2024-05-13 22:01:27.999
M19760_3314	Grilled Naan	Grilled curry-spiced flatbread	Breads	2024-05-13 22:01:26.221	2024-05-13 22:01:26.221
M39901_3056	Crispy Chicken Sandwich	Crispy chicken breast, lettuce, pickles on a potato roll	Hot Sandwiches	2024-05-19 00:00:51.516	2024-05-19 00:00:51.516
M32631_3314	Japanese Chicken Noodle Salad	Cold yakisoba noodles, grilled chicken, edamame, kale, vegetables, sesame and Asian vinaigrette	Entrées	2024-05-13 22:02:18.891	2024-05-13 22:02:18.891
M39263_3056	Chicken & Wild Rice Soup (6  fl oz)	Sautéed carrots, celery and onion simmered in chicken stock with grilled chicken breast, wild and long grain white rice, seasoned with parsley, thyme, basil & tarragon	Soups	2024-05-19 00:01:09.183	2024-05-19 00:01:09.183
M41058_3056	Spanish Style Cauliflower Rice	Sautéed cauliflower rice with cumin and chipotle salsa	Sides	2024-05-20 22:46:20.041	2024-05-20 22:46:20.041
M33537_3056	Vegan Rice Pudding	Sweet and creamy mixture of rice, quinoa, almond milk and raisins	Desserts	2024-05-19 00:01:13.07	2024-05-19 00:01:13.07
L276724_3056	Quinoa, Kale & Cranberry Salad	Quinoa, Kale & Cranberry Salad	Salads	2024-05-20 22:46:18.098	2024-05-20 22:46:18.098
L335737_3056	Quinoa and Kale Tabbouleh	Quinoa tossed with kale, tomato, cucumber, onion, lemon juice, parsley, garlic and mint	Sides	2024-05-20 22:46:19.965	2024-05-20 22:46:19.965
M19891_3314	Chicken & Sausage Paella	A traditional Spanish dish of yellow rice with chicken, sausage, tomato, peas and olives	Entrées	2024-05-22 00:00:11.71	2024-05-22 00:00:11.71
M14257_3314	Tofu	Diced extra firm tofu	Protein	2024-05-13 22:02:18.966	2024-05-13 22:02:18.966
M36071_3056	Cheeseburger Mac & Cheese Bowl	Creamy mac & cheese topped with ground beef, caramelized onions and relish, drizzled with ketchup and mustard, and finished with a crunchy potato chip topping	Entrées	2024-05-13 22:01:30.755	2024-05-13 22:01:30.755
M10040_3056	Grilled Zucchini Squash	Grilled zucchini squash tossed with steak seasoning	Sides	2024-05-13 22:01:30.82	2024-05-13 22:01:30.82
M33396_3314	Guacamole (3  fl oz)	A combination of avocado, cilantro, onion and tomato	Condiments	2024-05-13 22:01:32.018	2024-05-13 22:01:32.018
M32360_3314	Chopped Kale	Chopped kale	Salads	2024-05-20 00:00:07.635	2024-05-20 00:00:07.635
M20719_3314	Linguine with Lemon-Garlic Shrimp	Shrimp sauteed with onion, scallions, garlic and lemon-garlic vegetable broth tossed with linguine	Entrées	2024-05-13 22:01:32.081	2024-05-13 22:01:32.081
L227710_3314	AF CHILI, BEAN, VEGETABLE		Soups	2024-05-13 21:21:37.719	2024-05-13 21:21:37.719
M20278_3314	Danish Pastry	Warm Danish pastry	Breads	2024-05-13 21:21:40.848	2024-05-13 21:21:40.848
M37959_3056	Cheese Tortellini	Fresh cooked al dente twisted stuffed pasta	Entrées	2024-05-13 22:01:53.187	2024-05-13 22:01:53.187
M38600_3056	Hawaiian Chicken Poke Salad	Grilled chicken, sushi rice, kale, cucumber, edamame, avocado, pineapple, sweet onion, unagi sauce	Entrées	2024-05-13 22:01:33.028	2024-05-13 22:01:33.028
M32554_3314	Turmeric & Quinoa Basmati Rice	Basmati rice mixed with turmeric, cinnamon and red quinoa	Sides	2024-05-21 00:00:11.125	2024-05-21 00:00:11.125
M9650_3314	Jasmine Rice	Thai long grain rice with aromatic, nutty flavor	Sides	2024-05-13 21:21:40.784	2024-05-13 21:21:40.784
M39640_3056	Coffee & Berry Smoothie	Blend of strawberry, blueberry, coffee and almond milk	Cold Beverages	2024-05-13 22:02:17.419	2024-05-13 22:02:17.419
M33769_3314	Steamed Veggies	Simple blend of fresh, steamed broccoli, cauliflower and green beans	Sides	2024-05-13 22:01:50.787	2024-05-13 22:01:50.787
M19781_3314	Carne Asada	Grilled beef marinated in a blend of red wine vinegar, orange juice, oregano, cumin and garlic	Entrées	2024-05-13 22:01:32.397	2024-05-13 22:01:32.397
M10094_3314	Roasted Sweet Potatoes	Oven-roasted seasoned cubed sweet potatoes	Sides	2024-05-13 22:01:28.198	2024-05-13 22:01:28.198
M32949_3314	Roast Pork Butt	Seasoned, slow-roasted pork butt	Entrées	2024-05-13 22:02:25.441	2024-05-13 22:02:25.441
M33322_3314	Sushi Rice	Tender rice seasoned with rice wine vinegar	Sides	2024-05-13 22:02:25.629	2024-05-13 22:02:25.629
M19910_3314	Diced Turkey	Diced skinless turkey breast	Protein	2024-05-13 22:01:32.144	2024-05-13 22:01:32.144
M21332_3056	Sausage Breakfast Pizza	Scrambled eggs, sausage and American cheese	Entrées	2024-05-13 22:02:22.849	2024-05-13 22:02:22.849
M11563_3314	Cilantro Lime Rice	Long grain white rice with lime and cilantro	Sides	2024-05-13 22:01:27.81	2024-05-13 22:01:27.81
M13237_3056	Baby Bok Choy	Steamed fresh baby bok choy	Sides	2024-05-13 22:01:09.242	2024-05-13 22:01:09.242
M20350_3056	Jerk Chicken	Oven-roasted boneless marinated in a spicy garlic-lime jerk seasoning blend	Protein	2024-05-19 00:00:49.799	2024-05-19 00:00:49.799
M34522_3056	Mint Chutney	Fresh mint, cilantro, jalapeno, lime, garlic and gingerroot	Condiments	2024-05-19 00:00:49.922	2024-05-19 00:00:49.922
M40917_3056	Brown Lentil Dal	Brown lentils and tomato seasoned with mustard, cumin, ginger, garlic, onion and curry paste	Sides	2024-05-19 00:00:50.007	2024-05-19 00:00:50.007
M34431_3056	Split Pea Soup (6  fl oz)	Split green peas, onions, celery, carrots and herbs simmered in a rich vegetable broth	Soups	2024-05-19 00:00:49.738	2024-05-19 00:00:49.738
M34997_3314	Sweet Potato Coconut Curry	Spinach, chickpeas and roasted sweet potato sauteed with coconut milk, ginger and spices	Entrées	2024-05-13 22:01:52.696	2024-05-13 22:01:52.696
A3503_3056	Cinnamon Roll	Fresh baked cinnamon roll	Breads	2024-05-13 22:02:15.39	2024-05-13 22:02:15.39
M17162_3056	Strawberry Shortcake Parfait	Layers of yellow cake and strawberry mousse topped with whipped topping and a fresh strawberry	Desserts	2024-05-19 00:01:19.281	2024-05-19 00:01:19.281
M14113_3314	Donut Bites	A variety of fresh baked donuts coated with cocoa, cinnamon sugar or powdered sugar	Breads	2024-05-13 21:21:40.853	2024-05-13 21:21:40.853
L97521_3056	Bloom Strawberry Vanilla Cake		Desserts	2024-05-20 22:46:18.103	2024-05-20 22:46:18.103
M40484_3056	Primavera Pizza	Sauteed fresh squash, mushrooms, red onion and bell peppers, mozzarella and pizza sauce	Pizza	2024-05-13 22:01:25.845	2024-05-13 22:01:25.845
A4290_3056	Boom Boom Popcorn Chicken	Fried popcorn chicken bites tossed in boom boom sauce	Entrées	2024-05-19 00:00:56.228	2024-05-19 00:00:56.228
L363965_3056	Butternut & Chorizo Pizza	Roasted Butternut and Smokey Chorizo with Pesto Sauce and Goat Cheese	Pizza	2024-05-13 21:21:40.297	2024-05-13 21:21:40.297
M596_3056	Vanilla Iced Donut with Sprinkles	Freshly baked donut topped with vanilla icing and rainbow sprinkles	Breads	2024-05-13 21:21:36.778	2024-05-13 21:21:36.778
M36073_3314	Roasted Garlic Rice	White rice with roasted garlic	Sides	2024-05-20 00:00:07.749	2024-05-20 00:00:07.749
M20013_3056	Chocolate Brownie	Chewy chocolate brownie	Desserts	2024-05-13 21:21:40.358	2024-05-13 21:21:40.358
M21804_3056	Roasted Cauliflower	Fresh cauliflower roasted and seasoned with salt and pepper	Sides	2024-05-19 00:00:49.431	2024-05-19 00:00:49.431
M37808_3314	Kachumber Shrimp Rice Bowl	Shrimp, kachumber salad, chutney,& radish on quinoa basmati rice then topped with curry tempura cauliflower	Entrées	2024-05-20 00:00:07.873	2024-05-20 00:00:07.873
M2488_3314	Smoked Beef Brisket	Slow smoked tender beef brisket	Entrées	2024-05-13 22:01:27.972	2024-05-13 22:01:27.972
M7975_3314	Tuna Melt	Creamy tuna salad and American cheese on toasted English muffin	Hot Sandwiches 	2024-05-24 00:00:15.57	2024-05-24 00:00:15.57
M10015_3314	Glazed Carrots	Steamed fresh carrots tossed in an orange-brown sugar glaze	Sides	2024-05-13 22:01:28.158	2024-05-13 22:01:28.158
M19585_3314	Grilled Chicken Caesar Wrap	Grilled chicken breast, Parmesan, tomato, lettuce and creamy Caesar dressing in tortilla wrap	Cold Sandwiches	2024-05-13 22:01:26.221	2024-05-13 22:01:26.221
M36809_3056	Vanilla Milkshake	Vanilla ice cream blended with milk	Desserts	2024-05-19 00:00:56.044	2024-05-19 00:00:56.044
M19952_3314	Garlic Bread	Warm crusty baguette brushed with garlic-oregano oil	Breads	2024-05-13 22:01:31.979	2024-05-13 22:01:31.979
M20953_3314	Vegan Chipotle Chicken Taco	Flour tortilla with meatless chicken strips, lettuce, black bean-corn salsa and chipotle sauce	Entrées	2024-05-13 22:01:32.092	2024-05-13 22:01:32.092
M14858_3314	Roast Beef	Sliced top round roast beef	Protein	2024-05-13 22:01:28.034	2024-05-13 22:01:28.034
M39852_3056	Turkey & American Sandwich	Turkey, American, lettuce and tomato on whole wheat	Cold Sandwiches	2024-05-19 00:00:51.573	2024-05-19 00:00:51.573
M20943_3056	Chicken Fried Rice	Teriyaki-seasoned chicken, onion, celery, carrots, scallion, peas and egg with white rice	Entrées	2024-05-13 22:01:53.195	2024-05-13 22:01:53.195
M41514_3056	Carne Frita con Tostones	Fried pork plate served with fried smashed green plantains and served with an avocado salad	Entrées	2024-05-19 00:00:56.289	2024-05-19 00:00:56.289
M20885_3056	Onion, Jalapeno & Sausage Pizza	Caramelized onions, jalapenos, sausage, cheddar and pizza sauce on a golden brown crust	Pizza	2024-05-13 22:01:49.43	2024-05-13 22:01:49.43
M40906_3314	Chicken & Tomato Balti	Tikka masala marinated chicken pieces simmered a curry spiced broth with fresh tomato	Entrées	2024-05-23 00:00:16.074	2024-05-23 00:00:16.074
A3044_3314	Chicken  Noodle Soup (6  fl oz)	Sautéed carrots, celery, onion, white meat chicken, wide egg noodles, chicken stock, thyme, bay leaf, black and white peppers	Soups	2024-05-22 00:00:09.957	2024-05-22 00:00:09.957
M20888_3314	Onion & Pepper Pizza	Onions, green peppers, mozzarella and pizza sauce	Pizza	2024-05-13 22:01:32.107	2024-05-13 22:01:32.107
M6479_3314	Jalapeno Coleslaw	Creamy coleslaw with a kick of fire roasted jalapenos, cilantro and cumin	Salads	2024-05-13 22:01:27.78	2024-05-13 22:01:27.78
M40808_3314	Moroccan Chickpea Soup (6  fl oz)	A hearty chickpea and vegetable soup flavored with toasted spices	Soups	2024-05-13 21:21:37.724	2024-05-13 21:21:37.724
M21336_3056	Strawberry-Peach Sopaipillas	Warm cinnamon-sugar dough puffs with strawberry-peach topping	Desserts	2024-05-13 22:01:33.124	2024-05-13 22:01:33.124
M32216_3314	Salsa Verde (1  fl oz)	Zesty blend of tomatillos, onion, cilantro, jalapenos and lime juice	Condiments	2024-05-13 22:01:32.376	2024-05-13 22:01:32.376
M19060_3056	Southwest Egg & Ham Pizza	Scrambled eggs, ham, cheddar and salsa on a garlic herb crust	Entrées	2024-05-13 22:02:17.135	2024-05-13 22:02:17.135
M36792_3314	Buffalo Chicken Wrap	Grilled chicken, Buffalo sauce and ranch dressing with shredded cheddar, lettuce, tomato and red onion in a flour tortilla	Cold Sandwiches	2024-05-23 00:00:14.951	2024-05-23 00:00:14.951
M41526_3314	Chocolate Cake	Chocolate cake made with oat milk,  made-with-out gluten flour and cocoa	Desserts	2024-05-13 22:02:18.797	2024-05-13 22:02:18.797
M32313_3314	Asian Seared Chicken	Seared Asian-marinated chicken	Entrées	2024-05-13 22:02:18.831	2024-05-13 22:02:18.831
A714_3056	Southern Chicken & Dumplings	Pulled chicken & root vegetables in a steamy broth with biscuit style dumplings	Entrées	2024-05-13 22:01:53.508	2024-05-13 22:01:53.508
M35479_3314	Gardein™ Chick'n Lo Mein Bowl	Lo mein, meatless chick'n strips and mixed veggies tossed in teriyaki sauce	Entrées	2024-05-13 22:02:18.858	2024-05-13 22:02:18.858
M38042_3314	Pork Burrito Bowl	Shredded Pork, lettuce, beans and vegan cheddar cheese over cilantro rice then topped with salsa verde & jalapenos	Entrées	2024-05-13 22:02:18.893	2024-05-13 22:02:18.893
A5800_3314	Lemongrass Chicken Banh Mi	Lemongrass & red curry marinated chicken, pickled daikon & carrots, cilantro and lime-coriander mayo on a light and crispy roll	Sandwiches	2024-05-13 22:01:26.411	2024-05-13 22:01:26.411
M4906_3056	Mucho Nachos	Crispy tortilla chips smothered with cheese sauce, seasoned turkey, Cheddar, salsa and sour cream	Entrées	2024-05-13 22:01:09.181	2024-05-13 22:01:09.181
M38834_3314	Mac & Cheese	White cheddar macaroni & cheese	Entrées	2024-05-13 22:01:36.381	2024-05-13 22:01:36.381
M40924_3314	Chickpea Panchmael (1  serving)	Chickpeas, onion, pepper, zucchini and mushroom in spicy ginger-curry tomato sauce served over rice	Entrées	2024-05-13 22:01:26.284	2024-05-13 22:01:26.284
M40455_3314	Chicken Parmesan Pizza	Grilled seasoned chicken, mozzarella, Parmesan, fresh parsley and pizza sauce	Pizza	2024-05-13 22:01:36.402	2024-05-13 22:01:36.402
M34527_3314	Tartar Sauce	Creamy mayonnaise with sweet pickle relish, onion, parsley, lemon, Worcestershire and hot sauce	Sauces	2024-05-13 22:02:19.08	2024-05-13 22:02:19.08
M32711_3056	Cherry-Topped Cinnamon Roll	Fresh baked cinnamon roll with cherry topping and icing drizzle	Breads	2024-05-13 22:01:18.574	2024-05-13 22:01:18.574
M9849_3314	Sweet Potato Fries	Crispy sweet potato fries	Sides	2024-05-13 22:01:52.829	2024-05-13 22:01:52.829
M19739_3056	Seasoned Roast Beef	Oven-roasted eye round of beef coated with a peppery seasoning	Entrées	2024-05-13 22:01:19.371	2024-05-13 22:01:19.371
M21957_3056	Alfredo Sauce	Rich and creamy cheese sauce	Sauces	2024-05-19 00:01:19.457	2024-05-19 00:01:19.457
M34480_3314	Potato Leek Soup (6  fl oz)	Velvety puree of potatoes, leeks, onions, celery and herbs simmered in vegetable broth	Soups	2024-05-13 22:01:25.238	2024-05-13 22:01:25.238
M34458_3056	Hearty Beef & Vegetable Soup (6  fl oz)	Beef, potatoes, cabbage and tomatoes simmered in rich beef broth spiced with ancho pepper and cumin	Soups	2024-05-13 22:01:53.262	2024-05-13 22:01:53.262
M14278_3314	Diced Chicken	Seasoned diced chicken	Protein	2024-05-13 22:01:25.114	2024-05-13 22:01:25.114
M40068_3056	Chipotle Chicken Ciabatta	Chicken, red peppers, lettuce, chipotle mayonnaise & monterey jack cheese on ciabatta	Cold Sandwiches	2024-05-13 22:01:33.262	2024-05-13 22:01:33.262
M41055_3314	Pork Burrito Bowl	Shredded Pork, lettuce, beans and vegan cheddar cheese over cilantro rice then topped with salsa verde & jalapenos	Entrées	2024-05-13 22:02:18.899	2024-05-13 22:02:18.899
M41511_3056	Italian Beef Sandwich with Pickled Pepper Relish Plate	Shredded Italian beef on a hoagie roll topped with pickled pepper relish, mozzarella, provolone and parmesan and served with a side of au jus & tater tots & tater tots	Hot Sandwiches	2024-05-19 00:01:19.52	2024-05-19 00:01:19.52
M39656_3056	Veggie Antioxidant Salad	Kale, roasted beets, cauliflower, shredded Brussels sprouts, blueberries, quinoa, feta and sunflower seeds tossed with citrus balsamic vinaigrette	Salads	2024-05-19 00:00:49.728	2024-05-19 00:00:49.728
M17086_3314	Panko-Crusted Shrimp	Crispy deep-fried panko and Parmesan coated shrimp	Entrées	2024-05-13 22:02:18.892	2024-05-13 22:02:18.892
M14384_3056	Oven-Roasted Turkey	Roasted black pepper rubbed turkey breast	Entrées	2024-05-19 00:01:20.689	2024-05-19 00:01:20.689
M41369_3056	Creole Gumbo Bowl	Gumbo made with chicken, shrimp & andouille sausage on top of rice and topped with scallions	Entrées	2024-05-19 00:01:20.938	2024-05-19 00:01:20.938
M14226_3056	Cheddar Cauliflower Soup (8  fl oz)	Chopped cauliflower and Cheddar in a creamy thick broth spiced with hot pepper sauce	Soups	2024-05-13 21:21:39.816	2024-05-13 21:21:39.816
M41141_3056	Creole Stew	Creole stew with Beyond(R) sausage	Entrées	2024-05-13 21:21:40.005	2024-05-13 21:21:40.005
M35013_3056	Pimento Mac & Cheese	Baked macaroni with cheddar, American, Tabasco, roasted red peppers and crushed crackers	Sides	2024-05-19 00:01:21.005	2024-05-19 00:01:21.005
M35575_3056	Tofu Chilaquiles	Tofu, toasted pumpkin seeds, black bean corn salsa, red enchilada sauce and tortilla chips	Entrées	2024-05-13 22:02:17.196	2024-05-13 22:02:17.196
M40883_3314	Chile-Roasted Corn	Roasted corn, onions and green chiles seasoned with cumin	Sides	2024-05-13 22:01:28.115	2024-05-13 22:01:28.115
M9751_3314	Roasted Dijon Red Potatoes	Oven-roasted quartered red potatoes coated with Dijon mustard, garlic, parsley and butter	Sides	2024-05-13 22:01:28.178	2024-05-13 22:01:28.178
A1219_3314	Cheese Pizza	Mozzarella cheese & oregano sauce on a garlic herb crust	Pizza	2024-05-13 22:01:24.306	2024-05-13 22:01:24.306
L341952_3314	Blueberry Mango Smoothie	Blended blueberries mangos and apple juice	Cold Beverages	2024-05-13 21:21:40.888	2024-05-13 21:21:40.888
M20595_3314	Confetti Rice	Seasoned rice with diced onion and bell peppers	Sides	2024-05-20 00:00:08.021	2024-05-20 00:00:08.021
M20082_3056	Honey Granola	Crunchy cinnamon-spiced, honey-coated oats	Grains 	2024-05-13 21:21:36.832	2024-05-13 21:21:36.832
M35805_3056	Chicken Souvlaki	Grilled chicken skewer marinated in garlic, lemon, red wine vinegar and oregano	Entrées	2024-05-19 00:01:21.749	2024-05-19 00:01:21.749
A347_3314	Salsa Verde	Creamy salsa verde with avocado	Condiments	2024-05-13 22:01:35.057	2024-05-13 22:01:35.057
M35425_3314	Italian Roast Beef Sandwich	Roast beef and pickled cauliflower, celery, olives & red pepper on a long roll with an Au Jus spread	Hot Sandwiches 	2024-05-13 22:02:19.214	2024-05-13 22:02:19.214
M37127_3056	Battered Cod	Battered Cod	Entrées	2024-05-19 00:00:55.867	2024-05-19 00:00:55.867
M38230_3056	Strawberry Chia Thimble Cake	Thimble cake topped with chia yogurt cream & sweet strawberries	Desserts	2024-05-20 22:46:19.741	2024-05-20 22:46:19.741
M34504_3056	Summer Squash Tomato Saute	Seasoned sauté of zucchini, yellow squash and juicy grape tomatoes	Sides	2024-05-19 00:01:21.861	2024-05-19 00:01:21.861
M10182_3056	Seasoned Carrots	Steamed carrot slices tossed with seasoning	Sides	2024-05-13 22:01:19.433	2024-05-13 22:01:19.433
M35805_3314	Chicken Souvlaki	Grilled chicken skewer marinated in garlic, lemon, red wine vinegar and oregano	Entrées	2024-05-20 00:00:07.831	2024-05-20 00:00:07.831
M2027_3056	Chocolate Chip Cookie	Freshly baked chewy cookie with semisweet chocolate chips	Desserts	2024-05-13 22:01:53.309	2024-05-13 22:01:53.309
M34755_3056	Tzatziki Sauce	Tzatziki sauce	Condiments	2024-05-13 22:01:53.448	2024-05-13 22:01:53.448
M40758_3314	Balsamic Glazed Roasted Carrots	Roasted carrots simmered in a balsamic onion reduction	Sides	2024-05-21 00:00:09.491	2024-05-21 00:00:09.491
M40999_3314	Barahat Spiced Beef and Chickpeas	Barahat Spiced Beef and Chickpeas	Entrées	2024-05-13 22:01:32.068	2024-05-13 22:01:32.068
M40908_3056	Spanish Rice	Long grain white rice with tomatoes, onions, green peppers and garlic	Sides	2024-05-19 00:01:13.009	2024-05-19 00:01:13.009
M41518_3314	Chocolate Brownie	Chocolate Brownie	Desserts	2024-05-13 22:01:27.929	2024-05-13 22:01:27.929
M3854_3314	Penne	Fresh cooked al dente tube pasta	Entrées	2024-05-13 22:01:35.138	2024-05-13 22:01:35.138
M21975_3314	Veggie Lo Mein	Lo mein noodles stir-fried with cabbage and celery in a teriyaki-soy sauce	Sides	2024-05-21 00:00:11.16	2024-05-21 00:00:11.16
M508_3314	Grilled Naan	Freshly grilled Indian flatbread seasoned with toasted garam masala	Breads	2024-05-13 22:02:18.767	2024-05-13 22:02:18.767
M16592_3056	Korean BBQ Tofu	Stir-fried tofu with fresh broccoli, cabbage, onion, carrot and celery in chili garlic sauce	Entrées	2024-05-13 22:01:09.191	2024-05-13 22:01:09.191
M20954_3314	Vegan Meat Sauce	Hearty tomato sauce with peppers, onion, garlic and Morning Star Farms® sausage crumble	Sauces	2024-05-13 22:01:35.279	2024-05-13 22:01:35.279
M20555_3314	Belgian Waffle	Golden brown  waffle	Entrées	2024-05-13 22:02:14.459	2024-05-13 22:02:14.459
M32623_3314	Chinese Sesame Noodle with Chicken	Long noodles, grilled chicken thigh, sesame peanut dressing and vegetables	Entrées	2024-05-13 22:01:27.68	2024-05-13 22:01:27.68
M20104_3314	Deli Ham	Diced deli ham	Protein	2024-05-13 22:01:32.131	2024-05-13 22:01:32.131
M33409_3314	Meatless Chick'n Stirfry	Gardein® chick'n strips sauteed with ginger, garlic and soy sauce	Entrées	2024-05-13 22:01:36.383	2024-05-13 22:01:36.383
M33409_3056	Meatless Chick'n Stirfry	Gardein® chick'n strips sauteed with ginger, garlic and soy sauce	Entrées	2024-05-13 21:21:40.578	2024-05-13 21:21:40.578
M15521_3314	Maple Mashed Sweet Potatoes	Fresh mashed sweet potatoes with maple syrup, vanilla and nutmeg	Sides	2024-05-13 22:02:19.142	2024-05-13 22:02:19.142
M34515_3314	Vegan Home-Style Pancakes	Warm vegan pancakes made from scratch with soy milk and vanilla	Entrées	2024-05-13 22:02:16.127	2024-05-13 22:02:16.127
M34474_3314	Roasted Corn Chowder (6  fl oz)	Roasted corn, diced potatoes and onions in a creamy rich soup spiced with herbs and hot pepper sauce	Soups	2024-05-13 22:01:52.848	2024-05-13 22:01:52.848
M37045_3314	Blueberries 'N' Oats (6  fl oz)	Old fashioned oats combined with nonfat Greek yogurt, blueberries and a drizzle of honey	Cereals	2024-05-13 22:02:23.986	2024-05-13 22:02:23.986
M5630_3056	Classic Cheese Pizza	Mozzarella cheese and pizza sauce on a golden brown crust	Pizza	2024-05-13 21:21:40.297	2024-05-13 21:21:40.297
M33279_3056	Cherry-Blueberry Crisp	Almond and ginger flavored cherry-blueberry compote topped with crunchy spiced oats with almonds and whipped topping	Desserts	2024-05-19 00:00:49.771	2024-05-19 00:00:49.771
A2865_3056	Mandarin Orange Cake	White cake infused with orange gelatin, garnished with whipped topping and mandarin oranges	Desserts	2024-05-19 00:01:19.466	2024-05-19 00:01:19.466
M12296_3314	Turkey Bacon	Crispy turkey bacon strip	Sides	2024-05-13 22:01:35.339	2024-05-13 22:01:35.339
M10274_3314	Spanish Rice	Brown rice with tomatoes, onions, garlic and green peppers seasoned with cumin, oregano and sage	Sides	2024-05-13 22:02:24.307	2024-05-13 22:02:24.307
M17308_3056	Chicken Pho	Vietnamese Noodle soup loaded with chicken, bean sprouts, green onions, jalapenos, cilantro and basil	Entrées	2024-05-13 22:01:19.381	2024-05-13 22:01:19.381
A197_3314	El Choripán Platter	Grilled chorizo with guasacaca, pickled cabbage & cilantro crema on a roll with chili-lime chips	Sandwiches	2024-05-13 22:01:32.228	2024-05-13 22:01:32.228
M2323_3056	Lemon Jell-O®	Lemon-flavored gelatin	Desserts	2024-05-19 00:01:20.779	2024-05-19 00:01:20.779
M41549_3314	Mashed Potatoes	Mashed potatoes	Sides	2024-05-21 00:00:09.527	2024-05-21 00:00:09.527
M1884_3056	Red Velvet Cupcake	Freshly baked red velvet cake topped with creamy vanilla icing	Desserts	2024-05-13 22:01:09.243	2024-05-13 22:01:09.243
M36069_3056	Buffalo Mac & Cheese Bowl	Creamy mac & cheese topped with chicken, drizzled with Buffalo sauce and ranch dressing, and finished with a crunchy potato chip topping	Entrées	2024-05-13 21:21:36.604	2024-05-13 21:21:36.604
M40151_3056	Diced BBQ Tofu	Diced BBQ Tofu	Protein	2024-05-19 00:00:56.066	2024-05-19 00:00:56.066
M34579_3314	Hearty Beef Stew	Slow-simmered beef, potatoes, carrots, onions and celery in a rich beefy broth	Entrées	2024-05-13 21:21:37.543	2024-05-13 21:21:37.543
M4595_3314	Spicy Tofu Vegetable Stir-Fry	Tofu sauteed in sesame oil blend with red and green peppers, red onion and chili garlic sauce	Entrées	2024-05-13 21:21:40.647	2024-05-13 21:21:40.647
A5762_3314	Grilled Chili Rubbed Shrimp Tacos	Shrimp, avocado slaw, fresh jalapeno, cilantro, crispy bacon & toasted pepitas	Sandwiches	2024-05-13 22:01:27.806	2024-05-13 22:01:27.806
M40854_3314	Roasted Garlic Potatoes	Oven-roasted red potatoes tossed with roasted garlic	Sides	2024-05-19 00:00:11.785	2024-05-19 00:00:11.785
M21047_3056	Vegan Sausage Mac Casserole	Macaroni casserole with tomatoes, savory ground sausage crumble and veggies	Entrées	2024-05-13 22:01:33.042	2024-05-13 22:01:33.042
M21511_3314	Tortellini Rose	Cheese tortellini sauteed with tomato cream sauce and garlic topped with Parmesan and basil	Entrées	2024-05-13 22:01:26.285	2024-05-13 22:01:26.285
A5745_3314	MACARONI AND CHEESE TRUE BALANCE		Sides	2024-05-13 22:01:36.527	2024-05-13 22:01:36.527
M41480_3056	Beef Birria Sope	Seasoned braised beef, refried beans, salsa verde, cabbage, radish and lime crema layered on a fried sope	Entrées	2024-05-19 00:01:22.246	2024-05-19 00:01:22.246
M35425_3056	Italian Roast Beef Sandwich	Roast beef and pickled cauliflower, celery, olives & red pepper on a long roll with an Au Jus spread	Hot Sandwiches	2024-05-13 22:01:53.223	2024-05-13 22:01:53.223
M38678_3056	Sausage, Egg & Cheese Frittata	Sausage, egg, cheddar cheese	Entrées	2024-05-19 00:01:21.023	2024-05-19 00:01:21.023
M12961_3056	Chocolate Donut Bites	Freshly baked donut bites coated with cocoa and powdered sugar	Breads	2024-05-19 00:01:21.07	2024-05-19 00:01:21.07
M39457_3056	Al Pastor Pork Taco	Al pastor pork taco with cilantro onion topping, queso, pineapple, salsa verde	Entrées	2024-05-13 22:01:19.071	2024-05-13 22:01:19.071
M34710_3056	Melted Butter	Warm melted butter	Sauces	2024-05-13 22:02:17.359	2024-05-13 22:02:17.359
A3204_3056	Spicy Jackfruit	Shredded jackfruit mixed with ancho pepper, garlic & other spices	Salads	2024-05-19 00:00:56.252	2024-05-19 00:00:56.252
M34201_3056	Banana Bread	Freshly baked cinnamon spiced banana bread	Breads	2024-05-13 22:02:17.232	2024-05-13 22:02:17.232
M33876_3314	Vegan Cavatappi Alfredo	Cavatappi pasta with creamy Daiya® mozzarella flavored sauce, topped with an almond-based Parmesan	Entrées	2024-05-20 00:00:07.876	2024-05-20 00:00:07.876
M36727_3314	Fried Plantains	Fried plantains	Sides	2024-05-13 22:01:32.539	2024-05-13 22:01:32.539
M41138_3314	Alfredo Pesto Casserole	Red lentil rotini with alfredo pesto sauce & vegan mozzarella cheese	Entrées	2024-05-13 22:01:47.829	2024-05-13 22:01:47.829
M20983_3056	Vegan Beef Burrito	Tortilla stuffed with Spanish rice, vegan beef, black beans and fire roasted salsa	Entrées	2024-05-19 00:01:12.96	2024-05-19 00:01:12.96
M41036_3314	Grilled Chicken Breast	Sliced grilled chicken	Entrées	2024-05-13 22:01:35.138	2024-05-13 22:01:35.138
M40846_3314	Confetti Rice	Italian herb rice with sautéed onion and red and green peppers	Sides	2024-05-13 22:01:28.134	2024-05-13 22:01:28.134
M9746_3314	Roasted Potatoes	Oven-roasted seasoned potato quarters	Sides	2024-05-13 22:01:28.197	2024-05-13 22:01:28.197
M398_3314	Blueberry Muffin	Freshly baked muffin filled with juicy blueberries	Breads	2024-05-13 21:21:40.833	2024-05-13 21:21:40.833
M20110_3314	Lo Mein Noodles	Fresh cooked lo mein noodles	Grains	2024-05-13 22:02:18.918	2024-05-13 22:02:18.918
M4906_3314	Mucho Nachos	Crispy tortilla chips smothered with cheese sauce, seasoned turkey, Cheddar, salsa and sour cream	Entrées	2024-05-13 22:01:25.089	2024-05-13 22:01:25.089
M34865_3314	Edamame	Seasoned, steamed edamame pods	Sides	2024-05-13 22:02:19.105	2024-05-13 22:02:19.105
A1275_3314	Fried Cabbage	Green cabbage cooked with bacon, onion and garlic	Sides	2024-05-13 22:02:19.106	2024-05-13 22:02:19.106
M13263_3314	BBQ Chicken & Cheddar Sandwich	Crispy breaded chicken, Cheddar and lettuce on a toasted roll with BBQ sauce	Hot Sandwiches 	2024-05-13 22:02:19.169	2024-05-13 22:02:19.169
M33729_3056	Chilaquiles Rojo with Eggs	Mexican-style dish of fried tortilla chips mixed with red enchilada sauce, topped with fried egg, cheddar cheese and cilantro-lime crema	Entrées	2024-05-13 22:02:17.17	2024-05-13 22:02:17.17
M21890_3314	Charro Beans	Pinto beans simmered with vegetable broth, salsa and cumin	Sides	2024-05-13 22:01:50.78	2024-05-13 22:01:50.78
A1076_3314	Buttermilk Fried Chicken	Buttermilk crispy chicken	Entrées	2024-05-13 22:02:25.409	2024-05-13 22:02:25.409
M15554_3314	Baked Russet Potato	Oven-roasted russet potato	Sides	2024-05-13 22:01:25.215	2024-05-13 22:01:25.215
M14090_3056	Strawberry Oatmeal Bar	Cinnamon-spiced oatmeal dessert bar with strawberry preserves and crumb topping	Desserts	2024-05-13 22:01:09.242	2024-05-13 22:01:09.242
M35726_3056	Penne	Made-without-gluten penne tossed in margarine	Sides	2024-05-13 22:02:24.496	2024-05-13 22:02:24.496
M36071_3314	Cheeseburger Mac & Cheese Bowl	Creamy mac & cheese topped with ground beef, caramelized onions and relish, drizzled with ketchup and mustard, and finished with a crunchy potato chip topping	Entrées	2024-05-13 22:01:36.35	2024-05-13 22:01:36.35
M9958_3314	Collard Greens with Bacon	Fresh collard greens sauteed with bacon and onions seasoned with hot sauce	Sides	2024-05-13 22:01:26.412	2024-05-13 22:01:26.412
M33459_3314	Carolina Pulled Pork	Shredded pork marinated in sweet & tangy BBQ sauce	Entrées	2024-05-13 22:01:36.342	2024-05-13 22:01:36.342
M32657_3056	Spaghetti with Meat Sauce	Hearty meat sauce served over spaghetti	Entrées	2024-05-13 22:01:49.162	2024-05-13 22:01:49.162
M19921_3056	Sauteed Mushroom Ravioli	Sauteed mushroom ravioli with fresh basil and Parmesan	Entrées	2024-05-13 22:02:23.691	2024-05-13 22:02:23.691
M21568_3056	Szechuan Beef	Stir-fried beef, broccoli, onion, cabbage and carrots tossed in a spicy Szechuan sauce	Entrées	2024-05-19 00:00:50.022	2024-05-19 00:00:50.022
M19952_3056	Garlic Bread	Warm crusty baguette brushed with garlic-oregano oil	Breads	2024-05-13 22:01:49.224	2024-05-13 22:01:49.224
M9513_3314	Pork Sausage Links	Golden brown savory pork sausage link	Sides	2024-05-13 22:02:24.06	2024-05-13 22:02:24.06
M40710_3314	Corn Tortilla (1  each)	Griddled corn tortilla	Grains	2024-05-13 22:01:27.982	2024-05-13 22:01:27.982
M34504_3314	Summer Squash Tomato Saute	Seasoned sauté of zucchini, yellow squash and juicy grape tomatoes	Sides	2024-05-20 00:00:08.065	2024-05-20 00:00:08.065
M13541_3314	Sliced Tomatoes	Sliced fresh tomatoes	Salads	2024-05-13 22:01:26.378	2024-05-13 22:01:26.378
M14304_3056	Cheddar Cheese	Sliced Cheddar cheese	Protein	2024-05-13 22:00:59.847	2024-05-13 22:00:59.847
M40042_3314	French Toast Sticks	Baked bread in a sweet batter coating	Entrées	2024-05-13 21:21:40.909	2024-05-13 21:21:40.909
M40920_3314	Red Beans & Rice	Tender rice and red beans simmered with green bell peppers, onion and garlic	Sides	2024-05-13 22:01:32.563	2024-05-13 22:01:32.563
M16226_3056	Spicy Turkey Pepper Jack Sandwich	Turkey breast, spicy pepper jack, lettuce, pico de gallo and chipotle mustard on a pretzel roll	Cold Sandwiches	2024-05-20 22:46:19.672	2024-05-20 22:46:19.672
M4214_3314	Szechuan Pork	Oven-roasted pork loin that has marinated in a spicy Szechuan-soy sauce blend	Entrées	2024-05-13 21:21:40.648	2024-05-13 21:21:40.648
M32205_3314	Ginger Garlic Broccoli	Broccoli florets tossed in olive oil, ginger, garlic, salt and pepper and oven roasted	Sides	2024-05-13 21:21:40.772	2024-05-13 21:21:40.772
M38387_3056	Beef Tri-Tip Chimichurri	Grilled Chimichurri marinated beef tri-tip	Entrées	2024-05-13 22:01:53.169	2024-05-13 22:01:53.169
M11411_3314	Grilled Montreal Salmon	Salmon fillet seasoned with Montreal steak seasoning	Entrées	2024-05-22 00:00:11.711	2024-05-22 00:00:11.711
M10076_3314	Vegetable Medley	Seasoned fresh broccoli, cauliflower and carrots sauteed with red onions	Sides	2024-05-13 22:01:25.229	2024-05-13 22:01:25.229
M35731_3314	Beefy Tomato Penne Casserole	Penne with simmered tomatoes, ground beef, carrots, celery, onion, peas and Parmesan cheese	Entrées	2024-05-13 22:01:25.354	2024-05-13 22:01:25.354
M36628_3056	Mediterranean Saute with Orzo	Mediterranean-style sauteed vegetables over orzo with cucumber-caper relish	Entrées	2024-05-19 00:00:51.808	2024-05-19 00:00:51.808
M40851_3056	Roasted Red Potatoes	Oven-roasted and fork tender baby red potatoes	Sides	2024-05-19 00:00:55.96	2024-05-19 00:00:55.96
M33263_3056	Bananas Foster Cupcake	Fresh-baked sweet banana cupcakes topped with cinnamon icing	Desserts	2024-05-19 00:00:56.022	2024-05-19 00:00:56.022
L352998_3056	Vegan Beef Stir-Fry Rice Bowl	Vegan Beef Stir-Fry Rice Bowl	Entrées	2024-05-13 21:21:40.523	2024-05-13 21:21:40.523
M21084_3056	Pancake Syrup	Pancake Syrup	Condiments	2024-05-13 22:02:17.343	2024-05-13 22:02:17.343
M21070_3056	Cranberry Sauce	Jellied cranberry sauce	Condiments	2024-05-19 00:01:20.933	2024-05-19 00:01:20.933
M40859_3056	Tangy Cucumber Salad	Fresh cucumber and onion slices tossed in a homemade vinaigrette	Salads	2024-05-19 00:01:19.52	2024-05-19 00:01:19.52
M40459_3056	Meatball Pizza	Sliced Italian meatballs, mozzarella and pizza sauce	Pizza	2024-05-13 22:01:33.065	2024-05-13 22:01:33.065
M9560_3314	Seasoned Rice	Long grain white rice seasoned with salt and pepper	Sides	2024-05-13 22:02:19.143	2024-05-13 22:02:19.143
M34201_3314	Banana Bread	Freshly baked cinnamon spiced banana bread	Breads	2024-05-13 22:01:26.067	2024-05-13 22:01:26.067
M41612_3056	Arroz Rojo	Rice simmered with vegetable stock, tomato, peas, carrots and spices	Sides	2024-05-22 00:00:15.462	2024-05-22 00:00:15.462
M4892_3314	Southwest Fajitas	Grilled chicken thighs with peppers, onions, salsa and sour cream in a warm flour tortilla	Entrées	2024-05-13 22:02:24.291	2024-05-13 22:02:24.291
M37958_3056	California Sushi Rice Bowl	Seafood salad, avocado and cucumbers on sushi rice then topped with wonton straws, Japanese spice mix & spicy mayo	Entrées	2024-05-19 00:01:21.732	2024-05-19 00:01:21.732
M9616_3056	Couscous	Tiny granules of semolina pasta	Sides	2024-05-19 00:01:21.794	2024-05-19 00:01:21.794
M36582_3056	Brown Rice & Quinoa	Brown rice & red quinoa blend	Sides	2024-05-19 00:01:12.991	2024-05-19 00:01:12.991
M33279_3314	Cherry-Blueberry Crisp	Almond and ginger flavored cherry-blueberry compote topped with crunchy spiced oats with almonds and whipped topping	Desserts	2024-05-13 22:01:27.921	2024-05-13 22:01:27.921
M19548_3056	Strawberry-Mint Shortcake	Freshly baked buttermilk biscuits layered with minted strawberries and whipped topping	Desserts	2024-05-19 00:01:13.053	2024-05-19 00:01:13.053
M32349_3056	Beef Bibimbap	Korean rice bowl with seared beef strips, sesame spinach, kimchi, cucumber, fried egg and gochujang	Entrées	2024-05-19 00:00:42.1	2024-05-19 00:00:42.1
M39587_3314	Kale Ginger Juice	Fresh kale with ginger root, cucumbers, apples, celery & honey	Cold Beverages	2024-05-13 22:02:14.459	2024-05-13 22:02:14.459
L284444_3314	Overnight Blueberry 'N' Oats	Blueberries, Oats, Rice Flour, Almond Milk	Desserts	2024-05-13 21:21:40.896	2024-05-13 21:21:40.896
M21923_3056	Pumpkin-Curry Vegetable Saute	Butternut squash, cauliflower, mushrooms, peas and chickpeas in curried pumpkin sauce over rice	Entrées	2024-05-13 22:01:30.771	2024-05-13 22:01:30.771
M40879_3056	Calabacitas	Sautéed zucchini, corn, red and green peppers, onion and garlic	Sides	2024-05-13 22:02:23.936	2024-05-13 22:02:23.936
M32354_3314	Korean Noodle Bowl	Seared tofu, roasted shiitakes, kimchi, pickled carrot and daikon, and Korean vegetable broth	Entrées	2024-05-23 00:00:15	2024-05-23 00:00:15
M34419_3314	Brown Rice	Tender cooked brown rice	Sides	2024-05-13 22:01:28.106	2024-05-13 22:01:28.106
M2594_3314	Homestyle Spaghetti & Meatballs	Hot spaghetti topped with Italian beef meatballs and tomato sauce	Entrées	2024-05-13 22:02:25.423	2024-05-13 22:02:25.423
M18832_3314	Garden-Style Baked Tilapia	Oven-baked tilapia with a Parmesan-herb vegetable crumb topping	Entrées	2024-05-13 22:02:18.878	2024-05-13 22:02:18.878
A1227_3314	Hawaiian BBQ  Pizza	BBQ pulled pork, fresh pineapple & pickled red onions with Monterey jack cheese and Sweet Baby Rays ® BBQ sauce	Pizza	2024-05-13 22:02:18.939	2024-05-13 22:02:18.939
M40779_3314	Sweet Apple Coleslaw	Granny Smith apples and shredded red and green cabbage tossed with a caramelized onion vinaigrette	Salads	2024-05-13 22:02:19.062	2024-05-13 22:02:19.062
M9866_3314	Homestyle Mashed Potatoes	Fresh creamy mashed potatoes	Sides	2024-05-13 22:02:25.607	2024-05-13 22:02:25.607
M9294_3314	Marinara Sauce (1  fl oz)	Homemade sauce with tomatoes, onions, garlic, oregano and basil	Sauces	2024-05-13 22:01:35.278	2024-05-13 22:01:35.278
M3501_3314	Zesty Red Beans	Spicy kidney beans simmered with ham, onions, garlic and hot pepper sauce	Sides	2024-05-13 22:02:24.308	2024-05-13 22:02:24.308
M15286_3314	Garden Vegetables	Steamed fresh broccoli, cauliflower, green beans, carrots, green and yellow squash and red peppers	Sides	2024-05-13 22:01:28.156	2024-05-13 22:01:28.156
M41021_3056	Pork Chili Verde	Mexican dish of pork simmered with green chilies and tomatillos	Entrées	2024-05-13 22:02:24.496	2024-05-13 22:02:24.496
M21741_3314	Blackened Chicken	Char-grilled chicken seasoned with a peppery Cajun blend	Entrées	2024-05-13 22:01:26.255	2024-05-13 22:01:26.255
M20170_3314	Italian Wrap	Ham, salami, provolone, lettuce, tomato, onion & creamy Caesar dressing in a tortilla wrap	Cold Sandwiches	2024-05-13 22:02:24.752	2024-05-13 22:02:24.752
A41_3314	Crispy Sesame Tofu Lo Mein Bowl	Crispy sesame tofu with mixed vegetable lo mein coated in sauce and topped with scallions	Entrées	2024-05-13 22:02:24.812	2024-05-13 22:02:24.812
M39531_3314	Fish and Chips	Fish sticks and Old Bay seasoned potato chips	Entrées	2024-05-13 22:02:24.815	2024-05-13 22:02:24.815
M34461_3056	Chipotle Chicken Tortilla Soup (6  fl oz)	Chicken, corn tortillas, tomatoes, onion, garlic, chipotle pepper and cumin in a chicken broth	Soups	2024-05-19 00:00:55.992	2024-05-19 00:00:55.992
M19288_3314	Grilled Chicken Bruschetta	Tender boneless marinated chicken topped with a tomato bruschetta-style topping	Entrées	2024-05-13 22:02:24.833	2024-05-13 22:02:24.833
M34532_3314	Fire-Roasted Salsa	Char-grilled onions, bell peppers and jalapenos pureed with tomatoes, cilantro and garlic	Condiments	2024-05-13 22:01:27.908	2024-05-13 22:01:27.908
M19840_3314	Cavatappi	Fresh cooked al dente spiral tube pasta	Grains	2024-05-13 22:02:24.853	2024-05-13 22:02:24.853
M10503_3314	Lemon Wedges	Fresh lemon wedges	Sides	2024-05-13 22:02:25.004	2024-05-13 22:02:25.004
M32324_3056	Double Chocolate Chip Mini Muffin	Freshly baked chocolate muffin chock full of semisweet chocolate chips	Breads	2024-05-13 22:01:18.549	2024-05-13 22:01:18.549
M40905_3314	Bombay Aloo	Potatoes, onions and tomatoes simmered in a spicy curry, cumin, green chiles and fresh ginger sauce	Sides	2024-05-13 22:01:26.41	2024-05-13 22:01:26.41
A1222_3314	Mushroom Pizza	Sautéed mushrooms, mozzarella cheese, & oregano sauce on a garlic herb crust	Pizza	2024-05-13 22:02:24.875	2024-05-13 22:02:24.875
M15073_3314	Capri Blend Vegetables	Steamed fresh carrots, whole green beans and zucchini and yellow squash	Sides	2024-05-13 22:02:19.089	2024-05-13 22:02:19.089
M40427_3314	BBQ Chicken Pizza	Grilled seasoned chicken and red onions, mozzarella and barbecue sauce	Pizza	2024-05-23 00:00:15.019	2024-05-23 00:00:15.019
M35627_3314	Pork Sausage Patty (1  each)	Pork sausage patty	Protein	2024-05-13 22:01:26.157	2024-05-13 22:01:26.157
M40911_3056	Chicken with Cacciatore Sauce	Oven-roasted chicken breast served with an herbed tomato sauce with bell peppers and onions	Entrées	2024-05-13 22:02:24.495	2024-05-13 22:02:24.495
M18832_3056	Garden-Style Baked Tilapia	Oven-baked tilapia with a Parmesan-herb vegetable crumb topping	Entrées	2024-05-13 22:01:53.182	2024-05-13 22:01:53.182
M41126_3314	Vegetable Soup (6  fl oz)	Green beans, corn, green cabbage, potatoes and tomatoes simmered in savory vegetable broth	Soups	2024-05-13 22:01:27.842	2024-05-13 22:01:27.842
M34582_3314	Beef Stroganoff	Tender beef cubes, mushrooms and onion in a savory sour cream sauce	Entrées	2024-05-13 22:02:18.837	2024-05-13 22:02:18.837
M12901_3056	Cranberry-Spinach Orzo	Toasted orzo tossed with spinach, red onion and cranberries	Sides	2024-05-13 22:01:53.245	2024-05-13 22:01:53.245
M10583_3314	Hash Brown Potato Patty	Crispy fried shredded potato patty	Sides	2024-05-13 21:21:40.972	2024-05-13 21:21:40.972
M2488_3056	Smoked Beef Brisket	Slow smoked tender beef brisket	Entrées	2024-05-19 00:00:55.867	2024-05-19 00:00:55.867
M2594_3056	Homestyle Spaghetti & Meatballs	Hot spaghetti topped with Italian beef meatballs and tomato sauce	Entrées	2024-05-13 22:01:04.694	2024-05-13 22:01:04.694
M41604_3056	Japanese Fried Chicken with Sesame Green Beans	Japanese fried chicken served with rice, Szechuan sesame green beans, topped with scallions and spicy mayo	Entrées	2024-05-13 22:01:49.369	2024-05-13 22:01:49.369
M32678_3056	Chili Cheddar Dog	Hot dog topped with homemade chili and cheddar	Hot Sandwiches	2024-05-19 00:00:55.929	2024-05-19 00:00:55.929
A2008_3056	Sweet Corn Tartar Sauce	Tartar sauce mixed with sweet corn & spices	Condiments	2024-05-19 00:00:56.304	2024-05-19 00:00:56.304
M41617_3056	Horchata	Traditional Latin beverage made of soaked white rice & flavored with cinnamon, maple syrup & sugar	Beverages	2024-05-19 00:00:51.943	2024-05-19 00:00:51.943
M21890_3056	Charro Beans	Pinto beans simmered with vegetable broth, salsa and cumin	Sides	2024-05-20 22:46:19.715	2024-05-20 22:46:19.715
M34754_3056	Beef & Mushroom Pot Roast	Tender beef braised in a savory mushroom and onion sauce	Entrées	2024-05-19 00:01:22.617	2024-05-19 00:01:22.617
M19856_3314	Sauteed Mushrooms	Sauteed quartered fresh mushrooms	Salads	2024-05-13 22:02:19.026	2024-05-13 22:02:19.026
M10060_3056	Crispy Okra	Crispy deep-fried breaded okra	Sides	2024-05-19 00:01:13.009	2024-05-19 00:01:13.009
M33411_3056	Crema (1  fl oz)	A combination of Greek yogurt and sour cream	Condiments	2024-05-13 22:02:17.357	2024-05-13 22:02:17.357
M2677_3314	Roasted Pork Loin	Seasoned oven-roasted pork loin	Entrées	2024-05-13 22:01:27.97	2024-05-13 22:01:27.97
M4277_3056	Spicy Orange Chicken with Broccoli	Stir-fried chicken, broccoli, carrots and water chestnuts in spicy orange sauce over jasmine rice	Entrées	2024-05-19 00:01:13.256	2024-05-19 00:01:13.256
M32256_3056	Hearty Mashed Potatoes	Hearty skin-on seasoned mashed potatoes	Sides	2024-05-13 22:01:19.418	2024-05-13 22:01:19.418
L341668_3314	Pureed Hearty Vegetable Soup	Fresh vegetables and rice in an herbed vegetable broth, pureed	Soups	2024-05-20 22:46:21.435	2024-05-20 22:46:21.435
A1938_3056	Chilaquiles Rojos	Crispy tortilla chips topped with fire roasted salsa, chicken tinga, cilantro-lime crèma, queso & cilantro	Entrées	2024-05-13 22:02:17.383	2024-05-13 22:02:17.383
M2677_3056	Roasted Pork Loin	Seasoned oven-roasted pork loin	Entrées	2024-05-19 00:01:13.748	2024-05-19 00:01:13.748
A3046_3314	Tomato Basil Soup (6  fl oz)	Fresh tomatoes, sautéed garlic & onion, heavy cream, basil	Soups	2024-05-21 00:00:09.55	2024-05-21 00:00:09.55
M34584_3056	Pork Chili Verde	Mexican dish of pork simmered with green chilies and tomatillos	Entrées	2024-05-13 22:02:23.709	2024-05-13 22:02:23.709
M21921_3314	Mediterranean Saute with Orzo	Mediterranean-style sauteed vegetables over orzo with cucumber-caper relish	Entrées	2024-05-22 00:00:11.715	2024-05-22 00:00:11.715
M21578_3314	Sweet & Sour Tofu Stir-Fry	Stir-fried tofu, onion, bell peppers, carrots and pineapple coated with a sweet and sour sauce	Entrées	2024-05-24 00:00:11.452	2024-05-24 00:00:11.452
A3040_3314	Southwest Black Bean Soup (6  fl oz)	Black beans, tomatoes, jalapenos, cilantro, cumin infused broth	Soups	2024-05-13 22:01:28.219	2024-05-13 22:01:28.219
M40484_3314	Primavera Pizza	Sauteed fresh squash, mushrooms, red onion and bell peppers, mozzarella and pizza sauce	Pizza	2024-05-13 22:02:24.298	2024-05-13 22:02:24.298
M22115_3314	Tofu Breakfast Taco	Soft shell taco filled with tofu, scrambled turmeric, onions and salsa	Entrées	2024-05-13 22:02:14.46	2024-05-13 22:02:14.46
M40676_3314	Buttermilk Pancakes	Fluffy, golden brown buttermilk pancakes	Entrées	2024-05-13 22:02:16.114	2024-05-13 22:02:16.114
M33864_3314	Vegan Baked Penne Casserole	Penne and tomato sauce, topped with Daiya®  dairy-free mozzarella shreds and almond-based Parmesan	Entrées	2024-05-13 22:02:18.9	2024-05-13 22:02:18.9
M40496_3314	Chicken & Wild Rice Soup (16  fl oz)	Sautéed carrots, celery, onion, chicken stock, grilled chicken breast, wild and long grain rice, parsley, thyme, basil, tarragon	Soups	2024-05-13 22:01:25.229	2024-05-13 22:01:25.229
M34477_3314	New England Clam Chowder (6  fl oz)	A thick creamy soup of clams, potatoes, bacon, onions, celery and herbs	Soups	2024-05-13 22:02:19.168	2024-05-13 22:02:19.168
M41604_3314	Japanese Fried Chicken with Sesame Green Beans	Japanese fried chicken served with rice, Szechuan sesame green beans, topped with scallions and spicy mayo	Entrées	2024-05-13 22:01:36.356	2024-05-13 22:01:36.356
M33932_3056	Chocolate Harvest Cake	Moist chocolate cake with apple, pear, cranberries and fall spices	Desserts	2024-05-16 00:00:10.548	2024-05-16 00:00:10.548
M21341_3056	BBQ Chicken Stromboli	BBQ glazed chicken, grilled onions, Cheddar and mozzarella wrapped in a house-made crust	Pizza	2024-05-19 00:00:55.912	2024-05-19 00:00:55.912
A2863_3056	Chocolate Cherry Cake	Devil's food cake infused with cherry gelatin, garnished with whipped topping and cherry topping	Desserts	2024-05-13 22:02:26.714	2024-05-13 22:02:26.714
M32231_3314	Fried Chicken	Crispy golden-fried chicken	Entrées	2024-05-13 22:02:34.859	2024-05-13 22:02:34.859
M32949_3056	Roast Pork Butt	Seasoned, slow-roasted pork butt	Entrées	2024-05-13 22:02:35.111	2024-05-13 22:02:35.111
M33103_3056	Sweet Soy Green Beans	Fresh green beans coated with a combination of low sodium soy sauce, brown sugar and rice wine vinegar	Sides	2024-05-13 22:02:35.175	2024-05-13 22:02:35.175
M34755_3314	Tzatziki Sauce	Tzatziki sauce	Condiments	2024-05-13 22:02:35.694	2024-05-13 22:02:35.694
M2361_3056	Spiced Peach Cobbler	Warm cinnamon and nutmeg-spiced peaches with a crunchy oatmeal biscuit crust	Desserts	2024-05-19 00:00:56.036	2024-05-19 00:00:56.036
M32306_3056	Gochujang Sauce	Korean hot pepper sauce made with gochujang paste, sesame   seeds and garlic	Sauces	2024-05-13 22:02:35.415	2024-05-13 22:02:35.415
M40400_3056	Thai Red Curry Bowl	Thai red curry with sweet potatoes and green beans served with jasmine rice topped with cilantro	Entrées	2024-05-19 00:00:56.221	2024-05-19 00:00:56.221
M14456_3056	Rocky Road Brownie	Fudgy dessert bar with semisweet chocolate chips, marshmallows, pecans and chocolate icing	Desserts	2024-05-19 00:01:13.025	2024-05-19 00:01:13.025
M21330_3056	Southwest Ham Breakfast Pizza	Scrambled eggs, ham, salsa and cheddar on a golden brown crust	Entrées	2024-05-13 22:01:18.661	2024-05-13 22:01:18.661
M14891_3314	Ranch Dressing	Homestyle creamy ranch salad dressing	Condiments	2024-05-13 21:21:37.499	2024-05-13 21:21:37.499
M20110_3056	Lo Mein Noodles	Fresh cooked lo mein noodles	Grains 	2024-05-19 00:01:13.086	2024-05-19 00:01:13.086
M9906_3056	Corn on the Cob	Steamed corn on the cob	Sides	2024-05-13 22:02:40.32	2024-05-13 22:02:40.32
M21179_3314	Penne Pasta GF	Fresh cooked gluten free pasta	Grains	2024-05-13 22:01:34.129	2024-05-13 22:01:34.129
M20954_3056	Vegan Meat Sauce	Hearty tomato sauce with peppers, onion, garlic and Morning Star Farms® sausage crumble	Sauces	2024-05-13 22:01:04.912	2024-05-13 22:01:04.912
M40904_3056	Khadai Mushrooms	Sautéed curried mushrooms and tomatoes with garlic, gingerroot, cumin, peppers and onions	Sides	2024-05-19 00:01:13.8	2024-05-19 00:01:13.8
M14363_3314	Chopped Hard-Cooked Egg	Chopped hard-cooked egg	Protein	2024-05-13 22:02:18.955	2024-05-13 22:02:18.955
M34112_3314	Cucumber Pico de Gallo (1  fl oz)	Diced cucumber, plum tomatoes and onion with lemon juice and parsley	Condiments	2024-05-21 00:00:10.793	2024-05-21 00:00:10.793
M9729_3056	Hash Brown Potatoes	Pan-fried seasoned diced potatoes	Sides	2024-05-13 22:02:14.251	2024-05-13 22:02:14.251
M14599_3314	Cantaloupe	Cubed fresh cantaloupe	Salads	2024-05-13 21:21:40.95	2024-05-13 21:21:40.95
M14342_3314	Diced Pineapple	Fresh diced pineapple	Salads	2024-05-20 00:00:07.64	2024-05-20 00:00:07.64
M14343_3056	Sliced Red Onions	Thinly sliced red onions	Salads	2024-05-13 21:21:39.918	2024-05-13 21:21:39.918
M33196_3056	Lettuce	Fresh lettuce leaves	Salads	2024-05-13 21:21:39.954	2024-05-13 21:21:39.954
M10690_3314	Fresh Asparagus	Steamed fresh asparagus spears	Sides	2024-05-22 00:00:11.957	2024-05-22 00:00:11.957
M20988_3056	Buffalo Chicken Pizza	Seasoned chicken breast, Buffalo sauce, mozzarella and blue cheese	Pizza	2024-05-19 00:00:43.868	2024-05-19 00:00:43.868
M34520_3314	Old Fashioned Oatmeal (6  fl oz)	Homestyle oatmeal cereal	Cereals	2024-05-13 21:21:40.876	2024-05-13 21:21:40.876
M33534_3056	Crispy Chicken (4  piece)	Boneless chicken breast coated with seasoned bread crumbs	Protein	2024-05-13 21:21:39.825	2024-05-13 21:21:39.825
M4880_3056	Three Cheese & Ham Strata	Savory bread casserole with Swiss, cheddar, Parmesan, ham and bell peppers	Entrées	2024-05-13 21:21:36.654	2024-05-13 21:21:36.654
M40876_3056	Marinara Sauce	Homemade sauce with tomatoes, onions, garlic, oregano and basil	Sauces	2024-05-19 00:01:22.868	2024-05-19 00:01:22.868
M32329_3056	Bananaberry Mini Muffin	Freshly baked whole grain muffin with bananas and blueberries	Breads	2024-05-13 22:01:05.052	2024-05-13 22:01:05.052
M2787_3314	Latin Spiced Pork Roast	Oven-braised pork loin roast seasoned with coriander and cumin	Entrées	2024-05-13 22:02:35.816	2024-05-13 22:02:35.816
M32404_3314	Chimichurri (1  fl oz)	Green sauce made of finely chopped parsley, garlic, oregano, cilantro and vinegar	Sauces	2024-05-23 00:00:15.152	2024-05-23 00:00:15.152
M14301_3314	American Cheese	Sliced American cheese	Protein	2024-05-13 21:21:37.594	2024-05-13 21:21:37.594
M19864_3056	Beef Meatballs	Beef meatballs	Protein	2024-05-13 22:02:25.966	2024-05-13 22:02:25.966
A2944_3056	Plant-Based Meatball (1  each)	Roasted plant-based meatball	Protein	2024-05-13 22:02:26.15	2024-05-13 22:02:26.15
M16360_3056	Chicken Vegetable Noodle Bowl	Lo mein noodles, roasted chicken and fresh vegetables in a garlic ginger broth	Entrées	2024-05-13 22:02:26.459	2024-05-13 22:02:26.459
M1344_3056	Strawberry Cream Cheese	Light cream cheese blended with strawberry preserves	Condiments	2024-05-13 22:00:53.376	2024-05-13 22:00:53.376
A3193_3056	Jackfruit Chili (8  fl oz)	Shredded jackfruit sautéed with kidney beans, crushed tomatoes, onions, peppers, garlic and spices	Soups	2024-05-13 22:02:26.703	2024-05-13 22:02:26.703
M11624_3314	Green Leaf Lettuce	Green whole leaf lettuce	Salads	2024-05-13 21:21:37.656	2024-05-13 21:21:37.656
M20398_3056	Grilled Vegetable Stromboli	Grilled bell peppers, zucchini, carrot and onion, and mozzarella wrapped in pizza crust	Pizza	2024-05-13 22:02:32.946	2024-05-13 22:02:32.946
M2328_3056	Lemon Jell-O® Parfait	Lemon gelatin cubes layered with fluffy whipped topping	Desserts	2024-05-13 22:02:33.008	2024-05-13 22:02:33.008
M4883_3314	Jerk Chicken	Baked bone-in chicken coated with jerk seasoning	Entrées	2024-05-13 22:02:34.871	2024-05-13 22:02:34.871
A611_3314	Cajun Cream Sauce	Cream sauce with Cajun seasonings	Sauces	2024-05-13 22:02:34.993	2024-05-13 22:02:34.993
A2815_3056	Grilled Reuben	Corned beef, sauerkraut & Swiss cheese on marble rye	Sandwiches	2024-05-19 00:00:56.281	2024-05-19 00:00:56.281
M32654_3314	Beefy Mac Bake	Beef, macaroni, tomatoes, vegetables and Italian herbs baked with a cheesy crumb topping	Entrées	2024-05-13 22:02:35.758	2024-05-13 22:02:35.758
M40437_3314	Mushroom & Sausage Pizza	Sausage, mushrooms, mozzarella and pizza sauce	Pizza	2024-05-13 22:02:35.855	2024-05-13 22:02:35.855
M4277_3314	Spicy Orange Chicken with Broccoli	Stir-fried chicken, broccoli, carrots and water chestnuts in spicy orange sauce over jasmine rice	Entrées	2024-05-21 00:00:10.897	2024-05-21 00:00:10.897
M21375_3314	General Tso's Chicken	Stir-fried chicken, carrot, broccoli, bell pepper, water chestnuts and onions in spicy-sweet  sauce	Entrées	2024-05-13 22:02:25.409	2024-05-13 22:02:25.409
A5762_3056	Grilled Chili Rubbed Shrimp Tacos	Shrimp, avocado slaw, fresh jalapeno, cilantro, crispy bacon & toasted pepitas	Sandwiches	2024-05-13 22:02:33.192	2024-05-13 22:02:33.192
M34970_3056	Turmeric Tofu Scramble	Crumbled tofu sauteed with turmeric, salt and pepper	Entrées	2024-05-13 21:21:36.606	2024-05-13 21:21:36.606
M32272_3314	Chermoula Sauce (2  fl oz)	Flavorful blend of fresh cilantro, parsley, garlic, cumin, paprika, ginger and lemon	Sauces	2024-05-21 00:00:11.119	2024-05-21 00:00:11.119
M18432_3056	Arroz Rojo	Brown rice seasoned with oregano, chili powder, garlic and cumin	Sides	2024-05-19 00:00:48.874	2024-05-19 00:00:48.874
M10266_3314	Homestyle Macaroni Salad	Elbow macaroni, celery, bell pepper, green onions and eggs blended in a creamy mayonnaise dressing	Salads	2024-05-13 22:02:25.533	2024-05-13 22:02:25.533
M20555_3056	Belgian Waffle	Golden brown  waffle	Entrées	2024-05-13 22:02:17.384	2024-05-13 22:02:17.384
M34445_3314	Hearty Chicken Gumbo (6  fl oz)	Homemade soup with chicken, sausage, okra, bacon, tomato and garlic in spicy chicken broth	Soups	2024-05-13 22:02:34.748	2024-05-13 22:02:34.748
M40850_3056	O'Brien Potatoes	Pan-fried seasoned diced potatoes and sautéed green and red peppers and onions	Sides	2024-05-13 22:02:17.231	2024-05-13 22:02:17.231
M1709_3056	Banana Pudding Parfait	Creamy vanilla pudding with fresh bananas layered with crushed vanilla wafers and whipped topping	Desserts	2024-05-19 00:01:13.062	2024-05-19 00:01:13.062
M41612_3314	Arroz Rojo	Rice simmered with vegetable stock, tomato, peas, carrots and spices	Sides	2024-05-23 00:00:15.153	2024-05-23 00:00:15.153
M11770_3056	Tomato Wedges	Fresh tomatoes cut into wedges	Salads	2024-05-19 00:00:49.896	2024-05-19 00:00:49.896
M32743_3314	Arrabiata Cheese Ravioli	Cheese ravioli pan-sauteed with fresh tomato, mushrooms, onion, banana peppers and tomato sauce	Entrées	2024-05-23 00:00:16.034	2024-05-23 00:00:16.034
A486_3056	Smoked Paprika Roasted Potatoes	Potatoes roasted in smoked paprika	Sides	2024-05-13 22:01:45.928	2024-05-13 22:01:45.928
M40803_3056	Split Pea Soup (6  fl oz)	Split green peas, onions, celery, carrots and herbs simmered in a rich vegetable broth	Soups	2024-05-19 00:01:13.94	2024-05-19 00:01:13.94
M6446_3056	Penne Pasta Salad	Penne pasta, baby spinach and basil tossed with a balsamic vinaigrette	Salads	2024-05-13 22:01:30.82	2024-05-13 22:01:30.82
M33496_3056	Chicken Teriyaki	Stir-fried chicken, broccoli, cabbage, carrot, celery and onion tossed with teriyaki sauce	Entrées	2024-05-13 22:00:59.763	2024-05-13 22:00:59.763
M6475_3056	Chipotle Macaroni Salad	Creamy macaroni salad with bell peppers seasoned with cilantro, cumin and chipotle pepper	Salads	2024-05-13 22:02:35.177	2024-05-13 22:02:35.177
M33009_3314	Roasted Cauliflower	Fresh cauliflower seasoned and roasted	Sides	2024-05-23 00:00:16.223	2024-05-23 00:00:16.223
M39971_3056	Gardenburger Black Bean Burger (1  each)	Vegan black bean burger	Protein	2024-05-13 21:21:39.826	2024-05-13 21:21:39.826
M6578_3056	Shredded Carrots	Shredded fresh carrots	Salads	2024-05-13 21:21:39.893	2024-05-13 21:21:39.893
M21926_3314	Sweet Chili Tofu Saute	Tofu sauteed with Asian vegetables and pineapple in sweet chili sauce over almond-raisin rice	Entrées	2024-05-13 22:02:25.447	2024-05-13 22:02:25.447
M36310_3056	Mojo Chicken & Plantains Plate	Mojo grilled chicken with fried plantains, rice and beans topped with mojo dressing	Entrées	2024-05-13 22:02:25.889	2024-05-13 22:02:25.889
M40947_3056	BBQ Spiced Shredded Chicken	Braised chicken thigh meat simmered in BBQ spices and shredded	Entrées	2024-05-19 00:00:56.305	2024-05-19 00:00:56.305
M2351_3314	Oatmeal Raisin Cookie	Freshly baked chewy oatmeal cookie with raisins	Desserts	2024-05-13 21:21:37.517	2024-05-13 21:21:37.517
M20912_3056	Chik'n Paella	Spanish-style dish with yellow rice, tomato, peas, olives and meatless chicken strips	Entrées	2024-05-13 22:02:26.461	2024-05-13 22:02:26.461
M2030_3314	Sugar Cookie	Freshly baked soft sugar cookie	Desserts	2024-05-13 21:21:37.525	2024-05-13 21:21:37.525
M36582_3314	Brown Rice & Quinoa	Brown rice & red quinoa blend	Sides	2024-05-13 22:02:35.019	2024-05-13 22:02:35.019
M14545_3314	Garbanzo Beans	Garbanzo beans	Salads	2024-05-13 21:21:37.641	2024-05-13 21:21:37.641
M599_3056	Cinnamon-Sugar Donut	Freshly baked donut coated with cinnamon sugar	Breads	2024-05-13 22:01:25.907	2024-05-13 22:01:25.907
M10587_3314	Turkey Sausage Link	Golden brown savory turkey sausage link	Sides	2024-05-13 21:21:40.977	2024-05-13 21:21:40.977
M32642_3056	Chili Con Carne (8  fl oz)	A Southwest spiced stew of ground beef, tomatoes, onion, green peppers, garlic and kidney beans	Soups	2024-05-19 00:01:13.953	2024-05-19 00:01:13.953
M6578_3314	Shredded Carrots	Shredded fresh carrots	Salads	2024-05-13 21:21:37.656	2024-05-13 21:21:37.656
M21939_3056	Banana-Nut Mini Muffin	Freshly baked miniature muffin with fresh banana and walnuts	Breads	2024-05-13 22:01:00.096	2024-05-13 22:01:00.096
M6847_3056	Croutons	Homestyle seasoned croutons	Grains 	2024-05-13 21:21:39.833	2024-05-13 21:21:39.833
M6556_3056	Iceberg Lettuce	Chopped iceberg lettuce	Salads	2024-05-13 21:21:39.887	2024-05-13 21:21:39.887
M14574_3056	Sliced Green Bell Peppers	Sliced green bell peppers	Salads	2024-05-13 21:21:39.894	2024-05-13 21:21:39.894
M39275_3314	Garden Vegetable Soup (6  fl oz)	Fresh carrot, potato, corn, spinach, peppers and zucchini simmered with beans in a garlic herb broth	Soups	2024-05-13 22:01:34.253	2024-05-13 22:01:34.253
M36019_3314	Pineapple	Pineapple chunks	Salads	2024-05-13 21:21:40.958	2024-05-13 21:21:40.958
M21905_3314	Vegan Spiced Pumpkin Cake	Freshly-baked vegan pumpkin spice cake with raisins and walnuts	Desserts	2024-05-13 22:02:34.829	2024-05-13 22:02:34.829
A1221_3314	Pepperoni Pizza	Pepperoni, mozzarella cheese & oregano sauce on a garlic herb crust	Pizza	2024-05-13 22:02:34.639	2024-05-13 22:02:34.639
M40733_3056	Oven-Roasted Herbed Turkey Breast	Slow roasted boneless turkey breast rubbed with sage and thyme	Entrées	2024-05-19 00:01:17.686	2024-05-19 00:01:17.686
M19595_3056	Strawberry Mousse Parfait	Moist yellow cake cubes topped with creamy strawberry yogurt mousse and fresh strawberries	Desserts	2024-05-19 00:01:09.495	2024-05-19 00:01:09.495
M21866_3056	Chipotle Black Bean Burger (1  each)	Spicy black bean burger	Protein	2024-05-19 00:01:09.523	2024-05-19 00:01:09.523
M40806_3314	Hearty Lentil & Potato Soup (6  fl oz)	Lentils, potatoes, onion, bell pepper, celery, carrot, herbs and garlic in tomato-vegetable broth	Soups	2024-05-23 00:00:15.213	2024-05-23 00:00:15.213
M33062_3314	Overnight Apples 'N' Oats (6  fl oz)	Old fashioned oats combined with nonfat Greek yogurt, fresh apples, dried cranberries, a touch of cinnamon and brown sugar	Cereals	2024-05-13 21:21:40.885	2024-05-13 21:21:40.885
M40079_3314	Oatmeal Raisin Cookie	Freshly baked chewy oatmeal cookie with raisins	Desserts	2024-05-13 22:01:35.136	2024-05-13 22:01:35.136
M35618_3314	Apple Samosa	Baked cardamom pastry stuffed with apple, raisins & cranberries topped with a cinnamon apple glaze	Desserts	2024-05-24 00:00:12.219	2024-05-24 00:00:12.219
M9513_3056	Pork Sausage Links	Golden brown savory pork sausage link	Sides	2024-05-13 22:01:25.855	2024-05-13 22:01:25.855
M19924_3056	Sauteed Bruschetta Ravioli	Sauteed bruschetta and ravioli with fresh basil and Parmesan	Entrées	2024-05-13 22:01:30.755	2024-05-13 22:01:30.755
M40528_3056	Vietnamese Rice Bowl	Jasmine rice topped with pork, jalapenos, red cabbage, pickled cucumbers, scallions, cilantro & sweet chili sauce	Entrées	2024-05-13 22:01:30.991	2024-05-13 22:01:30.991
M10053_3314	Italian Vegetable Blend	Steamed medley of zucchini, cauliflower, crinkled carrots, Romano beans and lima beans	Sides	2024-05-13 22:01:28.167	2024-05-13 22:01:28.167
M41402_3056	Maple Pecan Donut Bites	Donut hole coated in a sweet maple glaze and pecans	Breads	2024-05-13 22:01:05.246	2024-05-13 22:01:05.246
M6943_3056	Fire-Roasted Salsa	Char-grilled onions, bell peppers and jalapenos pureed with tomatoes, cilantro and garlic	Condiments	2024-05-13 22:01:26.032	2024-05-13 22:01:26.032
M33549_3314	Vegan Frito Pie	Corn chips topped with plant-based chili con carne, salsa and banana peppers	Entrées	2024-05-13 22:02:25.449	2024-05-13 22:02:25.449
M34422_3314	Broccoli Cheddar Soup (6  fl oz)	Chopped broccoli and Cheddar in a creamy thick broth spiced with hot pepper sauce	Soups	2024-05-13 22:02:25.636	2024-05-13 22:02:25.636
M33367_3056	Gnocchi	Potato ricotta dumpling	Entrées	2024-05-13 22:02:25.885	2024-05-13 22:02:25.885
M9905_3056	Buttered Corn on the Cob	Fresh steamed and buttered corn on the cob	Sides	2024-05-13 22:02:25.948	2024-05-13 22:02:25.948
M14891_3056	Ranch Dressing	Homestyle creamy ranch salad dressing	Condiments	2024-05-13 21:21:39.947	2024-05-13 21:21:39.947
M21986_3314	Asian Tofu Noodle Bowl	Ginger and garlic stir-fried veggies, tofu and Asian noodles in steaming vegetable broth	Entrées	2024-05-13 22:02:34.835	2024-05-13 22:02:34.835
M32307_3056	Korean Vegetable Broth (1  fl oz)	Vegetable broth seasoned with gochujang, soy sauce, ginger and garlic	Soups	2024-05-13 22:02:35.21	2024-05-13 22:02:35.21
M20596_3314	Sweet & Sour Meatballs	Beef meatballs sauteed with pineapple, bell peppers, onion and sweet & sour sauce	Entrées	2024-05-13 22:02:35.854	2024-05-13 22:02:35.854
M9706_3056	Savory Rice Pilaf	Long grain rice and sauteed onion simmered in a seasoned vegetable broth	Sides	2024-05-13 22:01:53.258	2024-05-13 22:01:53.258
M21653_3056	Angus Beef Patty (1  each)	Angus beef patty	Protein	2024-05-13 21:21:39.981	2024-05-13 21:21:39.981
M21908_3314	Tofu-Potato Hash	Hearty tofu-potato hash with peppers and onions, served with salsa	Entrées	2024-05-13 22:01:26.129	2024-05-13 22:01:26.129
M214_3056	Blueberry-Banana Smoothie	Blueberries and fresh banana blended with creamy vanilla yogurt and apple juice	Cold Beverages	2024-05-13 22:01:18.724	2024-05-13 22:01:18.724
M39630_3056	Apple Cinnamon Muffin	Freshly baked apple cinnamon muffin	Breads	2024-05-13 22:02:22.974	2024-05-13 22:02:22.974
M18660_3314	Bow Tie Alfredo with Bacon	Bow-tie pasta, bacon and peas blended with Alfredo sauce topped with mozzarella	Entrées	2024-05-16 00:00:14.242	2024-05-16 00:00:14.242
M32404_3056	Chimichurri (1  fl oz)	Green sauce made of finely chopped parsley, garlic, oregano, cilantro and vinegar	Sauces	2024-05-13 22:02:26.135	2024-05-13 22:02:26.135
M40046_3056	Pimento Mac & Cheese	White cheddar macaroni & cheese, roasted red peppers	Entrées	2024-05-19 00:01:13.255	2024-05-19 00:01:13.255
M33062_3056	Overnight Apples 'N' Oats (6  fl oz)	Old fashioned oats combined with nonfat Greek yogurt, fresh apples, dried cranberries, a touch of cinnamon and brown sugar	Cereals	2024-05-13 22:00:53.16	2024-05-13 22:00:53.16
M36015_3314	Banana	Sliced Bananas	Salads	2024-05-13 21:21:37.614	2024-05-13 21:21:37.614
M34957_3314	Lentil Curry	Lentils, carrots and broccoli in coconut curry sauce with turmeric over lentils	Entrées	2024-05-13 22:01:32.397	2024-05-13 22:01:32.397
M2007_3314	Blueberry Scone	Freshly baked scone with juicy blueberries drizzled with vanilla icing	Breads	2024-05-13 21:21:40.834	2024-05-13 21:21:40.834
M36024_3314	Whipped Butter	Unsalted whipped butter	Condiments	2024-05-13 22:01:27.531	2024-05-13 22:01:27.531
M4878_3056	Beef Teriyaki	Tender marinated beef strips stir-fried with broccoli and cabbage in a sweet teriyaki sauce	Entrées	2024-05-13 22:02:32.008	2024-05-13 22:02:32.008
M34957_3056	Cauliflower Lentil Curry	Cauliflower, carrots and broccoli in coconut curry sauce with tumeric over lentils	Entrées	2024-05-13 22:01:19.387	2024-05-13 22:01:19.387
M34970_3314	Turmeric Tofu Scramble	Crumbled tofu sauteed with turmeric, salt and pepper	Entrées	2024-05-13 21:21:40.915	2024-05-13 21:21:40.915
M20044_3314	Orange Wedges	Orange wedges	Salads	2024-05-13 22:01:27.593	2024-05-13 22:01:27.593
M2007_3056	Blueberry Scone	Freshly baked scone with juicy blueberries drizzled with vanilla icing	Breads	2024-05-13 21:21:36.757	2024-05-13 21:21:36.757
M5644_3056	Pepperoni Pizza	Pepperoni, mozzarella and pizza sauce on a golden brown crust	Pizza	2024-05-13 21:21:40.33	2024-05-13 21:21:40.33
M10073_3056	Vegetarian Refried Beans	Hearty vegan refried beans	Sides	2024-05-13 22:01:25.877	2024-05-13 22:01:25.877
M21943_3056	Blueberry Mini Muffin	Freshly baked miniature muffin with blueberries	Breads	2024-05-13 22:01:25.904	2024-05-13 22:01:25.904
M14363_3056	Chopped Hard-Cooked Egg	Chopped hard-cooked egg	Protein	2024-05-13 21:21:39.824	2024-05-13 21:21:39.824
M20114_3056	Baby Spinach	Fresh baby spinach	Salads	2024-05-13 21:21:39.856	2024-05-13 21:21:39.856
M8321_3056	Classic Hot Dog	Grilled  hot dog on a roll	Hot Sandwiches	2024-05-13 21:21:39.763	2024-05-13 21:21:39.763
M19242_3056	Lite Italian Dressing	Lite Italian salad dressing	Condiments	2024-05-13 21:21:39.946	2024-05-13 21:21:39.946
A2938_3056	Miso-Ginger Ramen Noodle Bowl (1  serving)	Glazed chicken, vegetables and ramen noodles in miso-ginger broth topped with scallion, radish, cilantro, Thai red curry cream and a lime wedge	Soups	2024-05-13 22:02:35.435	2024-05-13 22:02:35.435
M13601_3314	Garlic Potato Salad	Diced potatoes and fresh garlic tossed in a creamy Dijon roasted garlic dressing	Salads	2024-05-13 22:02:25.517	2024-05-13 22:02:25.517
M32597_3056	Shrimp Lo Mein Salad	Seared shrimp with scallions, cabbage, cucumber and carrots over chilled noodles	Salads	2024-05-13 22:02:26.138	2024-05-13 22:02:26.138
M38581_3056	Sesame Tofu Crunch Poke Bowl	Crispy Tofu, kale, rice, pineapple, cabbage, sweet onion, jalapeno, macadamia nuts, poke sauce	Entrées	2024-05-13 22:02:26.701	2024-05-13 22:02:26.701
A1054_3056	Southwest  Sauteed Shrimp	Southwest   seasoned sauteed shrimp	Entrées	2024-05-13 22:02:26.763	2024-05-13 22:02:26.763
M14856_3314	Dill Pickle Slices	Dill pickle slices	Condiments	2024-05-13 21:21:40.585	2024-05-13 21:21:40.585
M6847_3314	Croutons	Homestyle seasoned croutons	Grains	2024-05-13 21:21:37.578	2024-05-13 21:21:37.578
M21159_3056	Creamy Parmesan Penne	Penne tossed with a Parmesan-garlic white sauce	Entrées	2024-05-13 22:02:35.104	2024-05-13 22:02:35.104
M40715_3314	Hummus	A dip of mashed chickpeas, tahini, lemon juice, oil and garlic	Condiments	2024-05-13 22:02:35.636	2024-05-13 22:02:35.636
M34023_3314	Baked Falafel	Falafel balls baked until golden brown	Entrées	2024-05-13 22:02:35.757	2024-05-13 22:02:35.757
M40391_3314	Classic Cheese Pizza	Mozzarella cheese and pizza sauce on a golden brown crust	Pizza	2024-05-13 21:21:37.58	2024-05-13 21:21:37.58
M14571_3314	Cucumbers	Sliced fresh cucumbers	Salads	2024-05-13 21:21:37.639	2024-05-13 21:21:37.639
M8321_3314	Classic Hot Dog	Grilled  hot dog on a roll	Hot Sandwiches 	2024-05-13 21:21:37.738	2024-05-13 21:21:37.738
M1997_3056	Chocolate Chip Scone	Freshly baked chocolate scone with semisweet chocolate chips drizzled with chocolate icing	Breads	2024-05-13 22:00:59.816	2024-05-13 22:00:59.816
M15473_3314	Crispy Chicken Sandwich	Crispy breaded chicken and lettuce on a roll with mayonnaise	Hot Sandwiches 	2024-05-13 21:21:37.739	2024-05-13 21:21:37.739
M22100_3056	Cheddar & Onion Frittata	Eggs with golden brown hash brown potatoes, onion and cheddar	Entrées	2024-05-19 00:01:00.282	2024-05-19 00:01:00.282
M34943_3056	Buffalo Chicken Mac and Cheese	Macaroni and cheese with baked crispy chicken tenders tossed with spicy buffalo sauce	Sides	2024-05-16 00:00:10.722	2024-05-16 00:00:10.722
M41036_3056	Grilled Chicken Breast	Sliced grilled chicken	Entrées	2024-05-13 21:21:39.981	2024-05-13 21:21:39.981
M14336_3056	Grape Tomatoes	Fresh grape tomatoes	Salads	2024-05-13 22:01:30.916	2024-05-13 22:01:30.916
A1146_3314	Chicken Gravy	Chicken gravy	Sauces	2024-05-13 22:02:25.579	2024-05-13 22:02:25.579
M13972_3314	Rotini with Tomato Sauce	Spiral pasta tossed with tomato sauce, Parmesan and fresh basil	Sides	2024-05-13 22:01:34.242	2024-05-13 22:01:34.242
M1461_3314	Whipped Cream Cheese	Fluffy whipped cream cheese	Condiments	2024-05-13 21:21:40.895	2024-05-13 21:21:40.895
M19303_3314	Grilled Indian-Spiced Chicken	Grilled chicken breast seasoned with a blend of toasted cumin, cinnamon and turmeric	Entrées	2024-05-23 00:00:16.079	2024-05-23 00:00:16.079
M13850_3314	Nonfat Strawberry Yogurt	Creamy nonfat strawberry yogurt	Protein	2024-05-13 21:21:40.937	2024-05-13 21:21:40.937
M41494_3056	Baked Croissant French Toast Plate	Baked croissant French toast served with fresh sliced strawberries and home made whipped cream	Entrées	2024-05-19 00:01:13.256	2024-05-19 00:01:13.256
L331357_3056	Chicken Apple Sausage	Chicken Apple Sausage	Sides	2024-05-13 22:02:17.232	2024-05-13 22:02:17.232
A3503_3314	Cinnamon Roll	Fresh baked cinnamon roll	Breads	2024-05-13 21:21:40.847	2024-05-13 21:21:40.847
M41005_3056	Cumin Roasted Cauliflower	Cumin spiced roasted cauliflower	Sides	2024-05-19 00:00:43.9	2024-05-19 00:00:43.9
A721_3056	Southern Spaghetti	Spaghetti tossed in a cheese sauce with green chilis and tomatoes	Pasta Entrées	2024-05-13 22:02:26.157	2024-05-13 22:02:26.157
M40418_3314	Pepperoni Pizza	Pepperoni, mozzarella and pizza sauce on a golden brown crust	Pizza	2024-05-13 21:21:37.585	2024-05-13 21:21:37.585
M32355_3056	Korean-Style Fried Chicken Dinner	Crispy chicken drumstick served with kimchi fried rice, shiitake mushrooms, pickled carrot and gochujang sauce	Entrées	2024-05-13 22:02:35.131	2024-05-13 22:02:35.131
M19746_3314	Cincinnati Chili	Hearty beef chili spiced with chili powder, cumin, cinnamon and allspice served over spaghetti	Entrées	2024-05-13 22:02:35.815	2024-05-13 22:02:35.815
M13499_3314	Sliced Onions	Thinly sliced yellow onions	Salads	2024-05-13 22:01:35.278	2024-05-13 22:01:35.278
M19998_3056	Red Beans & Rice	Tender rice and red beans simmered with green bell peppers, onion and garlic	Sides	2024-05-13 22:02:32.992	2024-05-13 22:02:32.992
M9906_3314	Corn on the Cob	Steamed corn on the cob	Sides	2024-05-13 22:01:36.504	2024-05-13 22:01:36.504
M32323_3056	Caramel Apple Mini Muffin	Freshly baked muffin with apple drizzled with caramel topping	Breads	2024-05-19 00:01:00.282	2024-05-19 00:01:00.282
M32414_3056	Argentine Meatballs	Turkey meatballs with Chimichurri and blue cheese atop cauliflower potato mash and grilled carrots	Entrées	2024-05-13 22:02:35.432	2024-05-13 22:02:35.432
M20948_3314	Grilled Chicken Breast (1  each)	Grilled chicken breast	Protein	2024-05-13 21:21:37.6	2024-05-13 21:21:37.6
M9734_3314	O'Brien Potatoes	Pan-fried seasoned diced potatoes and sauteed green and red peppers and onions	Sides	2024-05-13 21:21:40.972	2024-05-13 21:21:40.972
A1143_3314	Chicken Andouille Jambalaya	Chicken thighs & sausage andouille simmered with vegetables, herbs & spices	Entrées	2024-05-13 22:01:34.101	2024-05-13 22:01:34.101
M14258_3314	Shredded Cheddar Cheese	Shredded Cheddar cheese	Protein	2024-05-13 22:01:25.393	2024-05-13 22:01:25.393
M21327_3056	Bacon Breakfast Pizza	Scrambled eggs, bacon and American cheese on a house-made crust	Entrées	2024-05-19 00:01:17.016	2024-05-19 00:01:17.016
M14283_3314	Corn	Sweet corn kernels	Salads	2024-05-13 21:21:37.623	2024-05-13 21:21:37.623
M41118_3056	True Balance Carnitas Taco	Allergen friendly soft corn tortilla filled with shredded pork, vegan cheddar cheese, shredded lettuce, tomatoes, salsa & jalapenos	Entrées	2024-05-13 22:01:05.036	2024-05-13 22:01:05.036
M20278_3056	Danish Pastry	Warm Danish pastry	Breads	2024-05-13 22:00:59.825	2024-05-13 22:00:59.825
M6574_3314	Spring Salad Mix	Fresh spring lettuce mix	Salads	2024-05-13 21:21:37.675	2024-05-13 21:21:37.675
M766_3314	Scrambled Eggs	Freshly scrambled eggs seasoned with salt and pepper	Entrées	2024-05-13 21:21:40.91	2024-05-13 21:21:40.91
M15939_3056	Spanish Rice	Long grain white rice with tomatoes, onions, green peppers and garlic	Sides	2024-05-13 22:01:25.857	2024-05-13 22:01:25.857
M41561_3056	Sugar Cookie	Sugar cookie made with plant-based butter & made-without-gluten flour	Desserts	2024-05-13 21:21:39.949	2024-05-13 21:21:39.949
M2030_3056	Sugar Cookie	Freshly baked soft sugar cookie	Desserts	2024-05-13 21:21:40.391	2024-05-13 21:21:40.391
M13541_3056	Sliced Tomatoes	Sliced fresh tomatoes	Salads	2024-05-13 21:21:39.92	2024-05-13 21:21:39.92
M19735_3056	Balsamic Vinaigrette	Tangy balsamic vinaigrette dressing	Condiments	2024-05-13 21:21:39.94	2024-05-13 21:21:39.94
M1347_3056	Vegetable Cream Cheese	Light cream cheese blended with carrot, spinach, dill and lemon juice	Condiments	2024-05-19 00:00:46.975	2024-05-19 00:00:46.975
M36652_3314	Cuban Split Pea Soup (6  fl oz)	Split peas cooked in broth with potatoes,  tomato, Chorizo, ham, cumin, salt, pepper, thyme and bay leaves	Soups	2024-05-23 00:00:15.212	2024-05-23 00:00:15.212
M289_3056	Fresh Squeezed Orange Juice	Sweet, refreshing juice from fresh squeezed oranges	Cold Beverages	2024-05-13 21:21:36.779	2024-05-13 21:21:36.779
M32588_3314	Scrambled Eggs	Freshly scrambled eggs	Entrées	2024-05-13 22:01:47.852	2024-05-13 22:01:47.852
M34484_3056	Cincinnati Chili (6  fl oz)	Hearty beef chili seasoned with chili powder, cumin, cinnamon and allspice	Soups	2024-05-13 22:02:35.227	2024-05-13 22:02:35.227
M16593_3056	Szechuan Shrimp	Stir-fried shrimp, broccoli, cabbage, carrot and onion tossed with a spicy Szechuan sauce	Entrées	2024-05-13 22:02:35.102	2024-05-13 22:02:35.102
A3044_3056	Chicken  Noodle Soup (6  fl oz)	Sautéed carrots, celery, onion, white meat chicken, wide egg noodles, chicken stock, thyme, bay leaf, black and white peppers	Soups	2024-05-13 22:02:35.474	2024-05-13 22:02:35.474
M19735_3314	Balsamic Vinaigrette	Tangy balsamic vinaigrette dressing	Condiments	2024-05-13 21:21:37.476	2024-05-13 21:21:37.476
M13531_3314	Black Olives	Sliced pitted black olives	Salads	2024-05-13 21:21:37.615	2024-05-13 21:21:37.615
M13770_3314	Fresh Orange	Fresh orange	Sides	2024-05-13 21:21:37.703	2024-05-13 21:21:37.703
M39438_3314	Breakfast Muffin	Breakfast Muffin	Breads	2024-05-13 21:21:40.846	2024-05-13 21:21:40.846
M3040_3056	Mesquite BBQ Chicken	Grilled boneless chicken breast seasoned with the smoky flavor of mesquite barbeque spice blend	Entrées	2024-05-13 21:21:39.76	2024-05-13 21:21:39.76
M14528_3314	Cottage Cheese	Creamy cottage cheese	Protein	2024-05-13 21:21:40.916	2024-05-13 21:21:40.916
M32538_3314	Fresh Berries 	Fresh strawberries and blueberries	Salads	2024-05-13 22:01:27.579	2024-05-13 22:01:27.579
M14647_3314	Turkey Sausage Patty	Sizzling hot golden brown turkey sausage patty	Sides	2024-05-13 22:02:27.016	2024-05-13 22:02:27.016
M38830_3314	Pesto Alfredo Chicken & Tortellini	Grilled chicken breast, cheese filled tortellini, pesto alfredo sauce, shaved parmesan	Entrées	2024-05-13 22:01:47.848	2024-05-13 22:01:47.848
M40547_3056	Peri Peri Chicken	Chicken leg marinated in peri peri sauce	Entrées	2024-05-13 22:02:33.141	2024-05-13 22:02:33.141
M2969_3314	Chicken Parmesan	Chicken patty topped with tomato sauce, mozzarella and Parmesan	Entrées	2024-05-13 22:01:34.11	2024-05-13 22:01:34.11
M21946_3056	Whole Grain Lemon Poppy Mini Muffin	Freshly baked miniature whole grain muffin with lemon and poppy seeds	Breads	2024-05-13 22:01:48.783	2024-05-13 22:01:48.783
M35609_3056	Incogmeato™ Sausage Patty	Plant-based breakfast sausage	Protein	2024-05-13 22:02:17.294	2024-05-13 22:02:17.294
M18748_3314	Penne & Sausage	Whole grain pasta, Italian sausage, sauteed bell peppers, onions and garlic in tomato sauce	Entrées	2024-05-13 21:21:40.643	2024-05-13 21:21:40.643
M33275_3056	Vegan Peach-Banana Cake	Vegan blueberry banana cake topped with sweetened peaches and whipped topping	Desserts	2024-05-19 00:01:09.495	2024-05-19 00:01:09.495
M40079_3056	Oatmeal Raisin Cookie	Freshly baked chewy oatmeal cookie with raisins	Desserts	2024-05-13 21:21:40.536	2024-05-13 21:21:40.536
M21662_3056	Breaded Chicken Breast (1  each)	Crispy breaded chicken	Protein	2024-05-13 21:21:40.398	2024-05-13 21:21:40.398
M21903_3056	Vegan Carrot Spice Cake	Freshly-baked vegan carrot cake with raisins and walnuts spiced with cinnamon and nutmeg	Desserts	2024-05-19 00:00:46.909	2024-05-19 00:00:46.909
M38867_3056	French Toast Sticks	Baked bread in a sweet batter coating	Entrées	2024-05-13 21:21:36.893	2024-05-13 21:21:36.893
M34446_3314	Chicken & Rice Soup Florentine (6  fl oz)	Chicken, rice, spinach, carrot, celery and onion simmered in a hearty chicken broth	Soups	2024-05-13 22:01:34.253	2024-05-13 22:01:34.253
M20956_3314	Vegan Beef Taco	Flour tortilla filled with meatless taco beef crumbles, shredded lettuce, tomato and jalapeno	Entrées	2024-05-13 22:01:35.213	2024-05-13 22:01:35.213
M19242_3314	Lite Italian Dressing	Lite Italian salad dressing	Condiments	2024-05-13 21:21:37.478	2024-05-13 21:21:37.478
M41104_3056	Alfredo Pesto Sauce (1  fl oz)	Oat milk blended with plant-based crème, vegan mozzarella cheese and nut-free pesto sauce	Sauces	2024-05-13 22:02:26.131	2024-05-13 22:02:26.131
M15134_3314	Chicken Biryani	Sauteed curry-spiced chicken, basmati rice and crispy onions baked with Indian-spiced yogurt sauce	Entrées	2024-05-13 22:02:35.776	2024-05-13 22:02:35.776
M35394_3056	Chicken Chimichurri Melt	Grilled chicken, roasted red peppers, cheddar cheese on whole grain flat bread topped with chimichurri mayo	Hot Sandwiches	2024-05-13 22:02:32.956	2024-05-13 22:02:32.956
M3872_3314	Fettuccine	Fettuccine pasta	Entrées	2024-05-13 22:02:34.855	2024-05-13 22:02:34.855
M4846_3056	Korean BBQ Pork	Roasted pork loin with Korean BBQ sauce	Entrées	2024-05-13 22:02:35.106	2024-05-13 22:02:35.106
M9894_3056	Steamed Broccoli Florets	Steamed broccoli florets tossed with garlic and black pepper	Sides	2024-05-13 22:02:35.168	2024-05-13 22:02:35.168
M38848_3056	BBQ Brisket & Mashed Potatoes	Beef brisket, BBQ sauce, mashed potatoes	Entrées	2024-05-13 22:02:35.533	2024-05-13 22:02:35.533
M33147_3314	Yellow Basmati Rice	Savory basmati rice cooked in vegetable broth with turmeric	Sides	2024-05-13 22:02:35.042	2024-05-13 22:02:35.042
M214_3314	Blueberry-Banana Smoothie	Blueberries and fresh banana blended with creamy vanilla yogurt and apple juice	Cold Beverages	2024-05-13 22:01:26.1	2024-05-13 22:01:26.1
M19391_3056	Dan Dan Noodles	Spicy turkey, crisp vegetables and noodles in a sesame and chili garlic sauce	Entrées	2024-05-13 22:02:25.878	2024-05-13 22:02:25.878
M40911_3314	Chicken with Cacciatore Sauce	Oven-roasted chicken breast served with an herbed tomato sauce with bell peppers and onions	Entrées	2024-05-13 22:01:34.116	2024-05-13 22:01:34.116
M21645_3314	Granny Smith Apple	Fresh crisp apple	Salads	2024-05-13 21:21:37.645	2024-05-13 21:21:37.645
M9126_3056	Teriyaki Sauce	Blend of soy sauce, sesame and spices	Condiments	2024-05-13 22:00:59.886	2024-05-13 22:00:59.886
M40042_3056	French Toast Sticks	Baked bread in a sweet batter coating	Entrées	2024-05-13 22:01:18.658	2024-05-13 22:01:18.658
M14598_3314	Honeydew Melon	Cubed honeydew melon	Salads	2024-05-13 21:21:40.957	2024-05-13 21:21:40.957
M14290_3056	Feta Cheese Crumbles	Crumbled feta	Protein	2024-05-13 22:01:30.854	2024-05-13 22:01:30.854
M11770_3314	Tomato Wedges	Fresh tomatoes cut into wedges	Salads	2024-05-13 21:21:37.676	2024-05-13 21:21:37.676
M35249_3056	Berry Smoothie	Strawberry, blueberry and cranberry smoothie	Cold Beverages	2024-05-13 22:00:53.22	2024-05-13 22:00:53.22
M20840_3056	Meatball Pizza	Sliced Italian meatballs, mozzarella and pizza sauce	Pizza	2024-05-19 00:01:09.428	2024-05-19 00:01:09.428
M8170_3314	Grilled Black Bean Burger	Grilled black bean burger on a bun	Hot Sandwiches 	2024-05-13 21:21:37.747	2024-05-13 21:21:37.747
M39194_3056	Baked Cheese Ravioli	Tender cheese filled ravioli topped with fresh marinara sauce and parmesan cheese and baked until golden brown and bubbly	Entrées	2024-05-13 22:02:26.761	2024-05-13 22:02:26.761
A1219_3056	Cheese Pizza	Mozzarella cheese & oregano sauce on a garlic herb crust	Pizza	2024-05-13 21:21:39.761	2024-05-13 21:21:39.761
M34241_3056	Grape Tomatoes	Sliced grape tomatoes	Salads	2024-05-13 21:21:39.953	2024-05-13 21:21:39.953
M32320_3056	Carrot Raisin Mini Muffin	Freshly baked muffin with fresh carrots and raisins	Breads	2024-05-13 22:02:14.287	2024-05-13 22:02:14.287
M14912_3056	Old-Fashioned Coleslaw	Shredded green cabbage and carrots tossed in a traditional creamy dressing	Salads	2024-05-13 22:01:33.203	2024-05-13 22:01:33.203
M33238_3056	Vegan Zucchini Bread	Moist spiced vegan zucchini bread with raisins and walnuts	Desserts	2024-05-13 21:21:36.779	2024-05-13 21:21:36.779
A347_3056	Salsa Verde	Creamy salsa verde with avocado	Condiments	2024-05-13 22:01:05.266	2024-05-13 22:01:05.266
M20397_3056	Buffalo Chicken Stromboli	Grilled chicken, hot pepper sauce, mozzarella, blue cheese and carrots wrapped in pizza crust	Pizza	2024-05-13 22:02:25.89	2024-05-13 22:02:25.89
M18810_3056	Italian Meat Lover's Panini	Ham, salami, provolone and caramelized onion grilled on a whole grain flatbread	Hot Sandwiches	2024-05-13 22:02:26.512	2024-05-13 22:02:26.512
M41105_3314	Meat Sauce	Tomato sauce with ground beef, onions, peppers & herbs	Sauces	2024-05-13 22:02:34.729	2024-05-13 22:02:34.729
M32740_3056	Mushroom Bacon Gnocchi	Tender gnocchi pan-sauteed with bacon, mushrooms, onion, garlic, tomato sauce and fresh basil	Entrées	2024-05-13 22:02:35.104	2024-05-13 22:02:35.104
M21184_3056	Hawaiian Pizza	Ham, pineapple, mozzarella cheese and pizza sauce on a golden brown crust	Pizza	2024-05-13 22:02:35.166	2024-05-13 22:02:35.166
M12519_3314	Baked Potato with Chili	Baked russet potato topped with hearty vegetable bean chili and Cheddar	Entrées	2024-05-13 22:02:30.645	2024-05-13 22:02:30.645
M14343_3314	Sliced Red Onions	Thinly sliced red onions	Salads	2024-05-13 21:21:37.662	2024-05-13 21:21:37.662
M33548_3314	Chik'n Tagine	Moroccan vegan chicken stew with vegetables, chickpeas, raisins, olives and almonds in savory tomato broth	Entrées	2024-05-13 22:02:34.854	2024-05-13 22:02:34.854
M8958_3314	Hamburger	Juicy all beef burger on a soft split bun	Hot Sandwiches 	2024-05-13 21:21:37.76	2024-05-13 21:21:37.76
M36703_3314	Nonfat Vanilla Greek Yogurt	Creamy nonfat vanilla Greek yogurt	Protein	2024-05-13 22:01:27.56	2024-05-13 22:01:27.56
M19446_3056	Orange Chicken & Soba Noodle Salad	Grilled chicken on tossed greens, soba noodles, vegetables, coconut, peanuts and ginger dressing	Salads	2024-05-19 00:01:13.992	2024-05-19 00:01:13.992
M33241_3314	Vegan Blueberry Banana Bread	Freshly-baked vegan banana bread with blueberries	Desserts	2024-05-13 21:21:40.908	2024-05-13 21:21:40.908
M40004_3056	Sausage, Egg & Cheese Muffin	Sausage, egg, cheddar cheese, English muffin	Sandwiches	2024-05-13 22:01:48.721	2024-05-13 22:01:48.721
M21053_3314	Vegan Chili Con Carne Bowl	Fresh mashed sweet potatoes topped with plant-based chili con carne and green onions	Entrées	2024-05-13 22:02:35.854	2024-05-13 22:02:35.854
M40141_3056	Grilled Chicken Breast	Grilled chicken breast	Entrées	2024-05-13 21:21:40.288	2024-05-13 21:21:40.288
M34961_3314	Baked Tofu with Toasted Coconut Rice	Cinnamon infused rice simmered in coconut milk, toasted coconut and parsley, served with Cajun seasoned baked tofu and grilled pineapple salsa	Entrées	2024-05-13 22:01:34.086	2024-05-13 22:01:34.086
M5804_3056	Old-Fashioned Coleslaw	Green cabbage and carrots tossed in a traditional creamy dressing	Salads	2024-05-13 21:21:40.349	2024-05-13 21:21:40.349
M34450_3056	Mushroom Barley Soup (6  fl oz)	Pearl barley, mushrooms, carrot, celery, leeks and onion simmered in a rich seasoned vegetable broth	Soups	2024-05-13 22:02:35.227	2024-05-13 22:02:35.227
M34462_3056	Minestrone Soup (6  fl oz)	Hearty Italian vegetable soup with beans, ditalini pasta, bacon & Parmesan in vegetable broth	Soups	2024-05-13 22:01:45.736	2024-05-13 22:01:45.736
M6570_3314	Romaine Lettuce	Chopped romaine lettuce	Salads	2024-05-13 22:01:25.416	2024-05-13 22:01:25.416
M713_3314	Garlic Herb Breadstick	Freshly baked garlic herb breadstick	Breads	2024-05-13 22:01:34.048	2024-05-13 22:01:34.048
M8004_3314	Cheeseburger	Juicy all beef burger topped with American cheese on a soft split bun	Hot Sandwiches 	2024-05-13 22:01:35.34	2024-05-13 22:01:35.34
M7449_3056	Classic Italian Sub	Ham, salami, pepperoni and provolone on long roll with tomato, onion and vinaigrette	Cold Sandwiches	2024-05-13 22:02:38.266	2024-05-13 22:02:38.266
M32739_3056	Bacon Blue Gnocchi	Tender gnocchi pan-sauteed with bacon, peas and crumbled blue cheese in a creamy Alfredo sauce	Entrées	2024-05-13 22:02:32.932	2024-05-13 22:02:32.932
M3223_3314	Spicy Vegetable Gumbo	Roasted eggplant with okra, zucchini, mushrooms and bell pepper in a spicy tomato stew	Entrées	2024-05-13 22:02:36.289	2024-05-13 22:02:36.289
M40089_3314	Scrambled Chick Pea	Scrambled seasoned chick pea	Entrées	2024-05-13 22:02:38.052	2024-05-13 22:02:38.052
M4878_3314	Beef Teriyaki	Tender marinated beef strips stir-fried with broccoli and cabbage in a sweet teriyaki sauce	Entrées	2024-05-13 22:02:36.235	2024-05-13 22:02:36.235
M19631_3314	Diced Chicken	Diced roasted fresh chicken breasts and thighs	Entrées	2024-05-13 22:02:34.854	2024-05-13 22:02:34.854
M9651_3056	Rice Noodles ( 1/2 cup)	Fresh cooked rice noodles	Entrées	2024-05-13 22:02:35.105	2024-05-13 22:02:35.105
M32572_3314	Loco Moco	Hawaiian dish of white rice topped with grilled hamburger patty, fried egg and brown gravy	Entrées	2024-05-13 22:02:35.853	2024-05-13 22:02:35.853
M40376_3314	MADE-TO-ORDER, TOMATO, 5 X 6, SLICED 1/4", CUT IN HALF		Salads	2024-05-13 22:02:35.98	2024-05-13 22:02:35.98
M6529_3314	Tabbouleh	Traditional bulgur salad with tomato, fresh parsley, mint, bulgur and onion seasoned with olive oil, lemon juice and garlic	Salads	2024-05-13 22:02:35.982	2024-05-13 22:02:35.982
M21627_3314	Channa Masala	Fresh tomatoes, chiles and garbanzo beans simmered in a spicy curry tomato sauce	Sides	2024-05-13 22:02:36.043	2024-05-13 22:02:36.043
M13924_3314	Eggplant in Garlic Sauce	Stir-fried eggplant, garlic and fresh ginger in a sesame-soy sauce	Sides	2024-05-13 22:02:36.043	2024-05-13 22:02:36.043
M15122_3314	Vegetable Balti	Butternut squash, potatoes, green beans, cauliflower, tomatoes and peppers simmered in a curry broth	Sides	2024-05-13 22:02:36.103	2024-05-13 22:02:36.103
M40801_3314	Yellow Basmati Rice	Savory basmati rice cooked in vegetable broth with turmeric	Sides	2024-05-13 22:02:36.107	2024-05-13 22:02:36.107
M32948_3314	Soft Pretzel	Salted soft pretzel baked until golden brown	Breads	2024-05-13 22:02:36.17	2024-05-13 22:02:36.17
M36744_3314	Spicy Brown Mustard	Spicy Brown Mustard	Condiments	2024-05-13 22:02:36.227	2024-05-13 22:02:36.227
M39018_3314	Crispy Baked Chicken Cutlet	Crispy baked chicken cutlet	Entrées	2024-05-13 22:02:36.26	2024-05-13 22:02:36.26
M39007_3314	Lemon Pepper Rotisserie Chicken	Whole rotisserie chicken, lemon pepper seasoning blend	Entrées	2024-05-13 22:02:36.289	2024-05-13 22:02:36.289
M19842_3314	Bow Ties	Fresh cooked al dente bow-tie pasta	Grains	2024-05-13 22:02:36.296	2024-05-13 22:02:36.296
M37134_3314	Hard Boiled Eggs	Two hard boiled eggs	Protein	2024-05-13 22:02:36.351	2024-05-13 22:02:36.351
M33401_3314	Asian Coleslaw ( 1/2 cup)	Shredded green cabbage and carrots tossed with ginger, garlic, vinegar and cilantro	Salads	2024-05-13 22:02:36.359	2024-05-13 22:02:36.359
M21934_3314	Cheese Sauce	Rich and creamy hot cheese sauce	Sauces	2024-05-13 22:02:36.446	2024-05-13 22:02:36.446
M15063_3314	French Dip Au Jus	Rich beef broth	Sauces	2024-05-13 22:02:36.474	2024-05-13 22:02:36.474
M33324_3314	Japanese BBQ Sauce	Tangy barbecue sauce with a hint of soy sauce	Sauces	2024-05-13 22:02:36.475	2024-05-13 22:02:36.475
M10072_3056	Roasted Corn	Roasted corn tossed with salt and pepper	Sides	2024-05-13 22:02:32.994	2024-05-13 22:02:32.994
M9934_3314	Green Peas	Steamed green peas seasoned with ground black pepper	Sides	2024-05-13 22:02:36.487	2024-05-13 22:02:36.487
M40851_3314	Roasted Red Potatoes	Oven-roasted and fork tender baby red potatoes	Sides	2024-05-13 22:02:36.507	2024-05-13 22:02:36.507
M34456_3314	Barley Vegetable Soup (6  fl oz)	Green cabbage, tomatoes, green beans, corn, barley and herbs simmered in savory vegetable broth	Soups	2024-05-13 22:02:36.108	2024-05-13 22:02:36.108
M34447_3314	Beef Vegetable Noodle Soup (6  fl oz)	Roasted beef, egg noodles, potatoes and vegetables simmered in a rich beef stock	Soups	2024-05-13 22:02:36.108	2024-05-13 22:02:36.108
M7968_3314	Chili Cheddar Dog	Hot dog topped with homemade chili and Cheddar	Hot Sandwiches 	2024-05-13 22:02:36.109	2024-05-13 22:02:36.109
M21174_3314	Philly Cheesesteak	Philly cheesesteak with fried onions and American cheese	Hot Sandwiches 	2024-05-13 22:02:36.611	2024-05-13 22:02:36.611
M32499_3314	Shredded Pork & Slaw Biscuit	Warm cheddar biscuit with pulled pork, slaw and BBQ sauce	Hot Sandwiches 	2024-05-13 22:02:36.611	2024-05-13 22:02:36.611
M5794_3314	Pickled Red Onion	Thinly sliced red onion pickled with red wine vinegar, sugar and mustard seed	Condiments	2024-05-13 22:02:36.629	2024-05-13 22:02:36.629
M20692_3314	Chipotle Chicken Quesadilla	Crispy tortilla filled with grilled chicken, melted cheddar and chipotle sauce	Entrées	2024-05-13 22:02:36.676	2024-05-13 22:02:36.676
M20993_3314	Grilled Veggie Quesadilla	Crispy tortilla filled with grilled veggies and cheddar cheese	Entrées	2024-05-13 22:02:36.677	2024-05-13 22:02:36.677
M19739_3314	Seasoned Roast Beef	Oven-roasted eye round of beef coated with a peppery seasoning	Entrées	2024-05-13 22:02:36.722	2024-05-13 22:02:36.722
M18879_3314	Shrimp & Grits	Sauteed shrimp with tomato, bacon, onion and garlic over creamy cheddar grits	Entrées	2024-05-13 22:02:36.723	2024-05-13 22:02:36.723
M36204_3314	Vegan Roasted Veggie Mac & Cheese Bowl	Creamy vegan mac & cheese topped with roasted broccoli, cauliflower, carrots and an almond-based vegan parmesan topping	Entrées	2024-05-13 22:02:36.29	2024-05-13 22:02:36.29
A3228_3056	Funnel Cake Fries	Warm funnel cake fries dusted with sugar	Desserts	2024-05-13 22:02:38.551	2024-05-13 22:02:38.551
A3201_3056	Jackfruit Salad Wrap	A flour tortilla filled with  a creamy jackfruit salad, fresh tomato and arugula	Sandwiches	2024-05-13 22:02:38.636	2024-05-13 22:02:38.636
A368_3314	Baja Chicken Bowl	Spring mix topped with grilled mojo chicken, cauli-rice quinoa blend, fresh avocado, pico de gallo & salsa verde	Entrées	2024-05-13 22:02:36.234	2024-05-13 22:02:36.234
M40967_3314	Sautéed  Peppers and Onions	Fresh peppers and yellow onions sautéed in oil	Sides	2024-05-13 22:02:36.536	2024-05-13 22:02:36.536
M32348_3314	Korean-Style Fried Chicken Drumstick	Crispy golden chicken drumstick	Entrées	2024-05-13 22:02:36.69	2024-05-13 22:02:36.69
M19759_3314	Basmati Rice with Peas	Basmati rice with peas seasoned with cumin and cilantro	Sides	2024-05-13 22:02:36.015	2024-05-13 22:02:36.015
M20846_3314	Hawaiian Pizza	Ham, pineapple and pizza sauce topped with mozzarella cheese	Pizza	2024-05-13 22:02:36.297	2024-05-13 22:02:36.297
M36641_3314	Balsamic Roasted Vegetables	Oven-roasted eggplant, squash, potato, bell pepper, tomato and mushrooms tossed in balsamic vinaigrette	Sides	2024-05-13 22:02:35.983	2024-05-13 22:02:35.983
M33496_3314	Chicken Teriyaki	Stir-fried chicken, broccoli, cabbage, carrot, celery and onion tossed with teriyaki sauce	Entrées	2024-05-13 22:02:36.675	2024-05-13 22:02:36.675
M9879_3314	Crispy Homestyle French Fries	Piping hot crispy skin-on French fries	Sides	2024-05-13 21:21:37.685	2024-05-13 21:21:37.685
M33398_3314	Esquites	Corn tossed in a mixture of mayonnaise, lime juice, smoked paprika and cayenne	Sides	2024-05-13 22:02:36.864	2024-05-13 22:02:36.864
M20732_3056	Cheese Quesadilla	Cheddar cheese in a tortilla grilled to perfection	Entrées	2024-05-13 22:02:38.24	2024-05-13 22:02:38.24
M34546_3056	Turkey Gravy	Homestyle turkey gravy	Sauces	2024-05-13 22:02:39.114	2024-05-13 22:02:39.114
M33009_3056	Roasted Cauliflower	Fresh cauliflower seasoned and roasted	Sides	2024-05-13 22:02:38.614	2024-05-13 22:02:38.614
M2908_3056	Dulce de Leche Brownie	Fudgy dessert bar with swirls of dulce de leche topping baked in	Desserts	2024-05-13 22:02:39.931	2024-05-13 22:02:39.931
A3192_3056	Al Pastor Jackfruit Taco	Flour tortilla filled with jackfruit carnitas, fresh pineapple, salsa verde, vegan mozzarella & cilantro	Sandwiches	2024-05-13 22:02:40.193	2024-05-13 22:02:40.193
M40910_3314	Vegetarian Baked Beans	Tangy, sweet baked beans with onion and bell pepper	Sides	2024-05-13 22:02:42.541	2024-05-13 22:02:42.541
M20912_3314	Chik'n Paella	Spanish-style dish with yellow rice, tomato, peas, olives and meatless chicken strips	Entrées	2024-05-13 22:02:43.727	2024-05-13 22:02:43.727
M33627_3314	Red Curry Chicken Bowl	Jasmine rice topped with lemongrass chicken, broccoli, red curry sauce, marinated cucumber and fresh jalapeno	Entrées	2024-05-13 22:02:44.102	2024-05-13 22:02:44.102
M2027_3314	Chocolate Chip Cookie	Freshly baked chewy cookie with semisweet chocolate chips	Desserts	2024-05-13 21:21:37.518	2024-05-13 21:21:37.518
M368_3056	Banana Bread	Freshly baked homemade loaf made with fresh bananas	Breads	2024-05-13 22:01:18.719	2024-05-13 22:01:18.719
M21906_3314	Cinnamon Brown Sugar Granola (6  fl oz)	House-made granola with oats, brown sugar, cinnamon and agave syrup	Cereals	2024-05-13 21:21:40.854	2024-05-13 21:21:40.854
M20133_3056	Cavatappi Alfredo with Broccoli	Corkscrew pasta in creamy Alfredo sauce with fresh broccoli and diced ham topped with Parmesan	Entrées	2024-05-13 22:02:39.806	2024-05-13 22:02:39.806
M13844_3314	Nonfat Vanilla Yogurt	Nonfat creamy vanilla yogurt	Protein	2024-05-13 21:21:40.946	2024-05-13 21:21:40.946
M2345_3056	Pumpkin Pie	Rich, smooth pumpkin, cinnamon and spices in a flaky pie crust	Desserts	2024-05-16 00:00:10.549	2024-05-16 00:00:10.549
M34605_3314	Oven Roasted Carrots	Oven roasted carrots with thyme	Sides	2024-05-13 22:02:49.841	2024-05-13 22:02:49.841
M2969_3056	Chicken Parmesan	Chicken patty topped with tomato sauce, mozzarella and Parmesan	Entrées	2024-05-13 22:02:37.555	2024-05-13 22:02:37.555
M21049_3056	Vegan Sweet & Sour Chick'n	Meatless chick'n strips with onion, peppers, pineapple and sweet & sour sauce	Entrées	2024-05-13 22:02:40.257	2024-05-13 22:02:40.257
M14883_3056	Guacamole	Creamy avocado spread	Condiments	2024-05-13 22:02:38.465	2024-05-13 22:02:38.465
M15078_3056	Middle Eastern Falafel Pita	Falafel, tomato, onion and cucumber in pita topped with tzatziki served with tabbouleh	Salads	2024-05-13 22:02:39.886	2024-05-13 22:02:39.886
A2858_3056	Lemon Raspberry Cake	Lemon flavored cake infused with raspberry gelatin, garnished with whipped topping and raspberry sauce	Desserts	2024-05-13 22:02:40.136	2024-05-13 22:02:40.136
M32603_3056	Baharat Beef Hummus Bowl	Hummus with Baharat beef, tahini shredded beets, Harissa & a puffy pita	Entrées	2024-05-13 22:02:40.196	2024-05-13 22:02:40.196
M40821_3314	Roasted Garlic Rice	White rice with roasted garlic	Sides	2024-05-13 22:02:43.932	2024-05-13 22:02:43.932
M14289_3314	Blue Cheese Crumbles	Crumbled blue cheese	Protein	2024-05-13 22:02:44.177	2024-05-13 22:02:44.177
M12320_3314	Strawberry-Banana Smoothie	Strawberries and fresh banana blended with creamy vanilla yogurt and apple juice	Cold Beverages	2024-05-13 22:02:42.035	2024-05-13 22:02:42.035
M41061_3314	Fried Garlic Yellow Rice	Yellow rice fried with garlic and scallions	Sides	2024-05-13 22:02:36.873	2024-05-13 22:02:36.873
M3828_3056	Spaghetti	Fresh cooked al dente spaghetti	Entrées	2024-05-13 22:02:48.986	2024-05-13 22:02:48.986
M40795_3056	Mojo Pork	Roasted pork shoulder marinated in citrus, garlic, onions & fresh herbs	Entrées	2024-05-13 22:02:49.229	2024-05-13 22:02:49.229
M32686_3056	Chicken Pot Pie	Creamy chicken with potatoes, carrots, peas, celery and onion topped with a buttermilk biscuit	Entrées	2024-05-13 22:02:35.116	2024-05-13 22:02:35.116
A209_3056	Chicken Tinga Taco	Corn tortilla filled with pulled chicken with chipotle adobo, salsa roja, pickled onions & cilantro	Sandwiches	2024-05-13 22:00:53.379	2024-05-13 22:00:53.379
M40425_3056	Grilled Vegetable Pizza	Grilled fresh vegetables, mozzarella and pizza sauce	Pizza	2024-05-13 22:02:39.826	2024-05-13 22:02:39.826
M9958_3056	Collard Greens with Bacon	Fresh collard greens sauteed with bacon and onions seasoned with hot sauce	Sides	2024-05-13 22:02:38.282	2024-05-13 22:02:38.282
M13844_3056	Nonfat Vanilla Yogurt	Nonfat creamy vanilla yogurt	Protein	2024-05-13 21:21:36.816	2024-05-13 21:21:36.816
M36624_3056	Veggie & Black Bean Saute	Fresh vegetables and black beans served over brown rice	Entrées	2024-05-13 22:02:38.597	2024-05-13 22:02:38.597
M20112_3056	Pico de Gallo	Fresh salsa of chopped plum tomatoes, onions, jalapeno peppers with lime juice, cilantro and garlic	Condiments	2024-05-13 22:02:38.489	2024-05-13 22:02:38.489
M16738_3056	Iced Cinnamon Roll	Freshly baked cinnamon roll with cream cheese icing	Breads	2024-05-13 22:00:59.826	2024-05-13 22:00:59.826
M3223_3056	Spicy Vegetable Gumbo	Roasted eggplant with okra, zucchini, mushrooms and bell pepper in a spicy tomato stew	Entrées	2024-05-13 22:01:45.679	2024-05-13 22:01:45.679
M35618_3056	Apple Samosa	Baked cardamom pastry stuffed with apple, raisins & cranberries topped with a cinnamon apple glaze	Desserts	2024-05-13 22:02:14.32	2024-05-13 22:02:14.32
M14856_3056	Dill Pickle Slices	Dill pickle slices	Condiments	2024-05-13 21:21:39.946	2024-05-13 21:21:39.946
M40391_3056	Classic Cheese Pizza	Mozzarella cheese and pizza sauce on a golden brown crust	Pizza	2024-05-13 22:00:59.766	2024-05-13 22:00:59.766
M1883_3056	Devil's Food Cupcake	Freshly baked devil's food cake topped with creamy vanilla icing	Desserts	2024-05-19 00:00:49.772	2024-05-19 00:00:49.772
A3459_3056	Crispy Chicken Drumstick	Fried chicken drumstick seasoned with herbs & spices	Entrées	2024-05-13 22:02:45.366	2024-05-13 22:02:45.366
A3247_3056	Jackfruit Bunny Chow	Basmati rice topped with shredded jackfruit, cilantro, onions, jalapenos and spices	Entrées	2024-05-13 22:02:38.6	2024-05-13 22:02:38.6
M36146_3056	Salmon & Zucchini Noodles Bowl	Grilled salmon on zucchini noodles with mixed vegetables in a Mediterranean clam broth	Entrées	2024-05-13 22:02:39.8	2024-05-13 22:02:39.8
M40090_3056	Roast Pork Banh Mi	Vietnamese-style sandwich with roast pork, cucumber, pickled daikon & carrot, jalapeno and mayo	Hot Sandwiches	2024-05-13 22:02:39.863	2024-05-13 22:02:39.863
M14861-166387_3056	Couscous (1  ozw)	Chilled cooked couscous	Breads	2024-05-13 22:02:40.117	2024-05-13 22:02:40.117
M20696_3056	Risotto	Creamy Arborio rice simmered with garlic, onion and vegetable stock	Sides	2024-05-13 22:02:40.193	2024-05-13 22:02:40.193
A5808_3056	Five Spice Pork Sandwich	Braised pork,   mustard-kimchi slaw, fresh jalapeno, on a toasted roll	Sandwiches	2024-05-13 22:02:43.011	2024-05-13 22:02:43.011
A4872_3314	BBQ Mac &  Cheese Bowl	Mac & Cheese   topped with ground beef, roasted broccoli, panko crumbles & BBQ sauce	Entrées	2024-05-13 22:02:43.705	2024-05-13 22:02:43.705
M34535_3314	Salsa Verde (2  fl oz)	Zesty blend of tomatillos, onion, cilantro, jalapenos and lime juice	Condiments	2024-05-13 22:02:44.02	2024-05-13 22:02:44.02
M34753_3314	Mediterranean Pot Roast	Tender beef braised in a flavorful tomato and Kalamata olive sauce	Entrées	2024-05-13 22:02:44.083	2024-05-13 22:02:44.083
M33770_3314	Steamed Summer Vegetable Blend	Simple blend of fresh, steamed zucchini, yellow squash and green beans	Sides	2024-05-13 22:02:36.926	2024-05-13 22:02:36.926
M9722_3314	Home Fries	Oven-roasted seasoned fresh potato slices	Sides	2024-05-13 22:02:42.165	2024-05-13 22:02:42.165
M3379_3314	Beef Pho	Classic Vietnamese soup with sliced beef, rice noodles, bean sprouts, carrots, jalapeno, and basil	Entrées	2024-05-13 22:02:46.02	2024-05-13 22:02:46.02
M10550_3314	Coconut Jasmine Rice	Jasmine rice and flaked coconut simmered in coconut milk	Sides	2024-05-13 22:02:46.209	2024-05-13 22:02:46.209
A3043_3314	Chicken & Wild Rice Soup (6  fl oz)	Sautéed carrots, celery, onion, chicken stock, grilled chicken breast, wild and long grain rice, parsley, thyme, basil, tarragon	Soups	2024-05-13 22:02:42.545	2024-05-13 22:02:42.545
M9791_3314	Creamy Mashed Potatoes	Fresh mashed russet potatoes with fresh green onions	Sides	2024-05-13 22:02:44.275	2024-05-13 22:02:44.275
M40908_3314	Spanish Rice	Long grain white rice with tomatoes, onions, green peppers and garlic	Sides	2024-05-13 22:02:44.338	2024-05-13 22:02:44.338
M34422_3056	Broccoli Cheddar Soup (6  fl oz)	Chopped broccoli and Cheddar in a creamy thick broth spiced with hot pepper sauce	Soups	2024-05-13 22:02:38.328	2024-05-13 22:02:38.328
M21578_3056	Sweet & Sour Tofu Stir-Fry	Stir-fried tofu, onion, bell peppers, carrots and pineapple coated with a sweet and sour sauce	Entrées	2024-05-13 22:02:25.89	2024-05-13 22:02:25.89
M713_3056	Garlic Herb Breadstick	Freshly baked garlic herb breadstick	Breads	2024-05-13 22:01:04.749	2024-05-13 22:01:04.749
M20662_3056	Macaroni & Cheese	Tender corkscrew pasta in a cheesy cheddar sauce with a buttery Parmesan crumb topping	Entrées	2024-05-13 22:01:33.018	2024-05-13 22:01:33.018
M9955_3056	Calabacitas	Sauteed zucchini, corn, red and green peppers, onion and garlic	Sides	2024-05-13 22:02:40.32	2024-05-13 22:02:40.32
M19833_3056	Cavatappi Alfredo	Cavatappi pasta tossed in creamy Alfredo sauce	Entrées	2024-05-13 22:01:21.067	2024-05-13 22:01:21.067
M11563_3056	Cilantro Lime Rice	Long grain white rice with lime and cilantro	Sides	2024-05-13 22:01:05.052	2024-05-13 22:01:05.052
M36652_3056	Cuban Split Pea Soup (6  fl oz)	Split peas cooked in broth with potatoes,  tomato, Chorizo, ham, cumin, salt, pepper, thyme and bay leaves	Soups	2024-05-13 22:01:53.285	2024-05-13 22:01:53.285
M14301_3056	American Cheese	Sliced American cheese	Protein	2024-05-13 21:21:39.823	2024-05-13 21:21:39.823
M14278_3056	Diced Chicken	Seasoned diced chicken	Protein	2024-05-13 22:01:21.209	2024-05-13 22:01:21.209
M20047_3056	Hamburger Roll (1  each)	Soft split roll	Grains 	2024-05-13 21:21:39.834	2024-05-13 21:21:39.834
M41405_3056	Chili Chocolate Donut Bites	Chocolate donut spiced with chili powder, cinnamon and cayenne pepper	Breads	2024-05-13 22:02:14.385	2024-05-13 22:02:14.385
M14342_3056	Diced Pineapple	Fresh diced pineapple	Salads	2024-05-13 21:21:39.884	2024-05-13 21:21:39.884
M21398_3056	Grilled Ancho-Lime Chicken	Grilled ancho-lime marinated chicken thighs	Entrées	2024-05-13 22:01:31.041	2024-05-13 22:01:31.041
M41549_3056	Mashed Potatoes	Mashed potatoes	Sides	2024-05-13 22:02:45.39	2024-05-13 22:02:45.39
M19593_3056	Chocolate Mousse Parfait	Moist devil's food cake cubes topped with creamy chocolate yogurt mousse and chocolate chips	Desserts	2024-05-13 22:02:38.33	2024-05-13 22:02:38.33
M14535_3056	Bean Sprouts	Bean sprouts	Salads	2024-05-13 22:02:38.392	2024-05-13 22:02:38.392
A1058_3056	Southwest  Shrimp Tacos	Southwest shrimp   tacos topped avocado crema	Entrées	2024-05-13 22:02:38.58	2024-05-13 22:02:38.58
M40931_3056	Vegan Jambalaya	Flavorful vegan jambalaya with vegetables and cayenne pepper over red beans and rice	Entrées	2024-05-13 22:02:38.205	2024-05-13 22:02:38.205
M40319_3056	Country Fried Steak with Gravy	Crispy breaded beef steak topped with creamy country style gravy	Entrées	2024-05-13 22:02:37.526	2024-05-13 22:02:37.526
M40798_3314	Chile Verde Chicken Drumstick	Baked chicken drumstick in a jalapeno, tomatillo, green chile pepper, Tabasco® and cumin sauce	Entrées	2024-05-13 22:02:42.265	2024-05-13 22:02:42.265
M40924_3056	Chickpea Panchmael (1  serving)	Chickpeas, onion, pepper, zucchini and mushroom in spicy ginger-curry tomato sauce served over rice	Entrées	2024-05-13 22:02:39.821	2024-05-13 22:02:39.821
M39674_3056	Vietnamese Pork & Noodle Salad	Roast pork on a bed of rice noodles tossed with fresh vegetables, cilantro, mint and spicy-sweet dressing	Entrées	2024-05-19 00:00:45.696	2024-05-19 00:00:45.696
M4318_3314	Puerco Comino	Boneless pork oven-braised with bacon in orange and lime juices seasoned with cumin and oregano	Entrées	2024-05-13 22:02:43.753	2024-05-13 22:02:43.753
M14364_3314	Hard-Cooked Egg (1  each)	Peeled hard-cooked egg	Protein	2024-05-13 22:02:43.814	2024-05-13 22:02:43.814
A3068_3314	Sweet  Chili Pulled Pork	Pulled   pork marinated in sweet chili sauce	Entrées	2024-05-13 22:02:44.12	2024-05-13 22:02:44.12
L221951_3314	BAKED OATMEAL		Cereals	2024-05-13 22:02:42.018	2024-05-13 22:02:42.018
A1938_3314	Chilaquiles Rojos	Crispy tortilla chips topped with fire roasted salsa, chicken tinga, cilantro-lime crèma, queso & cilantro	Entrées	2024-05-13 22:02:42.079	2024-05-13 22:02:42.079
M21061_3056	Sweet & Spicy Chicken Stir-Fry	Chicken, pepper, onion, carrot and celery stir-fried with garlic, ginger, soy and crush red pepper	Entrées	2024-05-13 22:02:45.131	2024-05-13 22:02:45.131
A1146_3056	Chicken Gravy	Chicken gravy	Sauces	2024-05-13 22:02:45.377	2024-05-13 22:02:45.377
M32500_3314	Ham & Pickle Biscuit	Sliced ham, dill pickles and roasted red pepper pimento cheese on a fresh baked biscuit	Cold Sandwiches	2024-05-13 22:02:45.931	2024-05-13 22:02:45.931
M38102_3056	Chicken Shawarma Hummus Bowl	Chicken thighs & chickpea shawarma, roasted dukkah broccoli and beet slaw on hummus then topped with tahini, schug sauce and pita wedges	Entrées	2024-05-13 22:02:38.519	2024-05-13 22:02:38.519
M14195_3056	Chicken Cobb Mini Wrap	Grilled chicken, bacon, avocado, tomato, romaine and blue cheese dressing rolled in a flour tortilla	Cold Sandwiches	2024-05-13 22:01:33.074	2024-05-13 22:01:33.074
M32679_3056	Beef Burrito Bowl	Cilantro-lime brown rice topped with taco beef, charro beans, cheddar, lettuce and salsa verde	Entrées	2024-05-13 22:02:26.453	2024-05-13 22:02:26.453
M2351_3056	Oatmeal Raisin Cookie	Freshly baked chewy oatmeal cookie with raisins	Desserts	2024-05-13 21:21:39.822	2024-05-13 21:21:39.822
M20595_3056	Confetti Brown Rice	Seasoned brown rice with diced onion and bell peppers	Sides	2024-05-13 22:02:26.52	2024-05-13 22:02:26.52
M10076_3056	Vegetable Medley	Seasoned fresh broccoli, cauliflower and carrots sauteed with red onions	Sides	2024-05-13 21:21:39.796	2024-05-13 21:21:39.796
M12103_3056	Grilled BBQ Pork Chops	Tender pork chops rubbed with a special barbecue spice blend	Entrées	2024-05-19 00:00:45.203	2024-05-19 00:00:45.203
M14571_3056	Cucumbers	Sliced fresh cucumbers	Salads	2024-05-13 21:21:39.878	2024-05-13 21:21:39.878
M9665_3056	Sofrito Black Beans & Rice	Black beans and rice with sauteed bell pepper, onion, garlic and a flavorful vegetable sofrito	Sides	2024-05-13 22:02:49.042	2024-05-13 22:02:49.042
M20195_3056	Glazed Carrots	Steamed carrots tossed in a orange-brown sugar glaze	Sides	2024-05-13 22:02:40.32	2024-05-13 22:02:40.32
M14545_3056	Garbanzo Beans	Garbanzo beans	Salads	2024-05-13 21:21:39.884	2024-05-13 21:21:39.884
M21375_3056	General Tso's Chicken	Stir-fried chicken, carrot, broccoli, bell pepper, water chestnuts and onions in spicy-sweet  sauce	Entrées	2024-05-13 21:21:39.754	2024-05-13 21:21:39.754
M9636_3056	White Rice ( 1/2 cup)	Slow-simmered long grain white rice	Sides	2024-05-13 22:01:21.148	2024-05-13 22:01:21.148
M39262_3056	Chicken Noodle Soup (6  fl oz)	Sautéed carrots, celery and onion, with white meat chicken, wide egg noodles and chicken stock seasoned with thyme, bay leaf and black and white peppers	Soups	2024-05-13 22:01:53.291	2024-05-13 22:01:53.291
M34685_3056	Vegan Chicken Breast	Sliced vegan chicken breast	Protein	2024-05-13 22:02:37.805	2024-05-13 22:02:37.805
M39853_3056	Turkey & American Sandwich	Turkey, American, lettuce and tomato on white bread	Cold Sandwiches	2024-05-13 22:02:38.266	2024-05-13 22:02:38.266
M2194_3056	Lemon Cupcake	Freshly baked lemon cake with creamy lemon icing	Desserts	2024-05-13 22:02:38.33	2024-05-13 22:02:38.33
M34376_3056	Roasted Brussels Sprouts with Garlic	Fresh halved Brussels sprouts tossed with garlic and crushed red pepper, baked and sprinkled with Parmesan	Sides	2024-05-13 22:02:38.956	2024-05-13 22:02:38.956
A4385_3056	Tapioca Pearls	Tapioca pearls	Sides	2024-05-13 22:02:40.145	2024-05-13 22:02:40.145
M40463_3056	Onion, Jalapeno & Sausage Pizza	Caramelized onions, jalapenos, sausage, cheddar and pizza sauce	Pizza	2024-05-13 22:02:40.269	2024-05-13 22:02:40.269
M32306_3314	Gochujang Sauce	Korean hot pepper sauce made with gochujang paste, sesame   seeds and garlic	Sauces	2024-05-13 22:02:42.434	2024-05-13 22:02:42.434
M11539_3314	Scallion Mashed Potatoes	Mashed red potatoes with scallions	Sides	2024-05-13 22:02:42.497	2024-05-13 22:02:42.497
M15119_3314	Bombay Aloo	Potatoes, onions and tomatoes simmered in a spicy curry, cumin, green chiles and fresh ginger sauce	Sides	2024-05-13 22:02:44.258	2024-05-13 22:02:44.258
M9744_3314	Mashed Sweet Potatoes	Buttery mashed sweet potatoes	Sides	2024-05-13 22:02:44.32	2024-05-13 22:02:44.32
M14883_3314	Guacamole	Creamy avocado spread	Condiments	2024-05-13 22:02:42.041	2024-05-13 22:02:42.041
M36325_3314	Coconut Chia Pudding	Coconut chia pudding	Desserts	2024-05-13 22:02:45.981	2024-05-13 22:02:45.981
M14820_3314	Grilled Pork Satay	Spicy Thai-marinated pork skewers served on a bed of jasmine rice with red curry-peanut sauce	Entrées	2024-05-13 22:02:46.043	2024-05-13 22:02:46.043
M21356_3056	Gnocchi Rose	Potato gnocchi sauteed with tomato cream sauce and garlic topped with Parmesan and basil	Entrées	2024-05-13 22:02:38.204	2024-05-13 22:02:38.204
M34596_3314	Hearty Meat Sauce	Homemade sauce with ground beef, tomatoes, onion, bell peppers, garlic, basil and oregano	Sauces	2024-05-13 22:02:49.818	2024-05-13 22:02:49.818
M33856_3056	Pork Ramen	Ramen noodle bowl with roast pork loin, bok choy, carrots and drizzled with a spicy chili sauce	Entrées	2024-05-13 22:02:40.207	2024-05-13 22:02:40.207
M32249_3056	Jerk Chicken	Baked bone-in chicken coated with jerk seasoning	Entrées	2024-05-13 22:02:48.998	2024-05-13 22:02:48.998
A3043_3056	Chicken & Wild Rice Soup (6  fl oz)	Sautéed carrots, celery, onion, chicken stock, grilled chicken breast, wild and long grain rice, parsley, thyme, basil, tarragon	Soups	2024-05-13 22:02:43.073	2024-05-13 22:02:43.073
M19842_3056	Bow Ties	Fresh cooked al dente bow-tie pasta	Grains 	2024-05-13 22:01:04.793	2024-05-13 22:01:04.793
M21853_3056	Mint Chutney	Fresh mint, cilantro, jalapeno, lime, garlic and gingerroot	Condiments	2024-05-13 22:02:40.082	2024-05-13 22:02:40.082
M16589_3314	Kung Pao Tofu	Spicy stir-fry of tofu, onion, water chestnuts, carrots and peanuts in a chili garlic sauce	Entrées	2024-05-13 22:02:44.072	2024-05-13 22:02:44.072
M4585_3056	Salsa Guacamole	Spicy fresh salsa blended with guacamole	Condiments	2024-05-13 22:02:38.52	2024-05-13 22:02:38.52
A3040_3056	Southwest Black Bean Soup (6  fl oz)	Black beans, tomatoes, jalapenos, cilantro, cumin infused broth	Soups	2024-05-13 22:01:31.009	2024-05-13 22:01:31.009
M40418_3056	Pepperoni Pizza	Pepperoni, mozzarella and pizza sauce on a golden brown crust	Pizza	2024-05-13 22:00:59.767	2024-05-13 22:00:59.767
M34448_3056	Vegetable Soup (6  fl oz)	Green beans, corn, green cabbage, potatoes and tomatoes simmered in savory vegetable broth	Soups	2024-05-13 22:02:38.302	2024-05-13 22:02:38.302
M15674_3056	Roasted Chicken Breast	Oven-roasted chicken breast	Entrées	2024-05-13 22:02:37.556	2024-05-13 22:02:37.556
M20899_3056	Primavera Pizza	Sautéed squash, mushrooms, red onion and peppers, mozzarella and pizza sauce on a golden brown crust	Pizza	2024-05-13 22:02:37.569	2024-05-13 22:02:37.569
M19949_3056	Vegan Butternut Squash Risotto	Savory risotto made with roasted butternut squash, vegan chicken strips, almond milk, cranberries and almonds	Entrées	2024-05-13 22:02:38.208	2024-05-13 22:02:38.208
M3016_3056	Roasted Herbed Turkey Breast	Slow roasted boneless turkey breast rubbed with sage and thyme	Entrées	2024-05-13 22:02:38.917	2024-05-13 22:02:38.917
M33147_3056	Yellow Basmati Rice	Savory basmati rice cooked in vegetable broth with turmeric	Sides	2024-05-13 22:02:39.871	2024-05-13 22:02:39.871
M20924_3056	Vegan Brownie	Freshly baked vegan chocolate brownie	Desserts	2024-05-13 22:02:39.933	2024-05-13 22:02:39.933
A1143_3056	Chicken Andouille Jambalaya	Chicken thighs & sausage andouille simmered with vegetables, herbs & spices	Entrées	2024-05-13 22:02:40.194	2024-05-13 22:02:40.194
M37189_3314	Pumpkin Bread	Pumpkin Bread	Breads	2024-05-13 22:02:42.171	2024-05-13 22:02:42.171
M32304_3314	Kimchi	Kimchi-style cabbage, daikon and carrots flavored with fish sauce, gochujang, garlic and ginger	Condiments	2024-05-13 22:02:43.643	2024-05-13 22:02:43.643
M36069_3314	Buffalo Mac & Cheese Bowl	Creamy mac & cheese topped with chicken, drizzled with Buffalo sauce and ranch dressing, and finished with a crunchy potato chip topping	Entrées	2024-05-13 22:02:43.706	2024-05-13 22:02:43.706
M41010_3314	Roasted Mushrooms	Roasted mushrooms	Sides	2024-05-13 22:02:44.338	2024-05-13 22:02:44.338
M12961_3314	Chocolate Donut Bites	Freshly baked donut bites coated with cocoa and powdered sugar	Breads	2024-05-13 22:02:41.974	2024-05-13 22:02:41.974
M32573_3056	Cheeseburger	Beef burger with American cheese on  roll	Hot Sandwiches	2024-05-13 22:02:38.664	2024-05-13 22:02:38.664
M38765_3314	Creamy Cheese Polenta	Creamy cheese polenta	Sides	2024-05-13 22:02:46.219	2024-05-13 22:02:46.219
M9650_3056	Jasmine Rice	Thai long grain rice with aromatic, nutty flavor	Sides	2024-05-13 21:21:39.794	2024-05-13 21:21:39.794
M13641_3056	Chipotle Orange Chicken	Baked chicken seasoned with a Latin spice blend then tossed with smoky-sweet chipotle orange glaze	Entrées	2024-05-13 22:02:26.46	2024-05-13 22:02:26.46
M32349_3314	Beef Bibimbap	Korean rice bowl with seared beef strips, sesame spinach, kimchi, cucumber, fried egg and gochujang	Entrées	2024-05-13 22:02:42.241	2024-05-13 22:02:42.241
M41609_3056	Cilantro-Lime Crema	Sour cream mixed with fresh cilantro & lime	Condiments	2024-05-13 22:02:38.6	2024-05-13 22:02:38.6
M32832_3056	Pimento Cheese-Style Grits	Cheddar, cream cheese and roasted peppers folded into warm, creamy grits	Sides	2024-05-13 22:02:38.271	2024-05-13 22:02:38.271
M34479_3056	Chicken & Roasted Corn Chowder (6  fl oz)	A creamy thick and chunky chicken soup of roasted corn, bacon, potatoes, onions and garlic	Soups	2024-05-13 22:02:25.953	2024-05-13 22:02:25.953
M35712_3056	Grilled Cheese Sandwich	Grilled American cheese sandwich on  white bread	Hot Sandwiches	2024-05-13 21:21:39.763	2024-05-13 21:21:39.763
M34533_3056	Jalapeno-Mango Salsa	Fresh blend of mango, tomato, lime juice, jalapeno and cilantro	Condiments	2024-05-13 22:01:30.979	2024-05-13 22:01:30.979
M32205_3056	Ginger Garlic Broccoli	Broccoli florets tossed in olive oil, ginger, garlic, salt and pepper and oven roasted	Sides	2024-05-13 22:01:21.172	2024-05-13 22:01:21.172
M34358_3056	Seasoned Peas and Carrots	Steamed peas and carrots seasoned with salt	Sides	2024-05-13 22:02:39.882	2024-05-13 22:02:39.882
M40743_3056	Grilled Zucchini Squash	Grilled zucchini squash tossed with steak seasoning	Sides	2024-05-13 22:02:40.194	2024-05-13 22:02:40.194
M16572_3056	Chicken Teriyaki	Stir-fried chicken, broccoli, cabbage, carrot, celery and onion tossed with teriyaki sauce	Entrées	2024-05-13 22:02:40.256	2024-05-13 22:02:40.256
M19661_3314	Crispy Chicken Pepper Jack Slider	Crispy battered chicken, spicy pepper jack, lettuce and bacon mayonnaise on a mini kaiser roll	Hot Sandwiches 	2024-05-13 22:02:38.764	2024-05-13 22:02:38.764
M21855_3314	Beef Vindaloo	Beef cubes cooked with gingerroot, garlic, curry paste, tomato, red wine vinegar and coconut milk	Entrées	2024-05-13 22:02:42.242	2024-05-13 22:02:42.242
M39649_3314	Asian Flatbread	Peanut sauce, roasted peppers and onions, edamame, carrots, and scallions topped with mixed greens and sesame dressing	Pizza	2024-05-13 22:02:42.304	2024-05-13 22:02:42.304
M32830_3314	Texas Slaw	Shredded green cabbage, corn, peppers, jalapeno and cilantro tossed with spiced lime and vinegar	Salads	2024-05-13 22:02:42.433	2024-05-13 22:02:42.433
M33862_3314	Vegan Mac & Cheese	Elbow macaroni baked with creamy Daiya® dairy-free cheddar flavored sauce and bread crumbs	Entrées	2024-05-13 22:02:43.754	2024-05-13 22:02:43.754
M33519_3314	Chicken Tikka Masala	Chicken, tomato and onion simmered in a curry-spiced yogurt and coconut milk sauce	Entrées	2024-05-13 22:02:44.07	2024-05-13 22:02:44.07
M34750_3314	Tomato Dijon Pot Roast	Tender beef braised in a flavorful tomato Dijon sauce	Entrées	2024-05-13 22:02:44.132	2024-05-13 22:02:44.132
M19967_3314	Kale with Caramelized Onions	Fresh kale simmered with balsamic caramelized onions	Sides	2024-05-13 22:02:44.318	2024-05-13 22:02:44.318
M20846_3056	Hawaiian Pizza	Ham, pineapple and pizza sauce topped with mozzarella cheese	Pizza	2024-05-13 22:02:45.14	2024-05-13 22:02:45.14
M13972_3056	Rotini with Tomato Sauce	Spiral pasta tossed with tomato sauce, Parmesan and fresh basil	Sides	2024-05-13 22:02:37.587	2024-05-13 22:02:37.587
M9766_3056	Cheddar-Chive Mashed Potatoes	Mashed potatoes with Cheddar and chives	Sides	2024-05-13 22:02:42.88	2024-05-13 22:02:42.88
M21741_3056	Blackened Chicken	Char-grilled chicken seasoned with a peppery Cajun blend	Entrées	2024-05-13 22:02:38.205	2024-05-13 22:02:38.205
A2935_3056	Italian Sausage Risotto	Italian sausage with risotto, fennel, onion, peppers, parmesan cheese & herbs	Entrées	2024-05-19 00:00:44.118	2024-05-19 00:00:44.118
M21503_3056	Tortellini Alfredo	Cheese tortellini sauteed with Alfredo sauce and garlic, topped with Parmesan	Entrées	2024-05-13 22:01:33.018	2024-05-13 22:01:33.018
M19303_3056	Grilled Indian-Spiced Chicken	Grilled chicken breast seasoned with a blend of toasted cumin, cinnamon and turmeric	Entrées	2024-05-13 22:02:39.82	2024-05-13 22:02:39.82
M36634_3056	Chili Garlic Shrimp	Stir-fried shrimp, broccoli, cabbage, carrot and onion tossed with a spicy chili garlic sauce	Entrées	2024-05-13 22:02:25.874	2024-05-13 22:02:25.874
M39261_3056	Chicken Noodle Soup (6  fl oz)	A rich chicken broth with thick egg noodles, tender pieces of chicken, carrots and celery	Soups	2024-05-13 22:01:30.82	2024-05-13 22:01:30.82
M20187_3056	Spaghetti	Fresh cooked al dente spaghetti	Grains 	2024-05-13 22:02:26.584	2024-05-13 22:02:26.584
M1461_3056	Whipped Cream Cheese	Fluffy whipped cream cheese	Condiments	2024-05-13 21:21:36.855	2024-05-13 21:21:36.855
M36741_3314	Fried Chicken	Deep fried chicken	Entrées	2024-05-13 22:02:49.687	2024-05-13 22:02:49.687
M4595_3056	Spicy Tofu Vegetable Stir-Fry	Tofu sauteed in sesame oil blend with red and green peppers, red onion and chili garlic sauce	Entrées	2024-05-13 22:01:04.985	2024-05-13 22:01:04.985
M437_3056	Garlic Toast	Warm crusty baguette brushed with garlic-oregano oil	Breads	2024-05-13 22:02:37.619	2024-05-13 22:02:37.619
M40511_3056	Vegan Chicken Parmesan Sandwich	Vegan chicken tenders topped with tomato sauce, vegan mozzarella, Italian bread and toasted on a panini press	Hot Sandwiches	2024-05-13 22:02:37.806	2024-05-13 22:02:37.806
M179_3056	Vegetable Egg Roll	Crispy vegetable egg roll	Appetizers	2024-05-13 22:01:53.161	2024-05-13 22:01:53.161
M14330_3056	Devil's Food Cupcake with Strawberry	Freshly baked devil's food topped with vanilla icing and a strawberry half	Desserts	2024-05-13 22:02:38.329	2024-05-13 22:02:38.329
M41515_3056	Bread Pudding	Bread pudding made with fresh bananas, plant-based crème, raisins and topped with vanilla icing	Desserts	2024-05-13 22:02:38.582	2024-05-13 22:02:38.582
M41558_3056	Chocolate Chip Cookie	Chocolate Chip Cookie	Desserts	2024-05-13 21:21:40.536	2024-05-13 21:21:40.536
M18839_3314	Rotisserie Jerk Chicken	Roasted bone-in chicken rubbed with spicy jerk-style seasoning blend	Entrées	2024-05-13 22:02:42.293	2024-05-13 22:02:42.293
M40399_3314	Thai Red Curry	Sweet potatoes and green bean simmered in a vegan Thai red curry sauce, garam masala, coconut milk and aromatic vegetables	Entrées	2024-05-13 22:02:44.132	2024-05-13 22:02:44.132
M9619_3314	Basmati Rice	Indian long grain rice with fine texture and nutty flavor	Sides	2024-05-13 22:02:44.257	2024-05-13 22:02:44.257
M40029_3056	Tomato Basil Soup (6  fl oz)	Fresh pack tomatoes, tomato paste and tomato puree with sautéed garlic & onion, finished with touch of heavy cream and basil	Soups	2024-05-13 22:02:45.196	2024-05-13 22:02:45.196
M39651_3314	Margherita Flatbread	Shredded mozzarella, vine ripe tomato, basil pesto	Pizza	2024-05-13 22:02:46.069	2024-05-13 22:02:46.069
M19737-166513_3314	Cannellini Beans ( 1/4 cup)	White cannellini beans	Salads	2024-05-13 22:02:46.132	2024-05-13 22:02:46.132
M34442_3314	Moroccan Chickpea Soup (6  fl oz)	A hearty chickpea and vegetable soup flavored with toasted spices	Soups	2024-05-13 22:02:42.546	2024-05-13 22:02:42.546
M32582_3314	Italian Burger	Juicy beef burger, provolone and homemade tomato sauce	Hot Sandwiches 	2024-05-13 22:02:46.318	2024-05-13 22:02:46.318
M39263_3314	Chicken & Wild Rice Soup (6  fl oz)	Sautéed carrots, celery and onion simmered in chicken stock with grilled chicken breast, wild and long grain white rice, seasoned with parsley, thyme, basil & tarragon	Soups	2024-05-13 22:02:49.843	2024-05-13 22:02:49.843
M10053_3056	Italian Vegetable Blend	Steamed medley of zucchini, cauliflower, crinkled carrots, Romano beans and lima beans	Sides	2024-05-13 22:01:21.157	2024-05-13 22:01:21.157
M14095_3056	Szechuan Green Beans	Green beans tossed with spicy chili garlic sauce and toasted sesame seed	Sides	2024-05-13 21:21:40.341	2024-05-13 21:21:40.341
M4949_3056	Loaded Fish Tacos	Soft tacos with baked pollock, lettuce, cheese, tomato, and cilantro crema	Entrées	2024-05-13 22:01:30.788	2024-05-13 22:01:30.788
M41184_3056	Bulgogi Pork Sandwich	Gochujang marinated pork, chili sauce, pickled vegetables on toasted baguette	Hot Sandwiches	2024-05-19 00:00:45.412	2024-05-19 00:00:45.412
M3742_3056	Chicken with Marsala Sauce	Oven-roasted chicken breast served with a light Marsala wine sauce with mushrooms	Entrées	2024-05-19 00:00:46.28	2024-05-19 00:00:46.28
M15121_3056	Kadai Jhinga Masala	Sauteed curry shrimp with tomato, gingerroot, garlic, cumin, onion and bell peppers	Entrées	2024-05-13 22:02:39.795	2024-05-13 22:02:39.795
M19878_3056	Pork, Salami and Swiss Melt	Roasted pork loin, Genoa salami, deli ham, and melted Swiss on baguette	Hot Sandwiches	2024-05-13 22:02:39.857	2024-05-13 22:02:39.857
A2184_3056	Grilled Salmon with Wild Mushrooms	Char-grilled salmon with roasted wild mushrooms, cauliflower mash and black jack sauce with a crispy bacon topping	Entrées	2024-05-13 22:02:40.172	2024-05-13 22:02:40.172
M40078_3056	Chocolate Chip Cookie	Freshly baked chewy cookie with semisweet chocolate chips	Desserts	2024-05-13 21:21:39.949	2024-05-13 21:21:39.949
M32632_3314	Japanese Beef Chilled Noodle Salad	Cold noodles, beef, vegetables, egg and Asian vinaigrette, seasoned with Japanese spices	Entrées	2024-05-13 22:02:44.071	2024-05-13 22:02:44.071
M40934_3314	Roasted Autumn Vegetables	Fresh butternut squash, Brussels sprouts and cauliflower roasted with olive oil, salt and pepper	Sides	2024-05-13 22:02:44.321	2024-05-13 22:02:44.321
M34425_3314	Cream of Mushroom Soup (6  fl oz)	Homemade cream soup with fresh mushrooms, onion, garlic and herbs	Soups	2024-05-13 22:02:43.946	2024-05-13 22:02:43.946
M2194_3314	Lemon Cupcake	Freshly baked lemon cake with creamy lemon icing	Desserts	2024-05-13 22:02:45.99	2024-05-13 22:02:45.99
M40529_3314	Taco Bowl	Shredded lettuce & brown rice with taco beef, black beans, salsa, vegan cheese, jalapenos, avocado & vegan lime crema	Entrées	2024-05-13 22:02:42.303	2024-05-13 22:02:42.303
M34519_3056	Cream of Rice (6  fl oz)	Homestyle cream of rice cereal	Cereals	2024-05-13 21:21:36.609	2024-05-13 21:21:36.609
A435_3056	Ginger Soy Salmon Bowl	Ginger   soy marinated salmon served with edamame brown rice, kale, cucumber, cabbage,   avocado, served with carrot miso dressing and topped with scallions and   toasted sesame	Entrées	2024-05-13 22:02:40.107	2024-05-13 22:02:40.107
M40411_3314	Meat Lover's Pizza	Pepperoni, Italian sausage, Italian meatballs, mozzarella and pizza sauce on a golden brown crust	Pizza	2024-05-13 22:02:43.76	2024-05-13 22:02:43.76
M33727_3056	Chilaquiles Verde with Eggs	Mexican dish of fried tortilla chips mixed with green enchilada sauce, topped with fried egg, cheddar cheese and cilantro-lime crema	Entrées	2024-05-13 22:02:17.183	2024-05-13 22:02:17.183
M34997_3056	Sweet Potato Coconut Curry	Spinach, chickpeas and roasted sweet potato sauteed with coconut milk, ginger and spices	Entrées	2024-05-13 22:02:38.924	2024-05-13 22:02:38.924
M33003_3056	Veggie & Cheese Quiche-adilla	Baked mixture of egg, spinach, mushroom, tomato and cheddar cheese in a crispy tortilla shell	Entrées	2024-05-19 00:00:46.847	2024-05-19 00:00:46.847
M32256_3314	Hearty Mashed Potatoes	Hearty skin-on seasoned mashed potatoes	Sides	2024-05-13 22:02:49.839	2024-05-13 22:02:49.839
M21113_3056	Cuban Panini	Roasted pork, turkey, Swiss cheese and dill pickles on a whole grain flatbread with Dijon mustard	Hot Sandwiches	2024-05-13 22:02:26.511	2024-05-13 22:02:26.511
M9895_3056	Steamed Fresh Broccoli	Steamed fresh broccoli florets	Sides	2024-05-13 22:01:25.883	2024-05-13 22:01:25.883
M39525_3056	Salsa Verde	Tomatillos blended with cilantro, garlic, serrano pepper, onion & salt	Condiments	2024-05-13 22:01:26.042	2024-05-13 22:01:26.042
A1223_3056	BBQ Chicken Pizza	Grilled chicken & sautéed onions with Monterey jack cheese, mozzarella and Sweet Baby Ray's ® BBQ sauce	Pizza	2024-05-13 22:01:21.13	2024-05-13 22:01:21.13
M34477_3056	New England Clam Chowder (6  fl oz)	A thick creamy soup of clams, potatoes, bacon, onions, celery and herbs	Soups	2024-05-13 22:02:25.952	2024-05-13 22:02:25.952
M2984_3056	Grilled Chicken	Grilled seasoned boneless chicken thigh	Entrées	2024-05-13 22:01:21.323	2024-05-13 22:01:21.323
M10583_3056	Hash Brown Potato Patty	Crispy fried shredded potato patty	Sides	2024-05-13 21:21:36.733	2024-05-13 21:21:36.733
M21677_3056	Chicken Alfredo Noodle Bowl	Grilled chicken, broccoli, zucchini, peas and black olives tossed in a roasted tomato Alfredo sauce	Entrées	2024-05-13 22:02:39.808	2024-05-13 22:02:39.808
M14861-166386_3056	Couscous ( 1/4 cup)	Chilled cooked couscous	Breads	2024-05-13 22:02:40.115	2024-05-13 22:02:40.115
M32248_3314	Rotisserie-Style Chicken	Roasted bone-in chicken coated with rotisserie seasoning	Entrées	2024-05-13 22:02:44.119	2024-05-13 22:02:44.119
M32316_3314	Kimchi Fried Rice	Pan-fried brown rice with spicy kimchi, ginger, garlic and green onions	Sides	2024-05-13 22:02:42.495	2024-05-13 22:02:42.495
M40825_3314	Pozole Rojo	A rich, brothy stew of pork, hominy, and red chilies topped with shredded cabbage, radish, cilantro, lime, onion & avocado	Entrées	2024-05-13 22:02:43.751	2024-05-13 22:02:43.751
A81_3314	Fried Garlic Rice	Fried short-grain rice with sliced garlic	Sides	2024-05-13 22:02:44.303	2024-05-13 22:02:44.303
M9520_3314	Grilled Italian Sausage	Grilled sweet Italian sausage	Entrées	2024-05-13 22:02:46.04	2024-05-13 22:02:46.04
M39262_3314	Chicken Noodle Soup (6  fl oz)	Sautéed carrots, celery and onion, with white meat chicken, wide egg noodles and chicken stock seasoned with thyme, bay leaf and black and white peppers	Soups	2024-05-13 22:01:27.842	2024-05-13 22:01:27.842
M20174_3314	Turkey & Pepper Jack Panini	Turkey, pepper jack and tomato with black bean and roasted corn salsa  on a whole grain flatbread	Hot Sandwiches 	2024-05-13 22:01:27.873	2024-05-13 22:01:27.873
M2340_3056	Crispy Cereal Bar	Crispy dessert bar with crisp rice cereal and marshmallows	Desserts	2024-05-15 00:00:12.019	2024-05-15 00:00:12.019
M1942_3056	Lemon Bar	Lemony-sweet dessert bar with a delicate shortbread crust	Desserts	2024-05-15 00:00:12.022	2024-05-15 00:00:12.022
M20174_3056	Turkey & Pepper Jack Panini	Turkey, pepper jack and tomato with black bean and roasted corn salsa  on a whole grain flatbread	Hot Sandwiches	2024-05-15 00:00:12.21	2024-05-15 00:00:12.21
M19874_3314	Fried Ravioli	Fried cheese ravioli with tomato sauce, Parmesan and fresh basil topped with Marinera	Entrées	2024-05-15 00:00:13.057	2024-05-15 00:00:13.057
M40358_3314	Tikka Masala Tofu	Baked tofu simmered in onions, garlic, tomato and coconut milk finished with a tikka curry sauce	Entrées	2024-05-13 22:02:49.711	2024-05-13 22:02:49.711
M38551_3056	Fried Garlic Yellow Rice	Yellow rice fried with garlic and scallions	Sides	2024-05-13 22:02:25.941	2024-05-13 22:02:25.941
M600_3056	Powdered Sugar Donut	Freshly baked donut coated with powdered sugar	Breads	2024-05-13 22:01:05.064	2024-05-13 22:01:05.064
M36753_3314	Loaded Philly Tots	Tater Tots loaded with Philly cheesesteak then topped with melted cheese & creamy burger sauce	Entrées	2024-05-13 22:02:55.368	2024-05-13 22:02:55.368
A1087_3056	BBQ Ranch Pizza	Pulled pork, hot peppers & sautéed onions with mozzarella cheese, alfredo sauce & a ranch drizzle	Pizza	2024-05-13 22:02:25.892	2024-05-13 22:02:25.892
M10588_3056	Pork Sausage Patty	Sizzling hot golden brown pork sausage patty	Sides	2024-05-13 22:01:18.539	2024-05-13 22:01:18.539
M7941_3314	Classic Grilled Cheese	American cheese melted in between slices of crisp white bread	Hot Sandwiches 	2024-05-13 21:21:37.737	2024-05-13 21:21:37.737
A3203_3056	Spicy Jackfruit Rice Bowl	Jasmine rice topped with shredded spicy jackfruit, refried beans, romaine lettuce, vegan cheddar cheese, pico de gallo & fresh radish	Entrées	2024-05-13 22:01:33.334	2024-05-13 22:01:33.334
M14647_3056	Turkey Sausage Patty	Sizzling hot golden brown turkey sausage patty	Sides	2024-05-13 22:01:05.052	2024-05-13 22:01:05.052
M32328_3056	Carrot Pineapple Mini Muffin	Freshly baked whole grain muffin with fresh carrot, pineapple and applesauce spiced with cinnamon	Breads	2024-05-13 21:21:36.776	2024-05-13 21:21:36.776
M14385_3056	Cinnamon Streusel Coffee Cake	Freshly baked coffee cake with streusel crumb topping	Breads	2024-05-13 22:02:17.256	2024-05-13 22:02:17.256
M34518_3056	Cream of Wheat (6  fl oz)	Homestyle cream of wheat cereal	Cereals	2024-05-13 22:00:53.155	2024-05-13 22:00:53.155
M35964_3056	Croissant (1  each)	Buttered croissant	Grains 	2024-05-13 22:00:53.235	2024-05-13 22:00:53.235
A4982_3056	Egg, Ham & CheeseEnglish Muffin	Egg patty, ham & cheddar cheese on an English muffin	Sandwiches	2024-05-13 21:21:36.878	2024-05-13 21:21:36.878
M859_3056	Scrambled Eggs	Freshly scrambled eggs	Entrées	2024-05-13 21:21:37.019	2024-05-13 21:21:37.019
M20596_3056	Sweet & Sour Meatballs	Beef meatballs sauteed with pineapple, bell peppers, onion and sweet & sour sauce	Entrées	2024-05-13 22:02:25.852	2024-05-13 22:02:25.852
M14598_3056	Honeydew Melon	Cubed honeydew melon	Salads	2024-05-13 21:21:36.837	2024-05-13 21:21:36.837
M21938_3056	Hamburger	Grilled quarter pound beef burger on a roll	Hot Sandwiches	2024-05-13 22:02:27.696	2024-05-13 22:02:27.696
M21284_3056	Pineapple Chunks	Fresh pineapple	Salads	2024-05-13 21:21:36.852	2024-05-13 21:21:36.852
M9734_3056	O'Brien Potatoes	Pan-fried seasoned diced potatoes and sauteed green and red peppers and onions	Sides	2024-05-13 22:01:00.048	2024-05-13 22:01:00.048
M15473_3056	Crispy Chicken Sandwich	Crispy breaded chicken and lettuce on a roll with mayonnaise	Hot Sandwiches	2024-05-13 22:02:27.697	2024-05-13 22:02:27.697
M15668_3056	Raisins	Seedless raisins	Salads	2024-05-13 21:21:36.854	2024-05-13 21:21:36.854
M9519_3056	Bacon	Crisp, lightly smoked bacon strips	Sides	2024-05-13 22:01:18.719	2024-05-13 22:01:18.719
M14638_3056	Red Grapes	Fresh red seedless grapes	Salads	2024-05-13 21:21:36.854	2024-05-13 21:21:36.854
M9786_3056	Crispy Shoestring French Fries	Thin-cut potatoes, deep-fried to golden brown	Sides	2024-05-13 21:21:39.772	2024-05-13 21:21:39.772
M398_3056	Blueberry Muffin	Freshly baked muffin filled with juicy blueberries	Breads	2024-05-13 22:00:53.218	2024-05-13 22:00:53.218
M41061_3056	Fried Garlic Yellow Rice	Yellow rice fried with garlic and scallions	Sides	2024-05-13 22:02:27.704	2024-05-13 22:02:27.704
M20403_3056	Cranberry Orange Scone	Freshly baked scone with fresh cranberries and orange zest drizzled with vanilla icing	Breads	2024-05-13 22:00:53.219	2024-05-13 22:00:53.219
M13850_3056	Nonfat Strawberry Yogurt	Creamy nonfat strawberry yogurt	Protein	2024-05-13 21:21:36.78	2024-05-13 21:21:36.78
M19054_3056	Bacon & Egg Pizza	Scrambled eggs, crispy bacon and American cheese on a garlic herb crust	Entrées	2024-05-13 22:00:53.155	2024-05-13 22:00:53.155
M21942_3056	Cheeseburger	Grilled quarter pound beef burger with American cheese	Hot Sandwiches	2024-05-13 22:02:27.705	2024-05-13 22:02:27.705
M33241_3056	Vegan Blueberry Banana Bread	Freshly-baked vegan banana bread with blueberries	Desserts	2024-05-13 22:00:53.22	2024-05-13 22:00:53.22
M21908_3056	Tofu-Potato Hash	Hearty tofu-potato hash with peppers and onions, served with salsa	Entrées	2024-05-13 22:00:53.156	2024-05-13 22:00:53.156
M34520_3056	Old Fashioned Oatmeal (6  fl oz)	Homestyle oatmeal cereal	Cereals	2024-05-13 21:21:36.609	2024-05-13 21:21:36.609
M14599_3056	Cantaloupe	Cubed fresh cantaloupe	Salads	2024-05-13 21:21:36.833	2024-05-13 21:21:36.833
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (title, image, restaurant_id, short_description, long_description, start, "end", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.menus (id, date, restaurant_id, start, "end", price, period, created_at, updated_at) FROM stdin;
331405/22/202449	2024-05-22	3314	2024-05-22 14:15:00	2024-05-22 18:00:00	13	breakfast	2024-05-13 22:01:23.452	2024-05-13 22:01:23.452
331405/13/2024107	2024-05-13	3314	2024-05-13 23:30:00	2024-05-14 03:00:00	13	dinner	2024-05-13 21:21:36.581	2024-05-13 21:21:36.581
305605/31/202449	2024-05-31	3056	2024-05-31 14:15:00	2024-05-31 18:00:00	13	breakfast	2024-05-19 00:00:35.98	2024-05-19 00:00:35.98
305605/13/202449	2024-05-13	3056	2024-05-13 14:15:00	2024-05-13 18:00:00	13	breakfast	2024-05-13 21:21:34.835	2024-05-13 21:21:34.835
305605/13/2024106	2024-05-13	3056	2024-05-13 18:00:00	2024-05-13 21:30:00	13	lunch	2024-05-13 21:21:36.548	2024-05-13 21:21:36.548
331405/24/2024108	2024-05-24	3314	2024-05-24 03:00:00	2024-05-24 06:00:00	13	latenight	2024-05-13 22:01:21.066	2024-05-13 22:01:21.066
305605/29/202449	2024-05-29	3056	2024-05-29 14:15:00	2024-05-29 18:00:00	13	breakfast	2024-05-19 00:00:50.703	2024-05-19 00:00:50.703
331405/19/20242651	2024-05-19	3314	2024-05-19 18:00:00	2024-05-19 23:30:00	13	brunch	2024-05-13 22:01:22.649	2024-05-13 22:01:22.649
305605/13/2024107	2024-05-13	3056	2024-05-13 23:30:00	2024-05-14 03:00:00	13	dinner	2024-05-13 21:21:36.092	2024-05-13 21:21:36.092
331405/14/2024106	2024-05-14	3314	2024-05-14 18:00:00	2024-05-14 21:30:00	13	lunch	2024-05-13 22:00:59.068	2024-05-13 22:00:59.068
305605/14/2024108	2024-05-14	3056	2024-05-14 03:00:00	2024-05-14 06:00:00	13	latenight	2024-05-13 21:21:34.807	2024-05-13 21:21:34.807
331405/19/2024107	2024-05-19	3314	2024-05-19 23:30:00	2024-05-20 03:00:00	13	dinner	2024-05-13 22:01:24.265	2024-05-13 22:01:24.265
331405/14/2024108	2024-05-14	3314	2024-05-14 03:00:00	2024-05-14 06:00:00	13	latenight	2024-05-13 21:21:34.84	2024-05-13 21:21:34.84
331405/15/2024107	2024-05-15	3314	2024-05-15 23:30:00	2024-05-16 03:00:00	13	dinner	2024-05-13 22:00:57.195	2024-05-13 22:00:57.195
331405/24/2024106	2024-05-24	3314	2024-05-24 18:00:00	2024-05-24 21:30:00	13	lunch	2024-05-13 22:01:13.925	2024-05-13 22:01:13.925
331405/13/202449	2024-05-13	3314	2024-05-13 14:15:00	2024-05-13 18:00:00	13	breakfast	2024-05-13 21:21:36.583	2024-05-13 21:21:36.583
331405/24/202449	2024-05-24	3314	2024-05-24 14:15:00	2024-05-24 18:00:00	13	breakfast	2024-05-13 22:01:10.787	2024-05-13 22:01:10.787
331405/13/2024106	2024-05-13	3314	2024-05-13 18:00:00	2024-05-13 21:30:00	13	lunch	2024-05-13 21:21:34.869	2024-05-13 21:21:34.869
331405/14/2024107	2024-05-14	3314	2024-05-14 23:30:00	2024-05-15 03:00:00	13	dinner	2024-05-13 22:00:59.28	2024-05-13 22:00:59.28
331405/20/202449	2024-05-20	3314	2024-05-20 14:15:00	2024-05-20 18:00:00	13	breakfast	2024-05-13 22:01:11.314	2024-05-13 22:01:11.314
331405/20/2024106	2024-05-20	3314	2024-05-20 18:00:00	2024-05-20 21:30:00	13	lunch	2024-05-13 22:01:25.586	2024-05-13 22:01:25.586
305605/15/2024108	2024-05-15	3056	2024-05-15 03:00:00	2024-05-15 06:00:00	13	latenight	2024-05-13 22:00:55.995	2024-05-13 22:00:55.995
331405/21/202449	2024-05-21	3314	2024-05-21 14:15:00	2024-05-21 18:00:00	13	breakfast	2024-05-13 22:00:59.031	2024-05-13 22:00:59.031
331405/22/2024108	2024-05-22	3314	2024-05-22 03:00:00	2024-05-22 06:00:00	13	latenight	2024-05-13 22:00:57.64	2024-05-13 22:00:57.64
331405/21/2024107	2024-05-21	3314	2024-05-21 23:30:00	2024-05-22 03:00:00	13	dinner	2024-05-13 22:00:59.073	2024-05-13 22:00:59.073
331405/21/2024106	2024-05-21	3314	2024-05-21 18:00:00	2024-05-21 21:30:00	13	lunch	2024-05-13 22:00:59.278	2024-05-13 22:00:59.278
305605/18/202449	2024-05-18	3056	2024-05-18 16:00:00	2024-05-18 18:00:00	13	breakfast	2024-05-13 22:00:53.894	2024-05-13 22:00:53.894
331405/26/20242651	2024-05-26	3314	2024-05-26 18:00:00	2024-05-26 23:30:00	13	brunch	2024-05-13 22:01:04.02	2024-05-13 22:01:04.02
331405/17/202449	2024-05-17	3314	2024-05-17 14:15:00	2024-05-17 18:00:00	13	breakfast	2024-05-13 22:01:17.358	2024-05-13 22:01:17.358
331405/25/20242651	2024-05-25	3314	2024-05-25 18:00:00	2024-05-25 23:30:00	13	brunch	2024-05-13 22:01:17.377	2024-05-13 22:01:17.377
331405/25/2024107	2024-05-25	3314	2024-05-25 23:30:00	2024-05-26 03:00:00	13	dinner	2024-05-13 22:01:17.562	2024-05-13 22:01:17.562
305605/18/20242651	2024-05-18	3056	2024-05-18 18:00:00	2024-05-18 23:30:00	13	brunch	2024-05-13 22:00:53.892	2024-05-13 22:00:53.892
331405/17/2024106	2024-05-17	3314	2024-05-17 18:00:00	2024-05-17 21:30:00	13	lunch	2024-05-13 22:01:17.542	2024-05-13 22:01:17.542
305605/15/202449	2024-05-15	3056	2024-05-15 14:15:00	2024-05-15 18:00:00	13	breakfast	2024-05-13 22:01:17.36	2024-05-13 22:01:17.36
331405/26/2024107	2024-05-26	3314	2024-05-26 23:30:00	2024-05-27 03:00:00	13	dinner	2024-05-13 22:01:24.301	2024-05-13 22:01:24.301
305605/17/2024106	2024-05-17	3056	2024-05-17 18:00:00	2024-05-17 21:30:00	13	lunch	2024-05-13 22:01:03.729	2024-05-13 22:01:03.729
331405/26/202449	2024-05-26	3314	2024-05-26 16:00:00	2024-05-26 18:00:00	13	breakfast	2024-05-13 22:01:23.455	2024-05-13 22:01:23.455
331405/18/20242651	2024-05-18	3314	2024-05-18 18:00:00	2024-05-18 23:30:00	13	brunch	2024-05-13 22:01:17.565	2024-05-13 22:01:17.565
305605/14/2024106	2024-05-14	3056	2024-05-14 18:00:00	2024-05-14 21:30:00	13	lunch	2024-05-13 22:00:54.534	2024-05-13 22:00:54.534
305605/14/2024107	2024-05-14	3056	2024-05-14 23:30:00	2024-05-15 03:00:00	13	dinner	2024-05-13 22:00:55.997	2024-05-13 22:00:55.997
331405/14/202449	2024-05-14	3314	2024-05-14 14:15:00	2024-05-14 18:00:00	13	breakfast	2024-05-13 22:00:57.95	2024-05-13 22:00:57.95
331405/15/2024108	2024-05-15	3314	2024-05-15 03:00:00	2024-05-15 06:00:00	13	latenight	2024-05-13 22:00:54.374	2024-05-13 22:00:54.374
305605/15/2024106	2024-05-15	3056	2024-05-15 18:00:00	2024-05-15 21:30:00	13	lunch	2024-05-13 22:01:23.455	2024-05-13 22:01:23.455
331405/17/2024107	2024-05-17	3314	2024-05-17 23:30:00	2024-05-18 03:00:00	13	dinner	2024-05-13 22:01:04.118	2024-05-13 22:01:04.118
305605/15/2024107	2024-05-15	3056	2024-05-15 23:30:00	2024-05-16 03:00:00	13	dinner	2024-05-13 22:01:17.355	2024-05-13 22:01:17.355
305605/17/2024107	2024-05-17	3056	2024-05-17 23:30:00	2024-05-18 03:00:00	13	dinner	2024-05-13 22:01:04.056	2024-05-13 22:01:04.056
331405/15/202449	2024-05-15	3314	2024-05-15 14:15:00	2024-05-15 18:00:00	13	breakfast	2024-05-13 22:00:54.535	2024-05-13 22:00:54.535
331405/15/2024106	2024-05-15	3314	2024-05-15 18:00:00	2024-05-15 21:30:00	13	lunch	2024-05-13 22:00:57.962	2024-05-13 22:00:57.962
305605/17/202449	2024-05-17	3056	2024-05-17 14:15:00	2024-05-17 18:00:00	13	breakfast	2024-05-13 22:01:11.267	2024-05-13 22:01:11.267
331405/17/2024108	2024-05-17	3314	2024-05-17 03:00:00	2024-05-17 06:00:00	13	latenight	2024-05-13 22:01:23.465	2024-05-13 22:01:23.465
305605/16/2024108	2024-05-16	3056	2024-05-17 03:00:00	2024-05-17 06:00:00	13	latenight	2024-05-13 22:01:17.541	2024-05-13 22:01:17.541
305605/18/2024107	2024-05-18	3056	2024-05-18 23:30:00	2024-05-19 03:00:00	13	dinner	2024-05-13 22:00:54.353	2024-05-13 22:00:54.353
331405/18/202449	2024-05-18	3314	2024-05-18 16:00:00	2024-05-18 18:00:00	13	breakfast	2024-05-13 22:00:59.351	2024-05-13 22:00:59.351
305605/28/2024107	2024-05-28	3056	2024-05-28 23:30:00	2024-05-29 03:00:00	13	dinner	2024-05-19 00:00:39.73	2024-05-19 00:00:39.73
305605/30/2024106	2024-05-30	3056	2024-05-30 18:00:00	2024-05-30 21:30:00	13	lunch	2024-05-19 00:00:49.37	2024-05-19 00:00:49.37
305605/30/2024107	2024-05-30	3056	2024-05-30 23:30:00	2024-05-31 03:00:00	13	dinner	2024-05-19 00:00:50.702	2024-05-19 00:00:50.702
305605/29/2024107	2024-05-29	3056	2024-05-29 23:30:00	2024-05-30 03:00:00	13	dinner	2024-05-19 00:00:51.514	2024-05-19 00:00:51.514
305605/30/2024108	2024-05-30	3056	2024-05-30 03:00:00	2024-05-30 06:00:00	13	latenight	2024-05-19 00:00:53.165	2024-05-19 00:00:53.165
305605/23/2024107	2024-05-23	3056	2024-05-23 23:30:00	2024-05-24 03:00:00	13	dinner	2024-05-13 22:01:24.303	2024-05-13 22:01:24.303
331405/23/2024106	2024-05-23	3314	2024-05-23 18:00:00	2024-05-23 21:30:00	13	lunch	2024-05-13 22:01:26.19	2024-05-13 22:01:26.19
305605/24/2024107	2024-05-24	3056	2024-05-24 23:30:00	2024-05-25 03:00:00	13	dinner	2024-05-13 22:01:24.374	2024-05-13 22:01:24.374
305605/31/2024107	2024-05-31	3056	2024-05-31 23:30:00	2024-06-01 03:00:00	13	dinner	2024-05-19 00:00:41.431	2024-05-19 00:00:41.431
305605/17/2024108	2024-05-17	3056	2024-05-17 03:00:00	2024-05-17 06:00:00	13	latenight	2024-05-13 22:01:24.397	2024-05-13 22:01:24.397
305605/16/2024107	2024-05-16	3056	2024-05-16 23:30:00	2024-05-17 03:00:00	13	dinner	2024-05-13 22:01:28.954	2024-05-13 22:01:28.954
331405/21/2024108	2024-05-21	3314	2024-05-21 03:00:00	2024-05-21 06:00:00	13	latenight	2024-05-13 22:01:24.418	2024-05-13 22:01:24.418
331405/22/2024107	2024-05-22	3314	2024-05-22 23:30:00	2024-05-23 03:00:00	13	dinner	2024-05-13 22:01:24.316	2024-05-13 22:01:24.316
331405/22/2024106	2024-05-22	3314	2024-05-22 18:00:00	2024-05-22 21:30:00	13	lunch	2024-05-13 22:01:24.328	2024-05-13 22:01:24.328
331405/25/202449	2024-05-25	3314	2024-05-25 16:00:00	2024-05-25 18:00:00	13	breakfast	2024-05-13 22:01:24.395	2024-05-13 22:01:24.395
305605/30/202449	2024-05-30	3056	2024-05-30 14:15:00	2024-05-30 18:00:00	13	breakfast	2024-05-19 00:00:48.082	2024-05-19 00:00:48.082
305606/01/202449	2024-06-01	3056	2024-06-01 16:00:00	2024-06-01 18:00:00	13	breakfast	2024-05-19 00:00:41.584	2024-05-19 00:00:41.584
331405/24/2024107	2024-05-24	3314	2024-05-24 23:30:00	2024-05-25 03:00:00	13	dinner	2024-05-13 22:01:24.333	2024-05-13 22:01:24.333
305605/31/2024106	2024-05-31	3056	2024-05-31 18:00:00	2024-05-31 21:30:00	13	lunch	2024-05-19 00:00:44.447	2024-05-19 00:00:44.447
305605/16/2024106	2024-05-16	3056	2024-05-16 18:00:00	2024-05-16 21:30:00	13	lunch	2024-05-13 22:01:25.301	2024-05-13 22:01:25.301
331405/20/2024107	2024-05-20	3314	2024-05-20 23:30:00	2024-05-21 03:00:00	13	dinner	2024-05-13 22:01:25.586	2024-05-13 22:01:25.586
305605/22/2024106	2024-05-22	3056	2024-05-22 18:00:00	2024-05-22 21:30:00	13	lunch	2024-05-13 22:01:24.395	2024-05-13 22:01:24.395
305605/22/2024107	2024-05-22	3056	2024-05-22 23:30:00	2024-05-23 03:00:00	13	dinner	2024-05-13 22:01:24.74	2024-05-13 22:01:24.74
305606/01/2024107	2024-06-01	3056	2024-06-01 23:30:00	2024-06-02 03:00:00	13	dinner	2024-05-19 00:00:44.892	2024-05-19 00:00:44.892
305605/26/2024107	2024-05-26	3056	2024-05-26 23:30:00	2024-05-27 03:00:00	13	dinner	2024-05-13 22:01:25.604	2024-05-13 22:01:25.604
305605/19/2024107	2024-05-19	3056	2024-05-19 23:30:00	2024-05-20 03:00:00	13	dinner	2024-05-13 22:01:24.436	2024-05-13 22:01:24.436
305606/01/20242651	2024-06-01	3056	2024-06-01 18:00:00	2024-06-01 23:30:00	13	brunch	2024-05-19 00:00:48.134	2024-05-19 00:00:48.134
305605/29/2024106	2024-05-29	3056	2024-05-29 18:00:00	2024-05-29 21:30:00	13	lunch	2024-05-19 00:00:51.234	2024-05-19 00:00:51.234
305605/23/2024106	2024-05-23	3056	2024-05-23 18:00:00	2024-05-23 21:30:00	13	lunch	2024-05-13 22:01:24.739	2024-05-13 22:01:24.739
331405/23/2024107	2024-05-23	3314	2024-05-23 23:30:00	2024-05-24 03:00:00	13	dinner	2024-05-13 22:01:25.301	2024-05-13 22:01:25.301
331405/23/202449	2024-05-23	3314	2024-05-23 14:15:00	2024-05-23 18:00:00	13	breakfast	2024-05-13 22:01:25.291	2024-05-13 22:01:25.291
305605/14/202449	2024-05-14	3056	2024-05-14 14:15:00	2024-05-14 18:00:00	13	breakfast	2024-05-13 22:00:55.976	2024-05-13 22:00:55.976
331405/16/2024106	2024-05-16	3314	2024-05-16 18:00:00	2024-05-16 21:30:00	13	lunch	2024-05-13 22:00:59.386	2024-05-13 22:00:59.386
331405/16/2024107	2024-05-16	3314	2024-05-16 23:30:00	2024-05-17 03:00:00	13	dinner	2024-05-13 22:00:59.323	2024-05-13 22:00:59.323
305605/16/202449	2024-05-16	3056	2024-05-16 14:15:00	2024-05-16 18:00:00	13	breakfast	2024-05-13 22:01:17.101	2024-05-13 22:01:17.101
331405/16/202449	2024-05-16	3314	2024-05-16 14:15:00	2024-05-16 18:00:00	13	breakfast	2024-05-13 22:01:17.607	2024-05-13 22:01:17.607
331405/16/2024108	2024-05-16	3314	2024-05-17 03:00:00	2024-05-17 06:00:00	13	latenight	2024-05-13 22:00:56.634	2024-05-13 22:00:56.634
331405/18/2024107	2024-05-18	3314	2024-05-18 23:30:00	2024-05-19 03:00:00	13	dinner	2024-05-13 22:01:29.862	2024-05-13 22:01:29.862
305605/28/202449	2024-05-28	3056	2024-05-28 14:15:00	2024-05-28 18:00:00	13	breakfast	2024-05-19 00:00:25.828	2024-05-19 00:00:25.828
305605/24/2024106	2024-05-24	3056	2024-05-24 18:00:00	2024-05-24 21:30:00	13	lunch	2024-05-13 22:01:04.122	2024-05-13 22:01:04.122
305605/31/2024108	2024-05-31	3056	2024-05-31 03:00:00	2024-05-31 06:00:00	13	latenight	2024-05-19 00:00:48.14	2024-05-19 00:00:48.14
305605/25/2024107	2024-05-25	3056	2024-05-25 23:30:00	2024-05-26 03:00:00	13	dinner	2024-05-13 22:01:00.659	2024-05-13 22:01:00.659
305605/22/2024108	2024-05-22	3056	2024-05-22 03:00:00	2024-05-22 06:00:00	13	latenight	2024-05-13 22:00:55.976	2024-05-13 22:00:55.976
305605/24/2024108	2024-05-24	3056	2024-05-24 03:00:00	2024-05-24 06:00:00	13	latenight	2024-05-13 22:01:22.639	2024-05-13 22:01:22.639
305605/19/20242651	2024-05-19	3056	2024-05-19 18:00:00	2024-05-19 23:30:00	13	brunch	2024-05-13 22:01:18.208	2024-05-13 22:01:18.208
331405/19/202449	2024-05-19	3314	2024-05-19 16:00:00	2024-05-19 18:00:00	13	breakfast	2024-05-13 22:01:03.404	2024-05-13 22:01:03.404
305605/25/202449	2024-05-25	3056	2024-05-25 16:00:00	2024-05-25 18:00:00	13	breakfast	2024-05-13 22:00:57.943	2024-05-13 22:00:57.943
305605/26/20242651	2024-05-26	3056	2024-05-26 18:00:00	2024-05-26 23:30:00	13	brunch	2024-05-13 22:01:22.591	2024-05-13 22:01:22.591
305605/28/2024108	2024-05-28	3056	2024-05-28 03:00:00	2024-05-28 06:00:00	13	latenight	2024-05-19 00:00:24.226	2024-05-19 00:00:24.226
305605/26/202449	2024-05-26	3056	2024-05-26 16:00:00	2024-05-26 18:00:00	13	breakfast	2024-05-13 22:00:56.259	2024-05-13 22:00:56.259
305605/27/202449	2024-05-27	3056	2024-05-27 14:15:00	2024-05-27 18:00:00	13	breakfast	2024-05-19 00:00:24.227	2024-05-19 00:00:24.227
305605/27/2024106	2024-05-27	3056	2024-05-27 18:00:00	2024-05-27 21:30:00	13	lunch	2024-05-19 00:00:25.082	2024-05-19 00:00:25.082
305605/27/2024107	2024-05-27	3056	2024-05-27 23:30:00	2024-05-28 03:00:00	13	dinner	2024-05-19 00:00:25.103	2024-05-19 00:00:25.103
305605/25/20242651	2024-05-25	3056	2024-05-25 18:00:00	2024-05-25 23:30:00	13	brunch	2024-05-13 22:00:59.382	2024-05-13 22:00:59.382
305605/29/2024108	2024-05-29	3056	2024-05-29 03:00:00	2024-05-29 06:00:00	13	latenight	2024-05-19 00:00:25.7	2024-05-19 00:00:25.7
305605/28/2024106	2024-05-28	3056	2024-05-28 18:00:00	2024-05-28 21:30:00	13	lunch	2024-05-19 00:00:31.41	2024-05-19 00:00:31.41
305605/19/202449	2024-05-19	3056	2024-05-19 16:00:00	2024-05-19 18:00:00	13	breakfast	2024-05-13 22:00:54.356	2024-05-13 22:00:54.356
305605/20/2024107	2024-05-20	3056	2024-05-20 23:30:00	2024-05-21 03:00:00	13	dinner	2024-05-13 22:01:17.567	2024-05-13 22:01:17.567
305605/21/2024108	2024-05-21	3056	2024-05-21 03:00:00	2024-05-21 06:00:00	13	latenight	2024-05-13 22:01:18.203	2024-05-13 22:01:18.203
305605/20/2024106	2024-05-20	3056	2024-05-20 18:00:00	2024-05-20 21:30:00	13	lunch	2024-05-13 22:01:17.581	2024-05-13 22:01:17.581
305605/20/202449	2024-05-20	3056	2024-05-20 14:15:00	2024-05-20 18:00:00	13	breakfast	2024-05-13 22:00:55.974	2024-05-13 22:00:55.974
305605/21/202449	2024-05-21	3056	2024-05-21 14:15:00	2024-05-21 18:00:00	13	breakfast	2024-05-13 22:00:51.558	2024-05-13 22:00:51.558
305605/21/2024107	2024-05-21	3056	2024-05-21 23:30:00	2024-05-22 03:00:00	13	dinner	2024-05-13 22:00:59.224	2024-05-13 22:00:59.224
305605/21/2024106	2024-05-21	3056	2024-05-21 18:00:00	2024-05-21 21:30:00	13	lunch	2024-05-13 22:00:59.286	2024-05-13 22:00:59.286
331405/23/2024108	2024-05-23	3314	2024-05-23 03:00:00	2024-05-23 06:00:00	13	latenight	2024-05-13 22:01:36.568	2024-05-13 22:01:36.568
305605/23/2024108	2024-05-23	3056	2024-05-23 03:00:00	2024-05-23 06:00:00	13	latenight	2024-05-13 22:01:03.834	2024-05-13 22:01:03.834
305605/22/202449	2024-05-22	3056	2024-05-22 14:15:00	2024-05-22 18:00:00	13	breakfast	2024-05-13 22:01:10.76	2024-05-13 22:01:10.76
305605/23/202449	2024-05-23	3056	2024-05-23 14:15:00	2024-05-23 18:00:00	13	breakfast	2024-05-13 22:01:11.936	2024-05-13 22:01:11.936
305605/24/202449	2024-05-24	3056	2024-05-24 14:15:00	2024-05-24 18:00:00	13	breakfast	2024-05-13 22:01:03.716	2024-05-13 22:01:03.716
\.


--
-- Data for Name: nutrition_info; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.nutrition_info (dish_id, serving_size, serving_unit, calories, calories_from_fat, total_fat_g, trans_fat_g, saturated_fat_g, cholesterol_mg, sodium_mg, total_carbs_g, dietary_fiber_g, sugars_mg, protein_g, vitamin_a_iu, vitamin_c_iu, calcium_mg, iron_mg, created_at, updated_at) FROM stdin;
M14344_3314	1	each	5	0	0	0	0	0	570	less than 1	0	0	0	0.00	2.16	31.50	0.20	2024-05-13 21:21:41.804	2024-05-13 21:21:41.804
M19952_3314	1	piece	300	170	19	0	2	0	410	27	1	0	5	0.39	0.23	17.00	1.76	2024-05-13 22:02:51.221	2024-05-13 22:02:51.221
M21681_3314	1	serving	350	180	20	0	5	15	300	34	3	3	9	57.75	6.49	49.79	2.24	2024-05-24 00:00:16.311	2024-05-24 00:00:16.311
A41_3314	1	serving	930	190	21	0	3	0	1450	151	5	16	35	370.54	75.52		11.59	2024-05-13 22:03:28.865	2024-05-13 22:03:28.865
A5762_3056	2	each	410	200	22	0	4.5	60	740	36	2	2	15	\N	19.77	0.00	3.10	2024-05-13 22:03:35.499	2024-05-13 22:03:35.499
A1221_3314	1	each	420	120	22	0	8	30	1020	41	2	3	16	73.20	5.22		3.06	2024-05-13 22:03:37.17	2024-05-13 22:03:37.17
M32303_3314	1	serving	480	110	13	0	2.5	55	610	72	4	15	21	\N	19.18	0.00	8.42	2024-05-13 21:21:41.85	2024-05-13 21:21:41.85
M34484_3056	6	fl oz	230	110	12	0.5	4.5	55	310	11	2	2	18	22.55	2.07	40.89	2.89	2024-05-13 22:03:37.755	2024-05-13 22:03:37.755
M508_3056	1	each	1000	80	13	0	3.5	10	1960	188	7	8	35	32.32	0.11	12.98	12.24	2024-05-19 00:01:19.894	2024-05-19 00:01:19.894
M40802_3314	8	fl oz	280	70	8	0	1.5	40	430	29	6	7	23	34.62	11.91	98.99	14.98	2024-05-13 22:02:41.525	2024-05-13 22:02:41.525
M40917_3056	1/2	cup	70	20	2.5	0	0	0	170	9	2	1	3	9.82	4.07	19.33	1.28	2024-05-19 00:01:20.088	2024-05-19 00:01:20.088
M9849_3314	3 1/4	ozw	190	100	11	0	1.5	0	190	23	1	7	1	1448.32	6.47	26.93	0.41	2024-05-13 22:03:06.091	2024-05-13 22:03:06.091
M34048_3056	1	cup	180	5	10	0	8	0	310	18	4	7	4	220.99	44.69	85.36	20.07	2024-05-17 00:00:18.227	2024-05-17 00:00:18.227
M34431_3056	6	fl oz	150	25	2.5	0	0	0	290	23	8	4	9	57.90	1.38	26.95	1.36	2024-05-19 00:01:19.832	2024-05-19 00:01:19.832
M4100_3314	1	serving	400	70	9	0	3	35	640	60	7	10	22	1.26	0.00	82.82	4.28	2024-05-18 00:00:12.253	2024-05-18 00:00:12.253
M36069_3056	1	serving	600	220	29	0	13	105	1150	57	4	8	29	185.23	1.25	377.47	2.37	2024-05-13 21:21:41.159	2024-05-13 21:21:41.159
M35634_3314	1	slice	200	40	4.5	0	1	0	270	35	1	12	5	13.67	0.24	94.10	2.06	2024-05-13 22:02:47.937	2024-05-13 22:02:47.937
M21341_3056	1/8	cut	340	110	12	0	4	50	530	38	2	5	22	69.13	0.97	162.50	2.14	2024-05-19 00:01:27.129	2024-05-19 00:01:27.129
M2361_3056	1/2	cup	140	25	3	0	1	15	105	28	2	14	3	42.95	3.31	63.02	0.95	2024-05-19 00:01:27.251	2024-05-19 00:01:27.251
M40400_3056	1	serving	500	25	25	0	19	0	690	63	7	13	7	1076.91	42.15	81.87	2.71	2024-05-19 00:01:27.435	2024-05-19 00:01:27.435
A2815_3056	1	sandwich	510	140	44	0.5	18	75	1370	44	3	4	22	138.66	1.72		3.70	2024-05-19 00:01:27.496	2024-05-19 00:01:27.496
M10521_3314	1/2	cup	15	0	0	0	0	0	10	3	2	less than 1	2	17.35	25.35	17.59	0.36	2024-05-18 00:00:20.301	2024-05-18 00:00:20.301
M32657_3314	1	serving	400	70	9	0	3	40	640	60	7	10	22	1.29	0.00	80.59	4.37	2024-05-13 21:21:41.366	2024-05-13 21:21:41.366
M32743_3314	3/4	cup	290	60	12	0	4	40	990	35	4	7	10	17.09	17.97	156.76	2.50	2024-05-23 00:00:18.105	2024-05-23 00:00:18.105
M40911_3056	1	serving	180	35	4	0	0.5	85	400	6	1	3	27	13.84	8.07	23.08	0.99	2024-05-13 22:03:28.554	2024-05-13 22:03:28.554
L366315_3314	1	each	440	220	24	0	15	120	330	49	2	19	6	\N	0.32	\N	1.52	2024-05-20 22:46:22.631	2024-05-20 22:46:22.631
M40987_3314	1	serving	360	110	14	0	3	85	690	36	4	4	22	\N	42.52	0.00	2.83	2024-05-13 21:21:41.804	2024-05-13 21:21:41.804
M39850_3314	1	each	290	60	8	0	3.5	50	1090	34	4	8	25	117.14	9.07	199.48	1.59	2024-05-22 00:00:16.645	2024-05-22 00:00:16.645
M2182_3056	1/2	cup	210	50	6	0	2	0	95	40	2	21	2	\N	3.09	0.00	1.00	2024-05-20 22:46:22.934	2024-05-20 22:46:22.934
M40818_3314	1	serving	240	100	12	0	4	70	520	7	1	3	26	4.48	3.24	21.22	2.76	2024-05-20 00:00:10.676	2024-05-20 00:00:10.676
M40905_3314	1/2	cup	160	70	7	0	1	0	240	22	3	3	2	8.55	10.62	20.90	1.59	2024-05-13 22:02:46.497	2024-05-13 22:02:46.497
M32323_3056	1	muffin	90	20	2	0	1	0	120	16	0	9	1	0.12	2.81	2.18	0.36	2024-05-19 00:01:31.457	2024-05-19 00:01:31.457
M19647_3314	1/2	cup	120	15	1.5	0	0	0	210	23	2	0	4	2.07	0.55	12.98	0.53	2024-05-20 22:46:25.798	2024-05-20 22:46:25.798
M32981_3314	1/2	sandwich	210	90	10	0	1.5	25	270	20	4	2	12	41.65	4.86	46.79	1.40	2024-05-20 22:46:25.487	2024-05-20 22:46:25.487
M20403_3314	1	each	140	5	5	0	3	0	260	21	less than 1	6	2	0.42	2.47	39.40	1.01	2024-05-22 00:00:10.962	2024-05-22 00:00:10.962
M35269_3314	4	ozw	270	130	15	0.5	6	100	450	11	less than 1	2	22	39.72	1.45	146.88	2.60	2024-05-22 00:00:14.382	2024-05-22 00:00:14.382
M20114_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.928	2024-05-13 21:21:41.928
M21921_3314	1	serving	240	70	8	0	1	0	620	37	5	5	7	114.46	51.93	77.59	2.35	2024-05-22 00:00:16.725	2024-05-22 00:00:16.725
M33537_3056	1/2	cup	170	10	1.5	0	0	0	65	37	1	18	3	60.20	2.46	189.41	1.00	2024-05-19 00:01:38.916	2024-05-19 00:01:38.916
M10503_3314	1	wedge	0	0	0	0	0	0	0	less than 1	0	0	0	0.08	4.01	1.97	0.05	2024-05-13 22:03:29.07	2024-05-13 22:03:29.07
M14979_3056	1	cup	360	110	13	0	4	20	950	48	5	7	16	85.73	14.27	131.49	2.31	2024-05-13 21:21:43.29	2024-05-13 21:21:43.29
M2340_3056	1/64	cut	160	45	5	0	2	0	90	27	0	11	1	75.61	0.01	2.54	4.01	2024-05-15 00:00:14.412	2024-05-15 00:00:14.412
M34422_3314	6	fl oz	180	100	12	0	6	20	330	12	1	4	8	159.21	13.40	196.30	0.60	2024-05-13 22:03:29.681	2024-05-13 22:03:29.681
M33367_3056	1/2	cup	150	0	2	0	1	25	420	27	2	less than 1	6	0.00	0.15	45.44	1.34	2024-05-13 22:03:29.931	2024-05-13 22:03:29.931
L322479_3056	1	each	270	110	12	0	5	220	550	25	less than 1	2	15	\N	0.01	\N	2.36	2024-05-13 21:21:41.364	2024-05-13 21:21:41.364
M40468_3314	1/8	cut	300	110	12	0	5	25	660	34	2	3	14	69.21	2.20	212.59	2.37	2024-05-13 21:21:41.882	2024-05-13 21:21:41.882
M21926_3314	1	serving	340	70	7	0	1	0	210	58	5	26	11	118.76	63.73	97.59	2.16	2024-05-13 22:03:29.494	2024-05-13 22:03:29.494
A1275_3314	1/2	cup	110	0	6	0	2	15	350	8	2	4	6	5.57	40.97		0.50	2024-05-13 22:03:24.224	2024-05-13 22:03:24.224
M20943_3056	1	cup	270	45	7	0	1	20	350	42	2	3	12	126.94	4.29	113.18	2.92	2024-05-13 22:03:06.402	2024-05-13 22:03:06.402
M32597_3056	1	serving	520	100	11	0	1.5	170	1270	78	5	10	29	361.89	55.05	162.21	6.60	2024-05-13 22:03:30.18	2024-05-13 22:03:30.18
M21276_3056	3/4	cup	300	90	11	0	3	55	770	37	2	3	15	8.87	0.68	105.69	1.53	2024-05-13 21:21:41.157	2024-05-13 21:21:41.157
M34844_3314	3	ozw	150	35	4	0	1	85	55	0	0	0	26	10.71	0.69	9.92	0.43	2024-05-13 21:21:41.875	2024-05-13 21:21:41.875
M32355_3056	1	serving	580	300	33	0	6	110	800	41	3	12	30	77.80	11.02	49.06	2.63	2024-05-13 22:03:37.669	2024-05-13 22:03:37.669
A5808_3314	1	each	500	150	18	0	6	90	1190	48	5	8	32	12.21	36.75		4.77	2024-05-13 21:21:41.999	2024-05-13 21:21:41.999
M34360_3314	1/2	cup	80	60	6	0	0.5	0	130	5	3	2	2	1.34	49.76	21.16	0.58	2024-05-13 21:21:42.005	2024-05-13 21:21:42.005
M19998_3314	1/2	cup	130	10	1	0	0	0	140	26	2	1	4	1.54	5.75	49.91	1.80	2024-05-13 21:21:42.015	2024-05-13 21:21:42.015
M20110_3314	1/4	cup	60	5	1	0	0	0	65	11	0	0	2	\N	\N	\N	\N	2024-05-13 22:03:24.037	2024-05-13 22:03:24.037
M21372_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:23.912	2024-05-13 22:03:23.912
M33729_3056	1	serving	320	140	16	0	5	220	420	30	3	3	15	194.43	20.43	195.67	2.75	2024-05-13 22:03:22.298	2024-05-13 22:03:22.298
L227710_3314	8	fl oz	80	5	0.5	0	0	0	90	18	5	5	4	\N	23.13	\N	1.45	2024-05-13 21:21:42.031	2024-05-13 21:21:42.031
L100755_3314	6	each	1030	230	25	0	13	300	1640	151	9	9	52	\N	14.67	\N	7.57	2024-05-13 21:21:41.849	2024-05-13 21:21:41.849
M34579_3314	4	fl oz	100	25	2.5	0	0.5	15	170	11	2	2	8	98.38	4.25	22.06	0.85	2024-05-13 21:21:41.866	2024-05-13 21:21:41.866
M19926_3314	4	fl oz	130	30	3.5	0	0	0	50	23	3	3	4	102.08	42.63	25.46	0.78	2024-05-13 21:21:41.876	2024-05-13 21:21:41.876
M40808_3314	6	fl oz	100	25	3	0	0	0	310	15	3	3	4	95.30	5.14	30.89	1.37	2024-05-13 21:21:42.031	2024-05-13 21:21:42.031
M20170_3314	1/2	sandwich	210	70	11	0	3.5	15	540	21	2	2	7	146.43	3.54	149.55	1.64	2024-05-13 22:03:28.817	2024-05-13 22:03:28.817
M19952_3056	1	piece	370	170	19	0	2	0	580	41	2	0	7	0.44	0.23	17.00	2.61	2024-05-13 22:03:04.034	2024-05-13 22:03:04.034
M39531_3314	4	each	360	110	21	0	3.5	35	830	32	2	2	12	7.30	4.56	33.34	1.38	2024-05-13 22:03:28.88	2024-05-13 22:03:28.88
M20658_3056	1	serving	260	200	22	0	4.5	50	690	2	less than 1	1	13	4.68	0.83	50.25	0.62	2024-05-19 00:01:18.835	2024-05-19 00:01:18.835
M21424_3056	1	serving	430	200	23	0	7	60	780	34	2	10	16	82.09	6.18	140.60	1.11	2024-05-13 22:02:52.545	2024-05-13 22:02:52.545
M41200_3314	1	each	430	50	20	0	9	95	510	43	3	3	20	99.42	16.73	109.91	3.39	2024-05-13 22:03:05.942	2024-05-13 22:03:05.942
M40785_3314	3	ozw	150	70	2.5	0	0	65	270	3	0	3	28	21.07	0.02	10.21	1.22	2024-05-13 22:03:05.943	2024-05-13 22:03:05.943
M34474_3314	6	fl oz	140	60	7	0	2.5	less than 5	320	19	2	3	3	92.56	7.25	35.54	0.61	2024-05-13 22:03:06.091	2024-05-13 22:03:06.091
M34592_3314	2	fl oz	50	30	3.5	0	0	0	60	4	less than 1	2	1	18.33	6.55	10.51	0.46	2024-05-22 00:00:14.605	2024-05-22 00:00:14.605
M11411_3314	1	each	160	60	7	0	1	50	250	0	0	0	22	38.10	0.02	13.36	0.44	2024-05-22 00:00:16.7	2024-05-22 00:00:16.7
M40906_3314	1	serving	240	110	13	0	2.5	75	450	8	1	less than 1	22	34.26	9.48	47.40	2.05	2024-05-23 00:00:18.124	2024-05-23 00:00:18.124
M38830_3056	1	serving	690	110	34	0	12	155	2110	44	2	2	53	39.93	1.31	436.08	3.56	2024-05-18 00:00:17.949	2024-05-18 00:00:17.949
M33769_3314	1/2	cup	60	5	0.5	0	0	0	50	13	6	4	4	96.70	92.60	68.16	1.13	2024-05-13 22:03:04.889	2024-05-13 22:03:04.889
M17308_3056	1	serving	260	35	4	0	1	45	570	42	2	2	13	153.40	11.60	36.64	0.87	2024-05-13 22:02:29.414	2024-05-13 22:02:29.414
M9958_3314	1/2	cup	90	5	4.5	0	1.5	10	360	7	4	1	6	261.63	38.03	154.47	0.70	2024-05-13 22:02:46.525	2024-05-13 22:02:46.525
M38232_3056	1	each	160	25	4	0	0	0	360	22	5	3	6	1.98	1.68	35.96	1.74	2024-05-19 00:01:36.396	2024-05-19 00:01:36.396
M20987_3314	1	each	640	190	27	0	11	70	1240	77	3	7	21	141.71	9.93	408.11	1.26	2024-05-13 22:02:35.574	2024-05-13 22:02:35.574
M40998_3056	1	each	260	5	4	0	0	0	115	39	7	6	15	4.95	1.91	11.00	3.42	2024-05-19 00:01:20.019	2024-05-19 00:01:20.019
M40443_3056	1/8	cut	350	140	17	0	6	35	670	35	2	2	16	70.01	2.23	210.19	2.34	2024-05-13 22:01:39.281	2024-05-13 22:01:39.281
M36641_3056	1/2	cup	80	45	5	0	0.5	0	150	8	2	3	1	85.07	18.40	16.02	0.45	2024-05-19 00:01:20.153	2024-05-19 00:01:20.153
M33409_3056	1/2	cup	170	90	11	0	1	0	410	3	0	less than 1	17	0.05	0.13	40.69	1.80	2024-05-13 21:21:44.1	2024-05-13 21:21:44.1
M39656_3056	1	each	230	110	13	0	3.5	10	370	22	5	10	9	207.03	49.48	230.49	2.19	2024-05-19 00:01:19.831	2024-05-19 00:01:19.831
A212_3314	1	serving	610	140	20	0	6	130	730	74	8	12	34	\N	22.66	0.00	4.15	2024-05-19 00:00:15.041	2024-05-19 00:00:15.041
M21053_3056	1	serving	210	20	2	0	0	0	410	38	8	10	12	1057.47	24.85	95.49	3.18	2024-05-13 22:03:06.402	2024-05-13 22:03:06.402
M32588_3314	1/2	cup	140		9	0	3	340	130	0	0	0	12	\N	\N	51.45	2.00	2024-05-13 22:03:02.931	2024-05-13 22:03:02.931
M41021_3056	4	fl oz	120	40	4.5	0	1	35	170	6	1	3	13	14.68	12.88	26.43	0.97	2024-05-13 22:03:28.564	2024-05-13 22:03:28.564
M16488_3056	3	ozw	15	0	0	0	0	0	0	3	1	2	1	60.20	13.87	19.35	0.40	2024-05-13 22:03:06.464	2024-05-13 22:03:06.464
A4290_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:27.457	2024-05-19 00:01:27.457
M34419_3314	1/2	cup	110	10	1	0	0	0	0	22	less than 1	0	2	0.00	0.03	5.61	0.22	2024-05-13 22:02:48.532	2024-05-13 22:02:48.532
A714_3056	1	serving	320	90	14	0	4.5	60	890	28	1	4	20	148.87	2.36		3.26	2024-05-13 22:03:06.714	2024-05-13 22:03:06.714
M9751_3314	1/2	cup	130	0	3.5	0	2	10	125	21	2	2	3	30.27	14.84	17.66	0.93	2024-05-13 22:02:48.595	2024-05-13 22:02:48.595
A2944_3314	1	each	50		2	0	0	0	120	3	less than 1	0	5	\N	\N		0.63	2024-05-13 22:02:48.153	2024-05-13 22:02:48.153
M6479_3314	1/2	cup	140	110	13	0	2	5	135	6	2	4	1	45.10	28.77	27.62	0.43	2024-05-13 22:02:48.216	2024-05-13 22:02:48.216
M20433_3056	1	each	230	60	6	0	2	65	95	19	0	19	24	1.51	0.23	21.39	1.07	2024-05-13 22:03:00.778	2024-05-13 22:03:00.778
M34865_3314	1/2	cup	90	40	4	0	0	0	330	7	3	0	8	5.28	11.23	95.99	1.65	2024-05-13 22:03:24.221	2024-05-13 22:03:24.221
M36809_3056	12	fl oz	310	170	16	0	11	45	120	33	0	30	7	39.14	0.00	245.04	0.03	2024-05-19 00:01:27.271	2024-05-19 00:01:27.271
M9894_3314	1/2	cup	20	0	0	0	0	0	70	4	2	less than 1	1	41.50	34.96	22.08	0.37	2024-05-13 22:02:54.228	2024-05-13 22:02:54.228
A3028_3056	1	fl oz	10	0	1	0	0	0	0	0	0	0	0	0.00	0.00		0.00	2024-05-13 22:03:22.487	2024-05-13 22:03:22.487
A3576_3056	1	serving	480	190	20	0	4	250	770	55	3	9	22	395.87	7.52		3.28	2024-05-13 22:02:50.388	2024-05-13 22:02:50.388
A721_3056	1	cup	370	150	19	0	10	85	380	31	3	4	20	147.71	9.11		7.04	2024-05-13 22:03:30.226	2024-05-13 22:03:30.226
M5768_3314	1/2	cup	120	90	10	0	1.5	0	260	12	less than 1	less than 1	1	0.00	0.00	6.81	0.18	2024-05-13 22:03:20.284	2024-05-13 22:03:20.284
M41017_3314	2	fl oz	15	0	0	0	0	0	40	3	0	2	1	18.62	17.72	24.78	8.26	2024-05-13 22:02:53.983	2024-05-13 22:02:53.983
M861_3314	1	slice	150	25	2.5	0	1	50	270	27	0	6	6	28.25	0.03	64.52	2.04	2024-05-13 22:02:47.937	2024-05-13 22:02:47.937
M40547_3056	1	each	470	270	30	0	7	130	1200	12	3	5	39	100.97	33.61	65.80	2.69	2024-05-13 22:03:35.427	2024-05-13 22:03:35.427
M40913_3314	1	each	150	40	4.5	0	1	85	55	0	0	0	26	13.24	0.35	6.25	0.44	2024-05-20 22:46:23.686	2024-05-20 22:46:23.686
M40484_3056	1/8	cut	350	80	9	0	3.5	20	730	53	2	4	16	78.44	11.76	210.78	3.49	2024-05-13 22:02:45.578	2024-05-13 22:02:45.578
M20104_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:51.378	2024-05-13 22:02:51.378
M41514_3056	1	serving	870	520	60	0	11	200	970	36	5	16	46	76.10	29.11	76.33	4.10	2024-05-19 00:01:27.518	2024-05-19 00:01:27.518
L81261_3314	1	each	220	100	11	0	7	60	180	26	less than 1	9	3	\N	0.30	\N	0.57	2024-05-20 22:46:22.634	2024-05-20 22:46:22.634
M3411_3314	1	cup	270	45	5	0	0.5	0	470	51	3	12	6	195.84	29.52	64.12	0.97	2024-05-13 22:02:41.53	2024-05-13 22:02:41.53
M34515_3314	2	each	240	50	6	0	0.5	0	240	41	2	11	6	0.00	0.00	211.24	2.22	2024-05-13 22:03:21.261	2024-05-13 22:03:21.261
M33279_3314	1	serving	170	50	6	0	2	0	10	27	2	17	2	0.39	1.42	14.50	0.48	2024-05-13 22:02:48.343	2024-05-13 22:02:48.343
M21748_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:06.527	2024-05-13 22:03:06.527
M32651_3056	1	serving	300	150	17	0.5	6	65	390	14	1	3	22	69.96	2.77	68.18	2.94	2024-05-19 00:01:37.601	2024-05-19 00:01:37.601
M14257_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:24.095	2024-05-13 22:03:24.095
M16592_3056	1/2	cup	130	35	7	0	1	0	730	11	2	6	7	70.20	13.82	49.64	1.11	2024-05-13 22:02:12.659	2024-05-13 22:02:12.659
M21890_3056	1/2	cup	80	0	0	0	0	0	350	15	4	1	5	0.21	1.38	41.93	1.29	2024-05-20 22:46:24.138	2024-05-20 22:46:24.138
M40710_3314	1	each	70	25	3	0	0	0	10	11	1	0	1	\N	0.00	9.38	0.26	2024-05-13 22:02:48.406	2024-05-13 22:02:48.406
A1076_3314	2	piece	450	230	26	0	6	110	270	19	less than 1	less than 1	34	6.32	0.19		2.50	2024-05-13 22:03:29.449	2024-05-13 22:03:29.449
M41494_3056	1	serving	850	25	64	0	41	300	310	58	3	24	8	183.63	42.08	65.95	2.27	2024-05-19 00:01:39.106	2024-05-19 00:01:39.106
M33510_3314	1/2	cup	180	35	4	0	0.5	40	470	21	2	16	14	168.11	15.22	22.97	0.74	2024-05-20 00:00:10.688	2024-05-20 00:00:10.688
L341668_3314	8	fl oz	90	25	3	0	0	0	270	13	2	4	2	\N	12.01	\N	7.23	2024-05-20 22:46:25.83	2024-05-20 22:46:25.83
M39640_3056	4	fl oz	60	0	0.5	0	0	0	30	14	1	11	0	27.26	15.78	88.08	0.34	2024-05-13 22:03:22.522	2024-05-13 22:03:22.522
M1942_3056	1/48	cut	330	80	9	0	3.5	55	200	60	less than 1	41	3	\N	0.00	0.00	1.49	2024-05-15 00:00:14.415	2024-05-15 00:00:14.415
M2340_3314	1/64	cut	160	45	5	0	2	0	90	27	0	11	1	75.61	0.01	2.54	4.01	2024-05-13 22:02:54.044	2024-05-13 22:02:54.044
M20174_3056	1	each	280	90	10	0	3.5	35	910	32	3	4	18	\N	9.46	0.00	2.07	2024-05-15 00:00:14.601	2024-05-15 00:00:14.601
M41604_3314	1	serving	610	320	37	0	6	85	1140	54	5	10	18	41.96	33.02		2.81	2024-05-13 22:02:55.153	2024-05-13 22:02:55.153
M16559_3056	1/2	cup	180	30	3.5	0	0	0	480	31	less than 1	2	6	59.48	3.63	31.90	2.50	2024-05-19 00:01:36.397	2024-05-19 00:01:36.397
M15073_3314	1/2	cup	20	0	0	0	0	0	10	4	1	2	1	174.61	6.58	20.18	0.31	2024-05-13 22:03:24.214	2024-05-13 22:03:24.214
M34434_3056	6	fl oz	60	10	1.5	0	0	0	290	11	2	2	3	65.56	10.99	19.37	0.94	2024-05-19 00:01:27.212	2024-05-19 00:01:27.212
M32878_3314	2	piece	480	320	35	0	8	125	780	2	0	1	36	73.43	0.05	25.62	1.92	2024-05-13 22:03:05.937	2024-05-13 22:03:05.937
M32660_3314	1/2	cup	160	25	6	0	2.5	20	160	18	less than 1	2	9	11.61	4.59	45.43	1.61	2024-05-13 22:02:46.505	2024-05-13 22:02:46.505
M32739_3056	3/4	cup	320	90	13	0	5	40	1010	38	3	4	12	38.81	3.91	122.46	1.87	2024-05-13 22:03:35.108	2024-05-13 22:03:35.108
M9497_3314	1	fl oz	15	0	0	0	0	0	25	1	0	less than 1	2	0.36	0.23	25.33	0.05	2024-05-20 00:00:11.456	2024-05-20 00:00:11.456
M32657_3056	1	serving	400	70	9	0	3	40	640	60	7	8	22	1.29	0.00	80.59	4.37	2024-05-13 22:03:03.973	2024-05-13 22:03:03.973
M41604_3056	1	serving	610	320	37	0	6	85	1140	54	5	10	18	41.96	33.02		2.81	2024-05-13 22:03:04.25	2024-05-13 22:03:04.25
M19891_3314	1	cup	340	120	15	0	3.5	60	630	36	3	4	16	37.67	14.21	84.25	3.07	2024-05-22 00:00:16.724	2024-05-22 00:00:16.724
M35731_3314	1	cup	220	60	6	0	2.5	25	310	30	3	6	12	214.53	15.27	131.47	12.44	2024-05-13 22:02:43.133	2024-05-13 22:02:43.133
M19924_3056	1	serving	170	35	8	0	3	30	310	19	1	2	7	21.00	5.09	114.77	1.21	2024-05-13 22:02:50.154	2024-05-13 22:02:50.154
M20719_3314	1	cup	210	30	4	0	0.5	50	300	33	3	2	13	40.85	11.45	67.88	1.61	2024-05-13 22:02:51.316	2024-05-13 22:02:51.316
A1950_3056	2	each	240	50	7	0	2	25	440	31	4	4	11	30.95	17.45		1.66	2024-05-19 00:01:36.716	2024-05-19 00:01:36.716
M40459_3056	1/8	cut	370	100	11	0	4.5	25	780	51	2	3	17	67.55	2.16	213.85	3.55	2024-05-13 22:02:52.295	2024-05-13 22:02:52.295
M19303_3314	1	each	160	45	5	0	1	85	50	0	0	0	26	10.31	0.02	8.49	0.62	2024-05-23 00:00:18.13	2024-05-23 00:00:18.13
M40715_3056	1/2	cup	330	180	20	0	2.5	0	260	28	6	less than 1	10	0.90	3.09	91.45	3.29	2024-05-19 00:01:19.957	2024-05-19 00:01:19.957
M32711_3056	1	roll	110	30	3.5	0	1.5	less than 5	130	17	0	9	1	0.00	0.00	1.13	0.39	2024-05-13 22:02:28.496	2024-05-13 22:02:28.496
M9519_3314	2	slice	130		10	0	3.5	25	400	less than 1	0	less than 1	8	0.62	0.00	9.53	0.45	2024-05-13 22:02:12.596	2024-05-13 22:02:12.596
M34522_3056	2	fl oz	20	0	0	0	0	0	220	4	1	less than 1	1	77.45	14.92	27.73	0.69	2024-05-19 00:01:20.022	2024-05-19 00:01:20.022
M10090_3314	1/2	cup	100	50	6	0	0.5	0	115	11	2	4	2	285.80	12.87	43.07	0.60	2024-05-22 00:00:14.618	2024-05-22 00:00:14.618
M35575_3056	1	serving	530	170	19	0	3.5	0	420	65	11	4	27	78.50	24.53	165.95	6.28	2024-05-13 22:03:22.322	2024-05-13 22:03:22.322
L341952_3314	12	fl oz	110	0	0	0	0	0	10	29	2	23	1	\N	93.64	\N	0.42	2024-05-13 21:21:44.414	2024-05-13 21:21:44.414
M16738_3314	1	roll	220	90	10	1	4	10	250	28	less than 1	15	3	\N	0.00	1.33	0.73	2024-05-20 22:46:22.682	2024-05-20 22:46:22.682
M36308_3056	1	each	60	20	2	0	0	0	0	12	less than 1	5	0	\N	4.28	3.14	0.23	2024-05-19 00:01:20.089	2024-05-19 00:01:20.089
M34487_3056	6	fl oz	180	60	6	0	2.5	30	300	17	5	3	14	33.09	10.79	46.47	3.10	2024-05-19 00:01:19.832	2024-05-19 00:01:19.832
M39901_3056	1	sandwich	510	25	27	0	4.5	35	1170	48	2	5	21	11.82	0.61	156.32	2.53	2024-05-19 00:01:22.573	2024-05-19 00:01:22.573
M3863_3056	1/2	cup	100	0	1.5	0	0	30	10	18	less than 1	less than 1	4	0.00	0.00	14.89	0.88	2024-05-19 00:01:37.6	2024-05-19 00:01:37.6
M37127_3056	1	each	120	110	6	0	0	25	180	8	0	0	8	1.47	0.00	8.03	0.29	2024-05-19 00:01:27.087	2024-05-19 00:01:27.087
M18810_3056	1	each	570	160	24	0	7	35	1360	67	6	8	24	33.78	2.40	143.14	3.92	2024-05-13 22:03:30.554	2024-05-13 22:03:30.554
M19848_3056	2	tablespoons	35	15	1.5	0	0.5	10	15	1	0	less than 1	3	\N	\N	\N	\N	2024-05-13 22:03:00.991	2024-05-13 22:03:00.991
M35425_3056	1	each	280	35	6	0	1.5	35	680	38	1	6	19	70.81	11.76	54.71	3.12	2024-05-13 22:03:06.439	2024-05-13 22:03:06.439
M32316_3056	1/2	cup	100	45	5	0	0.5	0	115	13	1	less than 1	2	29.74	7.80	19.14	0.38	2024-05-13 22:02:12.688	2024-05-13 22:02:12.688
M32253_3056	1	each	380	0	32	0	9	150	200	1	0	less than 1	22	\N	0.17	17.14	0.92	2024-05-19 00:01:38.79	2024-05-19 00:01:38.79
M40920_3314	1/2	cup	130	10	1	0	0	0	140	26	2	1	4	1.54	5.75	49.91	1.80	2024-05-13 22:02:51.805	2024-05-13 22:02:51.805
M34755_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:06.684	2024-05-13 22:03:06.684
M1709_3056	1	each	170	15	5	0	3.5	0	160	29	less than 1	18	1	1.08	2.12	12.00	8.80	2024-05-19 00:01:38.917	2024-05-19 00:01:38.917
M40854_3314	1/2	cup	100	10	1.5	0	0	0	80	21	2	1	2	1.06	13.27	11.38	0.75	2024-05-19 00:00:17.255	2024-05-19 00:00:17.255
M21375_3314	1/2	cup	190	60	7	0	1.5	35	470	21	2	16	12	170.87	15.22	21.84	1.12	2024-05-13 22:03:29.452	2024-05-13 22:03:29.452
M10266_3314	1/2	cup	290	210	24	0	4	45	270	16	1	2	4	7.81	4.93	18.77	0.88	2024-05-13 22:03:29.577	2024-05-13 22:03:29.577
M40455_3314	1/8	cut	270	70	8	0	3.5	30	570	33	1	3	16	62.82	2.73	201.11	2.36	2024-05-13 22:02:55.175	2024-05-13 22:02:55.175
M2722_3314	3	ozw	200	80	9	0	2.5	75	80	0	0	0	27	0.85	0.09	23.94	1.12	2024-05-20 00:00:10.713	2024-05-20 00:00:10.713
M40046_3056	1	serving	500	280	31	1	11	55	1040	38	1	10	19	41.67	28.63	396.61	1.26	2024-05-19 00:01:39.106	2024-05-19 00:01:39.106
M10587_3056	2	link	110	60	7	0	1.5	45	330	less than 1	0	0	10	0.00	0.32	10.08	0.88	2024-05-13 21:21:41.24	2024-05-13 21:21:41.24
M34895_3314	3	ozw	190	80	9	0	3.5	75	140	0	0	0	25	0.01	0.00	16.83	1.66	2024-05-13 22:02:41.53	2024-05-13 22:02:41.53
M41104_3056	1	fl oz	60	25	4	0	1.5	0	55	3	0	less than 1	1	\N	0.46	0.00	0.17	2024-05-13 22:03:30.156	2024-05-13 22:03:30.156
M3863_3314	1/2	cup	100	0	1.5	0	0	30	10	18	less than 1	less than 1	4	0.00	0.00	14.89	0.88	2024-05-13 22:03:23.974	2024-05-13 22:03:23.974
M13499_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:54.197	2024-05-13 22:02:54.197
M8004_3314	1	each	370	160	16	0.5	7	70	480	31	less than 1	4	24	38.02	0.00	176.65	3.37	2024-05-13 22:02:54.258	2024-05-13 22:02:54.258
M10182_3056	1/2	cup	60	30	3.5	0	1.5	0	50	6	3	3	1	727.55	1.95	30.37	0.48	2024-05-13 22:02:29.473	2024-05-13 22:02:29.473
M33548_3314	4	fl oz	150	30	3.5	0	0	0	420	17	2	5	13	9.82	8.35	49.25	1.86	2024-05-13 22:03:37.376	2024-05-13 22:03:37.376
M19741_3314	4	wedge	90	20	2.5	0	0	0	90	17	2	less than 1	2	0.78	7.45	12.28	0.85	2024-05-13 22:02:41.656	2024-05-13 22:02:41.656
M10690_3314	3	ozw	20	0	0	0	0	0	10	3	2	1	2	41.25	6.35	18.97	0.75	2024-05-22 00:00:16.953	2024-05-22 00:00:16.953
M37958_3314	1	each	470	200	23	0	3.5	15	600	60	2	7	7	2.74	17.39	86.99	1.89	2024-05-13 22:03:23.959	2024-05-13 22:03:23.959
M40451_3314	1/8	cut	290	90	10	0	3.5	30	490	34	2	2	16	62.81	2.73	192.24	2.17	2024-05-13 22:02:35.534	2024-05-13 22:02:35.534
M41105_3314	1	fl oz	35	15	2	0	0.5	10	55	2	0	1	3	3.21	3.94	14.39	3.11	2024-05-13 22:03:37.25	2024-05-13 22:03:37.25
M40942_3056	1	fl oz	80	80	9	0	0.5	0	40	1	0	0	0	20.92	7.20	11.90	0.43	2024-05-19 00:01:18.837	2024-05-19 00:01:18.837
M38830_3314	1	serving	690	110	34	0	12	155	2110	44	2	2	53	39.93	1.31	436.08	3.56	2024-05-13 22:03:02.937	2024-05-13 22:03:02.937
M21159_3056	1	cup	320	70	8	0	3	15	230	55	2	6	9	67.21	3.15	211.96	0.82	2024-05-13 22:03:37.629	2024-05-13 22:03:37.629
M33093_3314	1/2	cup	100	5	4	0	2	10	70	17	2	3	2	37.16	3.11	3.71	0.42	2024-05-13 22:03:03.059	2024-05-13 22:03:03.059
M35394_3056	1	each	650	250	27	0	7	90	990	63	6	6	38	103.64	30.49	135.42	4.04	2024-05-13 22:03:35.189	2024-05-13 22:03:35.189
M19856_3314	1/2	cup	140	120	14	0	1.5	0	100	2	less than 1	0	2	\N	\N	\N	\N	2024-05-13 22:03:24.15	2024-05-13 22:03:24.15
M35726_3056	1/2	cup	110	20	2	0	0.5	0	5	22	1	0	2	25.18	0.00	8.25	0.28	2024-05-13 22:03:28.568	2024-05-13 22:03:28.568
M9636_3314	1/2	cup	120	0	0	0	0	0	0	26	0	0	3	0.00	0.00	47.12	1.52	2024-05-13 22:02:48.649	2024-05-13 22:02:48.649
M19874_3314	1	serving	260	40	8	0	3.5	30	690	35	3	5	11	\N	0.30	0.00	2.42	2024-05-15 00:00:14.943	2024-05-15 00:00:14.943
A1219_3314	1	each	380	120	18	0	6	20	850	41	2	3	14	70.99	5.22		2.88	2024-05-13 22:02:35.534	2024-05-13 22:02:35.534
M7975_3056	1	each	430	230	27	0	8	60	710	24	1	2	22	74.97	0.55	369.20	1.89	2024-05-13 22:03:03.995	2024-05-13 22:03:03.995
M38387_3056	3	ozw	200	110	12	0	4	65	50	0	0	0	22	2.22	0.74	10.88	2.35	2024-05-13 22:03:06.379	2024-05-13 22:03:06.379
M34445_3314	6	fl oz	160	40	8	0	2	20	350	16	1	2	6	10.41	11.22	47.44	5.08	2024-05-13 22:03:37.286	2024-05-13 22:03:37.286
M39852_3056	1/2	each	130	35	3.5	0	1.5	20	560	17	2	3	11	60.38	6.96	160.06	0.77	2024-05-19 00:01:22.931	2024-05-19 00:01:22.931
M10274_3056	1/2	cup	100	20	2	0	0	0	70	19	1	1	2	2.96	5.14	15.63	3.00	2024-05-19 00:01:36.462	2024-05-19 00:01:36.462
M41602_3314	1	serving	580	250	27	0	6	120	310	41	2	8	40	87.47	25.31		2.37	2024-05-22 00:00:16.724	2024-05-22 00:00:16.724
M38088_3314	8	fl oz	180	90	9	0	1	0	520	17	4	5	11	30.15	39.31	91.33	1.90	2024-05-13 22:02:54.107	2024-05-13 22:02:54.107
M19910_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:51.378	2024-05-13 22:02:51.378
M19908_3314	2 1/4	ozw	250		17	0	2.5	0	300	24	1	3	2	12.05	2.36	9.59	1.59	2024-05-13 22:02:48.584	2024-05-13 22:02:48.584
M34452_3314	6	fl oz	110	60	7	0	2.5	15	270	8	1	less than 1	4	76.90	1.55	29.93	0.74	2024-05-13 22:02:48.647	2024-05-13 22:02:48.647
M19585_3314	1/2	sandwich	290	150	17	0	4	30	540	20	1	1	13	93.38	2.62	161.85	1.61	2024-05-13 22:02:45.903	2024-05-13 22:02:45.903
M4906_3314	1	serving	470	220	23	0	9	95	1670	48	4	6	22	90.75	1.75	313.79	1.88	2024-05-13 22:02:41.532	2024-05-13 22:02:41.532
M36652_3314	6	fl oz	190	30	6	0	1.5	10	390	25	6	3	9	53.92	16.25	31.16	1.60	2024-05-23 00:00:16.567	2024-05-23 00:00:16.567
M14304_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:01:39.355	2024-05-13 22:01:39.355
M40955_3314	1/2	cup	160	35	4	0	0	0	500	23	7	1	7	0.00	0.22	39.29	1.72	2024-05-13 22:02:54.23	2024-05-13 22:02:54.23
M32404_3056	1	fl oz	80	80	8	0	1	0	40	1	0	0	0	20.92	7.20	11.90	0.43	2024-05-13 22:03:30.18	2024-05-13 22:03:30.18
M38834_3056	1	serving	250	140	15	0	6	25	490	18	less than 1	4	9	\N	0.14	197.03	0.57	2024-05-13 22:03:04.9	2024-05-13 22:03:04.9
M4595_3314	1/2	cup	130	45	7	0	1	0	480	11	2	6	7	47.59	66.30	42.26	1.17	2024-05-13 21:21:44.172	2024-05-13 21:21:44.172
A1938_3056	1	serving	430	130	17	0	5	70	430	52	5	5	19	46.46	24.25		18.42	2024-05-13 22:03:22.509	2024-05-13 22:03:22.509
M32306_3056	1	fl oz	90	35	4	0	0.5	0	420	13	0	8	1	0.01	0.28	10.72	0.15	2024-05-13 22:03:37.903	2024-05-13 22:03:37.903
A5800_3056	1	each	500	210	25	0	4.5	95	690	44	5	6	24	94.29	28.41		3.72	2024-05-13 22:02:12.849	2024-05-13 22:02:12.849
A5825_3314	6	fl oz	180	60	7	0	2.5	30	300	14	4	3	13	33.06	10.83		2.85	2024-05-20 00:00:10.912	2024-05-20 00:00:10.912
M32414_3056	1	serving	360	90	19	0	5	100	980	36	7	7	19	1021.92	49.83	153.68	2.68	2024-05-13 22:03:37.92	2024-05-13 22:03:37.92
L363988_3056	1	/8 cut	410	170	20	0	8	55	970	38	2	4	21	\N	3.04	\N	2.76	2024-05-20 22:46:22.845	2024-05-20 22:46:22.845
M398_3314	1	muffin	340	80	9	0	4.5	less than 5	510	61	1	34	3	0.30	0.38	2.36	1.54	2024-05-13 21:21:44.358	2024-05-13 21:21:44.358
M21923_3056	1	serving	280	45	5	0	1	0	240	51	7	5	9	166.29	24.53	53.81	2.22	2024-05-13 22:02:50.17	2024-05-13 22:02:50.17
M6363_3056	1/2	cup	280	210	24	0	3.5	25	260	15	1	2	2	1.07	8.94	12.30	0.42	2024-05-19 00:01:18.913	2024-05-19 00:01:18.913
M39262_3314	6	fl oz	60	10	1	0	0	10	390	9	less than 1	2	4	5.43	1.76	18.21	0.42	2024-05-13 22:02:48.266	2024-05-13 22:02:48.266
M40392_3314	1	serving	410	170	20	0	8	0	190	51	7	2	12	91.86	29.02	64.66	2.41	2024-05-13 22:02:51.314	2024-05-13 22:02:51.314
L340205_3314	4	fl oz	150	30	4.5	0	0.5	0	70	25	5	8	4	\N	16.76	\N	1.70	2024-05-20 22:46:22.696	2024-05-20 22:46:22.696
M38230_3056	1	serving	160	70	7	0	1	20	80	21	less than 1	11	4	\N	9.54	0.00	0.77	2024-05-20 22:46:24.187	2024-05-20 22:46:24.187
M41617_3056	1	each	330	35	3.5	0	2	10	50	68	2	22	10	52.35	0.05		0.77	2024-05-19 00:01:23.304	2024-05-19 00:01:23.304
A2863_3056	1	piece	190	60	7	0	5	10	280	30	2	19	3	0.00	3.08		1.07	2024-05-13 22:03:30.796	2024-05-13 22:03:30.796
M41058_3056	1/2	cup	70	45	5	0	0	0	290	6	2	3	2	\N	43.87	0.00	0.66	2024-05-20 22:46:24.482	2024-05-20 22:46:24.482
M36582_3056	1/2	cup	120	0	1.5	0	0	0	0	22	2	0	4	0.17	0.01	11.53	0.87	2024-05-19 00:01:38.852	2024-05-19 00:01:38.852
A721_3314	1	cup	370	150	19	0	10	85	380	31	3	4	20	147.71	9.11		7.04	2024-05-20 00:00:10.723	2024-05-20 00:00:10.723
M10734_3314	8	fl oz	100	35	4	0	1	15	380	10	less than 1	1	6	79.86	2.50	32.50	1.01	2024-05-22 00:00:14.619	2024-05-22 00:00:14.619
M32324_3056	1	muffin	120	20	3.5	0	2	0	135	21	less than 1	13	1	0.00	0.00	2.99	1.25	2024-05-13 22:02:28.506	2024-05-13 22:02:28.506
M34532_3314	2	fl oz	15	0	0	0	0	0	40	3	0	2	1	18.62	17.72	24.78	8.26	2024-05-13 22:02:48.336	2024-05-13 22:02:48.336
M41549_3314	1/2	cup	120	25	3.5	0	2	0	80	21	2	1	2	32.39	7.44	29.23	0.36	2024-05-21 00:00:13.729	2024-05-21 00:00:13.729
M21076_3314	2	tablespoons	10	0	0	0	0	0	20	1	0	less than 1	0	\N	\N	\N	\N	2024-05-13 22:02:51.253	2024-05-13 22:02:51.253
M20953_3314	1	each	150	40	4.5	0	1	0	360	20	less than 1	1	6	23.90	15.29	85.73	1.70	2024-05-13 22:02:51.326	2024-05-13 22:02:51.326
M14864_3056	1/4	cup	60	0	0	0	0	0	0	11	less than 1	0	2	\N	\N	\N	\N	2024-05-13 22:03:00.907	2024-05-13 22:03:00.907
M14363_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:24.04	2024-05-13 22:03:24.04
M32501_3314	1	each	450	280	30	0	10	45	1270	29	less than 1	5	17	35.58	4.47	130.38	2.74	2024-05-13 22:03:23.856	2024-05-13 22:03:23.856
M40004_3056	1	sandwich	450	110	31	0	10	160	480	23	1	1	17	48.06	0.00	321.52	1.78	2024-05-13 22:03:03.468	2024-05-13 22:03:03.468
M32737_3056	3/4	cup	240	60	10	0	1.5	20	760	30	3	2	8	32.10	23.67	72.21	1.90	2024-05-23 00:00:10.806	2024-05-23 00:00:10.806
M32231_3314	2	piece	430	260	28	0	7	90	290	19	1	0	25	36.46	2.36	19.26	2.44	2024-05-13 22:03:37.409	2024-05-13 22:03:37.409
M33009_3314	1/2	cup	70	45	5	0	0.5	0	160	5	3	2	2	1.23	52.84	19.86	0.40	2024-05-23 00:00:18.285	2024-05-23 00:00:18.285
M600_3314	1	each	240	150	11	0	5	0	260	32	less than 1	8	4	0.00	0.59	13.83	1.58	2024-05-21 00:00:09.602	2024-05-21 00:00:09.602
M289_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:12.51	2024-05-13 22:02:12.51
M32313_3314	3	ozw	150	60	7	0	2	110	180	0	0	0	21	6.64	0.02	4.47	0.98	2024-05-13 22:03:23.917	2024-05-13 22:03:23.917
M38042_3314	1	serving	370	90	14	0	5	45	680	43	4	2	18	17.26	7.43	63.77	2.33	2024-05-13 22:03:23.978	2024-05-13 22:03:23.978
M33549_3314	1	serving	310	120	14	0	2	0	1270	37	7	5	13	30.62	15.10	123.31	2.44	2024-05-13 22:03:29.499	2024-05-13 22:03:29.499
M14113_3056	4	each	210	110	12	0	6	10	300	24	less than 1	10	2	\N	0.01	0.00	1.28	2024-05-13 22:02:28.689	2024-05-13 22:02:28.689
M1057_3056	1	each	250	30	3	0	0.5	0	1110	51	0	7	5	0.31	0.08	20.16	2.96	2024-05-13 22:03:22.325	2024-05-13 22:03:22.325
M19679_3056	1	serving	340	50	14	0	8	65	370	35	1	3	19	22.16	22.33	22.29	2.01	2024-05-13 22:03:27.894	2024-05-13 22:03:27.894
M22115_3314	1	each	200	80	9	0	2	0	280	19	2	1	9	2.19	0.78	117.99	1.95	2024-05-13 22:03:20.228	2024-05-13 22:03:20.228
M9905_3056	1	each	130	15	3.5	0	1.5	5	0	24	3	5	4	31.09	6.32	1.73	0.52	2024-05-13 22:03:29.991	2024-05-13 22:03:29.991
M40441_3314	1/8	cut	300	110	12	0	4.5	25	530	35	2	2	14	67.52	2.16	209.33	2.24	2024-05-13 22:02:46.348	2024-05-13 22:02:46.348
M19834_3056	1/8	cut	470	180	20	0	8	170	930	50	2	3	21	131.75	0.12	199.52	3.98	2024-05-13 22:03:22.263	2024-05-13 22:03:22.263
A611_3314	1	fl oz	210	0	21	0	14	80	105	5	0	0	0	15.31	0.29		0.19	2024-05-13 22:03:37.532	2024-05-13 22:03:37.532
M33103_3056	3	ozw	80	20	2.5	0	0	0	440	12	3	7	2	24.40	7.42	40.23	0.71	2024-05-13 22:03:37.717	2024-05-13 22:03:37.717
M32572_3314	1	serving	440	220	25	1	9	280	270	23	0	0	30	135.55	0.00	91.01	4.53	2024-05-13 22:03:38.088	2024-05-13 22:03:38.088
M38834_3314	1	serving	250	140	15	0	6	25	490	18	less than 1	4	9	\N	0.14	197.03	0.57	2024-05-13 22:02:55.156	2024-05-13 22:02:55.156
M21804_3056	1/2	cup	50	35	3.5	0	0	0	105	3	2	2	1	0.83	35.74	13.43	0.27	2024-05-19 00:01:19.522	2024-05-19 00:01:19.522
M713_3056	1	each	170	40	6	0	1	0	260	25	0	1	4	0.31	0.07	3.78	1.55	2024-05-13 22:02:01.182	2024-05-13 22:02:01.182
M19840_3314	1/4	cup	30	0	0	0	0	0	0	6	0	0	1	\N	\N	\N	\N	2024-05-13 22:03:28.894	2024-05-13 22:03:28.894
M14278_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:41.56	2024-05-13 22:02:41.56
M38765_3056	4	fl oz	120	40	4.5	0	2.5	15	210	15	1	3	5	62.05	0.11	266.67	0.58	2024-05-19 00:01:36.463	2024-05-19 00:01:36.463
M12296_3056	2	slice	60	45	5	0	1	20	130	less than 1	0	less than 1	4	0.25	0.00	3.74	0.36	2024-05-13 22:01:43.913	2024-05-13 22:01:43.913
M36310_3056	1	serving	400	100	11	0	2	85	240	47	4	12	30	\N	12.78	0.00	2.41	2024-05-13 22:03:29.939	2024-05-13 22:03:29.939
M40919_3314	1/2	cup	40	15	2	0	0	0	80	6	2	2	2	278.00	9.04	70.80	0.46	2024-05-13 22:02:51.51	2024-05-13 22:02:51.51
M15286_3314	1/2	cup	15	0	0	0	0	0	10	4	1	2	1	107.23	28.29	15.97	0.28	2024-05-13 22:02:48.571	2024-05-13 22:02:48.571
A3044_3056	6	fl oz	50	10	1.5	0	0	15	510	7	0	0	3	0.00	0.57		0.45	2024-05-13 22:03:37.944	2024-05-13 22:03:37.944
M33279_3056	1	serving	170	50	6	0	2	0	10	27	2	17	2	0.39	1.42	14.50	0.48	2024-05-19 00:01:19.833	2024-05-19 00:01:19.833
M508_3314	1	each	210	15	5	0	2.5	10	370	35	1	1	7	32.32	0.11	12.98	2.29	2024-05-13 22:03:23.855	2024-05-13 22:03:23.855
M14863_3314	1/4	cup	70	0	0	0	0	0	5	13	less than 1	less than 1	2	\N	\N	\N	\N	2024-05-20 00:00:11.289	2024-05-20 00:00:11.289
M19998_3056	1/2	cup	130	10	1	0	0	0	140	26	2	1	4	1.54	5.75	49.91	1.80	2024-05-13 22:03:35.206	2024-05-13 22:03:35.206
M32988_3056	1	each	520	230	26	0	6	75	850	40	3	2	29	301.40	2.65	264.57	3.46	2024-05-19 00:01:20.089	2024-05-19 00:01:20.089
M21053_3314	1	serving	210	20	2	0	0	0	410	38	8	10	12	1057.47	24.85	95.49	3.18	2024-05-13 22:03:38.109	2024-05-13 22:03:38.109
M18832_3056	1	each	170	60	7	0	1.5	35	160	11	less than 1	1	18	16.51	4.03	26.37	0.76	2024-05-13 22:03:06.386	2024-05-13 22:03:06.386
M12901_3056	1/2	cup	160	20	3	0	0	0	110	33	3	13	4	36.42	1.34	24.48	1.09	2024-05-13 22:03:06.448	2024-05-13 22:03:06.448
M33400_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:48.323	2024-05-13 22:02:48.323
M2488_3314	3	ozw	170	50	6	0	2	80	570	less than 1	0	less than 1	27	9.71	0.01	16.21	2.41	2024-05-13 22:02:48.385	2024-05-13 22:02:48.385
M20013_3056	1/64	cut	190	50	6	0	2.5	0	150	33	1	23	2	0.00	0.00	0.44	1.57	2024-05-13 21:21:43.889	2024-05-13 21:21:43.889
M34480_3314	6	fl oz	130	45	5	0	2	5	310	18	2	5	3	70.54	5.89	81.80	0.45	2024-05-13 22:02:41.684	2024-05-13 22:02:41.684
M1842_3056	1/64	cut	350	140	16	0	4.5	10	230	55	1	42	2	101.35	0.81	30.07	0.82	2024-05-13 22:03:06.51	2024-05-13 22:03:06.51
M40151_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:27.3	2024-05-19 00:01:27.3
A3204_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:27.487	2024-05-19 00:01:27.487
M19739_3056	3	ozw	120	35	3.5	0	1.5	55	330	0	0	0	20	0.00	0.04	6.53	1.83	2024-05-13 22:02:29.411	2024-05-13 22:02:29.411
M14342_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-20 00:00:10.792	2024-05-20 00:00:10.792
M40068_3056	1/2	sandwich	330	160	18	0	3.5	50	500	27	1	1	17	55.73	9.75	64.85	1.88	2024-05-13 22:02:52.495	2024-05-13 22:02:52.495
M10569_3056	1/2	cup	100	25	3	0	0	0	50	19	2	3	3	9.94	3.53	3.64	0.50	2024-05-19 00:01:37.664	2024-05-19 00:01:37.664
M35340_3314	1/2	each	200	50	7	0	2.5	40	440	20	less than 1	3	16	53.67	3.21	151.06	1.32	2024-05-13 22:02:55.09	2024-05-13 22:02:55.09
M10060_3056	1/2	cup	110	45	5	0	1	0	380	15	1	1	2	0.03	1.84	28.90	0.41	2024-05-19 00:01:38.878	2024-05-19 00:01:38.878
M9876_3056	1/2	cup	100	10	1.5	0	0	0	80	21	2	1	2	1.06	13.27	11.38	0.75	2024-05-13 22:03:06.464	2024-05-13 22:03:06.464
M40803_3056	6	fl oz	150	25	2.5	0	0	0	290	23	8	4	9	57.90	1.38	26.95	1.36	2024-05-19 00:01:39.827	2024-05-19 00:01:39.827
M36024_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:47.936	2024-05-13 22:02:47.936
M13263_3314	1	each	540	260	28	0	7	45	1080	53	2	13	21	62.32	1.72	192.61	2.52	2024-05-13 22:03:24.286	2024-05-13 22:03:24.286
L276724_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-20 22:46:22.904	2024-05-20 22:46:22.904
M40042_3314	1	serving	300	130	14	0	2.5	0	390	39	1	8	5	\N	\N	84.62	2.41	2024-05-13 21:21:44.448	2024-05-13 21:21:44.448
M21939_3056	1	muffin	80	25	2.5	0	1	0	95	13	0	7	1	0.18	0.51	1.89	0.34	2024-05-13 22:01:43.937	2024-05-13 22:01:43.937
M18432_3056	1/2	cup	100	10	1	0	0	0	40	21	1	0	2	5.85	0.08	12.49	0.54	2024-05-19 00:01:18.605	2024-05-19 00:01:18.605
A3193_3056	8	fl oz	120	5	1	0	0	0	520	23	7	5	6	42.85	14.40		2.86	2024-05-13 22:03:30.756	2024-05-13 22:03:30.756
M20732_3314	2	each	520	280	31	0	17	80	920	36	0	less than 1	22	272.24	0.00	721.90	2.14	2024-05-21 00:00:13.492	2024-05-21 00:00:13.492
M40141_3056	1	each	140	30	3.5	0	1	70	230	0	0	0	27	0.00	0.00	6.69	0.81	2024-05-13 21:21:43.827	2024-05-13 21:21:43.827
M21332_3056	1/8	cut	460	260	28	0	10	180	850	34	2	2	19	140.32	0.00	214.94	2.67	2024-05-13 22:03:27.354	2024-05-13 22:03:27.354
M21943_3056	1	muffin	80	20	2	0	1	0	120	15	0	8	1	0.07	0.09	0.56	0.36	2024-05-13 22:02:45.586	2024-05-13 22:02:45.586
M17086_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:23.978	2024-05-13 22:03:23.978
M14255_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-20 00:00:10.729	2024-05-20 00:00:10.729
M40765_3314	1/2	cup	260	160	17	0	6	90	210	2	0	0	23	11.76	2.33	39.49	1.89	2024-05-13 22:02:51.325	2024-05-13 22:02:51.325
M19781_3314	3	ozw	120	30	3.5	0	1	50	95	0	0	0	20	2.77	0.05	13.31	1.35	2024-05-13 22:02:51.632	2024-05-13 22:02:51.632
M20555_3314	1	each	530	220	18	0	4.5	60	950	80	2	18	10	66.20	0.20	377.71	0.95	2024-05-13 22:03:20.178	2024-05-13 22:03:20.178
A3044_3314	6	fl oz	50	10	1.5	0	0	15	510	7	0	0	3	0.00	0.57		0.45	2024-05-22 00:00:14.632	2024-05-22 00:00:14.632
M39457_3056	1	each	200	35	6	0	2.5	20	430	29	3	4	7	4.70	15.35	85.43	1.07	2024-05-13 22:02:29.096	2024-05-13 22:02:29.096
M10094_3314	1/2	cup	100	15	2	0	0	0	120	19	3	6	1	843.36	13.72	29.89	0.79	2024-05-13 22:02:48.632	2024-05-13 22:02:48.632
M21584_3056	1/2	cup	110	15	2.5	0	0	0	55	19	3	2	5	\N	10.60	0.00	1.29	2024-05-20 22:46:24.157	2024-05-20 22:46:24.157
M21986_3314	1/2	cup	180	70	8	0	1	0	230	20	1	1	7	15.17	26.36	48.40	1.86	2024-05-13 22:03:37.358	2024-05-13 22:03:37.358
M40067_3056	1	sandwich	580	130	23	0	10	90	1500	65	1	9	31	171.64	9.98	274.91	4.75	2024-05-22 00:00:17.06	2024-05-22 00:00:17.06
M21257_3314	1	each	45	35	3.5	0	1.5	10	50	less than 1	0	0	2	\N	0.13	7.63	0.23	2024-05-13 22:02:54.228	2024-05-13 22:02:54.228
M32303_3056	1	serving	480	110	13	0	2.5	55	610	72	4	15	21	\N	19.18	0.00	8.42	2024-05-23 00:00:10.815	2024-05-23 00:00:10.815
M21975_3314	1/2	cup	180	30	3.5	0	0	0	410	31	less than 1	2	6	30.29	5.57	32.80	2.42	2024-05-21 00:00:14.963	2024-05-21 00:00:14.963
M36582_3314	1/2	cup	120	0	1.5	0	0	0	0	22	2	0	4	0.17	0.01	11.53	0.87	2024-05-13 22:03:37.545	2024-05-13 22:03:37.545
M32307_3056	1	fl oz	5	0	0	0	0	0	65	less than 1	0	0	0	0.00	0.08	1.75	0.03	2024-05-13 22:03:37.733	2024-05-13 22:03:37.733
M32538_3314	1/2	cup	30	0	0	0	0	0	0	7	2	5	1	1.25	30.30	9.12	0.27	2024-05-13 22:02:48.007	2024-05-13 22:02:48.007
M16360_3056	1	serving	440	60	8	0	1	35	870	69	2	5	23	151.33	34.30	80.07	5.63	2024-05-13 22:03:30.511	2024-05-13 22:03:30.511
M11563_3314	1/2	cup	120	0	0.5	0	0	0	45	27	0	0	3	0.50	0.80	47.82	1.54	2024-05-13 22:02:48.261	2024-05-13 22:02:48.261
M34023_3314	1	each	45	5	0.5	0	0	0	140	8	0	1	2	0.06	2.82	16.92	0.70	2024-05-13 22:03:38.071	2024-05-13 22:03:38.071
M35609_3314	1	each	150	60	7	0	1	0	400	9	2	less than 1	15	0.64	0.00	53.07	1.66	2024-05-23 00:00:06.306	2024-05-23 00:00:06.306
M40806_3314	6	fl oz	60	10	1.5	0	0	0	290	11	2	2	3	65.56	10.99	19.37	0.94	2024-05-23 00:00:16.577	2024-05-23 00:00:16.577
M34201_3314	1	each	170	35	4	0	2	less than 5	230	31	2	14	2	0.65	1.85	2.32	0.42	2024-05-13 22:02:45.766	2024-05-13 22:02:45.766
M40467_3314	1/8	cut	270	70	8	0	3.5	20	550	36	2	4	13	\N	11.76	0.00	2.38	2024-05-24 00:00:16.356	2024-05-24 00:00:16.356
M36071_3314	1	serving	660	240	31	0.5	15	95	1370	64	5	11	31	183.27	5.23	408.49	3.83	2024-05-13 22:02:55.151	2024-05-13 22:02:55.151
M36703_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:47.996	2024-05-13 22:02:47.996
M20719_3056	1	cup	210	30	4	0	0.5	50	300	33	3	3	13	40.85	11.45	67.88	1.61	2024-05-19 00:01:19.768	2024-05-19 00:01:19.768
M20277_3056	1	each	220	90	10	0	4	less than 5	240	31	less than 1	13	3	0.00	0.00	74.56	1.24	2024-05-13 21:21:41.255	2024-05-13 21:21:41.255
A293_3056	1	each	140	30	3.5	0	1	70	65	0	0	0	26	4.97	0.03		0.87	2024-05-19 00:01:20.086	2024-05-19 00:01:20.086
M36628_3056	1	serving	240	70	8	0	1	0	610	37	5	5	7	114.45	51.93	77.37	2.34	2024-05-19 00:01:23.123	2024-05-19 00:01:23.123
M9513_3056	2	link	240	200	23	0	8	45	440	less than 1	0	0	8	0.20	0.00	17.94	0.59	2024-05-13 22:02:45.569	2024-05-13 22:02:45.569
M40762_3314	1/2	cup	140	20	2.5	0	0	0	120	27	0	0	3	0.00	0.00		1.75	2024-05-13 22:02:51.513	2024-05-13 22:02:51.513
A3040_3314	6	fl oz	100	10	1.5	0	0	0	240	17	5	3	4	\N	9.81		1.84	2024-05-13 22:02:48.622	2024-05-13 22:02:48.622
M2488_3056	3	ozw	170	50	6	0	2	80	570	less than 1	0	less than 1	27	9.71	0.01	16.21	2.41	2024-05-19 00:01:27.086	2024-05-19 00:01:27.086
M20912_3056	4	fl oz	170	45	6	0	1	0	420	24	2	2	6	20.02	6.24	64.00	1.95	2024-05-13 22:03:30.514	2024-05-13 22:03:30.514
L363965_3056	1	/8 cut	430	140	26	0	8	40	710	35	2	3	15	\N	6.09	\N	2.66	2024-05-13 21:21:43.834	2024-05-13 21:21:43.834
M18804_3056	1	each	530	160	18	0	5	45	1090	63	6	5	30	54.47	30.36	137.01	4.79	2024-05-19 00:01:27.149	2024-05-19 00:01:27.149
A5762_3314	2	each	410	200	22	0	4.5	60	740	36	2	2	15	\N	19.77	0.00	3.10	2024-05-13 22:02:48.246	2024-05-13 22:02:48.246
A229_3056	2	each	190	50	6	0	1	0	250	31	5	4	3	29.11	24.28		5.58	2024-05-19 00:01:27.522	2024-05-19 00:01:27.522
A368_3314	1	serving	200	60	9	0	2.5	40	460	13	4	4	17	117.88	36.05		1.56	2024-05-13 22:03:38.514	2024-05-13 22:03:38.514
A212_3056	1	serving	610	140	20	0	6	130	730	74	8	12	34	\N	22.66	0.00	4.15	2024-05-13 22:02:28.616	2024-05-13 22:02:28.616
M33876_3314	1	cup	370	60	15	0	5	0	290	48	4	3	11	4.97	1.66	161.80	2.33	2024-05-20 00:00:11.288	2024-05-20 00:00:11.288
M37959_3056	1/2	cup	160	0	4	0	1	20	390	24	1	0	6	\N	0.02	0.00	1.34	2024-05-13 22:03:06.398	2024-05-13 22:03:06.398
M20399_3314	1/8	cut	320	130	14	0	5	25	550	35	2	2	15	49.85	0.68	168.25	2.35	2024-05-13 22:02:48.434	2024-05-13 22:02:48.434
M21926_3056	1	serving	340	70	7	0	1	0	210	58	5	26	11	118.76	63.73	97.59	2.16	2024-05-19 00:01:37.629	2024-05-19 00:01:37.629
A2941_3056	1	serving	480	270	28	0	8	45	1440	35	2	8	17	8.24	34.58		1.50	2024-05-13 22:02:52.512	2024-05-13 22:02:52.512
M20846_3314	1/8	cut	310	90	10	0	3.5	25	730	40	2	7	16	72.28	5.50	201.90	2.51	2024-05-13 22:03:38.577	2024-05-13 22:03:38.577
M20983_3056	1	each	340	60	7	0	2	0	910	55	5	3	14	16.75	3.88	242.70	5.30	2024-05-19 00:01:38.832	2024-05-19 00:01:38.832
M39263_3056	6	fl oz	150		8	0	3.5	25	720	15	less than 1	1	4	\N	\N	0.00	0.47	2024-05-19 00:01:37.69	2024-05-19 00:01:37.69
M15554_3314	1	each	140	0	0	0	0	0	15	33	3	2	4	1.55	14.88	23.25	1.67	2024-05-13 22:02:41.657	2024-05-13 22:02:41.657
M9126_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:01:39.402	2024-05-13 22:01:39.402
M3030_3314	2	piece	370	160	18	0	5	115	720	13	less than 1	11	37	79.48	1.26	31.18	2.07	2024-05-13 22:02:48.371	2024-05-13 22:02:48.371
M32642_3056	8	fl oz	240	70	9	0	3	40	400	23	6	4	18	44.12	14.40	61.76	4.12	2024-05-19 00:01:39.828	2024-05-19 00:01:39.828
M20596_3314	1/2	cup	190	120	13	0.5	5	25	260	12	1	8	6	15.25	24.29	34.60	0.93	2024-05-13 22:03:38.108	2024-05-13 22:03:38.108
M41558_3314	1	cookie	160	70	7	0	4.5	0	25	15	less than 1	13	1	29.29	0.00	16.77	0.88	2024-05-13 22:02:54.014	2024-05-13 22:02:54.014
M40437_3314	1/12	cut	330	140	16	0	5	25	600	34	2	2	14	69.20	2.20	204.06	2.19	2024-05-13 22:03:38.134	2024-05-13 22:03:38.134
L97521_3056	1	/64 cut	180	50	6	0	2.5	0	170	33	1	24	2	\N	0.00	\N	1.32	2024-05-20 22:46:22.919	2024-05-20 22:46:22.919
M20397_3056	1/8	cut	310	100	11	0	3.5	45	610	33	2	1	21	160.07	0.57	122.98	2.09	2024-05-13 22:03:29.945	2024-05-13 22:03:29.945
M20423_3056	1/2	cup	360	30	14	0	8	30	220	59	3	39	2	\N	3.12	0.00	0.51	2024-05-20 22:46:24.189	2024-05-20 22:46:24.189
M21327_3056	1/8	cut	420	210	23	0	9	175	810	34	2	2	18	140.39	0.00	211.66	2.58	2024-05-19 00:01:40.567	2024-05-19 00:01:40.567
A5800_3314	1	each	500	210	25	0	4.5	95	690	44	5	6	24	94.29	28.41		3.72	2024-05-13 22:02:46.482	2024-05-13 22:02:46.482
L364409_3056	1	portion	140	0	0.5	0	0	0	280	29	3	3	5	\N	0.00	\N	1.55	2024-05-20 22:46:24.412	2024-05-20 22:46:24.412
M34504_3314	1/2	cup	40	0	3	0	2	10	105	3	less than 1	2	1	72.81	11.27	16.69	0.32	2024-05-20 00:00:11.473	2024-05-20 00:00:11.473
M3742_3314	1	serving	180	50	6	0	1	85	230	4	0	less than 1	26	10.95	1.28	11.90	0.82	2024-05-13 22:02:54.077	2024-05-13 22:02:54.077
M41612_3056	1/2	cup	110	20	2	0	0	0	80	21	1	1	3	41.04	4.03		0.37	2024-05-22 00:00:18.778	2024-05-22 00:00:18.778
M21678_3314	1	serving	420	110	22	0	10	35	490	37	2	4	17	140.67	38.91	53.84	3.72	2024-05-21 00:00:13.498	2024-05-21 00:00:13.498
M40749_3056	1/2	cup	100	20	2	0	0	0	70	19	1	1	2	2.96	5.14	15.63	3.00	2024-05-13 22:02:29.096	2024-05-13 22:02:29.096
M32554_3056	1/2	cup	90	0	0	0	0	0	95	19	less than 1	0	3	0.05	0.01	10.28	0.83	2024-05-19 00:01:19.521	2024-05-19 00:01:19.521
A1146_3314	2	fl oz	50	35	3.5	0	2	0	70	less than 1	0	0	1	28.48	0.00		0.05	2024-05-13 22:03:29.632	2024-05-13 22:03:29.632
M21905_3314	1/64	cut	250	110	13	0	1.5	0	130	33	2	15	3	0.06	1.09	63.47	1.14	2024-05-13 22:03:37.358	2024-05-13 22:03:37.358
M18832_3314	1	each	170	60	7	0	1.5	35	160	11	less than 1	1	18	16.51	4.03	26.37	0.76	2024-05-13 22:03:23.975	2024-05-13 22:03:23.975
M40453_3314	1/2	cup	90	10	1.5	0	0	0	100	17	0	0	2	0.00	0.00	9.26	1.21	2024-05-13 22:03:24.038	2024-05-13 22:03:24.038
M12519_3314	1	serving	340	90	10	0	5	25	510	51	7	6	14	195.60	32.04	263.14	6.94	2024-05-13 22:03:32.884	2024-05-13 22:03:32.884
M39587_3314	1	each	80	5	0.5	0	0	0	40	20	2	14	2	118.78	25.45	88.38	0.82	2024-05-13 22:03:20.177	2024-05-13 22:03:20.177
M32404_3314	1	fl oz	80	80	8	0	1	0	40	1	0	0	0	20.92	7.20	11.90	0.43	2024-05-23 00:00:16.515	2024-05-23 00:00:16.515
M40779_3314	1/2	cup	70	5	0.5	0	0	0	10	14	1	10	1	12.24	20.61	29.52	0.41	2024-05-13 22:03:24.163	2024-05-13 22:03:24.163
M17308_3314	1	serving	260	35	4	0	1	45	570	42	2	2	13	153.40	11.60	36.64	0.87	2024-05-13 22:02:51.638	2024-05-13 22:02:51.638
M20278_3314	1	each	120	50	5	0	2.5	5	135	17	less than 1	9	2	20.48	4.98	9.25	0.64	2024-05-13 21:21:44.394	2024-05-13 21:21:44.394
M6929_3056	2	fl oz	20	0	0	0	0	0	70	5	less than 1	3	0	28.19	36.18	9.15	0.15	2024-05-24 00:00:10.407	2024-05-24 00:00:10.407
M32360_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-20 00:00:10.788	2024-05-20 00:00:10.788
M13601_3314	1/2	cup	320	230	25	0	4	15	290	21	2	2	2	6.35	7.93	14.65	0.46	2024-05-13 22:03:29.569	2024-05-13 22:03:29.569
M9615_3314	1/2	cup	180	60	7	0	1	65	290	24	less than 1	1	5	34.62	6.39	60.91	1.92	2024-05-13 21:21:44.324	2024-05-13 21:21:44.324
M21741_3314	1	each	150	30	3.5	0	0.5	85	540	4	2	0	26	75.91	0.26	24.12	1.35	2024-05-13 22:02:46.357	2024-05-13 22:02:46.357
M34456_3314	6	fl oz	60	20	2.5	0	0	0	290	10	2	2	1	49.97	8.11	29.94	4.50	2024-05-13 22:03:38.388	2024-05-13 22:03:38.388
M13924_3314	1/2	cup	110	50	6	0	0.5	0	390	13	3	4	2	2.45	3.32	32.50	0.68	2024-05-13 22:03:38.296	2024-05-13 22:03:38.296
M21934_3314	2	fl oz	45	10	1.5	0	0	0	360	8	0	2	1	0.00	0.00	17.18	0.03	2024-05-13 22:03:38.705	2024-05-13 22:03:38.705
M40851_3314	1/2	cup	100	10	1.5	0	0	0	10	20	2	1	2	1.03	12.99	9.28	0.72	2024-05-13 22:03:38.768	2024-05-13 22:03:38.768
M32499_3314	1	each	300	130	14	0	7	30	600	31	1	7	12	52.40	4.62	192.00	2.45	2024-05-13 22:03:38.861	2024-05-13 22:03:38.861
M41526_3314	1	portion	170	15	2	0	0	0	190	23	less than 1	19	1	14.37	0.00	37.49	0.80	2024-05-13 22:03:23.913	2024-05-13 22:03:23.913
M20174_3314	1	each	280	90	10	0	3.5	35	910	32	3	4	18	48.85	9.46	136.35	2.07	2024-05-13 22:02:48.309	2024-05-13 22:02:48.309
M9786_3314	3	ozw	190	80	9	0	1.5	0	410	22	1	0	1	\N	\N	10.18	0.00	2024-05-13 22:02:05.875	2024-05-13 22:02:05.875
M40850_3056	1/2	cup	140	60	7	0	0	0	200	18	2	less than 1	1	5.88	9.13	5.55	0.29	2024-05-13 22:03:22.344	2024-05-13 22:03:22.344
A3503_3056	1	roll	130	45	5	1	1.5	10	230	18	less than 1	5	3	\N	0.00		0.72	2024-05-13 22:03:20.801	2024-05-13 22:03:20.801
M37808_3314	1	each	270	30	3.5	0	0.5	30	460	49	3	3	11	26.92	18.26	59.21	2.43	2024-05-20 00:00:11.285	2024-05-20 00:00:11.285
M34425_3056	6	fl oz	150	80	9	0	3	10	450	12	1	6	4	76.96	1.85	103.80	0.98	2024-05-13 22:03:00.846	2024-05-13 22:03:00.846
M6475_3056	1/2	cup	230	150	16	0	2.5	10	650	19	1	5	4	15.72	12.15	14.35	1.53	2024-05-13 22:03:37.716	2024-05-13 22:03:37.716
M4702_3056	1/2	cup	90	40	4.5	0	0.5	0	125	11	2	2	2	6.35	24.76	17.05	0.93	2024-05-19 00:01:19.773	2024-05-19 00:01:19.773
M14090_3056	1/64	cut	330	110	13	0	6	5	230	50	2	28	4	122.75	0.00	10.05	1.31	2024-05-13 22:02:12.714	2024-05-13 22:02:12.714
M4214_3314	2 1/2	ozw	190	60	7	0	2.5	75	250	1	0	less than 1	28	0.00	0.00	22.83	1.13	2024-05-13 21:21:44.188	2024-05-13 21:21:44.188
M32205_3314	1/2	cup	40	20	2.5	0	0	0	135	4	2	1	2	19.05	54.91	29.86	0.46	2024-05-13 21:21:44.31	2024-05-13 21:21:44.31
M10588_3314	1	patty	180		18	0	6	30	170	less than 1	0	0	5	1.28	0.00	9.23	0.32	2024-05-13 22:03:21.306	2024-05-13 22:03:21.306
M41475_3056	1	serving	1000	330	37	0	6	90	1250	141	4	23	22	17.71	55.30	123.61	2.95	2024-05-19 00:01:20.023	2024-05-19 00:01:20.023
M4906_3056	1	serving	470	220	23	0	9	95	1670	48	4	6	22	90.75	1.75	313.79	1.88	2024-05-13 22:02:12.632	2024-05-13 22:02:12.632
M41036_3314	3	ozw	150	35	4	0	0.5	85	50	0	0	0	26	10.21	0.00	5.64	0.42	2024-05-13 22:02:54.072	2024-05-13 22:02:54.072
M2677_3314	3	ozw	180	60	7	0	2.5	75	210	0	0	0	27	0.04	0.00	22.41	1.09	2024-05-13 22:02:48.374	2024-05-13 22:02:48.374
M9746_3314	1/2	cup	120	0	3	0	2	10	60	20	2	1	2	25.29	12.99	9.76	0.73	2024-05-13 22:02:48.618	2024-05-13 22:02:48.618
M34461_3056	6	fl oz	100	30	3	0	0.5	15	300	12	2	2	6	9.80	3.69	29.31	3.63	2024-05-19 00:01:27.21	2024-05-19 00:01:27.21
M40310_3314	1	sandwich	210	110	14	0	1.5	0	290	20	4	2	2	20.83	10.11	39.10	2.63	2024-05-13 22:02:47.935	2024-05-13 22:02:47.935
L284444_3314	1	serving	280	70	8	0	1	0	85	41	5	10	12	\N	0.37	\N	2.86	2024-05-13 21:21:44.432	2024-05-13 21:21:44.432
L352998_3056	1	/2 cup	230	25	2.5	0	0	0	580	52	4	35	6	\N	26.68	\N	3.03	2024-05-13 21:21:44.066	2024-05-13 21:21:44.066
M20956_3314	1	each	130	25	3	0	1	0	440	20	1	2	6	17.72	11.86	94.61	1.60	2024-05-13 22:02:54.136	2024-05-13 22:02:54.136
M36071_3056	1	serving	660	240	31	0.5	15	95	1370	64	5	11	31	183.27	5.23	408.49	3.83	2024-05-13 22:02:50.154	2024-05-13 22:02:50.154
M40674_3056	1	each	420	120	16	0	4	0	1080	59	12	9	21	\N	17.14	0.00	4.94	2024-05-13 21:21:44.044	2024-05-13 21:21:44.044
M40528_3056	1	serving	390	50	5	0	2	55	550	59	3	24	25	185.09	19.57	71.82	2.19	2024-05-13 22:02:50.398	2024-05-13 22:02:50.398
M10645_3314	1/2	cup	15	0	0	0	0	0	30	3	1	2	1	46.37	36.53	16.36	0.33	2024-05-13 22:03:24.231	2024-05-13 22:03:24.231
M6847-165894_3056	1/4	cup	60		2	0	0	0	170	9	0	less than 1	1	\N	\N	238.73	0.40	2024-05-23 00:00:07.626	2024-05-23 00:00:07.626
M599_3314	1	each	240	150	11	0	5	0	260	32	1	7	4	0.09	0.61	19.74	1.63	2024-05-13 22:02:12.484	2024-05-13 22:02:12.484
A787_3056	1	serving	310	100	16	0	6	110	660	20	1	1	22	87.09	20.18		1.66	2024-05-13 22:03:06.727	2024-05-13 22:03:06.727
M2775_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:40.606	2024-05-13 22:03:40.606
M20851_3314	1/8	cut	260	90	9	0	3.5	20	430	34	2	1	12	72.00	3.06	197.79	1.99	2024-05-13 22:02:48.13	2024-05-13 22:02:48.13
M32678_3056	1	each	450	90	26	0	10	60	900	36	4	6	21	64.46	8.98	201.61	35.64	2024-05-19 00:01:27.148	2024-05-19 00:01:27.148
M2787_3314	3	ozw	190	70	7	0	2.5	75	70	2	1	0	28	1.11	0.27	46.07	1.96	2024-05-13 22:03:38.086	2024-05-13 22:03:38.086
M36073_3314	1/2	cup	130	15	1.5	0	0	0	75	27	0	0	3	0.01	1.11	53.70	1.58	2024-05-20 00:00:10.911	2024-05-20 00:00:10.911
M33411_3056	1	fl oz	35	25	3	0	1.5	10	25	2	0	1	2	\N	0.00	34.78	0.00	2024-05-13 22:03:22.466	2024-05-13 22:03:22.466
M7975_3314	1	each	430	230	27	0	8	60	710	24	1	2	22	74.97	0.55	369.20	1.89	2024-05-24 00:00:16.556	2024-05-24 00:00:16.556
M36204_3314	1	serving	450	140	25	0	7	0	500	47	7	5	13	\N	23.26	0.00	2.59	2024-05-13 22:03:38.545	2024-05-13 22:03:38.545
M18841_3314	2	piece	430	220	24	0	7	155	900	2	less than 1	0	48	84.24	0.00	39.32	2.60	2024-05-21 00:00:13.503	2024-05-21 00:00:13.503
M34112_3314	1	fl oz	5	0	0	0	0	0	55	1	0	less than 1	0	6.80	2.98	5.29	0.10	2024-05-21 00:00:14.655	2024-05-21 00:00:14.655
M21330_3056	1/8	cut	410	190	22	0	7	170	790	35	2	2	19	150.00	0.00	233.27	2.62	2024-05-13 22:02:28.617	2024-05-13 22:02:28.617
M38581_3056	1	serving	730	300	41	0	7	10	1350	75	6	26	17	297.80	72.08	194.39	3.85	2024-05-13 22:03:30.755	2024-05-13 22:03:30.755
M3685_3056	4	fl oz	170	50	12	0	7	35	420	6	1	2	10	15.97	12.54	35.05	2.42	2024-05-19 00:01:38.79	2024-05-19 00:01:38.79
M21036_3314	1	each	380	60	6	0	2	0	600	68	4	8	10	178.28	49.77	253.67	4.57	2024-05-21 00:00:14.734	2024-05-21 00:00:14.734
M9294_3314	1	fl oz	25	15	1.5	0	0	0	30	2	0	less than 1	0	9.17	3.28	5.26	0.23	2024-05-13 22:02:54.2	2024-05-13 22:02:54.2
M15122_3314	1/2	cup	100	40	4.5	0	0.5	0	180	14	3	3	2	148.92	38.39	28.96	1.06	2024-05-13 22:03:38.331	2024-05-13 22:03:38.331
M19548_3056	1	serving	210	20	9	0	6	0	380	29	1	7	2	0.47	13.61	59.89	1.59	2024-05-19 00:01:38.918	2024-05-19 00:01:38.918
M20103_3314	1	each	90	20	2	0	0.5	0	190	16	0	0	2	0.00	0.00	67.87	0.98	2024-05-13 22:02:51.334	2024-05-13 22:02:51.334
A1054_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:30.816	2024-05-13 22:03:30.816
A209_3314	2	each	400	100	16	0	5	130	520	36	4	6	28	24.58	9.80		2.71	2024-05-13 22:02:51.46	2024-05-13 22:02:51.46
M36792_3314	1	each	490	180	21	0	6	90	1040	42	3	3	29	182.70	11.17	290.59	3.26	2024-05-23 00:00:16.276	2024-05-23 00:00:16.276
M38848_3056	1	serving	520	240	29	1	14	85	1960	44	4	9	22	44.14	1.22	101.43	2.24	2024-05-13 22:03:37.963	2024-05-13 22:03:37.963
M33772_3056	1	each	130	25	3	0	0	70	125	6	less than 1	1	21	18.60	11.18	62.16	0.76	2024-05-19 00:01:27.087	2024-05-19 00:01:27.087
M39654_3056	1	each	500	100	18	0	3	25	1090	66	4	17	21	132.08	31.06	151.96	4.02	2024-05-13 22:03:06.414	2024-05-13 22:03:06.414
M34582_3314	4	fl oz	130	45	5	0	1.5	35	180	5	less than 1	less than 1	15	3.79	1.41	23.34	1.27	2024-05-13 22:03:23.923	2024-05-13 22:03:23.923
M40484_3314	1/12	cut	270	70	8	0	3.5	20	550	36	2	4	13	78.43	11.76	210.78	2.38	2024-05-13 22:03:28.486	2024-05-13 22:03:28.486
M21578_3314	1/2	cup	100	35	4	0	1	0	115	11	2	8	6	62.35	8.62	41.61	0.86	2024-05-24 00:00:13.196	2024-05-24 00:00:13.196
M19631_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:37.407	2024-05-13 22:03:37.407
M10076_3314	1/2	cup	45	20	2.5	0	1	0	50	5	2	2	1	236.18	26.16	21.45	0.33	2024-05-13 22:02:41.665	2024-05-13 22:02:41.665
M32949_3056	1/2	cup	240	140	16	0	6	90	190	0	0	0	23	1.84	0.00	25.47	1.60	2024-05-13 22:03:37.655	2024-05-13 22:03:37.655
M40376_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:38.232	2024-05-13 22:03:38.232
M21627_3314	1/2	cup	160	40	4.5	0	0.5	0	140	24	5	2	7	9.17	7.37	36.21	5.67	2024-05-13 22:03:38.295	2024-05-13 22:03:38.295
M33864_3314	4	fl oz	150	10	3.5	0	1	0	350	26	3	5	5	27.78	7.95	31.68	1.94	2024-05-13 22:03:23.984	2024-05-13 22:03:23.984
M39018_3314	1	each	220	30	4	0	1	70	580	14	2	2	29	49.29	0.27	22.17	1.56	2024-05-13 22:03:38.515	2024-05-13 22:03:38.515
M7968_3314	1	each	460	90	26	0	10	60	900	36	4	6	21	64.45	8.98	202.51	35.60	2024-05-13 22:03:38.392	2024-05-13 22:03:38.392
M20993_3314	1	each	460	100	18	0	9	25	870	65	10	8	16	240.53	26.85	248.20	1.55	2024-05-13 22:03:39.014	2024-05-13 22:03:39.014
M35425_3314	1/2	each	150	15	3	0	0.5	20	360	21	less than 1	3	10	35.41	5.88	54.71	1.65	2024-05-13 22:03:24.293	2024-05-13 22:03:24.293
A350_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:51.649	2024-05-13 22:02:51.649
M19760_3314	1	piece	250	60	7	0	1	0	430	41	2	2	8	0.02	0.09	15.78	2.82	2024-05-13 22:02:45.914	2024-05-13 22:02:45.914
M21938_3314	1	each	360	150	15	0.5	5	70	340	30	less than 1	4	26	2.57	0.00	95.44	3.91	2024-05-13 22:02:05.877	2024-05-13 22:02:05.877
M19288_3314	1	serving	170	60	6	0	1	85	120	2	0	less than 1	26	23.10	3.82	13.25	0.63	2024-05-13 22:03:28.88	2024-05-13 22:03:28.88
M12296_3314	2	slice	60	45	5	0	1	20	130	less than 1	0	less than 1	4	0.25	0.00	3.74	0.36	2024-05-13 22:02:54.247	2024-05-13 22:02:54.247
M10072_3056	1/2	cup	100	25	3	0	0	0	70	19	2	3	3	9.98	3.48	3.70	0.48	2024-05-13 22:03:35.207	2024-05-13 22:03:35.207
M20888_3314	1/8	cut	280	90	10	0	3.5	20	540	37	2	3	13	75.26	14.80	200.19	2.38	2024-05-13 22:02:51.346	2024-05-13 22:02:51.346
M20350_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:19.913	2024-05-19 00:01:19.913
M32322_3056	1	muffin	80	20	2	0	1	0	110	14	0	7	1	0.06	0.29	0.94	0.34	2024-05-13 22:02:30.829	2024-05-13 22:02:30.829
M21568_3056	1/2	cup	110	25	4	0	1	25	690	9	1	5	12	92.18	17.89	27.50	1.01	2024-05-19 00:01:20.1	2024-05-19 00:01:20.1
M9513_3314	2	link	240	200	23	0	8	45	440	less than 1	0	0	8	0.20	0.00	17.94	0.59	2024-05-13 22:03:28.257	2024-05-13 22:03:28.257
M12167_3056	1	each	310	100	11	0	4.5	175	730	36	1	4	17	102.52	0.01	117.99	3.07	2024-05-13 22:03:20.72	2024-05-13 22:03:20.72
M14864_3314	1/4	cup	60	0	0	0	0	0	0	11	less than 1	0	2	\N	\N	\N	\N	2024-05-13 22:02:54.111	2024-05-13 22:02:54.111
M40967_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:38.768	2024-05-13 22:03:38.768
M32745_3314	3/4	cup	230	30	9	0	3.5	40	360	27	2	3	9	9.90	6.21	138.95	1.76	2024-05-13 21:21:41.866	2024-05-13 21:21:41.866
M15134_3314	1	serving	450	150	23	0	8	100	540	35	2	3	27	30.72	11.17	52.16	3.11	2024-05-13 22:03:38.083	2024-05-13 22:03:38.083
M35575_3314	1	serving	530	170	19	0	3.5	0	420	65	11	4	27	78.50	24.53	165.95	6.28	2024-05-13 22:03:20.228	2024-05-13 22:03:20.228
M19801_3056	1/8	cut	410	130	12	0	4.5	35	1190	52	2	3	25	47.91	32.41	171.85	4.32	2024-05-13 22:03:03.974	2024-05-13 22:03:03.974
M20749_3056	1	each	260	100	12	0	2.5	55	630	25	4	3	12	22.06	28.12	113.88	1.82	2024-05-13 22:03:06.441	2024-05-13 22:03:06.441
M10053_3314	1/2	cup	35	0	0	0	0	0	25	7	2	2	2	\N	12.52	20.88	0.75	2024-05-13 22:02:48.588	2024-05-13 22:02:48.588
M16625_3314	2	each	420	190	21	0	10	90	750	38	1	4	18	124.04	24.45	386.10	2.37	2024-05-13 22:02:48.401	2024-05-13 22:02:48.401
M2349_3056	1/8	cut	410	160	18	0	8	0	520	55	less than 1	27	27	\N	108.16	15.39	1.95	2024-05-13 22:03:06.502	2024-05-13 22:03:06.502
A2008_3056	1	fl oz	150	150	16	0	2.5	10	150	2	0	2	0	2.33	0.97		0.09	2024-05-19 00:01:27.52	2024-05-19 00:01:27.52
M40496_3314	16	fl oz	420		23	0	10	65	1980	42	2	4	10	\N	\N	0.00	1.30	2024-05-13 22:02:41.669	2024-05-13 22:02:41.669
M35805_3314	2	each	280	130	15	0	4	125	115	0	0	0	35	26.31	0.59	7.61	1.97	2024-05-20 00:00:11.283	2024-05-20 00:00:11.283
M21047_3056	1	cup	180	30	3.5	0	0	0	340	30	5	6	10	166.93	21.86	89.86	12.88	2024-05-13 22:02:52.282	2024-05-13 22:02:52.282
M9560_3314	1/2	cup	130	15	1.5	0	0	0	75	26	0	0	3	0.01	0.00	47.29	1.52	2024-05-13 22:03:24.229	2024-05-13 22:03:24.229
M41118_3056	1	each	240	80	13	0	5	45	300	17	2	1	13	14.03	7.03	37.16	1.38	2024-05-13 22:02:03.409	2024-05-13 22:02:03.409
M20044_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:48.009	2024-05-13 22:02:48.009
M32660_3056	1/2	cup	160	25	6	0	2.5	20	160	18	less than 1	2	9	11.61	4.59	45.43	1.61	2024-05-13 21:21:43.34	2024-05-13 21:21:43.34
M40342_3314	1	each	250	110	14	0	3.5	0	210	26	4	less than 1	6	54.61	1.47	45.52	1.72	2024-05-13 22:02:48.026	2024-05-13 22:02:48.026
M32348_3314	1	serving	360	200	23	0	5	110	210	12	0	less than 1	27	0.01	0.00	11.82	1.90	2024-05-13 22:03:39.032	2024-05-13 22:03:39.032
M32348_3056	1	serving	360	200	23	0	5	110	210	12	0	less than 1	27	0.01	0.00	11.82	1.90	2024-05-13 22:02:12.616	2024-05-13 22:02:12.616
M3223_3314	4	fl oz	40	10	1	0	0	0	95	8	2	3	2	22.14	12.40	26.61	0.64	2024-05-13 22:03:38.522	2024-05-13 22:03:38.522
M16226_3056	1	each	610	80	9	0	3	30	1280	97	4	12	35	\N	6.57	0.00	5.46	2024-05-20 22:46:24.122	2024-05-20 22:46:24.122
M20023_3056	1	serving	550	240	27	0	7	85	1060	44	4	3	31	402.12	3.50	290.29	3.63	2024-05-13 21:21:43.883	2024-05-13 21:21:43.883
M33275_3056	1	serving	300	110	13	0	3.5	0	140	47	2	28	2	0.71	3.00	64.71	1.08	2024-05-19 00:01:38.045	2024-05-19 00:01:38.045
M35731_3056	1	cup	220	60	6	0	2.5	25	310	30	3	6	12	214.53	15.27	131.47	12.44	2024-05-19 00:01:41.709	2024-05-19 00:01:41.709
M32680_3056	1	each	470	140	16	0.5	6	50	1110	55	4	3	23	12.38	3.07	259.55	6.25	2024-05-19 00:01:41.771	2024-05-19 00:01:41.771
M21903_3314	1/64	cut	280	110	13	0	1.5	0	140	40	2	22	3	148.01	2.14	70.00	0.98	2024-05-13 22:02:54.049	2024-05-13 22:02:54.049
M37923_3056	1	each	200	80	9	0	1	0	85	26	9	13	5	59.26	0.34	322.79	4.01	2024-05-19 00:01:41.833	2024-05-19 00:01:41.833
M20327_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:41.894	2024-05-19 00:01:41.894
M9650_3314	1/2	cup	130	0	0	0	0	0	0	30	less than 1	0	3	0.00	0.00	12.95	0.30	2024-05-13 21:21:44.31	2024-05-13 21:21:44.31
M34584_3056	4	fl oz	120	40	4.5	0	1	35	170	6	1	3	13	14.68	12.88	26.43	0.97	2024-05-13 22:03:27.882	2024-05-13 22:03:27.882
M32329_3056	1	muffin	80	15	2	0	1	0	110	15	less than 1	8	1	0.26	0.67	0.76	0.19	2024-05-13 22:02:03.461	2024-05-13 22:02:03.461
M21511_3314	3/4	cup	240	50	9	0	2.5	20	880	31	3	5	8	7.22	0.91	99.43	1.68	2024-05-13 22:02:46.362	2024-05-13 22:02:46.362
M40879_3056	1/2	cup	50	15	1.5	0	0	0	50	9	2	3	2	48.85	21.05	17.08	0.47	2024-05-13 22:03:28.133	2024-05-13 22:03:28.133
M33459_3314	1/2	cup	260	140	16	0	6	90	250	3	0	3	23	5.34	1.07	49.37	1.64	2024-05-13 22:02:55.149	2024-05-13 22:02:55.149
M40758_3314	1/2	cup	90	25	2.5	0	0	0	200	17	4	8	2	903.73	7.67	45.52	0.70	2024-05-21 00:00:13.672	2024-05-21 00:00:13.672
M33396_3314	3	fl oz	150	0	13	0	2	0	380	8	0	0	0	11.39	0.93	16.57	0.01	2024-05-13 22:02:51.254	2024-05-13 22:02:51.254
M4277_3314	1	serving	300	60	8	0	1.5	65	520	41	2	4	17	98.70	33.27	33.38	1.44	2024-05-21 00:00:14.736	2024-05-21 00:00:14.736
M35479_3314	1	serving	460	140	14	0	1.5	0	1970	54	2	13	29	1.80	3.75	127.16	5.72	2024-05-13 22:03:23.976	2024-05-13 22:03:23.976
A1227_3314	1	each	560	190	25	0	10	65	1290	60	2	21	26	98.71	10.33		3.80	2024-05-13 22:03:24.039	2024-05-13 22:03:24.039
M35627_3314	1	each	180		18	0	6	30	170	less than 1	0	0	5	1.28	0.00	9.23	0.32	2024-05-13 22:02:45.865	2024-05-13 22:02:45.865
M13237_3056	3	piece	15	0	0	0	0	0	35	2	1	less than 1	2	220.87	27.09	96.89	1.08	2024-05-13 22:02:12.69	2024-05-13 22:02:12.69
M32272_3314	2	fl oz	260	250	27	0	3	0	115	3	less than 1	0	1	60.88	12.58	29.94	1.28	2024-05-21 00:00:14.961	2024-05-21 00:00:14.961
M40016_3056	6	fl oz	100	35	4	0	2	20	970	11	less than 1	3	5	78.67	1.01	66.63	0.46	2024-05-13 22:02:12.88	2024-05-13 22:02:12.88
M20595_3314	1/2	cup	120	30	3	0	0	0	40	21	1	less than 1	2	3.86	6.39	12.28	0.35	2024-05-20 00:00:11.47	2024-05-20 00:00:11.47
M4846_3056	3	ozw	200	60	7	0	2.5	75	270	3	0	2	28	0.04	0.94	22.95	1.14	2024-05-13 22:03:37.654	2024-05-13 22:03:37.654
M3872_3314	1/2	cup	120	5	0.5	0	0	0	10	24	1	1	4	0.00	0.00	8.28	1.19	2024-05-13 22:03:37.407	2024-05-13 22:03:37.407
M32216_3314	1	fl oz	5	0	0	0	0	0	70	1	0	less than 1	0	7.23	3.63	5.16	0.12	2024-05-13 22:02:51.595	2024-05-13 22:02:51.595
M32354_3314	1	serving	360	70	8	0	1.5	0	600	57	4	3	14	65.95	7.37	75.71	1.57	2024-05-23 00:00:16.337	2024-05-23 00:00:16.337
M9894_3056	1/2	cup	20	0	0	0	0	0	70	4	2	less than 1	1	41.50	34.96	22.08	0.37	2024-05-13 22:03:37.715	2024-05-13 22:03:37.715
M37134_3314	1	each	160		10	0	3	375	120	2	0	2	12	\N	\N	50.20	2.02	2024-05-13 22:03:38.584	2024-05-13 22:03:38.584
M15063_3314	2	fl oz	15	0	0	0	0	0	35	3	0	0	0	0.00	0.00	2.30	0.02	2024-05-13 22:03:38.707	2024-05-13 22:03:38.707
M34447_3314	6	fl oz	110	20	3	0	0.5	20	290	13	1	2	7	61.21	6.07	29.34	3.19	2024-05-13 22:03:38.388	2024-05-13 22:03:38.388
M5794_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:38.952	2024-05-13 22:03:38.952
M14883_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:40.876	2024-05-13 22:03:40.876
M3501_3314	1/2	cup	130	15	2.5	0	1	less than 5	260	20	8	2	9	28.86	5.46	52.06	2.63	2024-05-13 22:03:28.506	2024-05-13 22:03:28.506
M9906_3314	1	each	45	0	0	0	0	0	0	10	1	2	1	5.45	2.18	1.36	0.28	2024-05-13 22:02:55.279	2024-05-13 22:02:55.279
M34997_3314	1/2	cup	150	20	9	0	6	0	150	14	3	3	3	312.27	5.65	38.44	1.22	2024-05-13 22:03:05.949	2024-05-13 22:03:05.949
M4878_3314	1/2	cup	110	30	3	0	1	25	320	9	1	5	11	69.83	13.52	28.69	0.82	2024-05-13 22:03:38.516	2024-05-13 22:03:38.516
M34458_3056	6	fl oz	90	30	3.5	0	0.5	10	280	9	1	2	5	2.17	8.35	27.93	3.39	2024-05-13 22:03:06.497	2024-05-13 22:03:06.497
A197_3314	1	serving	980	140	62	0	19	90	3570	89	9	13	23	\N	30.93	0.00	5.66	2024-05-13 22:02:51.469	2024-05-13 22:02:51.469
M13972_3056	1/2	cup	140	5	1	0	0	0	210	27	3	3	6	6.45	0.11	53.87	1.34	2024-05-13 22:03:39.955	2024-05-13 22:03:39.955
M21336_3056	1	serving	100	30	3.5	0	2	0	50	16	less than 1	9	1	1.09	12.38	7.38	0.51	2024-05-13 22:02:52.344	2024-05-13 22:02:52.344
M39651_3056	1	each	470	70	23	0	7	30	980	48	2	4	20	132.91	7.51	410.80	3.28	2024-05-19 00:01:27.137	2024-05-19 00:01:27.137
M40846_3314	1/2	cup	150	25	3	0	0	0	50	29	less than 1	1	3	5.60	8.85	58.27	1.75	2024-05-13 22:02:48.549	2024-05-13 22:02:48.549
M2594_3056	1	serving	360	60	8	0	3	15	700	60	7	7	15	5.67	0.15	106.17	3.49	2024-05-13 22:02:01.132	2024-05-13 22:02:01.132
M19759_3314	1/2	cup	150	5	1	0	0	0	105	31	1	1	5	15.20	2.61	13.37	1.55	2024-05-13 22:03:38.268	2024-05-13 22:03:38.268
M6479_3056	1/2	cup	140	110	13	0	2	5	135	6	2	4	1	45.10	28.77	27.62	0.43	2024-05-19 00:01:27.198	2024-05-19 00:01:27.198
M10040_3056	3	ozw	60	45	5	0	0.5	0	105	3	1	2	1	60.22	13.87	20.27	0.42	2024-05-13 22:02:50.217	2024-05-13 22:02:50.217
M19824_3056	1	cookie	540	230	25	0	13	20	400	72	1	43	5	5.83	0.01	39.04	3.89	2024-05-19 00:01:27.26	2024-05-19 00:01:27.26
M14113_3314	4	each	210	110	12	0	6	10	300	24	less than 1	10	2	\N	0.01	0.00	1.28	2024-05-13 21:21:44.411	2024-05-13 21:21:44.411
M15521_3314	1/2	cup	120	0	3	0	2	10	100	22	3	8	1	807.33	12.74	27.53	0.73	2024-05-13 22:03:24.228	2024-05-13 22:03:24.228
A283_3056	1	fl oz	45	30	3	0	0	0	45	4	2	2	1	2.02	10.71		0.20	2024-05-19 00:01:27.444	2024-05-19 00:01:27.444
M32944_3314	1	roll	120	15	1	0	0	0	220	23	0	3	3	\N	\N	6.28	1.23	2024-05-13 22:03:23.851	2024-05-13 22:03:23.851
M2328_3056	1	each	140	30	3	0	3	0	140	26	0	25	2	0.00	19.42	5.65	0.03	2024-05-13 22:03:35.208	2024-05-13 22:03:35.208
M34527_3314	2	fl oz	320	310	34	0	5	20	320	4	0	3	0	3.83	1.72	7.23	0.16	2024-05-13 22:03:24.165	2024-05-13 22:03:24.165
M40319_3056	1	serving	410	300	26	0	10	50	1040	31	1	1	16	65.08	0.13	41.69	3.16	2024-05-13 22:03:39.9	2024-05-13 22:03:39.9
M40908_3056	1/2	cup	110	15	1.5	0	0	0	70	21	0	1	2	2.96	5.12	45.13	3.91	2024-05-19 00:01:38.855	2024-05-19 00:01:38.855
M14456_3056	1/64	cut	280	70	10	0	5	0	160	45	2	33	3	0.06	0.02	4.49	2.57	2024-05-19 00:01:38.917	2024-05-19 00:01:38.917
M20110_3056	1/4	cup	60	5	1	0	0	0	65	11	0	0	2	\N	\N	\N	\N	2024-05-19 00:01:38.98	2024-05-19 00:01:38.98
M10587_3314	2	link	110	60	7	0	1.5	45	330	less than 1	0	0	10	0.00	0.32	10.08	0.88	2024-05-13 21:21:44.536	2024-05-13 21:21:44.536
M9651_3056	1/2	cup	210	5	0.5	0	0	0	20	47	1	0	4	0.00	0.00	10.39	0.16	2024-05-13 22:03:37.655	2024-05-13 22:03:37.655
M40794_3314	1/2	cup	100	60	6	0	1	30	30	3	less than 1	less than 1	7	16.36	26.36	12.46	0.45	2024-05-24 00:00:13.195	2024-05-24 00:00:13.195
M2594_3314	1	serving	360	60	8	0	3	15	700	60	7	7	15	5.67	0.15	106.17	3.49	2024-05-13 22:03:29.452	2024-05-13 22:03:29.452
L335737_3056	1	/2 cup	90	30	3.5	0	0	0	55	13	2	2	3	\N	16.93	\N	1.16	2024-05-20 22:46:24.395	2024-05-20 22:46:24.395
M9866_3314	1/2	cup	120	5	3.5	0	2	10	80	21	2	2	2	30.78	7.44	24.56	0.33	2024-05-13 22:03:29.641	2024-05-13 22:03:29.641
M2677_3056	3	ozw	180	60	7	0	2.5	75	210	0	0	0	27	0.04	0.00	22.41	1.09	2024-05-19 00:01:39.601	2024-05-19 00:01:39.601
M18537_3314	1	each	160	45	5	0	1	70	105	0	0	0	26	5.34	0.37	14.35	0.90	2024-05-20 00:00:11.284	2024-05-20 00:00:11.284
M32631_3314	1	serving	330	90	10	0	2	65	590	38	3	4	23	119.12	29.21	148.14	4.57	2024-05-13 22:03:23.977	2024-05-13 22:03:23.977
M19842_3314	1/4	cup	40	0	0	0	0	0	0	8	0	0	1	\N	\N	\N	\N	2024-05-13 22:03:38.548	2024-05-13 22:03:38.548
M41017_3056	2	fl oz	15	0	0	0	0	0	40	3	0	2	1	18.62	17.72	24.78	8.26	2024-05-13 22:02:29.096	2024-05-13 22:02:29.096
M10015_3314	1/2	cup	100	45	5	0	2	0	90	14	2	10	1	730.66	2.77	29.57	0.31	2024-05-13 22:02:48.587	2024-05-13 22:02:48.587
M32671_3314	1	each	110	45	6	0	2	50	210	6	less than 1	less than 1	9	1.74	0.80	33.88	1.60	2024-05-21 00:00:14.735	2024-05-21 00:00:14.735
M15674_3056	3	ozw	140	25	3	0	0.5	85	50	0	0	0	26	10.21	0.00	5.64	0.42	2024-05-13 22:03:39.908	2024-05-13 22:03:39.908
M19595_3056	1	each	120	60	6	0	6	less than 5	95	14	0	10	1	0.18	9.12	22.69	0.28	2024-05-19 00:01:38.047	2024-05-19 00:01:38.047
M19864_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:30.017	2024-05-13 22:03:30.017
M20842_3056	1/8	cut	330	130	14	0	6	40	580	35	2	2	16	95.75	11.04	211.33	2.01	2024-05-13 22:02:12.66	2024-05-13 22:02:12.66
M4878_3056	1/2	cup	110	30	3	0	1	25	320	9	1	5	11	69.83	13.52	28.69	0.82	2024-05-13 22:03:33.955	2024-05-13 22:03:33.955
M19921_3056	1/2	cup	240	80	13	0	4	30	400	21	2	2	9	36.66	4.28	167.17	1.41	2024-05-13 22:03:27.884	2024-05-13 22:03:27.884
M40427_3314	1/8	cut	320	100	11	0	4	30	600	41	2	8	17	74.88	2.50	200.36	2.17	2024-05-23 00:00:16.381	2024-05-23 00:00:16.381
M20692_3314	1	serving	490	190	22	0	10	95	880	41	2	2	29	184.72	26.78	459.27	2.83	2024-05-13 22:03:38.954	2024-05-13 22:03:38.954
M4214_3056	2 1/2	ozw	190	60	7	0	2.5	75	250	1	0	less than 1	28	0.00	0.00	22.83	1.13	2024-05-13 21:21:43.848	2024-05-13 21:21:43.848
M34755_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:38.023	2024-05-13 22:03:38.023
M10569_3314	1/2	cup	100	25	3	0	0	0	50	19	2	3	3	9.94	3.53	3.64	0.50	2024-05-13 21:21:42.016	2024-05-13 21:21:42.016
A2944_3056	1	each	50		2	0	0	0	120	3	less than 1	0	5	\N	\N		0.63	2024-05-13 22:03:30.216	2024-05-13 22:03:30.216
M32554_3314	1/2	cup	90	0	0	0	0	0	95	19	less than 1	0	3	0.05	0.01	10.28	0.83	2024-05-21 00:00:14.962	2024-05-21 00:00:14.962
M19746_3314	1	serving	320	110	13	0	6	50	290	31	3	2	19	60.42	1.35	140.01	2.89	2024-05-13 22:03:38.084	2024-05-13 22:03:38.084
M34970_3314	1/2	cup	220	110	12	0	2.5	0	160	4	3	less than 1	22	6.42	0.00	117.37	3.01	2024-05-13 21:21:44.473	2024-05-13 21:21:44.473
M40924_3314	1	serving	240	30	3.5	0	0	0	75	44	3	4	8	51.10	46.14	38.76	5.54	2024-05-13 22:02:46.36	2024-05-13 22:02:46.36
M20955_3314	8	fl oz	220	40	4	0	0.5	0	680	29	9	6	20	61.23	14.98	113.85	4.36	2024-05-13 22:02:41.706	2024-05-13 22:02:41.706
M9934_3314	1/2	cup	100	30	3.5	0	1.5	0	95	12	4	4	5	134.68	16.02	20.95	1.40	2024-05-13 22:03:38.762	2024-05-13 22:03:38.762
M33147_3314	1/2	cup	150	20	2.5	0	0	0	180	30	0	0	4	0.00	0.00	6.04	1.14	2024-05-13 22:03:37.593	2024-05-13 22:03:37.593
M36727_3314	4	each	260	80	9	0	1.5	0	10	49	4	22	1	\N	17.13	3.14	0.91	2024-05-13 22:02:51.781	2024-05-13 22:02:51.781
M4883_3314	2	piece	320	160	18	0	5	115	550	1	0	less than 1	36	63.48	0.51	33.38	2.23	2024-05-13 22:03:37.408	2024-05-13 22:03:37.408
M21174_3314	1	each	460	200	18	0	8	70	1060	45	less than 1	7	30	72.01	48.39	215.81	3.92	2024-05-13 22:03:38.86	2024-05-13 22:03:38.86
M34477_3314	6	fl oz	150	50	8	0	3.5	15	690	15	less than 1	4	5	90.64	3.89	106.38	0.75	2024-05-13 22:03:24.286	2024-05-13 22:03:24.286
M40843_3314	1/2	cup	130	15	1.5	0	0	0	75	26	0	0	3	0.01	0.00	47.29	1.52	2024-05-13 22:02:48.611	2024-05-13 22:02:48.611
M33409_3314	1/2	cup	170	90	11	0	1	0	410	3	0	less than 1	17	0.05	0.13	40.69	1.80	2024-05-13 22:02:55.172	2024-05-13 22:02:55.172
M21890_3314	1/2	cup	80	0	0	0	0	0	350	15	4	1	5	0.21	1.38	41.93	1.29	2024-05-13 22:03:04.885	2024-05-13 22:03:04.885
M33770_3314	1/2	cup	15	0	0	0	0	0	0	3	less than 1	1	1	30.77	7.26	15.98	0.27	2024-05-13 22:03:39.276	2024-05-13 22:03:39.276
M40749_3314	1/2	cup	100	20	2	0	0	0	70	19	1	1	2	2.96	5.14	15.63	3.00	2024-05-13 22:02:54.237	2024-05-13 22:02:54.237
M40079_3314	1	cookie	120	40	4.5	0	2	less than 5	115	18	less than 1	10	1	1.91	0.08	7.78	1.20	2024-05-13 22:02:54.045	2024-05-13 22:02:54.045
M14081_3314	1	each	610	360	39	0	9	50	1390	46	2	6	21	45.50	3.15	191.59	2.54	2024-05-13 22:02:54.27	2024-05-13 22:02:54.27
M37045_3314	6	fl oz	140	10	2	0	0.5	less than 5	45	22	2	10	12	10.42	0.81	130.26	0.71	2024-05-13 22:03:28.171	2024-05-13 22:03:28.171
A1222_3314	1	each	430	170	23	0	7	20	910	42	2	3	15	71.01	5.22		2.96	2024-05-13 22:03:28.915	2024-05-13 22:03:28.915
M40851_3056	1/2	cup	100	10	1.5	0	0	0	10	20	2	1	2	1.03	12.99	9.28	0.72	2024-05-19 00:01:27.184	2024-05-19 00:01:27.184
M33263_3056	1	each	180	40	6	0	3	5	170	31	0	22	1	8.04	0.79	2.84	0.50	2024-05-19 00:01:27.247	2024-05-19 00:01:27.247
M19391_3056	1	cup	390	140	14	0	2.5	70	770	47	2	3	22	63.33	8.06	90.99	4.94	2024-05-13 22:03:29.902	2024-05-13 22:03:29.902
M21677_3314	1	serving	450	180	23	0	7	60	400	37	4	5	22	132.57	23.93	214.60	2.78	2024-05-20 00:00:11.501	2024-05-20 00:00:11.501
M599_3056	1	each	240	150	11	0	5	0	260	32	1	7	4	0.09	0.61	19.74	1.63	2024-05-13 22:02:45.61	2024-05-13 22:02:45.61
A3046_3314	6	fl oz	130	0	8	0	4.5	25	530	12	2	8	2	0.00	0.00		1.11	2024-05-21 00:00:13.744	2024-05-21 00:00:13.744
M10401_3314	1/2	cup	60	45	5	0	0.5	0	60	4	1	3	1	65.82	14.76	25.32	0.48	2024-05-13 22:02:51.52	2024-05-13 22:02:51.52
M34461_3314	6	fl oz	100	30	3	0	0.5	15	300	12	2	2	6	9.80	3.69	29.31	3.63	2024-05-21 00:00:13.737	2024-05-21 00:00:13.737
M21084_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:22.45	2024-05-13 22:03:22.45
M2969_3056	1	each	370	230	25	0	6	40	950	20	2	4	17	35.55	0.38	154.49	1.23	2024-05-13 22:03:39.903	2024-05-13 22:03:39.903
M20651_3314	1	serving	380	140	16	0	6	65	760	40	2	6	20	166.34	3.59	168.63	2.91	2024-05-13 21:21:44.161	2024-05-13 21:21:44.161
M41055_3314	1	serving	370	90	14	0	5	45	680	43	4	2	18	17.26	7.43	63.77	2.33	2024-05-13 22:03:23.983	2024-05-13 22:03:23.983
M4277_3056	1	serving	300	60	8	0	1.5	65	520	41	2	4	17	98.70	33.27	33.38	1.44	2024-05-19 00:01:39.107	2024-05-19 00:01:39.107
M11315_3056	3	ozw	70	25	2.5	0	0	0	180	11	4	5	1	1141.91	4.83	41.12	0.47	2024-05-13 22:03:06.497	2024-05-13 22:03:06.497
M41612_3314	1/2	cup	110	20	2	0	0	0	80	21	1	1	3	41.04	4.03		0.37	2024-05-23 00:00:16.524	2024-05-23 00:00:16.524
M14226_3056	8	fl oz	240	140	16	0	8	25	400	16	2	6	10	191.12	21.53	239.51	0.70	2024-05-13 21:21:43.351	2024-05-13 21:21:43.351
M40883_3314	1/2	cup	120	30	3	0	0	0	190	24	4	5	3	23.16	11.38	14.95	0.87	2024-05-13 22:02:48.533	2024-05-13 22:02:48.533
M33496_3314	1/2	cup	130	40	4.5	0	0.5	30	370	11	1	7	11	72.43	13.49	27.62	0.35	2024-05-13 22:03:38.955	2024-05-13 22:03:38.955
M41141_3056	1/2	cup	160	90	10	0	3	0	320	8	3	2	8	12.86	20.32	25.97	1.76	2024-05-13 21:21:43.538	2024-05-13 21:21:43.538
M33401_3314	1/2	cup	20	0	0	0	0	0	150	5	2	2	1	80.05	25.57	23.73	0.35	2024-05-13 22:03:38.624	2024-05-13 22:03:38.624
M38600_3056	1	serving	640	220	33	0	5	80	1020	58	3	23	27	148.84	54.92	116.56	2.52	2024-05-13 22:02:52.266	2024-05-13 22:02:52.266
M33322_3314	1/2	cup	140	0	0	0	0	0	15	31	0	2	2	0.00	0.05	7.80	0.33	2024-05-13 22:03:29.655	2024-05-13 22:03:29.655
M40946_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:02.954	2024-05-13 22:03:02.954
M35618_3314	1	each	130	35	4	0	1	0	100	23	1	10	2	0.88	5.59	12.95	0.71	2024-05-24 00:00:13.472	2024-05-24 00:00:13.472
M16593_3056	1/2	cup	80	10	2	0	0	45	740	9	1	5	8	72.11	17.80	28.54	0.46	2024-05-13 22:03:37.619	2024-05-13 22:03:37.619
M21184_3056	1/8	cut	380	70	8	0	3.5	25	980	57	3	9	19	72.31	5.50	210.78	3.81	2024-05-13 22:03:37.681	2024-05-13 22:03:37.681
A41_3056	1	serving	930	190	21	0	3	0	1450	151	5	16	35	370.54	75.52		11.59	2024-05-13 21:21:44.099	2024-05-13 21:21:44.099
M20133_3056	1	cup	230	50	7	0	2	20	750	31	3	5	13	48.77	34.34	86.86	1.48	2024-05-13 22:03:41.972	2024-05-13 22:03:41.972
M19739_3314	3	ozw	120	35	3.5	0	1.5	55	330	0	0	0	20	0.00	0.04	6.53	1.83	2024-05-13 22:03:39.033	2024-05-13 22:03:39.033
M32623_3314	1	serving	410	170	19	0	3.5	65	500	38	7	6	24	203.31	86.07	102.96	3.29	2024-05-13 22:02:48.102	2024-05-13 22:02:48.102
M40451_3056	1/8	cut	290	90	10	0	3.5	30	490	34	2	2	16	62.81	2.73	192.24	2.17	2024-05-19 00:01:41.722	2024-05-19 00:01:41.722
M10463_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:41.785	2024-05-19 00:01:41.785
M34685_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:40.177	2024-05-13 22:03:40.177
M21957_3056	1	fl oz	30	15	1.5	0	0	0	150	3	0	less than 1	1	0.00	0.00	14.99	0.01	2024-05-19 00:01:41.973	2024-05-19 00:01:41.973
M34533_3314	2	fl oz	20	0	0	0	0	0	70	5	less than 1	4	0	28.33	16.61	6.66	0.13	2024-05-13 22:02:51.582	2024-05-13 22:02:51.582
M20398_3056	1/8	cut	270	90	10	0	3	15	430	35	2	2	11	160.16	20.14	163.40	2.02	2024-05-13 22:03:35.127	2024-05-13 22:03:35.127
M41518_3314	1/64	cut	280	90	10	0	1	0	240	32	2	27	2	0.43	1.23	10.46	1.73	2024-05-13 22:02:48.348	2024-05-13 22:02:48.348
M41061_3314	1/2	cup	170	40	4.5	0	0	0	120	30	less than 1	less than 1	3	3.68	2.22	61.61	1.95	2024-05-13 22:03:39.275	2024-05-13 22:03:39.275
M6529_3314	1/2	cup	140	50	6	0	0.5	0	85	20	4	1	3	55.38	18.06	32.93	1.50	2024-05-13 22:03:38.246	2024-05-13 22:03:38.246
M33398_3314	1	serving	150	70	9	0	2	5	70	18	2	3	3	13.40	4.02	29.06	0.46	2024-05-13 22:03:39.215	2024-05-13 22:03:39.215
M2983_3314	3	ozw	150	60	7	0	2	110	150	0	0	0	21	7.48	1.22	4.91	0.97	2024-05-13 22:02:51.644	2024-05-13 22:02:51.644
A347_3314	1	fl oz	25	15	2	0	0	0	220	3	1	less than 1	0	7.34	3.33		0.17	2024-05-13 22:02:54.015	2024-05-13 22:02:54.015
M40801_3314	1/2	cup	150	20	2.5	0	0	0	180	30	0	0	4	0.00	0.00	6.04	1.14	2024-05-13 22:03:38.371	2024-05-13 22:03:38.371
M32948_3314	1	each	180	0	0.5	0	0	0	100	37	1	less than 1	5	0.00	0.00	10.14	2.46	2024-05-13 22:03:38.434	2024-05-13 22:03:38.434
M37047_3056	1/8	cut	360	90	10	0	4.5	30	830	49	2	2	20	79.99	6.12	197.68	3.59	2024-05-13 22:02:30.767	2024-05-13 22:02:30.767
M20899_3056	1/8	cut	350	80	8	0	3.5	20	790	54	3	5	16	82.95	12.64	211.42	3.72	2024-05-13 22:03:39.954	2024-05-13 22:03:39.954
M20732_3056	2	each	520	280	31	0	17	80	920	36	0	less than 1	22	272.24	0.00	721.90	2.14	2024-05-13 22:03:40.628	2024-05-13 22:03:40.628
M39853_3056	1	each	350	60	7	0	3.5	40	1300	50	1	8	23	120.77	13.92	149.41	3.25	2024-05-13 22:03:40.668	2024-05-13 22:03:40.668
M14861-166387_3056	1	ozw	35	0	0	0	0	0	0	8	0	0	1	\N	0.00	0.00	0.11	2024-05-13 22:03:42.286	2024-05-13 22:03:42.286
M20954_3314	2	fl oz	40	10	1	0	0	0	95	5	1	2	4	10.90	11.06	38.64	7.50	2024-05-13 22:02:54.208	2024-05-13 22:02:54.208
M3854_3314	1/2	cup	100	0	0	0	0	0	5	20	2	0	4	0.00	0.00	13.07	0.82	2024-05-13 22:02:54.078	2024-05-13 22:02:54.078
M32949_3314	1/2	cup	240	140	16	0	6	90	190	0	0	0	23	1.84	0.00	25.47	1.60	2024-05-13 22:03:29.47	2024-05-13 22:03:29.47
M33116_3314	1/2	cup	80	10	1.5	0	0	0	300	17	3	6	2	\N	\N	53.86	1.59	2024-05-16 00:00:15.287	2024-05-16 00:00:15.287
M21356_3056	3/4	cup	280	50	9	0	3	30	780	42	3	6	9	21.86	7.70	103.90	2.60	2024-05-13 22:03:40.581	2024-05-13 22:03:40.581
M40999_3314	1/2	cup	220	80	9	0	3.5	40	310	16	4	less than 1	17	14.28	1.10	35.24	2.75	2024-05-13 22:02:51.315	2024-05-13 22:02:51.315
M34450_3056	6	fl oz	110	30	3.5	0	0	0	150	18	2	1	2	30.21	2.80	15.18	0.83	2024-05-13 22:03:37.751	2024-05-13 22:03:37.751
M36741_3056	1	piece	460	0	32	0	9	150	280	19	1	0	25	28.69	0.15	21.02	2.19	2024-05-13 22:03:04.903	2024-05-13 22:03:04.903
M33398_3056	1	serving	150	70	9	0	2	5	70	18	2	3	3	13.40	4.02	29.06	0.46	2024-05-13 22:02:52.327	2024-05-13 22:02:52.327
M40947_3056	3	ozw	160	70	8	0	2	110	420	less than 1	0	0	20	12.56	0.01	5.28	0.98	2024-05-19 00:01:27.521	2024-05-19 00:01:27.521
M34957_3314	1	cup	240	40	11	0	6	0	390	28	10	4	10	164.01	23.63	51.69	4.17	2024-05-13 22:02:51.631	2024-05-13 22:02:51.631
M36641_3314	1/2	cup	80	45	5	0	0.5	0	150	8	2	3	1	85.07	18.40	16.02	0.45	2024-05-13 22:03:38.266	2024-05-13 22:03:38.266
M7449_3056	1	each	570	150	33	0	12	80	1930	40	1	7	29	145.64	10.47	277.54	3.16	2024-05-13 22:03:40.645	2024-05-13 22:03:40.645
M41120_3314	1/2	cup	180	60	7	0	1.5	65	1080	16	3	9	14	117.61	140.42	106.18	4.70	2024-05-13 21:21:44.162	2024-05-13 21:21:44.162
M39007_3314	2	piece	430	220	24	0	7	155	1140	2	0	0	48	84.24	0.11	33.82	2.37	2024-05-13 22:03:38.52	2024-05-13 22:03:38.52
A5745_3314	1/2	cup	260	35	10	0	5	0	260	37	2	2	4	58.52	0.08		0.68	2024-05-13 22:02:55.303	2024-05-13 22:02:55.303
M368_3056	1	slice	250	60	8	0	3	35	135	42	1	24	4	105.63	1.64	39.47	1.23	2024-05-13 22:02:28.688	2024-05-13 22:02:28.688
M40348_3314	1	each	230	50	9	0	3	15	310	31	5	4	7	10.52	13.43	92.11	1.57	2024-05-13 22:02:54.101	2024-05-13 22:02:54.101
M1883_3056	1	each	150	45	5	0	3	10	200	26	1	18	2	0.00	0.00	22.20	0.68	2024-05-19 00:01:19.834	2024-05-19 00:01:19.834
M33324_3314	2	fl oz	90	0	0	0	0	0	810	19	less than 1	16	1	0.37	8.49	24.02	0.30	2024-05-13 22:03:38.718	2024-05-13 22:03:38.718
A287_3314	1	each	90	20	2	0	0.5	35	190	less than 1	0	0	15	0.00	0.41		0.70	2024-05-13 22:02:48.089	2024-05-13 22:02:48.089
A2865_3056	1	piece	200	50	5	0	3.5	0	250	34	0	22	2	5.95	4.80		0.77	2024-05-19 00:01:42.027	2024-05-19 00:01:42.027
M5722_3056	1/2	cup	40	20	2.5	0	0	0	60	5	1	3	1	81.05	16.13	22.07	0.26	2024-05-13 22:03:00.829	2024-05-13 22:03:00.829
M21070_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:42.504	2024-05-19 00:01:42.504
M437_3056	2	slice	180	90	9	0	1	0	290	21	less than 1	0	3	0.22	0.11	8.50	1.31	2024-05-13 22:03:39.972	2024-05-13 22:03:39.972
M19488_3314	2	each	380	90	10	0	2	0	500	64	6	10	8	903.53	35.18	198.79	3.86	2024-05-13 22:02:48.401	2024-05-13 22:02:48.401
M14858_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:48.464	2024-05-13 22:02:48.464
M18879_3314	1	serving	250	100	12	0	5	75	460	21	2	3	16	74.42	7.07	159.67	1.61	2024-05-13 22:03:39.034	2024-05-13 22:03:39.034
M16020_3056	1	/48 cut	190	20	2.5	0	0.5	0	310	40	less than 1	21	2	\N	2.58	0.00	2.20	2024-05-13 21:21:43.912	2024-05-13 21:21:43.912
M41138_3314	1	cup	410	110	20	0	7	0	290	45	7	4	14	114.89	2.06	248.22	3.81	2024-05-13 22:03:02.904	2024-05-13 22:03:02.904
M16684_3056	1	each	190	110	12	0	5	40	260	10	1	2	9	59.25	5.34	136.67	0.70	2024-05-13 22:02:28.617	2024-05-13 22:02:28.617
M40511_3056	1/2	sandwich	380	10	11	0	3.5	0	1330	51	6	6	22	0.00	1.13	119.61	4.13	2024-05-13 22:03:40.19	2024-05-13 22:03:40.19
M32740_3056	3/4	cup	290	80	12	0	3	35	850	38	3	5	10	2.52	1.88	68.76	2.25	2024-05-13 22:03:37.624	2024-05-13 22:03:37.624
M41126_3314	6	fl oz	70	20	2.5	0	0	0	290	13	2	2	2	63.59	9.34	26.91	3.06	2024-05-13 22:02:48.276	2024-05-13 22:02:48.276
M19949_3056	1	serving	720	260	29	0	3.5	0	740	97	4	15	19	446.68	15.57	285.94	2.63	2024-05-13 22:03:40.626	2024-05-13 22:03:40.626
M40715_3314	1/2	cup	330	180	20	0	2.5	0	260	28	6	less than 1	10	0.90	3.09	91.45	3.29	2024-05-13 22:03:38.012	2024-05-13 22:03:38.012
M32654_3314	1	cup	220	50	6	0	2.5	25	330	28	4	6	13	211.82	15.06	139.19	12.98	2024-05-13 22:03:38.076	2024-05-13 22:03:38.076
M36744_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:38.456	2024-05-13 22:03:38.456
M14330_3056	1	each	200	60	7	0	4	10	250	34	1	25	2	0.06	3.60	27.41	0.84	2024-05-13 22:03:40.708	2024-05-13 22:03:40.708
M19593_3056	1	each	150	45	9	0	7	less than 5	100	19	1	15	2	0.00	0.00	27.91	1.29	2024-05-13 22:03:40.738	2024-05-13 22:03:40.738
M2194_3056	1	each	160	45	5	0	2.5	less than 5	180	28	0	20	1	0.00	0.00	0.43	0.45	2024-05-13 22:03:40.745	2024-05-13 22:03:40.745
M14535_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:40.799	2024-05-13 22:03:40.799
M33238_3056	1/64	cut	270	110	13	0	1.5	0	150	39	2	21	3	9.09	3.17	67.07	0.99	2024-05-13 21:21:41.256	2024-05-13 21:21:41.256
M34376_3056	1/2	cup	35	5	0.5	0	0	0	85	7	2	2	3	38.43	56.26	42.22	1.12	2024-05-13 22:03:41.357	2024-05-13 22:03:41.357
M21677_3056	1	serving	450	180	23	0	7	60	400	37	4	5	22	132.57	23.93	214.60	2.78	2024-05-13 22:03:41.973	2024-05-13 22:03:41.973
M2908_3056	1/64	cut	230	50	6	0	3	less than 5	160	39	1	30	3	0.00	0.00	32.11	1.57	2024-05-13 22:03:42.095	2024-05-13 22:03:42.095
M40743_3056	3	ozw	60	45	5	0	0	0	105	3	1	2	1	60.22	13.87	20.27	0.42	2024-05-13 22:03:42.368	2024-05-13 22:03:42.368
M20912_3314	4	fl oz	170	45	6	0	1	0	420	24	2	2	6	20.02	6.24	64.00	1.95	2024-05-13 22:03:45.16	2024-05-13 22:03:45.16
M32632_3314	1	serving	320	70	8	0	2	120	630	38	3	5	22	170.85	21.13	85.38	4.14	2024-05-13 22:03:45.531	2024-05-13 22:03:45.531
M40934_3314	1/2	cup	60	25	2.5	0	0	0	150	10	3	2	2	320.42	44.60	42.10	0.94	2024-05-13 22:03:45.773	2024-05-13 22:03:45.773
M34425_3314	6	fl oz	150	80	9	0	3	10	450	12	1	6	4	76.96	1.85	103.80	0.98	2024-05-13 22:03:45.409	2024-05-13 22:03:45.409
A1146_3056	2	fl oz	50	35	3.5	0	2	0	70	less than 1	0	0	1	28.48	0.00		0.05	2024-05-13 22:03:46.753	2024-05-13 22:03:46.753
M3379_3314	1	serving	250	25	3	0	1	25	520	42	2	2	14	158.37	12.07	36.25	1.26	2024-05-13 22:03:46.875	2024-05-13 22:03:46.875
M10550_3314	1/2	cup	170	0	3.5	0	3	0	110	31	1	4	3	0.00	0.14	14.16	0.65	2024-05-13 22:03:47.058	2024-05-13 22:03:47.058
M40089_3314	1/2	cup	190	25	3	0	0.5	0	410	31	7	less than 1	10	0.24	0.03	29.74	2.82	2024-05-13 22:03:40.44	2024-05-13 22:03:40.44
M22100_3056	1	each	270	200	22	0	6	185	290	7	less than 1	1	9	118.35	2.59	131.99	0.92	2024-05-19 00:01:31.478	2024-05-19 00:01:31.478
M33932_3056	1	each	190	30	8	0	5	20	190	27	2	19	2	34.18	0.10	31.73	1.07	2024-05-16 00:00:14.181	2024-05-16 00:00:14.181
M14856_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.109	2024-05-13 21:21:44.109
M2027_3314	1	cookie	120	50	6	0	3	less than 5	95	16	0	9	1	1.46	0.00	3.56	0.97	2024-05-13 21:21:41.814	2024-05-13 21:21:41.814
M6570_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:43.139	2024-05-13 22:02:43.139
M6847_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.875	2024-05-13 21:21:41.875
M6578_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.97	2024-05-13 21:21:41.97
M40358_3314	1	cup	400	160	28	0	13	0	300	15	5	5	21	31.81	16.68	159.74	14.61	2024-05-13 22:03:48.846	2024-05-13 22:03:48.846
M21645_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.943	2024-05-13 21:21:41.943
M15473_3314	1	each	550	320	35	0	6	40	920	44	2	5	18	52.45	1.69	93.36	2.45	2024-05-13 21:21:42.076	2024-05-13 21:21:42.076
M34520_3314	6	fl oz	110	0	2	0	0	0	5	20	3	0	4	0.00	0.00	19.87	1.13	2024-05-13 21:21:44.412	2024-05-13 21:21:44.412
M9906_3056	1	each	45	0	0	0	0	0	0	10	1	2	1	5.45	2.18	1.36	0.28	2024-05-13 22:03:42.49	2024-05-13 22:03:42.49
M13844_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.475	2024-05-13 21:21:44.475
M40904_3056	1/2	cup	70	45	4.5	0	0.5	0	180	7	2	2	2	33.52	43.22	13.11	1.09	2024-05-19 00:01:39.657	2024-05-19 00:01:39.657
M39630_3056	1	muffin	300	90	10	0	6	0	200	35	less than 1	29	2	90.15	0.58	164.04	0.46	2024-05-13 22:03:27.464	2024-05-13 22:03:27.464
M33062_3056	6	fl oz	200	0	1.5	0	0	less than 5	40	39	4	26	11	1.77	8.06	116.15	0.76	2024-05-13 22:00:59.03	2024-05-13 22:00:59.03
M596_3056	1	each	460	210	20	0	11	0	350	68	less than 1	38	4	0.00	0.59	13.80	1.58	2024-05-13 21:21:41.256	2024-05-13 21:21:41.256
M20840_3056	1/8	cut	300	110	12	0	4.5	25	590	36	2	3	14	72.03	3.04	205.61	2.47	2024-05-19 00:01:37.937	2024-05-19 00:01:37.937
M20954_3056	2	fl oz	40	10	1	0	0	0	95	5	1	2	4	10.90	11.06	38.64	7.50	2024-05-13 22:02:01.765	2024-05-13 22:02:01.765
M20082_3056	1/4	cup	110	25	2.5	0	1	0	15	22	2	9	3	\N	\N	\N	\N	2024-05-13 21:21:41.305	2024-05-13 21:21:41.305
M19845_3056	2	tablespoons	25	15	1.5	0	0	0	35	2	less than 1	less than 1	0	\N	\N	\N	\N	2024-05-19 00:01:41.986	2024-05-19 00:01:41.986
M38867_3056	1	serving	300	130	14	0	2.5	0	390	39	1	8	5	\N	\N	84.62	2.41	2024-05-13 21:21:41.366	2024-05-13 21:21:41.366
M14384_3056	3	ozw	150	80	3	0	0	65	220	1	0	1	28	16.08	0.00	11.02	1.20	2024-05-19 00:01:42.23	2024-05-19 00:01:42.23
M32623_3056	1	serving	410	170	19	0	3.5	65	500	38	7	7	24	203.31	86.07	102.96	3.29	2024-05-19 00:01:36.392	2024-05-19 00:01:36.392
M21653_3056	1	each	420	320	35	2	13	95	310	less than 1	0	0	24	\N	0.06	41.28	2.69	2024-05-13 21:21:43.538	2024-05-13 21:21:43.538
M32380_3056	1/2	cup	130	45	5	0	1.5	50	160	1	0	0	18	3.05	0.95	16.84	0.77	2024-05-19 00:01:43.715	2024-05-19 00:01:43.715
M8321_3056	1	each	300	20	18	0	6	30	740	26	1	3	11	\N	0.00	76.02	33.82	2024-05-13 21:21:43.329	2024-05-13 21:21:43.329
M34463_3056	6	fl oz	80	30	3	0	0.5	15	310	7	less than 1	less than 1	5	61.10	1.88	16.04	0.32	2024-05-19 00:01:43.15	2024-05-19 00:01:43.15
M21903_3056	1/64	cut	280	110	13	0	1.5	0	140	40	2	22	3	148.01	2.14	70.00	0.98	2024-05-19 00:01:15.965	2024-05-19 00:01:15.965
M40479_3314	1/8	cut	400	150	16	0	7	30	900	47	2	4	17	69.20	8.75	234.12	3.11	2024-05-21 00:00:14.785	2024-05-21 00:00:14.785
M33534_3056	4	piece	290	200	22	0	4	30	570	13	0	0	12	\N	0.38	14.18	0.61	2024-05-13 21:21:43.392	2024-05-13 21:21:43.392
M40472_3056	1/8	cut	360	100	12	0	6	20	800	49	2	5	15	142.12	22.09	231.89	3.08	2024-05-13 22:02:03.401	2024-05-13 22:02:03.401
M19446_3056	1	serving	380	60	11	0	2.5	35	830	54	4	9	20	94.60	42.20	60.48	2.27	2024-05-19 00:01:39.864	2024-05-19 00:01:39.864
M2787_3056	3	ozw	190	70	7	0	2.5	75	70	2	1	0	28	1.11	0.27	46.07	1.96	2024-05-13 22:03:42.398	2024-05-13 22:03:42.398
M32349_3314	1	serving	390	130	14	0	3	230	690	44	3	8	22	393.86	6.59	144.67	3.17	2024-05-13 22:03:43.942	2024-05-13 22:03:43.942
M15121_3056	1/2	cup	120	40	4.5	0	0.5	75	340	7	1	2	12	24.24	27.86	33.18	4.50	2024-05-13 22:03:41.947	2024-05-13 22:03:41.947
M19878_3056	1	each	430	100	16	0	7	60	1420	44	2	2	27	82.00	0.63	281.21	8.31	2024-05-13 22:03:42.02	2024-05-13 22:03:42.02
A2184_3056	1	each	210	80	11	0	2.5	35	570	16	2	13	14	51.09	16.12		0.86	2024-05-13 22:03:42.334	2024-05-13 22:03:42.334
M40733_3056	3	ozw	150	80	3	0	0	65	220	1	0	1	28	16.35	0.07	12.42	1.30	2024-05-19 00:01:41.222	2024-05-19 00:01:41.222
M21866_3056	1	each	140	35	4	0	0.5	0	360	21	7	3	12	32.77	8.68	88.14	2.41	2024-05-19 00:01:38.048	2024-05-19 00:01:38.048
M37189_3314	1	slice	270	80	10	0	1.5	30	150	43	1	27	3	2.24	0.06	35.06	1.34	2024-05-13 22:03:43.88	2024-05-13 22:03:43.88
M32306_3314	1	fl oz	90	35	4	0	0.5	0	420	13	0	8	1	0.01	0.28	10.72	0.15	2024-05-13 22:03:44.134	2024-05-13 22:03:44.134
M11539_3314	1/2	cup	120	5	3.5	0	2	10	80	21	2	2	2	32.56	13.48	23.99	0.37	2024-05-13 22:03:44.196	2024-05-13 22:03:44.196
M9615_3056	1/2	cup	180	60	7	0	1	65	290	24	less than 1	1	5	34.62	6.39	60.91	1.92	2024-05-19 00:01:41.778	2024-05-19 00:01:41.778
M34546_3056	2	fl oz	50	0	4	0	2.5	10	230	4	0	0	1	30.30	0.00	2.18	0.20	2024-05-13 22:03:41.512	2024-05-13 22:03:41.512
A3503_3314	1	roll	130	45	5	1	1.5	10	230	18	less than 1	5	3	\N	0.00		0.72	2024-05-13 21:21:44.386	2024-05-13 21:21:44.386
M4318_3314	1/2	cup	190	80	11	0	4	50	370	9	1	2	15	10.71	6.74	44.11	2.47	2024-05-13 22:03:45.201	2024-05-13 22:03:45.201
M40399_3314	1	serving	370	25	25	0	19	0	690	34	6	13	3	1072.93	41.84	68.13	2.39	2024-05-13 22:03:45.576	2024-05-13 22:03:45.576
M35576_3056	1/24	cut	430	90	11	0	3.5	0	330	80	3	60	4	0.00	0.00	157.48	4.35	2024-05-19 00:01:43.189	2024-05-19 00:01:43.189
M41066_3056	1	each	160	50	6	0	1	70	230	0	0	0	27	0.00	0.00	6.69	0.81	2024-05-19 00:01:20.087	2024-05-19 00:01:20.087
M41480_3056	1	each	470	90	12	0	3	80	620	54	8	6	35	61.79	12.46	152.24	6.54	2024-05-19 00:01:43.375	2024-05-19 00:01:43.375
M36325_3314	1	fl oz	60	5	5	0	4	0	20	3	less than 1	2	0	0.00	0.34	17.79	0.36	2024-05-13 22:03:46.819	2024-05-13 22:03:46.819
M14820_3314	1	serving	590	240	28	0	7	65	510	50	4	13	37	3.08	1.96	61.66	2.18	2024-05-13 22:03:46.881	2024-05-13 22:03:46.881
M35618_3056	1	each	130	35	4	0	1	0	100	23	1	10	2	0.88	5.59	12.95	0.71	2024-05-13 22:03:20.051	2024-05-13 22:03:20.051
M19735_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.819	2024-05-13 21:21:41.819
M19242_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.813	2024-05-13 21:21:41.813
M40911_3314	1	serving	180	35	4	0	0.5	85	400	6	1	3	27	13.84	8.07	23.08	0.99	2024-05-13 22:02:53.238	2024-05-13 22:02:53.238
M13531_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.937	2024-05-13 21:21:41.937
M14571_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.938	2024-05-13 21:21:41.938
M14343_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.971	2024-05-13 21:21:41.971
M13770_3314	1	each	45	0	0	0	0	0	0	12	2	9	1	10.99	53.16	39.97	0.10	2024-05-13 21:21:42.006	2024-05-13 21:21:42.006
M8321_3314	1	each	300	20	18	0	6	30	740	26	1	3	11	\N	0.00	76.02	33.82	2024-05-13 21:21:42.053	2024-05-13 21:21:42.053
M2007_3314	1	each	150	5	6	0	3.5	0	290	23	less than 1	6	2	0.11	0.14	41.84	1.12	2024-05-13 21:21:44.371	2024-05-13 21:21:44.371
M21906_3314	6	fl oz	370	30	8	0	1	0	10	72	5	33	8	0.61	1.22	54.65	2.39	2024-05-13 21:21:44.411	2024-05-13 21:21:44.411
M2345_3056	1/8	cut	310		12	0	5	55	390	47	3	26	5	650.09	1.96	78.21	1.84	2024-05-16 00:00:13.995	2024-05-16 00:00:13.995
M39263_3314	6	fl oz	150		8	0	3.5	25	720	15	less than 1	1	4	\N	\N	0.00	0.47	2024-05-13 22:03:48.979	2024-05-13 22:03:48.979
M13850_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.475	2024-05-13 21:21:44.475
A435_3056	1	each	590	300	33	0	4.5	55	600	47	8	16	29	307.69	55.30		3.78	2024-05-13 22:03:42.271	2024-05-13 22:03:42.271
M34997_3056	1/2	cup	150	20	9	0	6	0	150	14	3	3	3	312.27	5.65	38.44	1.22	2024-05-13 22:03:41.316	2024-05-13 22:03:41.316
A1221_3056	1	each	1230	120	36	1	15	35	3350	186	8	10	44	73.20	12.38		12.50	2024-05-13 21:21:43.304	2024-05-13 21:21:43.304
M41405_3056	4	each	220	0	12	0	5	0	180	26	1	9	3	230.17	0.18	19.08	1.52	2024-05-13 22:03:20.116	2024-05-13 22:03:20.116
M2969_3314	1	each	370	230	25	0	6	40	950	20	2	4	17	35.55	0.38	154.49	1.23	2024-05-13 22:02:53.237	2024-05-13 22:02:53.237
M13972_3314	1/2	cup	140	5	1	0	0	0	210	27	3	2	6	6.45	0.11	53.87	1.34	2024-05-13 22:02:53.364	2024-05-13 22:02:53.364
M36019_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.493	2024-05-13 21:21:44.493
M35609_3056	1	each	90	40	4.5	0	0.5	0	240	5	1	less than 1	9	0.38	0.00	53.07	0.99	2024-05-13 22:03:22.396	2024-05-13 22:03:22.396
M40042_3056	1	serving	300	130	14	0	2.5	0	390	39	1	8	5	\N	\N	84.62	2.41	2024-05-13 22:02:28.606	2024-05-13 22:02:28.606
A3228_3056	11	each	210	0	6	0	1	25	260	36	0	14	2	9.96	0.00		0.27	2024-05-13 22:03:40.941	2024-05-13 22:03:40.941
M3016_3056	3	ozw	150	80	3	0	0	65	220	1	0	1	28	16.35	0.07	12.42	1.30	2024-05-13 22:03:41.316	2024-05-13 22:03:41.316
M36146_3056	1	each	150	70	8	0	1	25	510	8	2	4	13	114.90	25.12	48.00	1.22	2024-05-13 22:03:41.948	2024-05-13 22:03:41.948
M40090_3056	1	each	420	130	14	0	3	55	720	44	2	3	26	45.12	14.87	41.39	3.68	2024-05-13 22:03:42.019	2024-05-13 22:03:42.019
M14861-166386_3056	1/4	cup	50	0	0	0	0	0	0	11	less than 1	0	2	\N	0.00	0.00	0.16	2024-05-13 22:03:42.279	2024-05-13 22:03:42.279
M18839_3314	1	piece	220	110	12	0	3.5	75	510	1	0	less than 1	24	42.12	0.51	50.78	1.67	2024-05-13 22:03:43.963	2024-05-13 22:03:43.963
M34446_3314	6	fl oz	70	20	2	0	0	15	300	8	less than 1	less than 1	5	123.17	1.62	39.00	0.72	2024-05-13 22:02:53.365	2024-05-13 22:02:53.365
M15119_3314	1/2	cup	160	70	7	0	1	0	240	22	3	3	2	8.55	10.62	20.90	1.59	2024-05-13 22:03:45.711	2024-05-13 22:03:45.711
M9744_3314	1/2	cup	100	0	3	0	2	10	100	18	3	6	2	809.51	12.74	32.70	0.73	2024-05-13 22:03:45.774	2024-05-13 22:03:45.774
M12320_3314	8	fl oz	130	0	0	0	0	0	20	31	3	19	2	3.65	42.85	57.03	0.73	2024-05-13 22:03:43.714	2024-05-13 22:03:43.714
M9722_3314	1/2	cup	140	40	4.5	0	0.5	0	140	24	2	2	2	0.03	14.06	6.04	0.39	2024-05-13 22:03:43.838	2024-05-13 22:03:43.838
M2194_3314	1	each	160	45	5	0	2.5	less than 5	180	28	0	20	1	0.00	0.00	0.43	0.45	2024-05-13 22:03:46.834	2024-05-13 22:03:46.834
M2351_3314	1	cookie	120	40	4.5	0	2	less than 5	115	18	less than 1	10	1	1.91	0.08	7.78	1.20	2024-05-13 21:21:41.817	2024-05-13 21:21:41.817
M10274_3314	1/2	cup	100	20	2	0	0	0	70	19	1	1	2	2.96	5.14	15.63	3.00	2024-05-13 22:03:28.505	2024-05-13 22:03:28.505
M14599_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.475	2024-05-13 21:21:44.475
M32573_3056	1	each	380	190	21	0.5	8	85	360	23	4	3	24	38.58	0.21	131.18	3.50	2024-05-13 22:03:41.067	2024-05-13 22:03:41.067
M2007_3056	1	each	150	5	6	0	3.5	0	290	23	less than 1	6	2	0.11	0.14	41.84	1.12	2024-05-13 21:21:41.254	2024-05-13 21:21:41.254
M21020_3056	1	each	150	20	7	0	4.5	30	140	20	less than 1	12	1	46.98	0.00	5.03	0.81	2024-05-19 00:01:41.826	2024-05-19 00:01:41.826
A3043_3314	6	fl oz	80		4.5	0	2	15	400	9	0	less than 1	2	\N	\N		0.27	2024-05-13 22:03:44.213	2024-05-13 22:03:44.213
M21511_3056	3/4	cup	240	50	9	0	2.5	20	880	31	3	5	8	7.22	0.91	99.43	1.68	2024-05-19 00:01:43.066	2024-05-19 00:01:43.066
M8958_3314	1	each	320	120	12	0.5	4.5	55	330	30	less than 1	4	21	2.01	0.00	94.58	3.37	2024-05-13 21:21:42.079	2024-05-13 21:21:42.079
M34532_3056	2	fl oz	15	0	0	0	0	0	40	3	0	2	1	18.62	17.72	24.78	8.26	2024-05-13 22:02:03.592	2024-05-13 22:02:03.592
M41402_3056	4	each	500	90	22	0	6	0	180	76	2	57	8	229.79	0.32	51.11	2.05	2024-05-13 22:02:03.594	2024-05-13 22:02:03.594
M38678_3056	1	serving	470	310	32	0	12	605	910	15	3	3	28	314.67	28.22	221.20	3.55	2024-05-19 00:01:42.629	2024-05-19 00:01:42.629
M12961_3056	4	each	220	110	12	0	6	10	300	25	less than 1	11	2	0.00	0.00	7.40	1.44	2024-05-19 00:01:42.691	2024-05-19 00:01:42.691
M33062_3314	6	fl oz	200	0	1.5	0	0	less than 5	40	39	4	26	11	1.77	8.06	116.15	0.76	2024-05-13 21:21:44.413	2024-05-13 21:21:44.413
M10583_3314	1	each	130	80	9	0	1.5	0	270	12	less than 1	0	1	\N	\N	0.00	0.00	2024-05-13 21:21:44.493	2024-05-13 21:21:44.493
A486_3056	1/2	cup	130	40	4.5	0	0.5	0	60	20	2	1	2	1.06	12.99		0.76	2024-05-13 22:03:01.034	2024-05-13 22:03:01.034
M13541_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:46.474	2024-05-13 22:02:46.474
M21662_3056	1	each	260	130	15	0	2.5	35	660	17	less than 1	0	15	\N	0.05	18.58	0.76	2024-05-13 21:21:43.92	2024-05-13 21:21:43.92
M14598_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.304	2024-05-13 21:21:41.304
M16589_3314	1/2	cup	200	90	12	0	2	0	760	14	3	6	9	61.42	1.40	47.34	1.32	2024-05-13 22:03:45.524	2024-05-13 22:03:45.524
M34241_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.522	2024-05-13 21:21:43.522
M19060_3056	1/8	cut	480	180	20	0	7	170	1040	52	2	4	22	150.03	0.00	242.15	3.93	2024-05-13 22:03:22.263	2024-05-13 22:03:22.263
M35249_3056	12	fl oz	180	0	0	0	0	0	15	46	4	37	1	3.69	51.42	36.41	0.98	2024-05-13 22:00:59.094	2024-05-13 22:00:59.094
M33727_3056	1	serving	320	150	16	0	5	220	410	29	3	11	14	153.74	6.59	182.50	2.51	2024-05-13 22:03:22.298	2024-05-13 22:03:22.298
M40676_3056	2	each	160	15	1.5	0	0	0	500	33	less than 1	6	5	0.00	0.00	66.69	1.66	2024-05-13 22:02:29.087	2024-05-13 22:02:29.087
M20555_3056	1	each	530	220	18	0	4.5	60	950	80	2	18	10	66.20	0.20	377.71	0.95	2024-05-13 22:03:22.51	2024-05-13 22:03:22.51
A1058_3056	2	each	390	160	17	0	3	90	810	38	3	1	18	44.48	24.86		2.91	2024-05-13 22:03:40.962	2024-05-13 22:03:40.962
A1143_3056	8	fl oz	300	80	14	0	3.5	95	530	22	3	7	23	77.66	40.98		2.90	2024-05-13 22:03:42.369	2024-05-13 22:03:42.369
M40908_3314	1/2	cup	110	15	1.5	0	0	0	70	21	0	1	2	2.96	5.12	45.13	3.91	2024-05-13 22:03:45.792	2024-05-13 22:03:45.792
M19661_3314	1	each	300	180	20	0	4.5	25	480	21	less than 1	2	9	75.87	0.57	90.36	1.28	2024-05-13 22:03:41.152	2024-05-13 22:03:41.152
M34753_3314	1	serving	240	100	12	0	3.5	70	440	8	2	4	25	37.83	29.36	36.90	3.59	2024-05-13 22:03:45.54	2024-05-13 22:03:45.54
M11770_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.991	2024-05-13 21:21:41.991
M36015_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.929	2024-05-13 21:21:41.929
M40494_3056	16	fl oz	150	35	4	0	1	40	1520	20	1	1	10	0.00	1.70	50.09	1.36	2024-05-19 00:01:20.022	2024-05-19 00:01:20.022
M7941_3314	1	each	320	170	19	0	10	25	530	27	0	3	10	223.08	0.00	211.05	1.36	2024-05-13 21:21:42.052	2024-05-13 21:21:42.052
M39438_3314	1	muffin	400	60	24	0.5	14	105	300	44	less than 1	22	5	164.58	0.00	73.97	1.45	2024-05-13 21:21:44.371	2024-05-13 21:21:44.371
M40924_3056	1	serving	240	30	3.5	0	0	0	75	44	3	4	8	51.10	46.14	38.76	5.54	2024-05-13 22:03:41.984	2024-05-13 22:03:41.984
M3828_3056	1/2	cup	110	0	0	0	0	0	10	23	2	0	4	0.00	0.00	15.04	0.92	2024-05-13 22:03:48.275	2024-05-13 22:03:48.275
M40078_3056	1	cookie	240	100	11	0	6	5	190	33	less than 1	19	2	2.91	0.01	3.56	1.94	2024-05-13 21:21:43.517	2024-05-13 21:21:43.517
M38765_3314	8	fl oz	250	80	9	0	5	25	410	31	2	6	10	124.11	0.22	266.67	1.16	2024-05-13 22:03:47.057	2024-05-13 22:03:47.057
M34957_3056	1	cup	240	40	11	0	6	0	390	28	10	4	10	164.01	23.63	51.69	4.17	2024-05-13 22:02:29.418	2024-05-13 22:02:29.418
M9766_3056	1/2	cup	150	25	6	0	3.5	15	125	21	2	2	4	54.76	7.79	73.95	0.35	2024-05-13 22:03:44.518	2024-05-13 22:03:44.518
M8170_3056	1	each	260	50	4.5	0	0.5	0	1000	46	9	5	16	0.00	0.00	130.10	4.29	2024-05-19 00:01:41.746	2024-05-19 00:01:41.746
M21920_3056	1	serving	200	30	3.5	0	0	0	260	38	5	7	6	61.01	65.87	118.66	9.97	2024-05-19 00:01:42.239	2024-05-19 00:01:42.239
A1143_3314	8	fl oz	300	80	14	0	3.5	95	530	22	3	7	23	77.66	40.98		2.90	2024-05-13 22:02:53.214	2024-05-13 22:02:53.214
M9734_3314	1/2	cup	140	60	7	0	0.5	0	200	18	2	less than 1	1	5.88	9.13	5.55	0.29	2024-05-13 21:21:44.519	2024-05-13 21:21:44.519
M39275_3314	6	fl oz	80	5	0	0	0	0	690	16	2	3	3	288.20	4.94	49.37	1.19	2024-05-13 22:02:53.364	2024-05-13 22:02:53.364
M10734_3056	8	fl oz	100	35	4	0	1	15	380	10	less than 1	1	6	79.86	2.50	32.50	1.01	2024-05-13 22:02:01.181	2024-05-13 22:02:01.181
M37394_3056	1	each	440	230	25	0	4	55	450	43	4	7	11	78.28	22.88	44.54	1.67	2024-05-19 00:01:42.534	2024-05-19 00:01:42.534
M21049_3056	1/2	cup	150	35	4	0	0.5	0	320	21	1	15	9	25.94	46.40	42.96	1.34	2024-05-13 22:03:42.433	2024-05-13 22:03:42.433
M40859_3056	1/2	cup	150	100	12	0	1	0	190	11	less than 1	8	1	3.11	3.12	15.05	0.23	2024-05-19 00:01:42.053	2024-05-19 00:01:42.053
M35013_3056	1/2	cup	240	80	12	0	7	35	300	26	2	4	9	132.23	9.76	161.32	1.06	2024-05-19 00:01:42.596	2024-05-19 00:01:42.596
L331357_3056	2	each	150	90	10	0	3	65	590	4	less than 1	3	12	\N	0.00		0.65	2024-05-13 22:03:22.361	2024-05-13 22:03:22.361
M9791_3314	1/2	cup	120	5	3.5	0	2	10	80	21	2	2	2	31.37	7.66	25.41	0.34	2024-05-13 22:03:45.73	2024-05-13 22:03:45.73
M35805_3056	2	each	280	130	15	0	4	125	115	0	0	0	35	26.31	0.59	7.61	1.97	2024-05-19 00:01:43.087	2024-05-19 00:01:43.087
M34504_3056	1/2	cup	40	0	3	0	2	10	105	3	less than 1	2	1	72.81	11.27	16.69	0.32	2024-05-19 00:01:43.149	2024-05-19 00:01:43.149
M34754_3056	1	serving	240	100	12	0	4	70	520	7	1	3	26	4.48	3.24	21.22	2.76	2024-05-19 00:01:43.714	2024-05-19 00:01:43.714
M32321_3056	1	muffin	80	20	2	0	1	0	115	14	0	8	1	0.01	0.01	0.87	0.35	2024-05-19 00:01:42.659	2024-05-19 00:01:42.659
M9729_3056	1/2	cup	120	40	4.5	0	0	0	210	19	2	0	1	0.03	0.00	4.28	0.27	2024-05-13 22:03:20.035	2024-05-13 22:03:20.035
M1997_3056	1	each	170	5	7	0	4	0	270	25	1	9	2	0.00	0.00	40.57	2.12	2024-05-13 22:01:39.339	2024-05-13 22:01:39.339
M21946_3056	1	muffin	100	25	3	0	1.5	0	160	18	1	8	1	0.06	0.75	7.36	0.28	2024-05-13 22:03:03.53	2024-05-13 22:03:03.53
M713_3314	1	each	170	40	6	0	1	0	260	25	0	1	4	0.31	0.07	3.78	1.55	2024-05-13 22:02:53.175	2024-05-13 22:02:53.175
A347_3056	1	fl oz	25	15	2	0	0	0	220	3	1	less than 1	0	7.34	3.33		0.17	2024-05-13 22:02:03.598	2024-05-13 22:02:03.598
M34710_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:22.487	2024-05-13 22:03:22.487
M33147_3056	1/2	cup	150	20	2.5	0	0	0	180	30	0	0	4	0.00	0.00	6.04	1.14	2024-05-13 22:03:42.036	2024-05-13 22:03:42.036
M20924_3056	1/64	cut	420	180	21	0	3	0	100	56	4	34	4	0.00	0.00	37.42	4.81	2024-05-13 22:03:42.098	2024-05-13 22:03:42.098
M41515_3056	1	piece	420	70	12	0	2.5	0	300	77	3	51	3	101.84	3.10	229.35	3.20	2024-05-13 22:03:40.984	2024-05-13 22:03:40.984
A3192_3056	1	each	170	40	6	0	2	0	490	25	2	4	2	8.17	13.45		1.48	2024-05-13 22:03:42.369	2024-05-13 22:03:42.369
M40910_3314	1/2	cup	220	15	2	0	0	0	540	43	7	19	9	2.61	10.98	78.53	3.05	2024-05-13 22:03:44.2	2024-05-13 22:03:44.2
M2030_3314	1	cookie	120	45	5	0	2	5	100	17	0	9	1	2.74	0.00	2.52	0.69	2024-05-13 21:21:41.82	2024-05-13 21:21:41.82
M33519_3314	1/2	cup	200	60	8	0	2	85	190	5	less than 1	2	27	23.54	6.75	35.06	4.42	2024-05-13 22:03:45.517	2024-05-13 22:03:45.517
M34750_3314	1	serving	250	100	12	0	3.5	70	550	8	2	3	25	120.17	3.92	33.17	2.70	2024-05-13 22:03:45.578	2024-05-13 22:03:45.578
M9619_3314	1/2	cup	130	0	0	0	0	0	0	29	0	0	4	0.00	0.00	5.16	0.98	2024-05-13 22:03:45.701	2024-05-13 22:03:45.701
M19967_3314	1/2	cup	40	15	1.5	0	0	0	80	6	2	2	2	278.00	9.04	70.80	0.46	2024-05-13 22:03:45.762	2024-05-13 22:03:45.762
M32582_3314	1	each	440	200	20	0.5	8	80	520	33	1	5	30	43.84	7.53	209.48	4.16	2024-05-13 22:03:47.176	2024-05-13 22:03:47.176
M40391_3314	1/12	cut	340	90	10	0	5	20	840	48	2	5	15	71.74	9.54	227.07	3.21	2024-05-13 21:21:41.879	2024-05-13 21:21:41.879
M34596_3314	2	fl oz	70	35	4	0	1.5	20	25	3	less than 1	2	6	8.14	9.68	27.67	6.86	2024-05-13 22:03:48.955	2024-05-13 22:03:48.955
M9665_3056	1/2	cup	190	50	6	0	0.5	0	115	30	2	1	4	21.04	21.50	56.99	1.79	2024-05-13 22:03:48.325	2024-05-13 22:03:48.325
M14301_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.909	2024-05-13 21:21:41.909
M41511_3056	1	serving	720	320	37	0	10	75	3090	63	4	6	39	\N	8.10	0.00	4.82	2024-05-19 00:01:42.045	2024-05-19 00:01:42.045
M6574_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.99	2024-05-13 21:21:41.99
M10266_3056	1/2	cup	290	210	24	0	4	45	270	16	1	2	4	7.81	4.93	18.77	0.88	2024-05-19 00:01:37.668	2024-05-19 00:01:37.668
M766_3314	1/2	cup	180	120	14	0	3.5	365	360	less than 1	0	0	12	157.88	0.00	60.92	1.74	2024-05-13 21:21:44.456	2024-05-13 21:21:44.456
M14647_3314	1	patty	90	60	7	0	2	30	280	less than 1	0	0	7	0.00	0.12	9.23	0.65	2024-05-13 22:03:31.072	2024-05-13 22:03:31.072
M859_3056	1/2	cup	140	80	9	0	3	365	320	less than 1	0	0	12	157.85	0.00	60.44	1.73	2024-05-13 21:21:41.377	2024-05-13 21:21:41.377
M19281_3056	1	each	160	30	3.5	0	0.5	85	100	5	1	2	26	61.12	0.35	16.69	0.99	2024-05-19 00:01:20.152	2024-05-19 00:01:20.152
M20195_3056	1/2	cup	100	50	6	0	2	0	95	14	3	11	1	759.02	1.86	34.78	0.48	2024-05-13 22:03:42.491	2024-05-13 22:03:42.491
M32954_3056	1	each	340	180	20	0	9	290	810	18	0	less than 1	19	201.61	0.14	309.62	2.41	2024-05-19 00:01:42.597	2024-05-19 00:01:42.597
M40795_3056	1/2	cup	270	160	17	0	6	90	200	3	0	1	23	6.77	1.74	41.01	2.27	2024-05-13 22:03:48.526	2024-05-13 22:03:48.526
M41561_3056	1	cookie	180	60	7	0	4.5	0	55	15	0	13	1	56.95	0.00	23.06	0.33	2024-05-13 21:21:43.521	2024-05-13 21:21:43.521
M2030_3056	1	cookie	230	90	10	0	4.5	15	200	33	0	18	2	5.48	0.00	2.52	1.37	2024-05-13 21:21:43.911	2024-05-13 21:21:43.911
M5804_3056	1/2	cup	150	130	14	0	2	10	150	5	2	3	1	42.31	21.04	27.37	0.37	2024-05-13 21:21:43.884	2024-05-13 21:21:43.884
A1219_3056	1	each	1190	120	32	0.5	13	25	3190	185	8	9	42	70.99	12.37		12.32	2024-05-13 21:21:43.303	2024-05-13 21:21:43.303
M34201_3056	1	each	170	35	4	0	2	less than 5	230	31	2	14	2	0.65	1.85	2.32	0.42	2024-05-13 22:03:22.361	2024-05-13 22:03:22.361
M4880_3056	1/24	cut	290	150	17	0	8	390	700	11	less than 1	2	22	232.07	8.24	311.83	2.58	2024-05-13 21:21:41.239	2024-05-13 21:21:41.239
M36741_3314	1	piece	460	0	32	0	9	150	280	19	1	0	25	28.69	0.15	21.02	2.19	2024-05-13 22:03:48.831	2024-05-13 22:03:48.831
M32349_3056	1	serving	390	130	14	0	3	230	690	44	3	8	22	393.86	6.59	144.67	3.17	2024-05-19 00:01:10.47	2024-05-19 00:01:10.47
M33856_3056	1	serving	340	50	8	0	2	45	1320	41	2	5	23	333.82	8.53	73.08	3.73	2024-05-13 22:03:42.395	2024-05-13 22:03:42.395
M36069_3314	1	serving	600	220	29	0	13	105	1150	57	4	7	29	185.23	1.25	377.47	2.37	2024-05-13 22:03:45.199	2024-05-13 22:03:45.199
A81_3314	1/2	cup	170	20	2.5	0	0	0	0	32	less than 1	0	3	0.00	1.84		0.40	2024-05-13 22:03:45.757	2024-05-13 22:03:45.757
M14883_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:43.754	2024-05-13 22:03:43.754
M4892_3314	1	serving	360	110	13	0	4.5	75	660	41	2	5	17	19.66	30.54	190.38	2.92	2024-05-13 22:03:28.454	2024-05-13 22:03:28.454
M40676_3314	2	each	160	15	1.5	0	0	0	500	33	less than 1	6	5	0.00	0.00	66.69	1.66	2024-05-13 22:03:21.239	2024-05-13 22:03:21.239
M20948_3314	1	each	160	45	5	0	1	85	50	0	0	0	26	\N	0.12	0.00	0.53	2024-05-13 21:21:41.911	2024-05-13 21:21:41.911
M17162_3056	1	each	160	40	5	0	4.5	less than 5	200	26	0	16	2	0.17	8.36	8.17	4.33	2024-05-19 00:01:41.839	2024-05-19 00:01:41.839
M14598_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.482	2024-05-13 21:21:44.482
M2323_3056	1/2	cup	70	0	0	0	0	0	105	17	0	17	1	0.00	14.56	3.94	0.02	2024-05-19 00:01:42.352	2024-05-19 00:01:42.352
M9879_3314	2	ozw	110	50	6	0	0.5	0	260	14	less than 1	0	1	\N	\N	0.00	0.00	2024-05-13 21:21:42.015	2024-05-13 21:21:42.015
M1925_3056	1/64	cut	270	130	15	0	8	40	340	31	2	20	4	138.44	0.02	46.62	1.20	2024-05-19 00:01:43.188	2024-05-19 00:01:43.188
M32244_3056	1	each	370	210	23	0	6	130	230	less than 1	0	0	38	87.12	0.14	19.31	2.14	2024-05-19 00:01:43.742	2024-05-19 00:01:43.742
M8170_3314	1	each	280	60	5	0	0.5	0	1180	50	11	6	19	0.00	0.00	130.10	4.93	2024-05-13 21:21:42.077	2024-05-13 21:21:42.077
M14528_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.473	2024-05-13 21:21:44.473
M9706_3056	1/2	cup	150	25	3	0	0	0	55	29	less than 1	less than 1	3	0.00	1.04	57.12	1.75	2024-05-13 22:03:06.477	2024-05-13 22:03:06.477
M40425_3056	1/8	cut	290	100	11	0	4	20	500	36	2	3	13	142.12	15.53	201.82	2.16	2024-05-13 22:03:42.016	2024-05-13 22:03:42.016
M32248_3314	2	piece	260	160	18	0	5	90	300	less than 1	0	0	23	\N	1.93	16.77	1.18	2024-05-13 22:03:45.571	2024-05-13 22:03:45.571
M5630_3056	1/8	cut	340	70	8	0	3.5	20	790	52	2	4	16	71.76	2.98	205.88	3.60	2024-05-13 21:21:43.849	2024-05-13 21:21:43.849
A5808_3056	1	each	500	150	18	0	6	90	1190	48	5	8	32	12.21	36.75		4.77	2024-05-13 22:03:44.695	2024-05-13 22:03:44.695
M34961_3314	1	serving	480	90	21	0	12	0	550	59	7	11	15	10.18	17.05	105.77	3.42	2024-05-13 22:02:53.202	2024-05-13 22:02:53.202
M33196_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.523	2024-05-13 21:21:43.523
A2938_3056	1	serving	330	35	7	0	3.5	55	1310	42	2	13	24	127.43	16.10		1.50	2024-05-13 22:03:37.92	2024-05-13 22:03:37.92
M18748_3314	1	cup	370	200	22	0	7	35	750	32	6	7	13	43.82	44.99	75.40	2.51	2024-05-13 21:21:44.167	2024-05-13 21:21:44.167
M40764_3056	1/2	cup	100	10	1.5	0	0	0	105	20	2	1	2	1.44	13.10	12.70	0.85	2024-05-19 00:01:10.209	2024-05-19 00:01:10.209
M34605_3314	2 3/4	ozw	70	20	2.5	0	0	0	170	11	4	5	1	1142.64	5.30	41.92	0.52	2024-05-13 22:03:48.978	2024-05-13 22:03:48.978
M20106_3056	1/4	cup	70	5	0.5	0	0	0	250	12	4	0	4	\N	\N	\N	\N	2024-05-13 22:02:03.585	2024-05-13 22:02:03.585
A3247_3056	1	serving	280	15	10	0	7	0	570	42	4	4	6	11.28	9.60		2.58	2024-05-13 22:03:41.003	2024-05-13 22:03:41.003
M15078_3056	1	serving	410	90	9	0	1.5	0	790	67	7	7	17	71.83	17.03	178.06	5.51	2024-05-13 22:03:42.078	2024-05-13 22:03:42.078
A2858_3056	1	piece	200	50	6	0	4	5	270	33	0	19	3	0.15	1.09		0.74	2024-05-13 22:03:42.332	2024-05-13 22:03:42.332
M20394_3056	1/8	cut	380	80	9	0	3	50	770	51	2	4	25	61.40	2.15	168.28	3.66	2024-05-19 00:01:41.735	2024-05-19 00:01:41.735
M32830_3314	1/2	cup	80	45	4.5	0	0.5	0	35	11	2	5	1	19.44	40.80	25.83	0.42	2024-05-13 22:03:44.117	2024-05-13 22:03:44.117
M40931_3056	1	serving	200	30	3.5	0	0	0	260	38	5	7	6	61.01	65.87	118.66	9.97	2024-05-13 22:03:40.623	2024-05-13 22:03:40.623
M32304_3314	1/2	cup	20	0	0	0	0	0	260	4	1	1	1	62.58	15.74	22.68	0.33	2024-05-13 22:03:45.116	2024-05-13 22:03:45.116
A4872_3314	1	serving	510	190	23	0	9	65	740	53	4	21	25	159.28	55.68		3.04	2024-05-13 22:03:45.179	2024-05-13 22:03:45.179
M40821_3314	1/2	cup	130	15	1.5	0	0	0	75	27	0	0	3	0.01	1.11	53.70	1.58	2024-05-13 22:03:45.366	2024-05-13 22:03:45.366
M33627_3314	1	serving	320	20	12	0	9	35	260	38	3	5	15	35.82	30.18	40.09	1.29	2024-05-13 22:03:45.552	2024-05-13 22:03:45.552
M41369_3056	1	each	560	120	30	0.5	11	150	710	44	2	3	28	112.62	14.26	98.64	9.52	2024-05-19 00:01:42.535	2024-05-19 00:01:42.535
M20846_3056	1/8	cut	310	90	10	0	3.5	25	730	40	2	7	16	72.28	5.50	201.90	2.51	2024-05-13 22:03:46.539	2024-05-13 22:03:46.539
M32500_3314	1	each	290	130	15	0	7	25	960	28	less than 1	4	11	43.44	3.32	193.34	2.19	2024-05-13 22:03:46.787	2024-05-13 22:03:46.787
M40529_3314	1	serving	470	210	27	0	4.5	0	1620	44	7	4	17	18.56	5.99	107.13	2.75	2024-05-13 22:03:43.992	2024-05-13 22:03:43.992
M41411_3056	1	each	180	10	7	0	4	10	190	26	less than 1	18	2	0.03	0.00	18.21	0.98	2024-05-19 00:01:41.993	2024-05-19 00:01:41.993
M14283_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.937	2024-05-13 21:21:41.937
M1461_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.42	2024-05-13 21:21:44.42
M36753_3314	1	serving	370	260	27	0	4.5	20	1010	30	2	5	9	2.30	19.06	34.44	1.11	2024-05-13 22:03:51.247	2024-05-13 22:03:51.247
M21908_3314	1	serving	130	60	6	0	1	0	270	11	3	2	8	7.32	15.48	63.89	1.11	2024-05-13 22:02:45.811	2024-05-13 22:02:45.811
M9786_3056	3	ozw	190	80	9	0	1.5	0	410	22	1	0	1	\N	\N	10.18	0.00	2024-05-13 21:21:43.339	2024-05-13 21:21:43.339
M3040_3056	3	ozw	160	45	5	0	1	85	100	less than 1	0	0	26	10.21	0.09	6.99	0.45	2024-05-13 21:21:43.29	2024-05-13 21:21:43.29
M214_3056	8	fl oz	140	5	0.5	0	0	0	20	33	4	22	2	3.65	15.43	49.84	0.32	2024-05-13 22:02:28.735	2024-05-13 22:02:28.735
M18660_3314	1	cup	320	110	13	0	4	15	980	40	4	6	12	42.16	5.38	133.15	1.43	2024-05-16 00:00:16.406	2024-05-16 00:00:16.406
M32256_3314	1/2	cup	110	30	3	0	1.5	0	85	18	2	2	3	45.14	8.00	29.04	0.91	2024-05-13 22:03:48.976	2024-05-13 22:03:48.976
M33009_3056	1/2	cup	70	45	5	0	0.5	0	160	5	3	2	2	1.23	52.84	19.86	0.40	2024-05-13 22:03:41.004	2024-05-13 22:03:41.004
A3201_3056	1	each	200	90	12	0	2	0	380	19	2	less than 1	3	15.97	3.32		1.40	2024-05-13 22:03:41.025	2024-05-13 22:03:41.025
M34358_3056	1/2	cup	40	0	0	0	0	0	200	9	3	4	3	414.48	7.05	20.13	0.82	2024-05-13 22:03:42.043	2024-05-13 22:03:42.043
A4385_3056	1/2	cup	120	0	0	0	0	0	40	28	0	0	0	0.00	0.00		0.00	2024-05-13 22:03:42.335	2024-05-13 22:03:42.335
M20696_3056	1/2	cup	180	45	5	0	1.5	0	220	29	0	0	3	44.09	1.46	13.36	0.29	2024-05-13 22:03:42.35	2024-05-13 22:03:42.35
M32603_3056	1	serving	570	250	27	0	6	30	1000	59	9	9	24	42.54	28.16	373.50	6.61	2024-05-13 22:03:42.375	2024-05-13 22:03:42.375
M16572_3056	1/2	cup	130	50	6	0	1	40	380	11	1	7	9	71.09	13.49	26.78	0.55	2024-05-13 22:03:42.425	2024-05-13 22:03:42.425
M40463_3056	1/8	cut	440	160	18	0	7	35	1010	53	3	4	17	98.66	3.65	221.22	3.65	2024-05-13 22:03:42.439	2024-05-13 22:03:42.439
M4929_3056	1	portion	540	410	45	0	14	155	1710	3	less than 1	2	31	29.14	0.04	32.91	2.37	2024-05-13 22:02:52.237	2024-05-13 22:02:52.237
M21855_3314	1/2	cup	150	40	6	0	1.5	30	240	11	2	2	13	4.87	6.34	22.97	4.86	2024-05-13 22:03:43.941	2024-05-13 22:03:43.941
M40798_3314	1	serving	220	100	11	0	3	100	310	6	less than 1	5	24	24.54	2.80	11.85	1.81	2024-05-13 22:03:43.949	2024-05-13 22:03:43.949
M39649_3314	1	each	460	90	16	0	2.5	0	1080	68	5	18	14	166.99	74.21	143.54	4.04	2024-05-13 22:03:44.005	2024-05-13 22:03:44.005
M32316_3314	1/2	cup	100	45	5	0	0.5	0	115	13	1	less than 1	2	29.74	7.80	19.14	0.38	2024-05-13 22:03:44.195	2024-05-13 22:03:44.195
M14891_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.814	2024-05-13 21:21:41.814
M40825_3314	8	fl oz	420	170	18	0	4.5	40	540	47	9	6	15	100.43	16.56	152.08	2.82	2024-05-13 22:03:45.195	2024-05-13 22:03:45.195
M33862_3314	1	each	490	80	23	0	9	0	510	60	4	3	12	6.19	0.14	210.03	2.59	2024-05-13 22:03:45.201	2024-05-13 22:03:45.201
M14364_3314	1	each	80		5	0	1.5	185	60	1	0	1	6	\N	\N	25.10	1.01	2024-05-13 22:03:45.264	2024-05-13 22:03:45.264
M34535_3314	2	fl oz	15	0	0	0	0	0	140	3	less than 1	2	0	14.46	7.25	6.77	0.25	2024-05-13 22:03:45.477	2024-05-13 22:03:45.477
A3068_3314	1/2	cup	240	110	12	0	4	90	670	8	0	6	27	0.00	0.06		1.61	2024-05-13 22:03:45.574	2024-05-13 22:03:45.574
M21179_3314	1/4	cup	50	0	0	0	0	0	0	11	0	0	1	\N	\N	\N	\N	2024-05-13 22:02:53.24	2024-05-13 22:02:53.24
M14289_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:03:45.627	2024-05-13 22:03:45.627
M41010_3314	1/2	cup	100	80	9	0	0.5	0	95	2	less than 1	0	2	0.03	0.74	6.34	0.15	2024-05-13 22:03:45.792	2024-05-13 22:03:45.792
M12961_3314	4	each	220	110	12	0	6	10	300	25	less than 1	11	2	0.00	0.00	7.40	1.44	2024-05-13 22:03:43.692	2024-05-13 22:03:43.692
M40418_3314	1/12	cut	370	90	12	0	6	25	930	48	2	5	17	72.98	9.54	228.55	3.31	2024-05-13 21:21:41.881	2024-05-13 21:21:41.881
L221951_3314	3	fl oz	370	160	19	0	3	65	150	44	3	24	7	45.67	0.08		1.47	2024-05-13 22:03:43.697	2024-05-13 22:03:43.697
A1938_3314	1	serving	430	130	17	0	5	70	430	52	5	5	19	46.46	24.25		18.42	2024-05-13 22:03:43.76	2024-05-13 22:03:43.76
M21061_3056	1/2	cup	100	40	4.5	0	1	20	330	10	1	6	7	134.08	16.69	21.80	0.70	2024-05-13 22:03:46.505	2024-05-13 22:03:46.505
M14258_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:43.136	2024-05-13 22:02:43.136
M14545_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.941	2024-05-13 21:21:41.941
M9520_3314	1	each	520	420	46	0	16	100	1130	6	2	2	20	3.49	0.48	34.02	1.81	2024-05-13 22:03:46.879	2024-05-13 22:03:46.879
M39651_3314	1	each	470	70	23	0	7	30	980	48	2	4	20	132.91	7.51	410.80	3.28	2024-05-13 22:03:46.929	2024-05-13 22:03:46.929
M19737-166513_3314	1/4	cup	45	0	0	0	0	0	55	8	3	0	3	0.00	0.60	267.62	1.09	2024-05-13 22:03:46.992	2024-05-13 22:03:46.992
M34442_3314	6	fl oz	100	25	3	0	0	0	310	15	3	3	4	95.30	5.14	30.89	1.37	2024-05-13 22:03:44.202	2024-05-13 22:03:44.202
M37958_3056	1	each	470	200	23	0	3.5	15	600	60	2	7	7	2.74	17.39	86.99	1.89	2024-05-19 00:01:43.077	2024-05-19 00:01:43.077
M9616_3056	1/2	cup	100	0	0	0	0	0	0	22	1	0	4	0.00	0.00	8.58	0.31	2024-05-19 00:01:43.14	2024-05-19 00:01:43.14
M19303_3056	1	each	160	45	5	0	1	85	50	0	0	0	26	10.31	0.02	8.49	0.62	2024-05-13 22:03:41.98	2024-05-13 22:03:41.98
M32256_3056	1/2	cup	110	30	3	0	1.5	0	85	18	2	2	3	45.14	8.00	29.04	0.91	2024-05-13 22:02:29.472	2024-05-13 22:02:29.472
M11770_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:19.958	2024-05-19 00:01:19.958
M40876_3056	1	fl oz	25	15	2	0	0	0	30	2	0	less than 1	0	9.17	3.28	5.26	0.23	2024-05-19 00:01:43.955	2024-05-19 00:01:43.955
M21853_3056	1	fl oz	10	0	0	0	0	0	75	2	less than 1	0	0	38.72	7.46	13.84	0.34	2024-05-13 22:03:42.27	2024-05-13 22:03:42.27
M11624_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.944	2024-05-13 21:21:41.944
M15668_3314	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:44.51	2024-05-13 21:21:44.51
M214_3314	8	fl oz	140	5	0.5	0	0	0	20	33	4	22	2	3.65	15.43	49.84	0.32	2024-05-13 22:02:45.794	2024-05-13 22:02:45.794
A2937_3056	1	sandwich	560	270	30	0	7	55	1290	51	2	8	22	104.33	9.60		3.12	2024-05-19 00:01:43.391	2024-05-19 00:01:43.391
M32249_3056	2	piece	260	160	18	0	5	90	340	less than 1	0	0	23	\N	2.19	19.78	1.38	2024-05-13 22:03:48.276	2024-05-13 22:03:48.276
M33241_3314	1	piece	260	90	10	0	1	0	130	40	1	21	2	0.66	2.64	59.80	1.05	2024-05-13 21:21:44.432	2024-05-13 21:21:44.432
M34943_3056	8	fl oz	300	90	11	0	2.5	25	770	36	2	0	13	3.85	0.07	36.56	1.26	2024-05-16 00:00:14.137	2024-05-16 00:00:14.137
A3043_3056	6	fl oz	80		4.5	0	2	15	400	9	0	less than 1	2	\N	\N		0.27	2024-05-13 22:03:44.707	2024-05-13 22:03:44.707
M9955_3056	1/2	cup	50	15	1.5	0	0	0	50	9	2	3	2	48.85	21.05	17.08	0.47	2024-05-13 22:03:42.486	2024-05-13 22:03:42.486
M32320_3056	1	muffin	100	20	2.5	0	1	0	130	20	0	12	1	20.07	0.23	8.84	0.59	2024-05-13 22:03:20.043	2024-05-13 22:03:20.043
A4982_3056	1	sandwich	300	110	14	0	4.5	140	590	24	less than 1	2	17	46.79	0.00		1.67	2024-05-13 21:21:41.364	2024-05-13 21:21:41.364
M40411_3314	1/12	cut	420	140	17	0	8	35	1040	49	2	5	19	74.52	9.67	240.89	3.50	2024-05-13 22:03:45.258	2024-05-13 22:03:45.258
M41036_3056	3	ozw	150	35	4	0	0.5	85	50	0	0	0	26	10.21	0.00	5.64	0.42	2024-05-13 21:21:43.536	2024-05-13 21:21:43.536
M39674_3056	1	serving	450	60	7	0	2	60	990	67	5	14	30	744.97	25.04	112.91	3.37	2024-05-19 00:01:14.757	2024-05-19 00:01:14.757
M10588_3056	1	patty	180		18	0	6	30	170	less than 1	0	0	5	1.28	0.00	9.23	0.32	2024-05-13 22:02:28.496	2024-05-13 22:02:28.496
M33003_3056	1	each	310	170	18	0	8	280	700	18	0	less than 1	17	231.10	1.32	314.01	2.48	2024-05-19 00:01:15.902	2024-05-19 00:01:15.902
M32679_3056	1	serving	400	140	16	0	6	60	910	41	4	3	24	58.34	6.56	154.78	2.96	2024-05-13 22:03:30.497	2024-05-13 22:03:30.497
M34448_3056	6	fl oz	70	20	2.5	0	0	0	290	13	2	2	2	63.59	9.34	26.91	3.06	2024-05-13 22:03:40.691	2024-05-13 22:03:40.691
M35964_3056	1	each	270		7	0	4	15	390	43	2	3	8	75.29	0.71	17.01	2.47	2024-05-13 22:00:59.154	2024-05-13 22:00:59.154
M20112_3056	2	tablespoons	5	0	0	0	0	0	55	1	0	less than 1	0	\N	\N	\N	\N	2024-05-13 22:03:40.879	2024-05-13 22:03:40.879
M34518_3056	6	fl oz	90	0	0	0	0	0	5	20	less than 1	0	2	0.00	0.00	210.07	7.32	2024-05-13 22:00:57.929	2024-05-13 22:00:57.929
M34533_3056	2	fl oz	20	0	0	0	0	0	70	5	less than 1	4	0	28.33	16.61	6.66	0.13	2024-05-13 22:02:50.387	2024-05-13 22:02:50.387
A3459_3056	1	each	380	200	23	0	5	110	540	16	1	0	28	24.47	0.23		2.48	2024-05-13 22:03:46.739	2024-05-13 22:03:46.739
M33400_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:45.746	2024-05-13 22:02:45.746
M398_3056	1	muffin	340	80	9	0	4.5	less than 5	510	61	1	34	3	0.30	0.38	2.36	1.54	2024-05-13 22:00:59.085	2024-05-13 22:00:59.085
M33496_3056	1/2	cup	130	40	4.5	0	0.5	30	370	11	1	7	11	72.43	13.49	27.62	0.35	2024-05-13 22:01:39.279	2024-05-13 22:01:39.279
M34970_3056	1/2	cup	220	110	12	0	2.5	0	160	4	3	less than 1	22	6.42	0.00	117.37	3.01	2024-05-13 21:21:41.16	2024-05-13 21:21:41.16
M34422_3056	6	fl oz	180	100	12	0	6	20	330	12	1	4	8	159.21	13.40	196.30	0.60	2024-05-13 22:03:40.708	2024-05-13 22:03:40.708
M15668_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.318	2024-05-13 21:21:41.318
M20662_3056	1	each	360	140	16	0	8	40	420	39	3	6	16	178.07	0.01	349.47	1.48	2024-05-13 22:02:52.262	2024-05-13 22:02:52.262
M41061_3056	1/2	cup	170	40	4.5	0	0	0	120	30	less than 1	less than 1	3	3.68	2.22	61.61	1.95	2024-05-13 22:03:31.248	2024-05-13 22:03:31.248
M20187_3056	2	tablespoons	30	0	0	0	0	0	0	6	0	0	1	\N	\N	\N	\N	2024-05-13 22:03:30.638	2024-05-13 22:03:30.638
M20953_3056	1	each	150	40	4.5	0	1	0	360	20	less than 1	1	6	23.90	15.29	85.73	1.70	2024-05-13 22:01:43.876	2024-05-13 22:01:43.876
M21113_3056	1	each	560	160	19	0	5	45	1570	63	7	5	31	43.75	2.11	183.22	4.41	2024-05-13 22:03:30.553	2024-05-13 22:03:30.553
M40029_3056	6	fl oz	80	15	2	0	1	5	420	14	2	9	2	\N	\N	37.13	1.27	2024-05-13 22:03:46.567	2024-05-13 22:03:46.567
M3223_3056	4	fl oz	40	10	1	0	0	0	95	8	2	3	2	22.14	12.40	26.61	0.64	2024-05-13 22:03:00.779	2024-05-13 22:03:00.779
M5644_3056	1/8	cut	360	70	10	0	4.5	25	880	52	2	4	17	73.00	2.98	207.36	3.70	2024-05-13 21:21:43.858	2024-05-13 21:21:43.858
M39971_3056	1	each	110	25	3	0	0	0	730	16	8	1	11	0.00	0.00	56.97	2.60	2024-05-13 21:21:43.398	2024-05-13 21:21:43.398
M14571_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.413	2024-05-13 21:21:43.413
M10583_3056	1	each	130	80	9	0	1.5	0	270	12	less than 1	0	1	\N	\N	0.00	0.00	2024-05-13 21:21:41.253	2024-05-13 21:21:41.253
M14343_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.474	2024-05-13 21:21:43.474
M19735_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.476	2024-05-13 21:21:43.476
M22052_3056	1	each	540	160	18	0	5	55	990	65	7	6	30	77.05	17.36	223.97	3.82	2024-05-19 00:01:43.123	2024-05-19 00:01:43.123
M1884_3056	1	each	160	50	6	0	3	10	210	27	1	19	2	0.00	0.00	22.20	0.68	2024-05-13 22:02:12.691	2024-05-13 22:02:12.691
M39194_3056	1/2	cup	250	70	13	0	5	45	380	23	2	3	11	62.08	7.81	191.16	1.74	2024-05-13 22:03:30.808	2024-05-13 22:03:30.808
M14195_3056	1	each	360	200	22	0	6	70	830	19	1	2	22	42.12	3.64	87.83	1.88	2024-05-13 22:02:52.31	2024-05-13 22:02:52.31
M14095_3056	4	ozw	70	10	2.5	0	0	0	360	11	3	6	2	30.11	9.13	58.48	0.97	2024-05-13 21:21:43.862	2024-05-13 21:21:43.862
M14647_3056	1	patty	90	60	7	0	2	30	280	less than 1	0	0	7	0.00	0.12	9.23	0.65	2024-05-13 22:02:03.419	2024-05-13 22:02:03.419
M21938_3056	1	each	360	150	15	0.5	5	70	340	30	less than 1	4	26	2.57	0.00	95.44	3.91	2024-05-13 22:03:31.218	2024-05-13 22:03:31.218
M36624_3056	4	fl oz	130	30	3.5	0	0	0	50	23	3	3	4	102.08	42.63	25.44	0.78	2024-05-13 22:03:41.003	2024-05-13 22:03:41.003
M13850_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.303	2024-05-13 21:21:41.303
M14638_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.318	2024-05-13 21:21:41.318
M36634_3056	1/2	cup	90	10	3	0	0	45	620	8	2	5	8	72.11	17.80	27.32	0.47	2024-05-13 22:03:29.891	2024-05-13 22:03:29.891
M41184_3056	1	each	560	45	8	0	1.5	25	2080	95	4	10	24	89.51	2.33	42.41	5.92	2024-05-19 00:01:14.483	2024-05-19 00:01:14.483
M41609_3056	1	fl oz	45	35	4	0	2.5	15	95	2	0	1	1	4.09	0.81		0.02	2024-05-13 22:03:41.004	2024-05-13 22:03:41.004
M34477_3056	6	fl oz	150	50	8	0	3.5	15	690	15	less than 1	4	5	90.64	3.89	106.38	0.75	2024-05-13 22:03:30.007	2024-05-13 22:03:30.007
M3742_3056	1	serving	180	50	6	0	1	85	230	4	0	less than 1	26	10.95	1.28	11.90	0.82	2024-05-19 00:01:15.34	2024-05-19 00:01:15.34
M14545_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.426	2024-05-13 21:21:43.426
M19242_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.488	2024-05-13 21:21:43.488
M10073_3056	1/2	cup	140	10	1.5	0	0	0	540	23	9	0	9	0.00	0.74	45.40	1.77	2024-05-13 22:02:45.581	2024-05-13 22:02:45.581
M20861_3056	1/8	cut	350	140	17	0	6	35	740	36	2	3	16	74.52	3.11	210.83	2.58	2024-05-19 00:01:43.128	2024-05-19 00:01:43.128
M20988_3056	1	each	660	240	26	0	11	100	1850	74	2	5	32	154.41	4.65	474.41	0.82	2024-05-19 00:01:12.201	2024-05-19 00:01:12.201
M3316_3056	1/24	cut	240	130	14	0	5	375	560	11	less than 1	2	16	195.95	7.22	149.50	2.38	2024-05-13 22:02:28.467	2024-05-13 22:02:28.467
M12103_3056	1	each	180	60	6	0	2	65	160	4	0	3	24	18.59	0.03	21.95	1.13	2024-05-19 00:01:14.243	2024-05-19 00:01:14.243
A2935_3056	1	serving	730	290	33	0	10	50	1200	84	2	4	23	91.14	39.52		1.71	2024-05-19 00:01:12.448	2024-05-19 00:01:12.448
M36652_3056	6	fl oz	190	30	6	0	1.5	10	390	25	6	3	9	53.92	16.25	31.16	1.60	2024-05-13 22:03:06.5	2024-05-13 22:03:06.5
M2351_3056	1	cookie	230	80	9	0	4	10	230	36	2	19	3	3.81	0.16	7.78	2.41	2024-05-13 21:21:43.353	2024-05-13 21:21:43.353
M14301_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.364	2024-05-13 21:21:43.364
M14342_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.415	2024-05-13 21:21:43.415
M13541_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.476	2024-05-13 21:21:43.476
M21375_3056	1/2	cup	190	60	7	0	1.5	35	470	21	2	16	12	170.87	15.22	21.84	1.12	2024-05-13 21:21:43.289	2024-05-13 21:21:43.289
M9636_3056	1/2	cup	120	0	0	0	0	0	0	26	0	0	3	0.00	0.00	47.12	1.52	2024-05-13 22:02:30.826	2024-05-13 22:02:30.826
M21398_3056	3	ozw	160	70	8	0	2	110	95	0	0	0	21	8.19	0.98	4.73	0.96	2024-05-13 22:02:50.447	2024-05-13 22:02:50.447
M14278_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:30.888	2024-05-13 22:02:30.888
M4595_3056	1/2	cup	130	45	7	0	1	0	480	11	2	6	7	47.59	66.30	42.26	1.17	2024-05-13 22:02:03.358	2024-05-13 22:02:03.358
M40391_3056	1/8	cut	340	90	10	0	5	20	840	48	2	5	15	71.74	9.54	227.07	3.21	2024-05-13 22:01:39.29	2024-05-13 22:01:39.29
M1347_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-19 00:01:16.077	2024-05-19 00:01:16.077
M34520_3056	6	fl oz	110	0	2	0	0	0	5	20	3	0	4	0.00	0.00	19.87	1.13	2024-05-13 21:21:41.239	2024-05-13 21:21:41.239
M13844_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.315	2024-05-13 21:21:41.315
M10053_3056	1/2	cup	35	0	0	0	0	0	25	7	2	2	2	\N	12.52	20.88	0.75	2024-05-13 22:02:30.826	2024-05-13 22:02:30.826
M14363_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.366	2024-05-13 21:21:43.366
M20596_3056	1/2	cup	190	120	13	0.5	5	25	260	12	1	8	6	15.25	24.29	34.60	0.93	2024-05-13 22:03:29.894	2024-05-13 22:03:29.894
M6446_3056	1/2	cup	130	30	3.5	0	0	0	190	21	2	4	3	25.33	1.54	22.07	0.94	2024-05-13 22:02:50.217	2024-05-13 22:02:50.217
M39261_3056	6	fl oz	70	15	1.5	0	0	15	670	9	less than 1	less than 1	4	0.00	0.76	14.19	0.61	2024-05-13 22:02:50.215	2024-05-13 22:02:50.215
M14336_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:50.325	2024-05-13 22:02:50.325
M21503_3056	3/4	cup	330	100	15	0	3.5	25	1030	37	2	4	10	7.22	0.91	121.90	1.45	2024-05-13 22:02:52.264	2024-05-13 22:02:52.264
M14856_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.477	2024-05-13 21:21:43.477
A1223_3056	1	each	1350	170	36	1	15	65	3470	204	8	26	53	97.08	13.17		12.68	2024-05-13 22:02:30.768	2024-05-13 22:02:30.768
M14891_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.49	2024-05-13 21:21:43.49
M21908_3056	1	serving	130	60	6	0	1	0	270	11	3	2	8	7.32	15.48	63.89	1.11	2024-05-13 22:00:58.298	2024-05-13 22:00:58.298
M289_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.304	2024-05-13 21:21:41.304
M9895_3056	1/2	cup	20	0	0	0	0	0	20	4	2	less than 1	1	41.47	34.96	21.55	0.36	2024-05-13 22:02:45.562	2024-05-13 22:02:45.562
M39525_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:45.767	2024-05-13 22:02:45.767
M20403_3056	1	each	140	5	5	0	3	0	260	21	less than 1	6	2	0.42	2.47	39.40	1.01	2024-05-13 22:00:59.089	2024-05-13 22:00:59.089
M179_3056	1	each	180	80	9	0	2	20	450	21	2	3	3	72.04	7.23	26.03	1.11	2024-05-13 22:03:06.378	2024-05-13 22:03:06.378
M1461_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.32	2024-05-13 21:21:41.32
M38102_3056	1	serving	460	240	26	0	3.5	30	720	40	8	3	18	\N	29.73	0.00	4.70	2024-05-13 22:03:40.922	2024-05-13 22:03:40.922
M4949_3056	1	each	170	50	5	0	2.5	30	320	18	0	1	11	50.48	10.36	154.62	1.28	2024-05-13 22:02:50.197	2024-05-13 22:02:50.197
M34479_3056	6	fl oz	200	60	9	0	4	30	300	20	2	5	10	88.56	4.34	80.35	0.85	2024-05-13 22:03:30.007	2024-05-13 22:03:30.007
M6943_3056	1	fl oz	10	0	0	0	0	0	20	2	0	less than 1	0	9.31	8.86	12.39	4.13	2024-05-13 22:02:45.73	2024-05-13 22:02:45.73
M20595_3056	1/2	cup	120	30	3	0	0	0	40	21	1	less than 1	2	3.86	6.39	12.28	0.35	2024-05-13 22:03:30.572	2024-05-13 22:03:30.572
M32205_3056	1/2	cup	40	20	2.5	0	0	0	135	4	2	1	2	19.05	54.91	29.86	0.46	2024-05-13 22:02:30.828	2024-05-13 22:02:30.828
M35712_3056	1	each	450	160	26	0	10	25	770	45	2	5	9	223.08	0.00	246.45	0.50	2024-05-13 21:21:43.335	2024-05-13 21:21:43.335
M14290_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:50.261	2024-05-13 22:02:50.261
M19842_3056	1/4	cup	40	0	0	0	0	0	0	8	0	0	1	\N	\N	\N	\N	2024-05-13 22:02:01.227	2024-05-13 22:02:01.227
M20047_3056	1	each	150	25	1.5	0	0	0	270	30	less than 1	4	5	\N	\N	73.13	1.69	2024-05-13 21:21:43.4	2024-05-13 21:21:43.4
M39262_3056	6	fl oz	60	10	1	0	0	10	390	9	less than 1	2	4	5.43	1.76	18.21	0.42	2024-05-13 22:03:06.501	2024-05-13 22:03:06.501
M15939_3056	1/2	cup	110	15	1.5	0	0	0	70	21	0	1	2	2.96	5.12	45.13	3.91	2024-05-13 22:02:45.549	2024-05-13 22:02:45.549
M9650_3056	1/2	cup	130	0	0	0	0	0	0	30	less than 1	0	3	0.00	0.00	12.95	0.30	2024-05-13 21:21:43.349	2024-05-13 21:21:43.349
M41005_3056	1/2	cup	80	60	6	0	0	0	130	5	3	2	2	1.34	49.76	21.16	0.58	2024-05-19 00:01:12.217	2024-05-19 00:01:12.217
M19054_3056	1/8	cut	490	200	22	0	9	175	1070	51	2	3	22	140.42	0.00	220.53	3.89	2024-05-13 22:00:57.929	2024-05-13 22:00:57.929
M32328_3056	1	muffin	80	15	2	0	1	0	110	15	less than 1	8	1	40.66	0.89	3.20	0.19	2024-05-13 21:21:41.255	2024-05-13 21:21:41.255
M13641_3056	2	piece	370	170	18	0	5	115	150	13	less than 1	10	37	65.60	1.72	39.21	2.38	2024-05-13 22:03:30.514	2024-05-13 22:03:30.514
M34519_3056	6	fl oz	130	0	0	0	0	0	10	28	0	0	2	0.00	0.06	11.29	10.25	2024-05-13 21:21:41.238	2024-05-13 21:21:41.238
M600_3056	1	each	240	150	11	0	5	0	260	32	less than 1	8	4	0.00	0.59	13.83	1.58	2024-05-13 22:02:03.463	2024-05-13 22:02:03.463
M2027_3056	1	cookie	240	100	11	0	6	5	190	33	less than 1	19	2	2.91	0.01	3.56	1.94	2024-05-13 22:03:06.523	2024-05-13 22:03:06.523
M40079_3056	1	cookie	230	80	9	0	4	10	230	36	2	19	3	3.81	0.16	7.78	2.41	2024-05-13 21:21:44.075	2024-05-13 21:21:44.075
M2984_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:30.969	2024-05-13 22:02:30.969
M6847_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.399	2024-05-13 21:21:43.399
M14599_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.316	2024-05-13 21:21:41.316
M6578_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.46	2024-05-13 21:21:43.46
M1344_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:00:59.217	2024-05-13 22:00:59.217
M21578_3056	1/2	cup	100	35	4	0	1	0	115	11	2	8	6	62.35	8.62	41.61	0.86	2024-05-13 22:03:29.929	2024-05-13 22:03:29.929
M32832_3056	1/2	cup	100	30	3.5	0	2	10	200	15	less than 1	3	3	50.71	7.21	67.15	0.76	2024-05-13 22:03:40.689	2024-05-13 22:03:40.689
M20885_3056	1/8	cut	440	150	17	0	7	35	1070	54	3	5	18	103.17	4.53	221.86	3.88	2024-05-13 22:03:04.252	2024-05-13 22:03:04.252
M14385_3056	1/48	cut	290	80	9	0	4.5	10	320	50	1	28	3	0.00	0.00	0.74	1.32	2024-05-13 22:03:22.362	2024-05-13 22:03:22.362
M4585_3056	1	fl oz	35	30	3.5	0	0	0	20	2	1	0	0	4.66	3.94	3.82	0.13	2024-05-13 22:03:40.929	2024-05-13 22:03:40.929
M6556_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.455	2024-05-13 21:21:43.455
A1087_3056	1	each	1330	200	42	1	18	60	3610	189	8	11	50	120.07	12.11		12.85	2024-05-13 22:03:29.946	2024-05-13 22:03:29.946
M41558_3056	1	cookie	160	70	7	0	4.5	0	25	15	less than 1	13	1	29.29	0.00	16.77	0.88	2024-05-13 21:21:44.068	2024-05-13 21:21:44.068
M16738_3056	1	roll	220	90	10	1	4	10	250	28	less than 1	15	3	\N	0.00	1.33	0.73	2024-05-13 22:01:39.342	2024-05-13 22:01:39.342
M19833_3056	1	cup	340	80	10	0	3	10	890	54	4	6	12	14.75	1.57	146.99	1.63	2024-05-13 22:02:30.639	2024-05-13 22:02:30.639
M41549_3056	1/2	cup	120	25	3.5	0	2	0	80	21	2	1	2	32.39	7.44	29.23	0.36	2024-05-13 22:03:46.757	2024-05-13 22:03:46.757
M38551_3056	1/2	cup	170	40	4.5	0	0.5	0	120	30	less than 1	less than 1	3	3.68	2.22	61.61	1.95	2024-05-13 22:03:29.963	2024-05-13 22:03:29.963
M15473_3056	1	each	550	320	35	0	6	40	920	44	2	5	18	52.45	1.69	93.36	2.45	2024-05-13 22:03:31.225	2024-05-13 22:03:31.225
M9519_3056	2	slice	130		10	0	3.5	25	400	less than 1	0	less than 1	8	0.62	0.00	9.53	0.45	2024-05-13 22:02:28.687	2024-05-13 22:02:28.687
M34462_3056	6	fl oz	110	20	3.5	0	1	5	270	14	2	2	5	50.47	5.82	66.32	3.56	2024-05-13 22:03:00.845	2024-05-13 22:03:00.845
M20278_3056	1	each	120	50	5	0	2.5	5	135	17	less than 1	9	2	20.48	4.98	9.25	0.64	2024-05-13 22:01:39.34	2024-05-13 22:01:39.34
M14912_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 22:02:52.45	2024-05-13 22:02:52.45
M9734_3056	1/2	cup	140	60	7	0	0.5	0	200	18	2	less than 1	1	5.88	9.13	5.55	0.29	2024-05-13 22:01:43.911	2024-05-13 22:01:43.911
A3203_3056	1	serving	260	45	9	0	3	0	670	40	6	3	7	72.49	6.81		1.64	2024-05-13 22:02:52.549	2024-05-13 22:02:52.549
M33241_3056	1	piece	260	90	10	0	1	0	130	40	1	21	2	0.66	2.64	59.80	1.05	2024-05-13 22:00:59.093	2024-05-13 22:00:59.093
M11563_3056	1/2	cup	120	0	0.5	0	0	0	45	27	0	0	3	0.50	0.80	47.82	1.54	2024-05-13 22:02:03.434	2024-05-13 22:02:03.434
M14574_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.461	2024-05-13 21:21:43.461
M32686_3056	1	serving	380	130	14	0	5	55	750	40	2	6	22	\N	3.58	0.00	2.71	2024-05-13 22:03:37.655	2024-05-13 22:03:37.655
M21741_3056	1	each	150	30	3.5	0	0.5	85	540	4	2	0	26	75.91	0.26	24.12	1.35	2024-05-13 22:03:40.615	2024-05-13 22:03:40.615
M9958_3056	1/2	cup	90	5	4.5	0	1.5	10	360	7	4	1	6	261.63	38.03	154.47	0.70	2024-05-13 22:03:40.69	2024-05-13 22:03:40.69
M21284_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:41.317	2024-05-13 21:21:41.317
M21942_3056	1	each	410	180	19	0.5	8	85	490	31	less than 1	4	29	38.58	0.00	177.51	3.91	2024-05-13 22:03:31.256	2024-05-13 22:03:31.256
A3040_3056	6	fl oz	100	10	1.5	0	0	0	240	17	5	3	4	\N	9.81		1.84	2024-05-13 22:02:50.403	2024-05-13 22:02:50.403
M10076_3056	1/2	cup	45	20	2.5	0	1	0	50	5	2	2	1	236.18	26.16	21.45	0.33	2024-05-13 21:21:43.352	2024-05-13 21:21:43.352
M40418_3056	1/8	cut	370	90	12	0	6	25	930	48	2	5	17	72.98	9.54	228.55	3.31	2024-05-13 22:01:39.291	2024-05-13 22:01:39.291
M20114_3056	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2024-05-13 21:21:43.411	2024-05-13 21:21:43.411
A209_3056	2	each	400	100	16	0	5	130	520	36	4	6	28	24.58	9.80		2.71	2024-05-13 22:00:59.254	2024-05-13 22:00:59.254
\.


--
-- Data for Name: push_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.push_token (token) FROM stdin;
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.restaurants (id, name, created_at, updated_at) FROM stdin;
3314	brandywine	2024-05-13 21:21:34.746	2024-05-13 21:21:34.746
3056	anteatery	2024-05-13 21:21:34.696	2024-05-13 21:21:34.696
\.


--
-- Data for Name: stations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stations (id, name, restaurant_id, created_at, updated_at) FROM stdin;
32808	Soups	3314	2024-05-13 21:21:35.823	2024-05-13 21:21:35.823
32803	Crossroads	3314	2024-05-13 21:21:35.951	2024-05-13 21:21:35.951
32804	Honeycakes/Bakery	3314	2024-05-13 21:21:36.019	2024-05-13 21:21:36.019
47692	Delete 	3314	2024-05-13 21:21:36.081	2024-05-13 21:21:36.081
23991	Oven	3056	2024-05-13 21:21:35.219	2024-05-13 21:21:35.219
32811	Compass	3314	2024-05-13 21:21:36.014	2024-05-13 21:21:36.014
23994	Bakery	3056	2024-05-13 21:21:35.014	2024-05-13 21:21:35.014
23995	Fire And Ice Sauté	3056	2024-05-13 21:21:35.322	2024-05-13 21:21:35.322
23989	Home	3056	2024-05-13 21:21:35.08	2024-05-13 21:21:35.08
23990	Sizzle Grill	3056	2024-05-13 21:21:35.202	2024-05-13 21:21:35.202
32802	Ember/Grill	3314	2024-05-13 21:21:35.654	2024-05-13 21:21:35.654
32806	Hearth/Pizza	3314	2024-05-13 21:21:35.76	2024-05-13 21:21:35.76
42378	Promotions	3314	2024-05-13 21:21:36.083	2024-05-13 21:21:36.083
32801	Grubb/ Mainline	3314	2024-05-13 21:21:35.702	2024-05-13 21:21:35.702
32807	Saute	3314	2024-05-13 21:21:35.807	2024-05-13 21:21:35.807
32809	The Farm Stand/ Deli	3314	2024-05-13 21:21:35.867	2024-05-13 21:21:35.867
32805	The Farm Stand/ Salad Bar	3314	2024-05-13 21:21:35.887	2024-05-13 21:21:35.887
32810	Vegan	3314	2024-05-13 21:21:35.928	2024-05-13 21:21:35.928
23992	Deli	3056	2024-05-13 21:21:34.92	2024-05-13 21:21:34.92
23997	Fire And Ice Round Grill	3056	2024-05-13 21:21:35.205	2024-05-13 21:21:35.205
23993	Farmer's Market	3056	2024-05-13 21:21:35.268	2024-05-13 21:21:35.268
30079	Soups	3056	2024-05-13 21:21:35.328	2024-05-13 21:21:35.328
23996	Vegan	3056	2024-05-13 21:21:35.344	2024-05-13 21:21:35.344
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 3, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: diet_restrictions diet_restrictions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diet_restrictions
    ADD CONSTRAINT diet_restrictions_pkey PRIMARY KEY (dish_id);


--
-- Name: dish_menu_station_joint dish_menu_station_joint_dish_id_menu_id_station_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dish_menu_station_joint
    ADD CONSTRAINT dish_menu_station_joint_dish_id_menu_id_station_id_pk PRIMARY KEY (dish_id, menu_id, station_id);


--
-- Name: dishes dishes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dishes
    ADD CONSTRAINT dishes_pkey PRIMARY KEY (id);


--
-- Name: events events_title_restaurant_id_start_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_title_restaurant_id_start_pk PRIMARY KEY (title, restaurant_id, start);


--
-- Name: menus menus_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_pkey PRIMARY KEY (id);


--
-- Name: nutrition_info nutrition_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nutrition_info
    ADD CONSTRAINT nutrition_info_pkey PRIMARY KEY (dish_id);


--
-- Name: push_token push_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.push_token
    ADD CONSTRAINT push_token_pkey PRIMARY KEY (token);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: stations stations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stations
    ADD CONSTRAINT stations_pkey PRIMARY KEY (id);


--
-- Name: diet_restrictions diet_restrictions_dish_id_dishes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diet_restrictions
    ADD CONSTRAINT diet_restrictions_dish_id_dishes_id_fk FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: dish_menu_station_joint dish_menu_station_joint_dish_id_dishes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dish_menu_station_joint
    ADD CONSTRAINT dish_menu_station_joint_dish_id_dishes_id_fk FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: dish_menu_station_joint dish_menu_station_joint_menu_id_menus_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dish_menu_station_joint
    ADD CONSTRAINT dish_menu_station_joint_menu_id_menus_id_fk FOREIGN KEY (menu_id) REFERENCES public.menus(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: dish_menu_station_joint dish_menu_station_joint_station_id_stations_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dish_menu_station_joint
    ADD CONSTRAINT dish_menu_station_joint_station_id_stations_id_fk FOREIGN KEY (station_id) REFERENCES public.stations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: events events_restaurant_id_restaurants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_restaurant_id_restaurants_id_fk FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: menus menus_restaurant_id_restaurants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT menus_restaurant_id_restaurants_id_fk FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: nutrition_info nutrition_info_dish_id_dishes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nutrition_info
    ADD CONSTRAINT nutrition_info_dish_id_dishes_id_fk FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: stations stations_restaurant_id_restaurants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stations
    ADD CONSTRAINT stations_restaurant_id_restaurants_id_fk FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

