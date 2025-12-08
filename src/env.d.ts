interface ImportMetaEnv {
  readonly SOLID_IDP : string;
  readonly SOLID_EMAIL : string;
  readonly SOLID_USERNAME : string;
  readonly SOLID_PASSWORD : string;
  readonly SOLID_VAULT_BASE_PATH : string;
  readonly LOCAL_VAULT_BASE_PATH : string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="astro/client" />