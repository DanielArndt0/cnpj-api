const DOMAIN_DESCRIPTION_TRANSLATIONS: Record<
  string,
  Record<string, string>
> = {
  company_sizes: {
    "not informed": "Não informado",
    "micro company": "Microempresa",
    "small business": "Empresa de pequeno porte",
    other: "Demais",
  },
  branch_types: {
    headquarters: "Matriz",
    branch: "Filial",
  },
  registration_statuses: {
    null: "Nula",
    active: "Ativa",
    suspended: "Suspensa",
    inactive: "Inapta",
    closed: "Baixada",
  },
  partner_types: {
    "legal entity": "Pessoa jurídica",
    "natural person": "Pessoa física",
    "foreign person/entity": "Pessoa ou entidade estrangeira",
  },
  age_groups: {
    "not applicable": "Não se aplica",
    "0 to 12 years": "0 a 12 anos",
    "13 to 20 years": "13 a 20 anos",
    "21 to 30 years": "21 a 30 anos",
    "31 to 40 years": "31 a 40 anos",
    "41 to 50 years": "41 a 50 anos",
    "51 to 60 years": "51 a 60 anos",
    "61 to 70 years": "61 a 70 anos",
    "71 to 80 years": "71 a 80 anos",
    "over 80 years": "Acima de 80 anos",
  },
};

function normalizeDescription(description: string) {
  return description.trim().toLowerCase();
}

export function translateDomainDescription(
  tableName: string,
  description: string | null,
) {
  if (!description) {
    return description;
  }

  return (
    DOMAIN_DESCRIPTION_TRANSLATIONS[tableName]?.[
      normalizeDescription(description)
    ] ?? description
  );
}
