export interface IContentScript {
  matches: string[];
  exclude_matches?: string[];
  css?: string[];
  js?: string[];
  run_at?: "document_start" | "document_end" | "document_idle";
  all_frames?: boolean;
  include_globs?: string[];
  exclude_globs?: string[];
  match_about_blank?: boolean;
}

export interface IBackground {
  persistent?: boolean;
  page?: string;
  scripts?: string[];
}

export interface IManifest {
  manifest_version: 2 | 3;
  name: string;
  version: `${number}.${number}.${number}`;
  description?: string;
  icons?: {
    16: string;
    48: string;
    128: string;
    256: string;
  };
  commands?: {
    [key: string]: {
      description?: string;
      suggested_key: Record<
        "default" | "mac" | "windows" | "linux" | "chromeos",
        `${"Ctrl" | "Command" | "MacCtrl" | "Alt" | "Option"}+${"Shift+" | ""}${string}`
      >;
    };
  };
  content_scripts?: IContentScript[];
  devtools_page?: string;
  optional_permissions?: string[];
  permissions?: string[];
  background?: IBackground;
  content_security_policy?: string;
}
