import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Person } from 'src/application/person/entities/person.entity';
import { Attribute } from 'src/application/attribute/entities/attribute.entity';

@Injectable()
export class ImportService {
  constructor(private dataSource: DataSource) {}

  async importExcel(filePath: string, categoryId: string) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const personRepo = this.dataSource.getRepository(Person);
    const attributeRepo = this.dataSource.getRepository(Attribute);

    for (const row of rows) {
        const person = personRepo.create({
            name: row['full_name'],
            category: { id: categoryId },
        });

        const attributeData = [
        { key: 'Nationality', value: row['nationality'] },
        { key: 'Overall-rating', value: row['overall_rating'] },
        { key: 'Preferred-foot', value: row['preferred_foot'] },
        ];

        const personAttributes: Attribute[] = [];

        for (const attr of attributeData) {
            const title = `${attr.key}: ${attr.value}`;

            let attribute = await attributeRepo.findOne({ where: { key: attr.key, title } });
            if (!attribute) {
                attribute = attributeRepo.create({
                    key: attr.key,
                    title,
                    category: { id: categoryId },
                });
                await attributeRepo.save(attribute);
            }
            personAttributes.push(attribute);
        }

            person.attributes = personAttributes;

            await personRepo.save(person);
        }

        console.log('Import finished!');
    }
}