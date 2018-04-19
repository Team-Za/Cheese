Use `example_db`;

insert into users (username, email, password) values ("test", "test@gmail.com", "test");
insert into portfolios (userName, UserId) values ("test", 1);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("Apple Inc.", 10, "AAPL", "https://storage.googleapis.com/iex/api/logos/AAPL.png", 178.24, 1);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("Alcoa Corporation", 10, "AA", "https://storage.googleapis.com/iex/api/logos/AA.png", 57.08, 1);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("22nd Century Group Inc.", 10, "XXII", "https://storage.googleapis.com/iex/api/logos/XXII.png", 2.37, 1);
insert into users (username, email, password) values ("test2", "test@gmail.com", "test");
insert into portfolios (userName, UserId) values ("test2", 2);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("8x8 Inc", 30, "EGHT", "https://storage.googleapis.com/iex/api/logos/EGHT.png", 19.58, 2);
insert into stocks (name, quantity, symbol, imageLink, price, PortfolioId) values ("3M Company", 40, "MMM", "https://storage.googleapis.com/iex/api/logos/MMM.png", 219.66, 2);