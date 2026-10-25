import type { PlanId } from '../data/plans';

export type Team = 'solo' | 'small' | 'firm';
export type Vat = 'yes' | 'no' | 'unsure';
export type Extra = 'none' | 'payroll' | 'advisory';

export interface FinderAnswers {
  team: Team;
  vat: Vat;
  extra: Extra;
}

// Regla sencilla y explicable: el plan se elige por lo más exigente que pida el caso.
export function recommendPlan({ team, vat, extra }: FinderAnswers): PlanId {
  if (team === 'firm' || extra === 'advisory') return 'empresarial';
  if (team === 'small' || vat !== 'no' || extra === 'payroll') return 'profesional';
  return 'basico';
}

export function reasonFor(answers: FinderAnswers, plan: PlanId): string {
  if (plan === 'empresarial') {
    return answers.extra === 'advisory'
      ? 'Incluye la consultoría financiera mensual que pediste.'
      : 'Cubre la nómina y las obligaciones de una firma con equipo.';
  }
  if (plan === 'profesional') {
    if (answers.vat === 'unsure')
      return 'Incluye IVA y retención; en la consulta confirmamos si eres responsable de IVA.';
    if (answers.vat === 'yes') return 'Incluye las declaraciones de IVA y retención en la fuente.';
    return 'Incluye la nómina de tu asistente o equipo pequeño.';
  }
  return 'Cubre tu contabilidad, tu declaración de renta y tu planilla como independiente.';
}
