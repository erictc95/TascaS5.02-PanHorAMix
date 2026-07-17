CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
                       avatar_url VARCHAR(255),
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media (
                       id BIGSERIAL PRIMARY KEY,
                       title VARCHAR(150) NOT NULL,
                       description TEXT,
                       media_url VARCHAR(255) NOT NULL,
                       thumbnail_url VARCHAR(255),
                       media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('VIDEO', 'IMAGE')),
                       category VARCHAR(100) NOT NULL,
                       visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('PUBLIC', 'PRIVATE')),
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
                      id BIGSERIAL PRIMARY KEY,
                      name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE media_tags (
                            media_id BIGINT NOT NULL,
                            tag_id BIGINT NOT NULL,

                            PRIMARY KEY (media_id, tag_id),

                            CONSTRAINT fk_media_tags_media
                                FOREIGN KEY (media_id)
                                    REFERENCES media(id)
                                    ON DELETE CASCADE,

                            CONSTRAINT fk_media_tags_tag
                                FOREIGN KEY (tag_id)
                                    REFERENCES tags(id)
                                    ON DELETE CASCADE
);