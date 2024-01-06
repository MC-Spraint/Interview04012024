import { Injectable, Logger } from '@nestjs/common';
import { Database } from 'src/shared/database/database.service';
import { Invoice } from './entity/invoice.entity';
import { InvoiceItem } from './entity/invoice-item.entity';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FetchInvoicePaginator } from './dto/fetch-invoice-paginator.dto';
import { SummaryDto } from './dto/summary.dto';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class InvoiceRepository {
  private readonly logger = new Logger(InvoiceRepository.name);

  constructor(private readonly databaseService: Database) {}

  public async insertInvoice(
    client_name: string,
    date: string,
  ): Promise<Partial<Invoice>> {
    const data = { client_name, date };
    const parameters = [...Object.values(data)];
    const query =
      `INSERT INTO invoices (` +
      Object.keys(data)
        .map((key) => `${key}`)
        .join(', ') +
      ') VALUES (' +
      Object.values(data)
        .map((value, index) => `$${index + 1}`)
        .join(', ') +
      ') RETURNING *;';

    try {
      const [newEntity] = await this.databaseService.query<Invoice>(
        query,
        parameters,
      );
      return newEntity;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async insertInvoiceItem(
    invoice_id: string,
    addItem: AddItemDto,
  ): Promise<InvoiceItem[]> {
    const item_amount = addItem.item_rate * addItem.item_quantity;
    const item_discount_amount =
      (addItem.item_quantity *
        (addItem.item_rate * addItem.item_discount_percentage)) /
      100;
    const data = {
      ...addItem,
      invoice_id,
      item_amount: Number(item_amount),
      item_discount_amount: Number(item_discount_amount),
    };
    const parameters = [
      ...Object.values(addItem),
      invoice_id,
      Number(item_amount),
      Number(item_discount_amount),
    ];
    const query =
      `INSERT INTO invoice_items (` +
      Object.keys(data)
        .map((key) => `${key}`)
        .join(', ') +
      ') VALUES (' +
      Object.values(data)
        .map((value, index) => `$${index + 1}`)
        .join(', ') +
      ') RETURNING *;';
    try {
      const newEntities = await this.databaseService.query<InvoiceItem>(
        query,
        parameters,
      );
      return newEntities;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async updateInvoiceAfterItemsInserted(
    invoice_id: string,
    addItem: AddItemDto,
  ): Promise<UpdateInvoiceDto> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [invoice, items] = await Promise.all([
        this.insertInvoiceItem(invoice_id, addItem),
        this.getItemsByInvoiceId(invoice_id),
      ]);
      const total_amount = items.reduce(
        (sum, item) => sum + Number(item.item_amount),
        0,
      );
      const parameters = [total_amount, invoice_id];
      const query = `UPDATE invoices SET 
        total_amount=$1
        WHERE id=$2 RETURNING *;`;
      const [updatedInvoice] = await this.databaseService.query<Invoice>(
        query,
        parameters,
      );
      const updated_invoice = { ...updatedInvoice, total_amount, items };
      return updated_invoice;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async getItemsByInvoiceId(invoice_id: string): Promise<InvoiceItem[]> {
    const query = `
    SELECT * FROM invoice_items 
    WHERE invoice_id=$1;
  `;

    try {
      const invoice = await this.databaseService.query<InvoiceItem>(query, [
        invoice_id,
      ]);
      return invoice;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async getInvoiceById(invoice_id: string): Promise<Invoice> {
    const query = `
      SELECT * FROM invoices 
      WHERE id=$1;
    `;

    try {
      const [invoice] = await this.databaseService.query<Invoice>(query, [
        invoice_id,
      ]);
      return invoice;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async removeInvoiceItem(
    invoice_id: string,
    item_id: string,
  ): Promise<UpdateInvoiceDto> {
    const deleteQuery = `
    DELETE FROM invoice_items
    WHERE invoice_id = $1 AND id = $2;
    
    `;
    const updateQuery = `UPDATE invoices SET 
        total_amount=$1
        WHERE id=$2 RETURNING *;`;
    try {
      const deletePArameters = [invoice_id, item_id];
      await this.databaseService.query(deleteQuery, deletePArameters);
      const [items] = await Promise.all([this.getItemsByInvoiceId(invoice_id)]);
      const total_amount = items.reduce(
        (sum, item) => sum + Number(item.item_amount),
        0,
      );
      const updateParameters = [total_amount, invoice_id];
      const [updatedInvoice] = await this.databaseService.query<Invoice>(
        updateQuery,
        updateParameters,
      );
      const updated_invoice = { ...updatedInvoice, total_amount, items };
      return updated_invoice;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async getInvoiceCount(): Promise<number> {
    const query = `
      SELECT COUNT(*) AS total_count
      FROM invoices;
    `;

    try {
      const [result] = await this.databaseService.query<{
        total_count: number;
      }>(query);
      return result.total_count;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  public async fetchInvoices(
    total_entity: number,
    page_no?: number,
    per_page?: number,
  ): Promise<FetchInvoicePaginator> {
    const page = page_no || 1;
    const limit = per_page || 5;
    const total_pages = Math.ceil(total_entity / limit);
    const pre_page = page - 1 ? page - 1 : null;
    const next_page = total_pages < page + 1 ? null : page + 1;
    const offset = (page - 1) * limit;

    const mainQuery = `
    SELECT
    invoices.id AS invoice_id,
    invoices.client_name,
    invoices.total_amount,
    invoices.date,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'item_id', invoice_items.id,
            'item_name', invoice_items.item_name,
            'item_quantity', invoice_items.item_quantity,
            'item_rate', invoice_items.item_rate,
            'item_discount_percentage', invoice_items.item_discount_percentage,
            'item_discount_amount', invoice_items.item_discount_amount,
            'item_amount', invoice_items.item_amount
        )
    ) AS items
FROM invoices
LEFT JOIN invoice_items ON invoices.id = invoice_items.invoice_id
GROUP BY invoices.id

    `;
    const query = `
    ${mainQuery} 
    LIMIT $1
    OFFSET $2 `;
    const variables = [limit, offset];
    try {
      const invoices = await this.databaseService.query<UpdateInvoiceDto>(
        query,
        variables,
      );
      const paginatedItems: FetchInvoicePaginator = {
        page: page,
        per_page: limit,
        pre_page: pre_page,
        next_page: next_page,
        total: total_entity,
        total_pages: total_pages,
        data: invoices,
      };
      return paginatedItems;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async getSummary(): Promise<SummaryDto[]> {
    const query = `
        SELECT
            DATE_TRUNC('day', invoices.date) AS date,
            COUNT(DISTINCT invoices.id) AS invoice_count,
            COUNT(invoice_items.id) AS item_count,
            COALESCE(SUM(invoice_items.item_discount_amount), 0) AS total_discount_value,
            COALESCE(SUM(invoice_items.item_amount), 0) AS total_amount
        FROM invoices
        LEFT JOIN invoice_items ON invoices.id = invoice_items.invoice_id
        GROUP BY date
        ORDER BY date;
    `;

    try {
      const results = await this.databaseService.query<SummaryDto>(query);
      return results;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
