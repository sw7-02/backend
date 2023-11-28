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
-- Name: improved_schema; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA improved_schema;


ALTER SCHEMA improved_schema OWNER TO pg_database_owner;

--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA improved_schema; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA improved_schema IS 'standard improved_schema schema';


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


ALTER TABLE improved_schema.assignment_solutions OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.assignment_solutions_assignment_solution_id_seq OWNER TO postgres;

--
-- TOC entry 4900 (class 0 OID 0)
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


ALTER TABLE improved_schema.assignments OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.assignments_assignment_id_seq OWNER TO postgres;

--
-- TOC entry 4901 (class 0 OID 0)
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


ALTER TABLE improved_schema.courses OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.courses_course_id_seq OWNER TO postgres;

--
-- TOC entry 4902 (class 0 OID 0)
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


ALTER TABLE improved_schema.enrollments OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.enrollments_enrollment_id_seq OWNER TO postgres;

--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 219
-- Name: enrollments_enrollment_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.enrollments_enrollment_id_seq OWNED BY improved_schema.enrollments.enrollment_id;


--
-- TOC entry 235 (class 1259 OID 17043)
-- Name: examples; Type: TABLE; Schema: improved_schema; Owner: postgres
--

CREATE TABLE improved_schema.examples (
    example_id integer NOT NULL,
    input character varying,
    output character varying,
    exercise_id bigint
);


ALTER TABLE improved_schema.examples OWNER TO postgres;

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


ALTER TABLE improved_schema.exercise_solutions OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.exercise_solutions_exercise_solution_id_seq OWNER TO postgres;

--
-- TOC entry 4904 (class 0 OID 0)
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


ALTER TABLE improved_schema.exercises OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.exercises_exercise_id_seq OWNER TO postgres;

--
-- TOC entry 4905 (class 0 OID 0)
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


ALTER TABLE improved_schema.hints OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.hints_hint_id_seq OWNER TO postgres;

--
-- TOC entry 4906 (class 0 OID 0)
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


ALTER TABLE improved_schema.sessions OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.sessions_session_id_seq OWNER TO postgres;

--
-- TOC entry 4907 (class 0 OID 0)
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
    code text
    --is_visible boolean
);


ALTER TABLE improved_schema.test_cases OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.test_cases_test_case_id_seq OWNER TO postgres;

--
-- TOC entry 4908 (class 0 OID 0)
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
    pw_salt character varying
);


ALTER TABLE improved_schema.users OWNER TO postgres;

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


ALTER SEQUENCE improved_schema.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: improved_schema; Owner: postgres
--

ALTER SEQUENCE improved_schema.users_user_id_seq OWNED BY improved_schema.users.user_id;


--
-- TOC entry 4687 (class 2604 OID 16559)
-- Name: assignment_solutions assignment_solution_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignment_solutions ALTER COLUMN assignment_solution_id SET DEFAULT nextval('improved_schema.assignment_solutions_assignment_solution_id_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 16545)
-- Name: assignments assignment_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.assignments ALTER COLUMN assignment_id SET DEFAULT nextval('improved_schema.assignments_assignment_id_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 16508)
-- Name: courses course_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.courses ALTER COLUMN course_id SET DEFAULT nextval('improved_schema.courses_course_id_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 16528)
-- Name: enrollments enrollment_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.enrollments ALTER COLUMN enrollment_id SET DEFAULT nextval('improved_schema.enrollments_enrollment_id_seq'::regclass);


--
-- TOC entry 4692 (class 2604 OID 16632)
-- Name: exercise_solutions exercise_solution_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercise_solutions ALTER COLUMN exercise_solution_id SET DEFAULT nextval('improved_schema.exercise_solutions_exercise_solution_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 16590)
-- Name: exercises exercise_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.exercises ALTER COLUMN exercise_id SET DEFAULT nextval('improved_schema.exercises_exercise_id_seq'::regclass);


--
-- TOC entry 4691 (class 2604 OID 16618)
-- Name: hints hint_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.hints ALTER COLUMN hint_id SET DEFAULT nextval('improved_schema.hints_hint_id_seq'::regclass);


--
-- TOC entry 4688 (class 2604 OID 16578)
-- Name: sessions session_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.sessions ALTER COLUMN session_id SET DEFAULT nextval('improved_schema.sessions_session_id_seq'::regclass);


--
-- TOC entry 4690 (class 2604 OID 16604)
-- Name: test_cases test_case_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.test_cases ALTER COLUMN test_case_id SET DEFAULT nextval('improved_schema.test_cases_test_case_id_seq'::regclass);


--
-- TOC entry 4684 (class 2604 OID 16517)
-- Name: users user_id; Type: DEFAULT; Schema: improved_schema; Owner: postgres
--

ALTER TABLE ONLY improved_schema.users ALTER COLUMN user_id SET DEFAULT nextval('improved_schema.users_user_id_seq'::regclass);


--
-- TOC entry 4882 (class 0 OID 16556)
-- Dependencies: 224
-- Data for Name: assignment_solutions; Type: TABLE DATA; Schema: improved_schema; Owner: postgres
--
