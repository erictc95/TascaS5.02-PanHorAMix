CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
                       avatar_url VARCHAR(255),
                       avatar_enabled BOOLEAN NOT NULL DEFAULT FALSE,
                       banner_url VARCHAR(255),
                       banner_enabled BOOLEAN NOT NULL DEFAULT FALSE,
                       first_name VARCHAR(100),
                       last_name VARCHAR(100),
                       bio TEXT,
                       phone_number VARCHAR(30),
                       phone_verified_at TIMESTAMP,
                       deletion_keyword_hash VARCHAR(255),
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       deleted_at TIMESTAMP
);

CREATE TABLE verification_codes (
                                    id BIGSERIAL PRIMARY KEY,
                                    user_id BIGINT NOT NULL,
                                    code_hash VARCHAR(255) NOT NULL,
                                    purpose VARCHAR(30) NOT NULL
                                        CHECK (
                                            purpose IN (
                                                        'PHONE_VERIFICATION',
                                                        'PHONE_CHANGE',
                                                        'ACCOUNT_DELETION'
                                                )
                                            ),
                                    target_phone VARCHAR(30),
                                    expires_at TIMESTAMP NOT NULL,
                                    attempts INT NOT NULL DEFAULT 0,
                                    used_at TIMESTAMP,
                                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    CONSTRAINT fk_verification_user
                                        FOREIGN KEY (user_id)
                                            REFERENCES users(id)
                                            ON DELETE CASCADE
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
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       user_id BIGINT NOT NULL,

                       CONSTRAINT fk_media_user
                           FOREIGN KEY (user_id)
                               REFERENCES users(id)
                               ON DELETE CASCADE
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