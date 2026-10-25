import { describe, expect, it } from 'vitest';
import { LIMITS, isSpam, validateContact, type ContactInput } from '../../src/lib/form';
import { recommendPlan } from '../../src/lib/planFinder';

const valid: ContactInput = {
  name: 'Ana Pérez',
  email: 'ana@ejemplo.co',
  phone: '+57 300 000 0000',
  service: 'Nómina',
  message: 'Necesito ayuda con la nómina de dos personas.',
  consent: true,
};

describe('validación del formulario de contacto', () => {
  it('acepta un envío completo', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('bloquea el envío si no se acepta el tratamiento de datos', () => {
    const errors = validateContact({ ...valid, consent: false });
    expect(errors.consent).toBeDefined();
  });

  it('exige nombre, correo válido, servicio y mensaje', () => {
    const errors = validateContact({ ...valid, name: ' ', email: 'ana@', service: 'Otro', message: 'hola' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'service']);
  });

  it('el teléfono es opcional pero se valida si se escribe', () => {
    expect(validateContact({ ...valid, phone: '' }).phone).toBeUndefined();
    expect(validateContact({ ...valid, phone: 'llámame' }).phone).toBeDefined();
    expect(validateContact({ ...valid, phone: '+57 (601) 745 8899 ext. 12345' }).phone).toBeUndefined();
    expect(validateContact({ ...valid, phone: '601 745 8899 x12' }).phone).toBeUndefined();
  });

  it('acepta correos largos reales y nombres con tildes o en otros alfabetos', () => {
    expect(
      validateContact({
        ...valid,
        email: 'bartholomew.fitzgerald@northwind-industries-holdings.example.com',
      }),
    ).toEqual({});
    expect(validateContact({ ...valid, name: 'Dương Thị Ngọc Ánh' })).toEqual({});
    expect(validateContact({ ...valid, name: 'عبد الرحمن الشمري' })).toEqual({});
    expect(validateContact({ ...valid, name: 'Jo' })).toEqual({});
  });

  it('respeta los límites de longitud', () => {
    expect(validateContact({ ...valid, name: 'a'.repeat(LIMITS.name + 1) }).name).toBeDefined();
    expect(validateContact({ ...valid, message: 'a'.repeat(LIMITS.message + 1) }).message).toBeDefined();
    expect(validateContact({ ...valid, email: `${'a'.repeat(250)}@x.co` }).email).toBeDefined();
  });

  it('detecta el campo trampa', () => {
    expect(isSpam({ website: 'http://spam' })).toBe(true);
    expect(isSpam({ website: '' })).toBe(false);
  });
});

describe('buscador de planes', () => {
  it('recomienda Básico para un independiente sin IVA ni extras', () => {
    expect(recommendPlan({ team: 'solo', vat: 'no', extra: 'none' })).toBe('basico');
  });
  it('recomienda Profesional si es responsable de IVA o tiene nómina', () => {
    expect(recommendPlan({ team: 'solo', vat: 'yes', extra: 'none' })).toBe('profesional');
    expect(recommendPlan({ team: 'solo', vat: 'unsure', extra: 'none' })).toBe('profesional');
    expect(recommendPlan({ team: 'small', vat: 'no', extra: 'none' })).toBe('profesional');
  });
  it('recomienda Empresarial para firmas o consultoría financiera', () => {
    expect(recommendPlan({ team: 'firm', vat: 'no', extra: 'none' })).toBe('empresarial');
    expect(recommendPlan({ team: 'solo', vat: 'no', extra: 'advisory' })).toBe('empresarial');
  });
});
