import { Injectable } from '@nestjs/common';
import { Database } from 'src/shared/database/database.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entity/invoice.entity';
import { InvoiceRepository } from './invoice.repo';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FetchInvoicePaginator } from './dto/fetch-invoice-paginator.dto';
import { SummaryDto } from './dto/summary.dto';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly databaseService: Database,
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  async insertInvoice(
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<Partial<Invoice>> {
    const { client_name, date } = createInvoiceDto;
    return await this.invoiceRepository.insertInvoice(client_name, date);
  }

  async insertInvoiceItem(
    invoice_id: string,
    addItemDto: AddItemDto,
  ): Promise<UpdateInvoiceDto> {
    return await this.invoiceRepository.updateInvoiceAfterItemsInserted(
      invoice_id,
      addItemDto,
    );
  }

  async removeInvoiceItem(
    invoiceId: string,
    itemId: string,
  ): Promise<UpdateInvoiceDto> {
    return await this.invoiceRepository.removeInvoiceItem(invoiceId, itemId);
  }

  async fetchInvoices(
    page: number,
    pageSize: number,
  ): Promise<FetchInvoicePaginator> {
    const count = await this.invoiceRepository.getInvoiceCount();
    return await this.invoiceRepository.fetchInvoices(count, page, pageSize);
  }

  async getSummary(): Promise<SummaryDto[]> {
    return await this.invoiceRepository.getSummary();
  }
}
