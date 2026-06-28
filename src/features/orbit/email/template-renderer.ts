export const renderTemplate = (template: string, variables: Record<string, string>): string =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? '');
