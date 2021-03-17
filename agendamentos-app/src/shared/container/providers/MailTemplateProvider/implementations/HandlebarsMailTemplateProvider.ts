import fs from 'fs';
import handlebars from 'handlebars';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default class HandlebarsMailTemplateProvider
  implements IMailTemplateProvider {
  public async parse({
    templateFile,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const fileContent = await fs.promises.readFile(templateFile, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(fileContent);

    return parseTemplate(variables);
  }
}
