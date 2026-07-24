import { getProductSchemaObject, getBreadcrumbSchemaObject, getSyllabusSchemaObject, getHomeSchemaObject, getOrganizationSchemaObject } from '@/components/SchemaOrg';

describe('Schema builders', () => {
  test('Home schema has required keys', () => {
    const s = getHomeSchemaObject();
    expect(s['@context']).toBe('https://schema.org');
    expect(s['@type']).toBe('WebSite');
    expect(s.name).toBeDefined();
    expect(s.url).toBeDefined();
  });

  test('Organization schema has required keys', () => {
    const o = getOrganizationSchemaObject();
    expect(o['@type']).toBe('Organization');
    expect(o.name).toBeDefined();
    expect(o.url).toBeDefined();
  });

  test('Product schema contains offers and price', () => {
    const p = getProductSchemaObject({ id: '123', title: 'Test', description: 'desc', author: 'author', price: 99 });
    expect(p['@type']).toBe('Product');
    expect(p.offers).toBeDefined();
    expect(p.offers.price).toBe('99');
  });

  test('Breadcrumb schema builds list', () => {
    const items = [{ name: 'Home', url: 'https://example.com' }, { name: 'Browse', url: 'https://example.com/browse' }];
    const b = getBreadcrumbSchemaObject(items);
    expect(b['@type']).toBe('BreadcrumbList');
    expect(b.itemListElement.length).toBe(2);
  });

  test('Syllabus schema contains expected fields', () => {
    const s = getSyllabusSchemaObject({ id: 's1', title: 'Syllabus 1', university: 'U', course: 'C', branch: 'B', semester: '1' });
    expect(s['@type']).toBe('CreativeWork');
    expect(s.name).toBe('Syllabus 1');
    expect(s.about).toBeDefined();
  });
});
