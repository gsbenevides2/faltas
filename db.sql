

CREATE TABLE alunos (
    ra              INTEGER NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone        VARCHAR(11) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    data_ingresso   DATE NOT NULL,
    data_termino    DATE NOT NULL,
    PRIMARY KEY (ra)
);

CREATE TABLE disciplinas (
    codigo   VARCHAR(5) NOT NULL,
    nome     VARCHAR(100) NOT NULL,
    conteudo VARCHAR(10000) NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE professores (
    registro INTEGER NOT NULL,
    cpf      VARCHAR(11) NOT NULL,
    nome     VARCHAR(100) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    email    VARCHAR(100) NOT NULL,
    PRIMARY KEY (registro),
    UNIQUE (cpf)
);

CREATE TABLE disciplinas_ofertadas (
    semestre             INTEGER NOT NULL,
    ano                  INTEGER NOT NULL,
    sala                 INTEGER,
    disciplinas_codigo   VARCHAR(5) NOT NULL,
    professores_registro INTEGER,
    id                   VARCHAR(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (disciplinas_codigo) REFERENCES disciplinas (codigo),
    FOREIGN KEY (professores_registro) REFERENCES professores (registro)
);

CREATE TABLE faltas (
    data                     DATETIME NOT NULL,
    alunos_ra                INTEGER NOT NULL, 
    disciplinas_ofertadas_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (alunos_ra) REFERENCES alunos (ra),
    FOREIGN KEY (disciplinas_ofertadas_id) REFERENCES disciplinas_ofertadas (id)

);

CREATE TABLE alunos_matriculas (
    alunos_ra                INTEGER NOT NULL, 
    disciplinas_ofertadas_id VARCHAR2(10) NOT NULL,
    PRIMARY KEY (alunos_ra, disciplinas_ofertadas_id),
    FOREIGN KEY (alunos_ra) REFERENCES alunos (ra),
    FOREIGN KEY (disciplinas_ofertadas_id) REFERENCES disciplinas_ofertadas (id)
);
