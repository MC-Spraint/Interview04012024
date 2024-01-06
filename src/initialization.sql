-- Enable the uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Invoices Table with UUID primary key
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
  	total_amount DECIMAL DEFAULT 0,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create InvoiceItems Table with UUID primary key
CREATE TABLE invoice_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_quantity INT NOT NULL DEFAULT 1,
    item_rate DECIMAL NOT NULL,
    item_discount_percentage DECIMAL(5, 2) DEFAULT 0,
  	item_amount DECIMAL NOT NULL,
  	item_discount_amount DECIMAL NOT NULL,
  
  	invoice_id UUID REFERENCES invoices(id)
);
