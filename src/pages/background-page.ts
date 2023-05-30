import { BrowserView, session } from "electron";
import { createReadStream } from "fs-extra";
import nodePath from "node:path";
import { Readable } from "node:stream";
import { IBackground } from "../schema";

export class BackgroundPage {
  private browserView: BrowserView;

  constructor(public extensionId: string, options: IBackground, private path: string) {
    session
      .fromPartition("persist:ecd:background")
      .protocol.registerStreamProtocol("chrome-extension", (_, callback) => {
        if (options.page) {
          const pagePath = nodePath.resolve(this.path, options.page);
          callback({ data: createReadStream(pagePath) });
        } else {
          callback({
            data: Readable.from(
              Buffer.from(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Background Page</title>
                ${options.scripts?.map((script) => `<script src="${script}"></script>`).join("\n") ?? ""}
              </head>
              <body>
              </body>
            </html>
          `)
            ),
          });
        }
      });

    this.browserView = new BrowserView({
      webPreferences: {
        session: session.fromPartition("persist:ecd:background"),
        contextIsolation: true,
      },
    });
    this.browserView.webContents.loadURL(`chrome-extension://${this.extensionId}/background.html`);
  }
}
