--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2025-05-17 03:41:53

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
-- TOC entry 4870 (class 1262 OID 119039)
-- Name: test_knitto_db; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE test_knitto_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';


\connect test_knitto_db

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 854 (class 1247 OID 119062)
-- Name: product_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.product_category AS ENUM (
    'S',
    'M',
    'L',
    'XL'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 119142)
-- Name: code_counters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.code_counters (
    prefix character varying NOT NULL,
    last_number integer NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 119086)
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255)
);


--
-- TOC entry 217 (class 1259 OID 119085)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 217
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- TOC entry 229 (class 1259 OID 119161)
-- Name: magic_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.magic_links (
    id integer NOT NULL,
    user_id integer,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false
);


--
-- TOC entry 228 (class 1259 OID 119160)
-- Name: magic_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.magic_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 228
-- Name: magic_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.magic_links_id_seq OWNED BY public.magic_links.id;


--
-- TOC entry 216 (class 1259 OID 119072)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category public.product_category NOT NULL,
    price numeric(10,2) NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 119071)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 215
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 222 (class 1259 OID 119107)
-- Name: sales_details; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_details (
    id integer NOT NULL,
    sales_header_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(10,2) NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 119106)
-- Name: sales_details_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 221
-- Name: sales_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_details_id_seq OWNED BY public.sales_details.id;


--
-- TOC entry 224 (class 1259 OID 119124)
-- Name: sales_details_temps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_details_temps (
    id integer NOT NULL,
    sales_header_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(10,2) NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 119123)
-- Name: sales_details_temps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_details_temps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 223
-- Name: sales_details_temps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_details_temps_id_seq OWNED BY public.sales_details_temps.id;


--
-- TOC entry 220 (class 1259 OID 119095)
-- Name: sales_headers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_headers (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    date date NOT NULL,
    code character varying(50)
);


--
-- TOC entry 219 (class 1259 OID 119094)
-- Name: sales_headers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_headers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 219
-- Name: sales_headers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_headers_id_seq OWNED BY public.sales_headers.id;


--
-- TOC entry 227 (class 1259 OID 119150)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text,
    password text,
    google_id text
);


--
-- TOC entry 226 (class 1259 OID 119149)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4672 (class 2604 OID 119089)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 119164)
-- Name: magic_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.magic_links ALTER COLUMN id SET DEFAULT nextval('public.magic_links_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 119075)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 119110)
-- Name: sales_details id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_details ALTER COLUMN id SET DEFAULT nextval('public.sales_details_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 119127)
-- Name: sales_details_temps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_details_temps ALTER COLUMN id SET DEFAULT nextval('public.sales_details_temps_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 119098)
-- Name: sales_headers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_headers ALTER COLUMN id SET DEFAULT nextval('public.sales_headers_id_seq'::regclass);


--
-- TOC entry 4676 (class 2604 OID 119153)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4860 (class 0 OID 119142)
-- Dependencies: 225
-- Data for Name: code_counters; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.code_counters VALUES ('INV-20250516', 3);


--
-- TOC entry 4853 (class 0 OID 119086)
-- Dependencies: 218
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.customers VALUES (1, 'Andi Saputra', 'andi@example.com');
INSERT INTO public.customers VALUES (2, 'Budi Santoso', 'budi@example.com');
INSERT INTO public.customers VALUES (3, 'Citra Lestari', 'citra@example.com');


--
-- TOC entry 4864 (class 0 OID 119161)
-- Dependencies: 229
-- Data for Name: magic_links; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.magic_links VALUES (1, 4, '3435dd9e17ec992b134eb989372b54fcd2a0c82b016db3b7898ea8e00ac75c01', '2025-05-18 02:34:38.974', true);


--
-- TOC entry 4851 (class 0 OID 119072)
-- Dependencies: 216
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products VALUES (1, 'Combed 30s', 'S', 20000.00);
INSERT INTO public.products VALUES (2, 'Combed 30s', 'M', 20000.00);
INSERT INTO public.products VALUES (3, 'Combed 30s', 'L', 20000.00);
INSERT INTO public.products VALUES (4, 'Combed 30s', 'XL', 20000.00);
INSERT INTO public.products VALUES (5, 'Combed 24s', 'S', 25000.00);
INSERT INTO public.products VALUES (6, 'Combed 24s', 'M', 25000.00);
INSERT INTO public.products VALUES (7, 'Combed 24s', 'L', 25000.00);
INSERT INTO public.products VALUES (8, 'Combed 24s', 'XL', 25000.00);
INSERT INTO public.products VALUES (9, 'Combed 28s', 'S', 22500.00);
INSERT INTO public.products VALUES (10, 'Combed 28s', 'M', 22500.00);
INSERT INTO public.products VALUES (11, 'Combed 28s', 'L', 22500.00);
INSERT INTO public.products VALUES (12, 'Combed 28s', 'XL', 22500.00);


--
-- TOC entry 4857 (class 0 OID 119107)
-- Dependencies: 222
-- Data for Name: sales_details; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sales_details VALUES (1, 1, 3, 100, 2000000.00);
INSERT INTO public.sales_details VALUES (2, 1, 4, 50, 1000000.00);
INSERT INTO public.sales_details VALUES (3, 1, 5, 120, 3000000.00);
INSERT INTO public.sales_details VALUES (4, 1, 6, 150, 3750000.00);
INSERT INTO public.sales_details VALUES (5, 2, 1, 75, 1500000.00);
INSERT INTO public.sales_details VALUES (6, 2, 2, 100, 2000000.00);
INSERT INTO public.sales_details VALUES (7, 2, 9, 75, 1687500.00);
INSERT INTO public.sales_details VALUES (8, 2, 10, 100, 2250000.00);
INSERT INTO public.sales_details VALUES (9, 3, 7, 50, 1250000.00);
INSERT INTO public.sales_details VALUES (10, 3, 8, 30, 750000.00);
INSERT INTO public.sales_details VALUES (11, 3, 4, 50, 1000000.00);
INSERT INTO public.sales_details VALUES (12, 3, 6, 175, 4375000.00);
INSERT INTO public.sales_details VALUES (13, 4, 7, 50, 1250000.00);
INSERT INTO public.sales_details VALUES (14, 4, 8, 30, 750000.00);
INSERT INTO public.sales_details VALUES (15, 4, 4, 50, 1000000.00);
INSERT INTO public.sales_details VALUES (16, 4, 6, 175, 4375000.00);
INSERT INTO public.sales_details VALUES (17, 6, 2, 100, 2000000.00);
INSERT INTO public.sales_details VALUES (18, 6, 5, 125, 3125000.00);
INSERT INTO public.sales_details VALUES (19, 6, 9, 80, 1800000.00);
INSERT INTO public.sales_details VALUES (20, 6, 1, 50, 1000000.00);
INSERT INTO public.sales_details VALUES (21, 6, 6, 100, 2500000.00);
INSERT INTO public.sales_details VALUES (24, 9, 3, 100, 2000000.00);
INSERT INTO public.sales_details VALUES (25, 10, 7, 100, 2500000.00);
INSERT INTO public.sales_details VALUES (26, 12, 8, 100, 2500000.00);


--
-- TOC entry 4859 (class 0 OID 119124)
-- Dependencies: 224
-- Data for Name: sales_details_temps; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sales_details_temps VALUES (1, 1, 3, 100, 2000000.00);
INSERT INTO public.sales_details_temps VALUES (2, 1, 4, 50, 1000000.00);
INSERT INTO public.sales_details_temps VALUES (3, 1, 5, 120, 3000000.00);
INSERT INTO public.sales_details_temps VALUES (4, 1, 6, 150, 3750000.00);
INSERT INTO public.sales_details_temps VALUES (5, 2, 1, 75, 1500000.00);
INSERT INTO public.sales_details_temps VALUES (6, 2, 2, 100, 2000000.00);
INSERT INTO public.sales_details_temps VALUES (7, 2, 9, 75, 1687500.00);
INSERT INTO public.sales_details_temps VALUES (8, 2, 10, 100, 2250000.00);
INSERT INTO public.sales_details_temps VALUES (9, 3, 7, 50, 1250000.00);
INSERT INTO public.sales_details_temps VALUES (10, 3, 8, 30, 750000.00);
INSERT INTO public.sales_details_temps VALUES (11, 3, 4, 50, 1000000.00);
INSERT INTO public.sales_details_temps VALUES (12, 3, 6, 175, 4375000.00);
INSERT INTO public.sales_details_temps VALUES (13, 4, 7, 50, 1250000.00);
INSERT INTO public.sales_details_temps VALUES (14, 4, 8, 30, 750000.00);
INSERT INTO public.sales_details_temps VALUES (15, 4, 4, 50, 1000000.00);
INSERT INTO public.sales_details_temps VALUES (16, 4, 6, 175, 4375000.00);


--
-- TOC entry 4855 (class 0 OID 119095)
-- Dependencies: 220
-- Data for Name: sales_headers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sales_headers VALUES (6, 1, '2025-05-13', 'INV-20250513-0001');
INSERT INTO public.sales_headers VALUES (3, 3, '2025-05-14', 'INV-20250514-0001');
INSERT INTO public.sales_headers VALUES (4, 2, '2025-05-14', 'INV-20250514-0002');
INSERT INTO public.sales_headers VALUES (1, 1, '2025-05-15', 'INV-20250515-0001');
INSERT INTO public.sales_headers VALUES (2, 2, '2025-05-15', 'INV-20250515-0002');
INSERT INTO public.sales_headers VALUES (9, 3, '2025-05-16', 'INV-20250516-0001');
INSERT INTO public.sales_headers VALUES (10, 2, '2025-05-16', 'INV-20250516-0002');
INSERT INTO public.sales_headers VALUES (12, 3, '2025-05-16', 'INV-20250516-0003');


--
-- TOC entry 4862 (class 0 OID 119150)
-- Dependencies: 227
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (2, 'zmuhammadzidan@gmail.com', '$2b$10$yb3fw10y/nUSXjreVZJTKewKVCTkHqwc9p5EFgYfL5mmhWaK8w3dK', NULL);
INSERT INTO public.users VALUES (3, 'test@gmail.com', '$2b$10$7BFHekwDo2LMogzO8XYtvuylGyoJxrZ7aIHqg5lPnR.wCOlxiYzgK', NULL);
INSERT INTO public.users VALUES (4, 'vorpalknight10@gmail.com', '$2b$10$1VVidZUDm0VpN0AhERGIn.gIK.nj66F4Bgb1qJFyO66.4LIY2r0RK', NULL);


--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 217
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_id_seq', 3, true);


--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 228
-- Name: magic_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.magic_links_id_seq', 1, true);


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 215
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 12, true);


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 221
-- Name: sales_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_details_id_seq', 26, true);


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 223
-- Name: sales_details_temps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_details_temps_id_seq', 16, true);


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 219
-- Name: sales_headers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_headers_id_seq', 12, true);


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4692 (class 2606 OID 119148)
-- Name: code_counters code_counters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.code_counters
    ADD CONSTRAINT code_counters_pkey PRIMARY KEY (prefix);


--
-- TOC entry 4682 (class 2606 OID 119093)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 2606 OID 119169)
-- Name: magic_links magic_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.magic_links
    ADD CONSTRAINT magic_links_pkey PRIMARY KEY (id);


--
-- TOC entry 4700 (class 2606 OID 119171)
-- Name: magic_links magic_links_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.magic_links
    ADD CONSTRAINT magic_links_token_key UNIQUE (token);


--
-- TOC entry 4680 (class 2606 OID 119077)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4688 (class 2606 OID 119112)
-- Name: sales_details sales_details_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_details
    ADD CONSTRAINT sales_details_pkey PRIMARY KEY (id);


--
-- TOC entry 4690 (class 2606 OID 119129)
-- Name: sales_details_temps sales_details_temps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_details_temps
    ADD CONSTRAINT sales_details_temps_pkey PRIMARY KEY (id);


--
-- TOC entry 4684 (class 2606 OID 119141)
-- Name: sales_headers sales_headers_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_headers
    ADD CONSTRAINT sales_headers_code_key UNIQUE (code);


--
-- TOC entry 4686 (class 2606 OID 119100)
-- Name: sales_headers sales_headers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_headers
    ADD CONSTRAINT sales_headers_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 119159)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4696 (class 2606 OID 119157)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4706 (class 2606 OID 119172)
-- Name: magic_links magic_links_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.magic_links
    ADD CONSTRAINT magic_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4702 (class 2606 OID 119118)
-- Name: sales_details sales_details_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_details
    ADD CONSTRAINT sales_details_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4703 (class 2606 OID 119113)
-- Name: sales_details sales_details_sales_header_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_details
    ADD CONSTRAINT sales_details_sales_header_id_fkey FOREIGN KEY (sales_header_id) REFERENCES public.sales_headers(id);


--
-- TOC entry 4704 (class 2606 OID 119135)
-- Name: sales_details_temps sales_details_temps_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_details_temps
    ADD CONSTRAINT sales_details_temps_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4705 (class 2606 OID 119130)
-- Name: sales_details_temps sales_details_temps_sales_header_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_details_temps
    ADD CONSTRAINT sales_details_temps_sales_header_id_fkey FOREIGN KEY (sales_header_id) REFERENCES public.sales_headers(id);


--
-- TOC entry 4701 (class 2606 OID 119101)
-- Name: sales_headers sales_headers_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_headers
    ADD CONSTRAINT sales_headers_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


-- Completed on 2025-05-17 03:41:54

--
-- PostgreSQL database dump complete
--

