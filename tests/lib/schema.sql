--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

-- Started on 2023-11-16 15:24:56

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
-- Name: improved_schema; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA improved_schema;


ALTER SCHEMA improved_schema OWNER TO pg_database_owner;

--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA improved_schema; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA improved_schema IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16556)
-- Name: assignment_solutions; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.assignment_solutions (
    assignment_solution_id integer NOT NULL,
    assignment_id integer,
    user_id integer,
    solution text,
    feedback text
);




--
-- TOC entry 223 (class 1259 OID 16555)
-- Name: assignment_solutions_assignment_solution_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.assignment_solutions_assignment_solution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 223
-- Name: assignment_solutions_assignment_solution_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.assignment_solutions_assignment_solution_id_seq OWNED BY improved_schema.assignment_solutions.assignment_solution_id;


--
-- TOC entry 222 (class 1259 OID 16542)
-- Name: assignments; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.assignments (
    assignment_id integer NOT NULL,
    course_id integer,
    title character varying(255),
    description text,
    code_template text,
    due_date timestamp without time zone,
    programming_language character varying(255)
);




--
-- TOC entry 221 (class 1259 OID 16541)
-- Name: assignments_assignment_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.assignments_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 221
-- Name: assignments_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.assignments_assignment_id_seq OWNED BY improved_schema.assignments.assignment_id;


--
-- TOC entry 216 (class 1259 OID 16505)
-- Name: courses; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.courses (
    course_id integer NOT NULL,
    title character varying(255)
);




--
-- TOC entry 215 (class 1259 OID 16504)
-- Name: courses_course_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.courses_course_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 215
-- Name: courses_course_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.courses_course_id_seq OWNED BY improved_schema.courses.course_id;


--
-- TOC entry 220 (class 1259 OID 16525)
-- Name: enrollments; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.enrollments (
    enrollment_id integer NOT NULL,
    course_id integer,
    user_id integer,
    user_role integer,
    total_points integer
);




--
-- TOC entry 219 (class 1259 OID 16524)
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.enrollments_enrollment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 219
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.enrollments_enrollment_id_seq OWNED BY improved_schema.enrollments.enrollment_id;


--
-- TOC entry 234 (class 1259 OID 16629)
-- Name: exercise_solutions; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.exercise_solutions (
    exercise_solution_id integer NOT NULL,
    exercise_id integer,
    user_id integer,
    solution text,
    is_anonymous boolean,
    is_pinned boolean
);




--
-- TOC entry 233 (class 1259 OID 16628)
-- Name: exercise_solutions_exercise_solution_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.exercise_solutions_exercise_solution_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 233
-- Name: exercise_solutions_exercise_solution_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.exercise_solutions_exercise_solution_id_seq OWNED BY improved_schema.exercise_solutions.exercise_solution_id;


--
-- TOC entry 228 (class 1259 OID 16587)
-- Name: exercises; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.exercises (
    exercise_id integer NOT NULL,
    session_id integer,
    title character varying(255),
    description text,
    points integer,
    programming_language character varying(255),
    code_template text
);




--
-- TOC entry 227 (class 1259 OID 16586)
-- Name: exercises_exercise_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.exercises_exercise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 227
-- Name: exercises_exercise_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.exercises_exercise_id_seq OWNED BY improved_schema.exercises.exercise_id;


--
-- TOC entry 232 (class 1259 OID 16615)
-- Name: hints; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.hints (
    hint_id integer NOT NULL,
    exercise_id integer,
    description text,
    "order" integer
);




--
-- TOC entry 231 (class 1259 OID 16614)
-- Name: hints_hint_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.hints_hint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 231
-- Name: hints_hint_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.hints_hint_id_seq OWNED BY improved_schema.hints.hint_id;


--
-- TOC entry 226 (class 1259 OID 16575)
-- Name: sessions; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.sessions (
    session_id integer NOT NULL,
    course_id integer,
    title character varying(255)
);




--
-- TOC entry 225 (class 1259 OID 16574)
-- Name: sessions_session_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.sessions_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 225
-- Name: sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.sessions_session_id_seq OWNED BY improved_schema.sessions.session_id;


--
-- TOC entry 230 (class 1259 OID 16601)
-- Name: test_cases; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.test_cases (
    test_case_id integer NOT NULL,
    exercise_id integer,
    code text,
    is_visible boolean
);




--
-- TOC entry 229 (class 1259 OID 16600)
-- Name: test_cases_test_case_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.test_cases_test_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 229
-- Name: test_cases_test_case_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.test_cases_test_case_id_seq OWNED BY improved_schema.test_cases.test_case_id;


--
-- TOC entry 218 (class 1259 OID 16514)
-- Name: users; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.users (
    user_id integer NOT NULL,
    username character varying(255),
    user_password character varying(255),
    is_teacher boolean,
    pw_salt character varying(255)
);




--
-- TOC entry 217 (class 1259 OID 16513)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: improved_schema; Owner: postgres
--

CREATE SEQUENCE improved_schema.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.users_user_id_seq OWNED BY improved_schema.users.user_id;


--
-- TOC entry 4683 (class 2604 OID 16559)
-- Name: assignment_solutions assignment_solution_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignment_solutions ALTER COLUMN assignment_solution_id SET DEFAULT nextval('improved_schema.assignment_solutions_assignment_solution_id_seq'::regclass);


--
-- TOC entry 4682 (class 2604 OID 16545)
-- Name: assignments assignment_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignments ALTER COLUMN assignment_id SET DEFAULT nextval('improved_schema.assignments_assignment_id_seq'::regclass);


--
-- TOC entry 4679 (class 2604 OID 16508)
-- Name: courses course_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.courses ALTER COLUMN course_id SET DEFAULT nextval('improved_schema.courses_course_id_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 16528)
-- Name: enrollments enrollment_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.enrollments ALTER COLUMN enrollment_id SET DEFAULT nextval('improved_schema.enrollments_enrollment_id_seq'::regclass);


--
-- TOC entry 4688 (class 2604 OID 16632)
-- Name: exercise_solutions exercise_solution_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercise_solutions ALTER COLUMN exercise_solution_id SET DEFAULT nextval('improved_schema.exercise_solutions_exercise_solution_id_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 16590)
-- Name: exercises exercise_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercises ALTER COLUMN exercise_id SET DEFAULT nextval('improved_schema.exercises_exercise_id_seq'::regclass);


--
-- TOC entry 4687 (class 2604 OID 16618)
-- Name: hints hint_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.hints ALTER COLUMN hint_id SET DEFAULT nextval('improved_schema.hints_hint_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 16578)
-- Name: sessions session_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.sessions ALTER COLUMN session_id SET DEFAULT nextval('improved_schema.sessions_session_id_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 16604)
-- Name: test_cases test_case_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.test_cases ALTER COLUMN test_case_id SET DEFAULT nextval('improved_schema.test_cases_test_case_id_seq'::regclass);


--
-- TOC entry 4680 (class 2604 OID 16517)
-- Name: users user_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.users ALTER COLUMN user_id SET DEFAULT nextval('improved_schema.users_user_id_seq'::regclass);


--
-- TOC entry 4702 (class 2606 OID 16563)
-- Name: assignment_solutions assignment_solutions_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignment_solutions
    ADD CONSTRAINT assignment_solutions_pkey PRIMARY KEY (assignment_solution_id);


--
-- TOC entry 4700 (class 2606 OID 16549)
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 4690 (class 2606 OID 16510)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (course_id);


--
-- TOC entry 4692 (class 2606 OID 16512)
-- Name: courses courses_title_key; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.courses
    ADD CONSTRAINT courses_title_key UNIQUE (title);


--
-- TOC entry 4698 (class 2606 OID 16530)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (enrollment_id);


--
-- TOC entry 4712 (class 2606 OID 16636)
-- Name: exercise_solutions exercise_solutions_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercise_solutions
    ADD CONSTRAINT exercise_solutions_pkey PRIMARY KEY (exercise_solution_id);


--
-- TOC entry 4706 (class 2606 OID 16594)
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (exercise_id);


--
-- TOC entry 4710 (class 2606 OID 16622)
-- Name: hints hints_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.hints
    ADD CONSTRAINT hints_pkey PRIMARY KEY (hint_id);


--
-- TOC entry 4704 (class 2606 OID 16580)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- TOC entry 4708 (class 2606 OID 16608)
-- Name: test_cases test_cases_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.test_cases
    ADD CONSTRAINT test_cases_pkey PRIMARY KEY (test_case_id);


--
-- TOC entry 4694 (class 2606 OID 16521)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4696 (class 2606 OID 16523)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4716 (class 2606 OID 16564)
-- Name: assignment_solutions assignment_solutions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignment_solutions
    ADD CONSTRAINT assignment_solutions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES improved_schema.assignments(assignment_id);


--
-- TOC entry 4717 (class 2606 OID 16569)
-- Name: assignment_solutions assignment_solutions_user_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignment_solutions
    ADD CONSTRAINT assignment_solutions_user_id_fkey FOREIGN KEY (user_id) REFERENCES improved_schema.users(user_id);


--
-- TOC entry 4715 (class 2606 OID 16550)
-- Name: assignments assignments_course_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignments
    ADD CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES improved_schema.courses(course_id);


--
-- TOC entry 4713 (class 2606 OID 16531)
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES improved_schema.courses(course_id);


--
-- TOC entry 4714 (class 2606 OID 16536)
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES improved_schema.users(user_id);


--
-- TOC entry 4722 (class 2606 OID 16637)
-- Name: exercise_solutions exercise_solutions_exercise_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercise_solutions
    ADD CONSTRAINT exercise_solutions_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES improved_schema.exercises(exercise_id);


--
-- TOC entry 4723 (class 2606 OID 16642)
-- Name: exercise_solutions exercise_solutions_user_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercise_solutions
    ADD CONSTRAINT exercise_solutions_user_id_fkey FOREIGN KEY (user_id) REFERENCES improved_schema.users(user_id);


--
-- TOC entry 4719 (class 2606 OID 16595)
-- Name: exercises exercises_session_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercises
    ADD CONSTRAINT exercises_session_id_fkey FOREIGN KEY (session_id) REFERENCES improved_schema.sessions(session_id);


--
-- TOC entry 4721 (class 2606 OID 16623)
-- Name: hints hints_exercise_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.hints
    ADD CONSTRAINT hints_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES improved_schema.exercises(exercise_id);


--
-- TOC entry 4718 (class 2606 OID 16581)
-- Name: sessions sessions_course_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.sessions
    ADD CONSTRAINT sessions_course_id_fkey FOREIGN KEY (course_id) REFERENCES improved_schema.courses(course_id);


--
-- TOC entry 4720 (class 2606 OID 16609)
-- Name: test_cases test_cases_exercise_id_fkey; Type: FK CONSTRAINT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.test_cases
    ADD CONSTRAINT test_cases_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES improved_schema.exercises(exercise_id);


-- Completed on 2023-11-16 15:24:56

--
-- PostgreSQL database dump complete
--

