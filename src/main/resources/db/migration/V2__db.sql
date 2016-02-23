CREATE TABLE Stores(
    id INTEGER AUTO_INCREMENT,
    name varchar
);
CREATE TABLE Products(
    id INTEGER AUTO_INCREMENT,
    code varchar,
    name varchar
);
CREATE TABLE Sales(
    id INTEGER AUTO_INCREMENT,
    store_id INTEGER,
    product_id INTEGER,
    count INTEGER,
    prise double,
    date DATE
);

INSERT INTO Stores VALUES(
    1, 'Вавилон'
);

INSERT INTO Stores VALUES(
    2, 'Спутник'
);

INSERT INTO Stores VALUES(
    3, 'Тверь'
);
