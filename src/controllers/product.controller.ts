import { Controller, Get, Post, Body, UseInterceptors, UploadedFile } from "@nestjs/common";
import { CsvFileService } from "../services/csv-file.service";
import { MessageService } from "../services/message.service";
import { ProductService } from "../services/use-cases/product";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("api/product")
export class ProductController {
  constructor(
    private readonly csvFileService: CsvFileService,
    private readonly messageService: MessageService,
    private readonly productService: ProductService
  ) {}

  @Post("processCsvFile")
  async processCsvFile(@Body() body) {
    const result = await this.csvFileService.process(
      body.csvFileName,
      "upsert-product",
      "upsert-product-dead-letter"
    );
    if (result[1] != null) {
      throw result[1];
    }
    const events = result[0];
    await Promise.all(
      events.map((event) => this.messageService.send(event[0], event[1]))
    );
    return events;
  }

  @Post("uploadCsvFile")
  @UseInterceptors(FileInterceptor("csvFile"))
  uploadCsvFile(@UploadedFile() csvFile: Express.Multer.File) {
    console.log(csvFile);
    return { filename: csvFile.filename };
  }

  @Get("all")
  async getAll() {
    return this.productService.getAllProducts();
  }
}
