--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

-- Started on 2023-11-27 15:07:54

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16556)
-- Name: assignment_solutions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment_solutions (
    assignment_solution_id integer NOT NULL,
    assignment_id integer,
    user_id integer,
    solution text,
    feedback text
);


ALTER TABLE public.assignment_solutions OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16555)
-- Name: assignment_solutions_assignment_solution_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignment_solutions_assignment_solution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignment_solutions_assignment_solution_id_seq OWNER TO postgres;

--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 223
-- Name: assignment_solutions_assignment_solution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignment_solutions_assignment_solution_id_seq OWNED BY public.assignment_solutions.assignment_solution_id;


--
-- TOC entry 222 (class 1259 OID 16542)
-- Name: assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignments (
    assignment_id integer NOT NULL,
    course_id integer,
    title character varying(255),
    description text,
    code_template text,
    due_date timestamp without time zone,
    programming_language character varying(255)
);


ALTER TABLE public.assignments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16541)
-- Name: assignments_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignments_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assignments_assignment_id_seq OWNER TO postgres;

--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 221
-- Name: assignments_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignments_assignment_id_seq OWNED BY public.assignments.assignment_id;


--
-- TOC entry 216 (class 1259 OID 16505)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    course_id integer NOT NULL,
    title character varying(255)
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16504)
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_course_id_seq OWNER TO postgres;

--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 215
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_course_id_seq OWNED BY public.courses.course_id;


--
-- TOC entry 220 (class 1259 OID 16525)
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    enrollment_id integer NOT NULL,
    course_id integer,
    user_id integer,
    user_role integer,
    total_points integer
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16524)
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollments_enrollment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_enrollment_id_seq OWNER TO postgres;

--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 219
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollments_enrollment_id_seq OWNED BY public.enrollments.enrollment_id;


--
-- TOC entry 235 (class 1259 OID 17043)
-- Name: examples; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examples (
    input character varying,
    output character varying,
    example_id bigint NOT NULL,
    exercise_id bigint
);


ALTER TABLE public.examples OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16629)
-- Name: exercise_solutions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercise_solutions (
    exercise_solution_id integer NOT NULL,
    exercise_id integer,
    user_id integer,
    solution text,
    is_anonymous boolean,
    is_pinned boolean
);


ALTER TABLE public.exercise_solutions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16628)
-- Name: exercise_solutions_exercise_solution_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exercise_solutions_exercise_solution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercise_solutions_exercise_solution_id_seq OWNER TO postgres;

--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 233
-- Name: exercise_solutions_exercise_solution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exercise_solutions_exercise_solution_id_seq OWNED BY public.exercise_solutions.exercise_solution_id;


--
-- TOC entry 228 (class 1259 OID 16587)
-- Name: exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercises (
    exercise_id integer NOT NULL,
    session_id integer,
    title character varying(255),
    description text,
    points integer,
    programming_language character varying(255),
    code_template text
);


ALTER TABLE public.exercises OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16586)
-- Name: exercises_exercise_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exercises_exercise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercises_exercise_id_seq OWNER TO postgres;

--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 227
-- Name: exercises_exercise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exercises_exercise_id_seq OWNED BY public.exercises.exercise_id;


--
-- TOC entry 232 (class 1259 OID 16615)
-- Name: hints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hints (
    hint_id integer NOT NULL,
    exercise_id integer,
    description text,
    "order" integer
);


ALTER TABLE public.hints OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16614)
-- Name: hints_hint_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hints_hint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hints_hint_id_seq OWNER TO postgres;

--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 231
-- Name: hints_hint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hints_hint_id_seq OWNED BY public.hints.hint_id;


--
-- TOC entry 226 (class 1259 OID 16575)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    session_id integer NOT NULL,
    course_id integer,
    title character varying(255)
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16574)
-- Name: sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_session_id_seq OWNER TO postgres;

--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 225
-- Name: sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessions_session_id_seq OWNED BY public.sessions.session_id;


--
-- TOC entry 230 (class 1259 OID 16601)
-- Name: test_cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_cases (
    test_case_id integer NOT NULL,
    exercise_id integer,
    code text,
    is_visible boolean
);


ALTER TABLE public.test_cases OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16600)
-- Name: test_cases_test_case_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_cases_test_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_cases_test_case_id_seq OWNER TO postgres;

--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 229
-- Name: test_cases_test_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_cases_test_case_id_seq OWNED BY public.test_cases.test_case_id;


--
-- TOC entry 218 (class 1259 OID 16514)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255),
    user_password character varying(255),
    is_teacher boolean,
    pw_salt character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16513)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4687 (class 2604 OID 16559)
-- Name: assignment_solutions assignment_solution_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_solutions ALTER COLUMN assignment_solution_id SET DEFAULT nextval('public.assignment_solutions_assignment_solution_id_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 16545)
-- Name: assignments assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments ALTER COLUMN assignment_id SET DEFAULT nextval('public.assignments_assignment_id_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 16508)
-- Name: courses course_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN course_id SET DEFAULT nextval('public.courses_course_id_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 16528)
-- Name: enrollments enrollment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN enrollment_id SET DEFAULT nextval('public.enrollments_enrollment_id_seq'::regclass);


--
-- TOC entry 4692 (class 2604 OID 16632)
-- Name: exercise_solutions exercise_solution_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_solutions ALTER COLUMN exercise_solution_id SET DEFAULT nextval('public.exercise_solutions_exercise_solution_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 16590)
-- Name: exercises exercise_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises ALTER COLUMN exercise_id SET DEFAULT nextval('public.exercises_exercise_id_seq'::regclass);


--
-- TOC entry 4691 (class 2604 OID 16618)
-- Name: hints hint_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hints ALTER COLUMN hint_id SET DEFAULT nextval('public.hints_hint_id_seq'::regclass);


--
-- TOC entry 4688 (class 2604 OID 16578)
-- Name: sessions session_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN session_id SET DEFAULT nextval('public.sessions_session_id_seq'::regclass);


--
-- TOC entry 4690 (class 2604 OID 16604)
-- Name: test_cases test_case_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_cases ALTER COLUMN test_case_id SET DEFAULT nextval('public.test_cases_test_case_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 16517)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4882 (class 0 OID 16556)
-- Dependencies: 224
-- Data for Name: assignment_solutions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignment_solutions (assignment_solution_id, assignment_id, user_id, solution, feedback) FROM stdin;
\.


--
-- TOC entry 4880 (class 0 OID 16542)
-- Dependencies: 222
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignments (assignment_id, course_id, title, description, code_template, due_date, programming_language) FROM stdin;
\.


--
-- TOC entry 4874 (class 0 OID 16505)
-- Dependencies: 216
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (course_id, title) FROM stdin;
\.


--
-- TOC entry 4878 (class 0 OID 16525)
-- Dependencies: 220
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (enrollment_id, course_id, user_id, user_role, total_points) FROM stdin;
\.


--
-- TOC entry 4893 (class 0 OID 17043)
-- Dependencies: 235
-- Data for Name: examples; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.examples (input, output, example_id, exercise_id) FROM stdin;
\.


--
-- TOC entry 4892 (class 0 OID 16629)
-- Dependencies: 234
-- Data for Name: exercise_solutions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercise_solutions (exercise_solution_id, exercise_id, user_id, solution, is_anonymous, is_pinned) FROM stdin;
\.


--
-- TOC entry 4886 (class 0 OID 16587)
-- Dependencies: 228
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercises (exercise_id, session_id, title, description, points, programming_language, code_template) FROM stdin;
\.


--
-- TOC entry 4890 (class 0 OID 16615)
-- Dependencies: 232
-- Data for Name: hints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hints (hint_id, exercise_id, description, "order") FROM stdin;
\.


--
-- TOC entry 4884 (class 0 OID 16575)
-- Dependencies: 226
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (session_id, course_id, title) FROM stdin;
\.


--
-- TOC entry 4888 (class 0 OID 16601)
-- Dependencies: 230
-- Data for Name: test_cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_cases (test_case_id, exercise_id, code, is_visible) FROM stdin;
\.


--
-- TOC entry 4876 (class 0 OID 16514)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, user_password, is_teacher, pw_salt) FROM stdin;
\.


--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 223
-- Name: assignment_solutions_assignment_solution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignment_solutions_assignment_solution_id_seq', 10, true);


--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 221
-- Name: assignments_assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignments_assignment_id_seq', 8, true);


--
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 215
-- Name: courses_course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_course_id_seq', 24, true);


--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 219
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_enrollment_id_seq', 15, true);


--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 233
-- Name: exercise_solutions_exercise_solution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercise_solutions_exercise_solution_id_seq', 6, true);


--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 227
-- Name: exercises_exercise_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercises_exercise_id_seq', 7, true);


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 231
-- Name: hints_hint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hints_hint_id_seq', 6, true);


--
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 225
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 7, true);


--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 229
-- Name: test_cases_test_case_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_cases_test_case_id_seq', 7, true);


--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 34, true);


--
-- TOC entry 4706 (class 2606 OID 16563)
-- Name: assignment_solutions assignment_solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_solutions
    ADD CONSTRAINT assignment_solutions_pkey PRIMARY KEY (assignment_solution_id);


--
-- TOC entry 4704 (class 2606 OID 16549)
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 4694 (class 2606 OID 16510)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);


--
-- TOC entry 4696 (class 2606 OID 16512)
-- Name: courses courses_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_title_key UNIQUE (title);


--
-- TOC entry 4702 (class 2606 OID 16530)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (enrollment_id);


--
-- TOC entry 4718 (class 2606 OID 17085)
-- Name: examples examples_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_pkey PRIMARY KEY (example_id);


--
-- TOC entry 4716 (class 2606 OID 16636)
-- Name: exercise_solutions exercise_solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_solutions
    ADD CONSTRAINT exercise_solutions_pkey PRIMARY KEY (exercise_solution_id);


--
-- TOC entry 4710 (class 2606 OID 16594)
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (exercise_id);


--
-- TOC entry 4714 (class 2606 OID 16622)
-- Name: hints hints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hints
    ADD CONSTRAINT hints_pkey PRIMARY KEY (hint_id);


--
-- TOC entry 4708 (class 2606 OID 16580)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- TOC entry 4712 (class 2606 OID 16608)
-- Name: test_cases test_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_pkey PRIMARY KEY (test_case_id);


--
-- TOC entry 4698 (class 2606 OID 16521)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4700 (class 2606 OID 16523)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4722 (class 2606 OID 16564)
-- Name: assignment_solutions assignment_solutions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_solutions
    ADD CONSTRAINT assignment_solutions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(assignment_id);


--
-- TOC entry 4723 (class 2606 OID 16569)
-- Name: assignment_solutions assignment_solutions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_solutions
    ADD CONSTRAINT assignment_solutions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4721 (class 2606 OID 16550)
-- Name: assignments assignments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id);


--
-- TOC entry 4719 (class 2606 OID 16531)
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id);


--
-- TOC entry 4720 (class 2606 OID 16536)
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4728 (class 2606 OID 16637)
-- Name: exercise_solutions exercise_solutions_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_solutions
    ADD CONSTRAINT exercise_solutions_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(exercise_id);


--
-- TOC entry 4729 (class 2606 OID 16642)
-- Name: exercise_solutions exercise_solutions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercise_solutions
    ADD CONSTRAINT exercise_solutions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4725 (class 2606 OID 16595)
-- Name: exercises exercises_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(session_id);


--
-- TOC entry 4727 (class 2606 OID 16623)
-- Name: hints hints_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hints
    ADD CONSTRAINT hints_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(exercise_id);


--
-- TOC entry 4724 (class 2606 OID 16581)
-- Name: sessions sessions_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(course_id);


--
-- TOC entry 4726 (class 2606 OID 16609)
-- Name: test_cases test_cases_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(exercise_id);


-- Completed on 2023-11-27 15:07:54

--
-- PostgreSQL database dump complete
--

