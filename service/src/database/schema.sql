-- ============================================================
CREATE DATABASE IF NOT EXISTS ifrs_voluntariado DEFAULT CHARACTER
SET
    utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

USE ifrs_voluntariado;

-- ------------------------------------------------------------
-- Desabilita temporariamente a checagem de chaves estrangeiras
-- ------------------------------------------------------------
SET
    FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS event_volunteers;

DROP TABLE IF EXISTS volunteers;

DROP TABLE IF EXISTS events;

DROP TABLE IF EXISTS users;

SET
    FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Users (Usuários e Administradores)
-- ------------------------------------------------------------
CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM ('admin', 'volunteer') NOT NULL DEFAULT 'volunteer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- ------------------------------------------------------------
-- Events (Eventos e Ações Sociais)
-- ------------------------------------------------------------
CREATE TABLE
    events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(150) NOT NULL,
        date DATETIME NOT NULL,
        max_volunteers INT NOT NULL CHECK (max_volunteers > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- ------------------------------------------------------------
-- Volunteers (Voluntários Cadastrados)
-- ------------------------------------------------------------
CREATE TABLE
    volunteers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        phone VARCHAR(20) NULL,
        course_or_affiliation VARCHAR(100) DEFAULT 'Comunidade Externa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- ------------------------------------------------------------
-- Event Volunteers (Inscrição/Vínculo de Voluntários nos Eventos)
-- ------------------------------------------------------------
CREATE TABLE
    event_volunteers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        volunteer_id INT NULL,
        user_id INT NULL,
        status ENUM ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
        FOREIGN KEY (volunteer_id) REFERENCES volunteers (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE KEY unique_event_volunteer (event_id, volunteer_id),
        UNIQUE KEY unique_event_user (event_id, user_id),
        CONSTRAINT chk_event_volunteer_identity CHECK (
            (
                volunteer_id IS NOT NULL
                AND user_id IS NULL
            )
            OR (
                volunteer_id IS NULL
                AND user_id IS NOT NULL
            )
        )
    );

-- ============================================================
-- DADOS FICTÍCIOS DE INICIALIZAÇÃO (SEEDS)
-- ============================================================
-- Usuários padrão
-- Senha do admin@ifrs.edu.br: 123456 (Hash Bcrypt gerado)
INSERT INTO
    users (name, email, password, role)
VALUES
    (
        'Admin',
        'admin@ifrs.edu.br',
        '$2b$10$YY6OxOIOdCCFbNFr6Fa/6efJJrcc8muGJfmU4PFeBCks90g8A8BQ6',
        'admin'
    ),
    (
        'User 1',
        'user1@gmail.com',
        '$2b$10$YY6OxOIOdCCFbNFr6Fa/6efJJrcc8muGJfmU4PFeBCks90g8A8BQ6',
        'volunteer'
    ),
    (
        'Rick Sanchez',
        'ricksanchez@gmail.com',
        '$2b$10$YY6OxOIOdCCFbNFr6Fa/6efJJrcc8muGJfmU4PFeBCks90g8A8BQ6',
        'volunteer'
    ),
    (
        'Morty Smith',
        'mortysmith@gmail.com',
        '$2b$10$YY6OxOIOdCCFbNFr6Fa/6efJJrcc8muGJfmU4PFeBCks90g8A8BQ6',
        'volunteer'
    ),
    (
        'Evil Morty',
        'evilmorty@gmail.com',
        '$2b$10$YY6OxOIOdCCFbNFr6Fa/6efJJrcc8muGJfmU4PFeBCks90g8A8BQ6',
        'volunteer'
    ),
    (
        'Jerry Smith',
        'jerrysmith@gmail.com',
        '$2b$10$YY6OxOIOdCCFbNFr6Fa/6efJJrcc8muGJfmU4PFeBCks90g8A8BQ6',
        'volunteer'
    );

INSERT INTO
    events (
        title,
        description,
        location,
        date,
        max_volunteers
    )
VALUES
    (
        'Campanha de Doação de Sangue',
        'Ação solidária em parceria com o Hemocentro Regional.',
        'Campus Bento Gonçalves - Bloco B',
        '2026-11-15 08:30:00',
        30
    ),
    (
        'Arrecadação de Alimentos',
        'Mutirão de arrecadação para famílias carentes.',
        'Praça Via Del Vino - Centro',
        '2026-11-20 09:00:00',
        15
    ),
    (
        'Mutirão Ambiental no Campus',
        'Plantio de mudas nativas.',
        'Trilha Ecológica - Campus Bento Gonçalves',
        '2026-12-05 13:30:00',
        25
    );

INSERT INTO
    volunteers (user_id, phone, course_or_affiliation)
SELECT
    id,
    CASE email
        WHEN 'user1@gmail.com' THEN '(54) 99900-0000'
        WHEN 'ricksanchez@gmail.com' THEN '(54) 99911-2233'
        WHEN 'mortysmith@gmail.com' THEN '(54) 99822-3344'
        WHEN 'evilmorty@gmail.com' THEN '(54) 99733-4455'
        WHEN 'jerrysmith@gmail.com' THEN '(54) 99644-5566'
    END,
    CASE email
        WHEN 'user1@gmail.com' THEN 'Comunidade Externa'
        WHEN 'ricksanchez@gmail.com' THEN 'Análise e Desenvolvimento de Sistemas'
        WHEN 'mortysmith@gmail.com' THEN 'Informática Para Internet'
        WHEN 'evilmorty@gmail.com' THEN 'Comunidade Externa'
        WHEN 'jerrysmith@gmail.com' THEN 'Comunidade Externa'
    END
FROM users
WHERE role = 'volunteer';

INSERT INTO
    event_volunteers (event_id, user_id)
VALUES
    (1, 3),
    (1, 4),
    (2, 5),
    (3, 3),
    (3, 6);