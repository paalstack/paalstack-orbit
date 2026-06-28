import type { WorkflowCondition } from '@/types/orbit';

export const evaluateCondition = (
  condition: WorkflowCondition,
  context: Record<string, string>
): boolean => {
  const contextValue = context[condition.field];
  if (contextValue === undefined) return false;

  switch (condition.operator) {
    case 'eq':
      return contextValue === condition.value;
    case 'neq':
      return contextValue !== condition.value;
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(contextValue);
    case 'not_in':
      return Array.isArray(condition.value) && !condition.value.includes(contextValue);
    default:
      return false;
  }
};
