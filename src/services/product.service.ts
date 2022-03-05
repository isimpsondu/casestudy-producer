import * as fs from "fs";
import * as path from "path";
import * as csv from "fast-csv";
import { Injectable } from "@nestjs/common";
import { MessageService } from "./message.service";

type ProductRow = {
  productId: string;
  price: number;
  stock: number;
};

@Injectable()
export class ProductService {
  constructor(private readonly messageService: MessageService) {}

  async processCsvFile(
    csvFileName: string,
    dataQueue: string,
    deadLetterQueue: string
  ) {
    const events: [string, ProductRow][] = [];
    fs.createReadStream(path.resolve(__dirname, "../assets", csvFileName))
      .pipe(csv.parse<ProductRow, ProductRow>({ headers: true }))
      .validate(
        (data: ProductRow): boolean => data.price >= 0 && data.stock >= 0
      )
      .on("error", (error) => console.error(error))
      .on("data", (row: ProductRow) => {
        console.log(`Valid [row=${JSON.stringify(row)}]`);
        // valid case
        events.push([dataQueue, row]);
      })
      .on("data-invalid", (row, rowNumber) => {
        console.log(
          `Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`
        );
        // invalid case
        events.push([deadLetterQueue, row]);
      })
      .on("end", async (rowCount: number) => {
        console.log(`Processed ${rowCount} rows`);
        await Promise.all(
          events.map((event) => this.messageService.send(event[0], event[1]))
        );
      });
  }
}
