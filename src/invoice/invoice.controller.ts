import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CreateInvoiceDto,
  CreateInvoiceResponse,
} from './dto/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import {
  FetchInvoicePaginator,
  FetchInvoicePaginatorResponse,
} from './dto/fetch-invoice-paginator.dto';
import { SummaryDto, SummaryResponse } from './dto/summary.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from 'src/shared/utils/dtos/success-response.enum';
import { UtilService } from 'src/shared/utils/util.service';
import { AddItemDto } from './dto/add-item.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly _util: UtilService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @ApiOperation({ description: 'Create Invoice' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Invoice created!',
    type: CreateInvoiceResponse,
  })
  @Post('/create')
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Res() res: Response,
  ): Promise<Response<CreateInvoiceResponse>> {
    const resp = {
      id: (await this.invoiceService.insertInvoice(createInvoiceDto)).id,
    };
    const resObj = this._util.successResponse<{ id: string }>(
      SuccessResponse.CREATED,
      'Invoice Created!',
      resp,
    );
    return res.status(HttpStatus.CREATED).json(resObj);
  }

  @ApiOperation({ description: 'Add InvoiceItem' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'InvoiceItem Added!',
    type: UpdateInvoiceDto,
  })
  @Post(':id/items')
  async addInvoiceItem(
    @Param('id') invoiceId: string,
    @Body() addItemDto: AddItemDto,
    @Res() res: Response,
  ): Promise<Response<UpdateInvoiceDto>> {
    const resp = await this.invoiceService.insertInvoiceItem(
      invoiceId,
      addItemDto,
    );
    const resObj = this._util.successResponse<UpdateInvoiceDto>(
      SuccessResponse.OK,
      'InvoiceItem Added!',
      resp,
    );
    return res.status(HttpStatus.OK).json(resObj);
  }

  @ApiOperation({ description: 'Remove InvoiceItem' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'InvoiceItem Removed!',
    type: UpdateInvoiceDto,
  })
  @Delete(':id/items/:itemId')
  async removeInvoiceItem(
    @Param('id') invoiceId: string,
    @Param('itemId') itemId: string,
    @Res() res: Response,
  ): Promise<Response<UpdateInvoiceDto>> {
    const result = await this.invoiceService.removeInvoiceItem(
      invoiceId,
      itemId,
    );
    const response = this._util.successResponse<UpdateInvoiceDto>(
      SuccessResponse.OK,
      'InvoiceItem Removed!',
      result,
    );
    return res.status(HttpStatus.OK).json(response);
  }

  @ApiOperation({ description: 'Get Invoice' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Invoice Fetched!',
    type: SummaryResponse,
  })
  @Get('/get')
  async fetchInvoices(
    @Query('page') page = 1,
    @Query('pagesize') pageSize = 2,
    @Res() res: Response,
  ): Promise<Response<FetchInvoicePaginatorResponse>> {
    const result = await this.invoiceService.fetchInvoices(page, pageSize);
    const resObj = this._util.successResponse<FetchInvoicePaginator>(
      SuccessResponse.OK,
      'Invoice Fetched!',
      result,
    );
    return res.status(HttpStatus.OK).json(resObj);
  }

  @ApiOperation({ description: 'Get Summary' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Summary Fetched!',
    type: SummaryResponse,
  })
  @Get('/summary')
  async getSummary(@Res() res: Response): Promise<Response<SummaryResponse>> {
    const result = await this.invoiceService.getSummary();
    const resObj = this._util.successResponse<SummaryDto[]>(
      SuccessResponse.OK,
      'Summary Fetched!',
      result,
    );
    return res.status(HttpStatus.OK).json(resObj);
  }
}
