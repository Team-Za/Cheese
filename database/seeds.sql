Use `example_db`;

insert into users (username, email, password) values ("test", "test@gmail.com", "test");
insert into portfolios (userName, UserId) values ("test", 1);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("testStock", 10, "testSymbol", "testImg", 3.50, 1);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("testStock2", 10, "testSymbol", "testImg", 3.50, 1);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("testStock3", 10, "testSymbol", "testImg", 3.50, 1);
insert into users (username, email, password) values ("test2", "test@gmail.com", "test");
insert into portfolios (userName, UserId) values ("test2", 2);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("testStock", 10, "testSymbol", "testImg", 3.50, 2);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("testStock2", 10, "testSymbol", "testImg", 3.50, 2);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("testStock3", 10, "testSymbol", "testImg", 3.50, 2);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("testStock4", 10, "testSymbol", "testImg", 3.56879, 2);