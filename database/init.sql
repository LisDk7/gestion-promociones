CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
);

CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,

    product_id INTEGER,
    category_id INTEGER,

    discount_type VARCHAR(20) NOT NULL,
    discount_value NUMERIC(10, 2) NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADA',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_promotion_product
        FOREIGN KEY (product_id)
        REFERENCES products(id),

    CONSTRAINT fk_promotion_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id),

    CONSTRAINT chk_promotion_target
        CHECK (
            (product_id IS NOT NULL AND category_id IS NULL)
            OR
            (product_id IS NULL AND category_id IS NOT NULL)
        ),

    CONSTRAINT chk_discount_type
        CHECK (discount_type IN ('PORCENTAJE', 'MONTO_FIJO')),

    CONSTRAINT chk_discount_value
        CHECK (discount_value > 0),

    CONSTRAINT chk_percentage_value
        CHECK (
            discount_type != 'PORCENTAJE'
            OR discount_value BETWEEN 1 AND 100
        ),

    CONSTRAINT chk_dates
        CHECK (end_date > start_date),

    CONSTRAINT chk_status
        CHECK (status IN ('PROGRAMADA', 'ACTIVA', 'FINALIZADA'))
);

INSERT INTO categories (name)
VALUES
    ('Ropa'),
    ('Tecnología'),
    ('Hogar');

INSERT INTO products (name, category_id)
VALUES
    ('Camiseta básica', 1),
    ('Pantalón clásico', 1),
    ('Audífonos inalámbricos', 2),
    ('Teclado mecánico', 2),
    ('Lámpara de escritorio', 3);