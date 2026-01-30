// Placeholder for additional parsing utilities
export class ResumeParser {
  static parseSection(text: string, sectionName: string): string {
    const regex = new RegExp(`${sectionName}[\\s\\S]*?(?=\\n\\n|$)`, 'i');
    const match = text.match(regex);
    return match ? match[0].replace(new RegExp(`^${sectionName}\\s*`, 'i'), '').trim() : '';
  }
}
