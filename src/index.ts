import { WebContents } from "electron";
import { BackgroundPage } from "./pages/background-page";
import { IContentScript, IManifest } from "./schema";
import { nanoid } from "nanoid";
import { readJSONSync } from "fs-extra";
import nodePath from "node:path";

enum ExtensionType {
  remote = "remote",
  local = "local",
}

export interface IRemoteExtensionConfig {
  type: ExtensionType.remote;
  id: string;
}

export interface ILocalExtensionConfig {
  type: ExtensionType.local;
  path: string;
}

type ExtensionConfig = IRemoteExtensionConfig | ILocalExtensionConfig;

export interface IExtensionHostOptions {
  extensions: ExtensionConfig[];
  devtoolsFrontendUrl: string;
}

export class ExtensionHost {
  backgroundPages: BackgroundPage[] = [];
  private extensions: { id: string; path: string; manifest: IManifest }[] = [];
  private devtoolsFrontendUrl: string;

  constructor(
    public contents: WebContents,
    { extensions, devtoolsFrontendUrl }: IExtensionHostOptions,
    cb?: () => void
  ) {
    this.devtoolsFrontendUrl = devtoolsFrontendUrl;
    Promise.all(extensions?.map((config) => this.loadExtension(config))).then(() => {
      cb?.();
    });
  }

  private loadManifest(path: string) {
    const manifest = readJSONSync(nodePath.resolve(path, "manifest.json")) as IManifest;
    return manifest;
  }

  private async loadExtension(config: ExtensionConfig) {
    if (config.type === ExtensionType.local) {
      this.extensions.push({ id: nanoid(32), path: config.path, manifest: this.loadManifest(config.path) });
    } else {
    }
  }

  private getContentScriptsByRunTiming(timing: IContentScript["run_at"]) {
    return this.extensions.reduce((list, extension) => {
      const scriptsList = (
        extension.manifest.content_scripts?.filter((script) => script.run_at === timing) ?? []
      ).map((i) => i.js ?? []);

      return [...list, ...scriptsList.reduce((scripts, script) => [...scripts, ...script], [] as string[])];
    }, [] as string[]);
  }

  processContentScripts() {
    this.contents.on("did-start-loading", () => {
      this.getContentScriptsByRunTiming("document_start").forEach((script) => {});
    });
  }
}
