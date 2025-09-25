DELETE FROM descricao_status;

INSERT INTO descricao_status (status_id, categoria, descricao) VALUES
(100, 0, 'Aberto'),
(101, 0, 'Finalizado'),
(102, 0, 'Cancelado'),
(200, 1, 'Pendente'),
(201, 1, 'Confirmado'),
(202, 1, 'Entregue'),
(203, 1, 'Cancelado');
