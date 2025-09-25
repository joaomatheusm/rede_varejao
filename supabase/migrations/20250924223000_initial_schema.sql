CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT now(),
    data_ult_atualizacao TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    imagem_url VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT now(),
    data_ult_atualizacao TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS produto (
    id SERIAL PRIMARY KEY,
    categoria_id INT REFERENCES categoria(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_url VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    unidade_medida VARCHAR(50),
    estoque INT DEFAULT 0,
    is_oferta BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT now(),
    data_ult_atualizacao TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS endereco (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE CASCADE,
    logradouro VARCHAR(255),
    numero VARCHAR(50),
    complemento VARCHAR(255),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    cep VARCHAR(20),
    apelido VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT now(),
    data_ult_atualizacao TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS descricao_status (
    status_id INT PRIMARY KEY,
    categoria INT NOT NULL, 
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS carrinho (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE CASCADE,
    status_id INT REFERENCES descricao_status(status_id),
    valor_total DECIMAL(10,2),
    data_criacao TIMESTAMP DEFAULT now(),
    data_ult_atualizacao TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS carrinho_item (
    id SERIAL PRIMARY KEY,
    carrinho_id INT REFERENCES carrinho(id) ON DELETE CASCADE,
    produto_id INT REFERENCES produto(id) ON DELETE CASCADE,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2),
    data_criacao TIMESTAMP DEFAULT now(),
    data_ult_atualizacao TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedido (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE CASCADE,
    endereco_id INT REFERENCES endereco(id),
    status_id INT REFERENCES descricao_status(status_id),
    valor_total DECIMAL(10,2),
    taxa_entrega DECIMAL(10,2),
    metodo_pagamento VARCHAR(50),
    data_criacao TIMESTAMP DEFAULT now(),
    data_ult_atualizacao TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedido_item (
    pedido_id INT REFERENCES pedido(id) ON DELETE CASCADE,
    produto_id INT REFERENCES produto(id) ON DELETE CASCADE,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2),
    PRIMARY KEY (pedido_id, produto_id)
);

CREATE TABLE IF NOT EXISTS favorito_usuario (
    usuario_id INT REFERENCES usuario(id) ON DELETE CASCADE,
    produto_id INT REFERENCES produto(id) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT now(),
    PRIMARY KEY (usuario_id, produto_id)
);

INSERT INTO descricao_status (status_id, categoria, descricao) VALUES
(1, 0, 'Aberto'),  
(2, 0, 'Finalizado'),
(3, 0, 'Cancelado'),
(4, 1, 'Pendente'),  
(5, 1, 'Confirmado'),
(6, 1, 'Cancelado'),
(7, 1, 'Entregue')
ON CONFLICT DO NOTHING;
