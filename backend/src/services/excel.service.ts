import * as ExcelJS from 'exceljs';
import { Service } from 'typedi';

@Service()
export class ExcelService {
  fitWidthColumns(sheet: ExcelJS.Worksheet) {
    sheet.columns.forEach(column => {
      let maxLength = 0;
      column['eachCell']({ includeEmpty: true }, function (cell) {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
  }
}
