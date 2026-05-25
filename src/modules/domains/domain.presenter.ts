import type { DomainDefinition } from "./domain.catalog.js";
import type { DomainRow } from "./domain.repository.js";
import { translateDomainDescription } from "./domain.translation.js";

export function presentDomainItem(
  definition: DomainDefinition,
  item: DomainRow,
) {
  return {
    codigo: item.code,
    descricao: translateDomainDescription(
      definition.tableName,
      item.description,
    ),
  };
}

export function presentDomainSummaryItem(params: {
  definition: DomainDefinition;
  total: number;
  example: DomainRow | null;
}) {
  return {
    identificador: params.definition.slug,
    titulo: params.definition.title,
    resumo: params.definition.summary,
    descricao: params.definition.description,
    endpoint: `/api/dominios/${params.definition.slug}`,
    total: params.total,
    campos: [
      {
        campo: "codigo",
        descricao: "Código do registro na tabela de domínio.",
      },
      {
        campo: "descricao",
        descricao:
          "Descrição legível do registro, apresentada em português quando houver tradução conhecida.",
      },
    ],
    exemplo: params.example
      ? presentDomainItem(params.definition, params.example)
      : null,
  };
}

export function presentDomainMetadata(definition: DomainDefinition) {
  return {
    identificador: definition.slug,
    titulo: definition.title,
    resumo: definition.summary,
    endpoint: `/api/dominios/${definition.slug}`,
  };
}
