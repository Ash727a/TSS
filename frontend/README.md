- __frontend__
   - [README.md](README.md)
   - [angular.json](angular.json)
   - [node\_modules](node_modules)
   - [package\-lock.json](package-lock.json)
   - [package.json](package.json)
   - __src__
     - __app__
       - [app\-routing.module.ts](src/app/app-routing.module.ts)
       - [app.component.html](src/app/app.component.html)
       - [app.component.scss](src/app/app.component.scss)
       - [app.component.spec.ts](src/app/app.component.spec.ts)
       - [app.component.ts](src/app/app.component.ts)
       - [app.module.ts](src/app/app.module.ts)
       - __core__
         - __interfaces__
           - [events.ts](src/app/core/interfaces/events.ts)
           - [index.ts](src/app/core/interfaces/index.ts)
           - [room.ts](src/app/core/interfaces/room.ts)
           - [telemetry.ts](src/app/core/interfaces/telemetry.ts)
           - [uia.ts](src/app/core/interfaces/uia.ts)
       - __modules__
         - __logs__
           - [logs.component.html](src/app/modules/logs/logs.component.html)
           - [logs.component.scss](src/app/modules/logs/logs.component.scss)
           - [logs.component.spec.ts](src/app/modules/logs/logs.component.spec.ts)
           - [logs.component.ts](src/app/modules/logs/logs.component.ts)
         - __rooms__
           - [rooms.component.html](src/app/modules/rooms/rooms.component.html)
           - [rooms.component.scss](src/app/modules/rooms/rooms.component.scss)
           - [rooms.component.spec.ts](src/app/modules/rooms/rooms.component.spec.ts)
           - [rooms.component.ts](src/app/modules/rooms/rooms.component.ts)
           - __station\-switch\-card__
             - [station\-switch\-card.component.html](src/app/modules/rooms/station-switch-card/station-switch-card.component.html)
             - [station\-switch\-card.component.scss](src/app/modules/rooms/station-switch-card/station-switch-card.component.scss)
             - [station\-switch\-card.component.spec.ts](src/app/modules/rooms/station-switch-card/station-switch-card.component.spec.ts)
             - [station\-switch\-card.component.ts](src/app/modules/rooms/station-switch-card/station-switch-card.component.ts)
             - __status\-icon\-text\-display__
               - [status\-icon\-text\-display.component.html](src/app/modules/rooms/station-switch-card/status-icon-text-display/status-icon-text-display.component.html)
               - [status\-icon\-text\-display.component.scss](src/app/modules/rooms/station-switch-card/status-icon-text-display/status-icon-text-display.component.scss)
               - [status\-icon\-text\-display.component.spec.ts](src/app/modules/rooms/station-switch-card/status-icon-text-display/status-icon-text-display.component.spec.ts)
               - [status\-icon\-text\-display.component.ts](src/app/modules/rooms/station-switch-card/status-icon-text-display/status-icon-text-display.component.ts)
         - __telemetry__
           - __controller__
             - [controller.component.html](src/app/modules/telemetry/controller/controller.component.html)
             - [controller.component.scss](src/app/modules/telemetry/controller/controller.component.scss)
             - [controller.component.spec.ts](src/app/modules/telemetry/controller/controller.component.spec.ts)
             - [controller.component.ts](src/app/modules/telemetry/controller/controller.component.ts)
           - __state__
             - [state.component.html](src/app/modules/telemetry/state/state.component.html)
             - [state.component.scss](src/app/modules/telemetry/state/state.component.scss)
             - [state.component.spec.ts](src/app/modules/telemetry/state/state.component.spec.ts)
             - [state.component.ts](src/app/modules/telemetry/state/state.component.ts)
           - [telemetry.component.html](src/app/modules/telemetry/telemetry.component.html)
           - [telemetry.component.scss](src/app/modules/telemetry/telemetry.component.scss)
           - [telemetry.component.spec.ts](src/app/modules/telemetry/telemetry.component.spec.ts)
           - [telemetry.component.ts](src/app/modules/telemetry/telemetry.component.ts)
         - __uia__
           - [uia.component.html](src/app/modules/uia/uia.component.html)
           - [uia.component.scss](src/app/modules/uia/uia.component.scss)
           - [uia.component.spec.ts](src/app/modules/uia/uia.component.spec.ts)
           - [uia.component.ts](src/app/modules/uia/uia.component.ts)
       - __services__
         - __api__
           - [logs.service.ts](src/app/services/api/logs.service.ts)
           - [rooms.service.ts](src/app/services/api/rooms.service.ts)
           - [server.service.ts](src/app/services/api/server.service.ts)
           - [telemetry.service.ts](src/app/services/api/telemetry.service.ts)
           - [uia.service.ts](src/app/services/api/uia.service.ts)
         - __modal__
           - [modal.service.spec.ts](src/app/services/modal/modal.service.spec.ts)
           - [modal.service.ts](src/app/services/modal/modal.service.ts)
         - __window\-scrolling__
           - [window\-scrolling.service.spec.ts](src/app/services/window-scrolling/window-scrolling.service.spec.ts)
           - [window\-scrolling.service.ts](src/app/services/window-scrolling/window-scrolling.service.ts)
       - __shared__
         - __components__
           - __card__
             - [card.component.html](src/app/shared/components/card/card.component.html)
             - [card.component.scss](src/app/shared/components/card/card.component.scss)
             - [card.component.spec.ts](src/app/shared/components/card/card.component.spec.ts)
             - [card.component.ts](src/app/shared/components/card/card.component.ts)
           - __control\-button__
             - [control\-button.component.html](src/app/shared/components/control-button/control-button.component.html)
             - [control\-button.component.scss](src/app/shared/components/control-button/control-button.component.scss)
             - [control\-button.component.spec.ts](src/app/shared/components/control-button/control-button.component.spec.ts)
             - [control\-button.component.ts](src/app/shared/components/control-button/control-button.component.ts)
           - __dropdown__
             - [dropdown.component.html](src/app/shared/components/dropdown/dropdown.component.html)
             - [dropdown.component.scss](src/app/shared/components/dropdown/dropdown.component.scss)
             - [dropdown.component.spec.ts](src/app/shared/components/dropdown/dropdown.component.spec.ts)
             - [dropdown.component.ts](src/app/shared/components/dropdown/dropdown.component.ts)
           - __footer__
             - [footer.component.html](src/app/shared/components/footer/footer.component.html)
             - [footer.component.scss](src/app/shared/components/footer/footer.component.scss)
             - [footer.component.ts](src/app/shared/components/footer/footer.component.ts)
           - __header__
             - [header.component.html](src/app/shared/components/header/header.component.html)
             - [header.component.scss](src/app/shared/components/header/header.component.scss)
             - [header.component.spec.ts](src/app/shared/components/header/header.component.spec.ts)
             - [header.component.ts](src/app/shared/components/header/header.component.ts)
           - __modal__
             - [modal.component.html](src/app/shared/components/modal/modal.component.html)
             - [modal.component.scss](src/app/shared/components/modal/modal.component.scss)
             - [modal.component.spec.ts](src/app/shared/components/modal/modal.component.spec.ts)
             - [modal.component.ts](src/app/shared/components/modal/modal.component.ts)
           - __outlined\-button__
             - [outlined\-button.component.html](src/app/shared/components/outlined-button/outlined-button.component.html)
             - [outlined\-button.component.scss](src/app/shared/components/outlined-button/outlined-button.component.scss)
             - [outlined\-button.component.spec.ts](src/app/shared/components/outlined-button/outlined-button.component.spec.ts)
             - [outlined\-button.component.ts](src/app/shared/components/outlined-button/outlined-button.component.ts)
           - __station\-tag__
             - [station\-tag.component.html](src/app/shared/components/station-tag/station-tag.component.html)
             - [station\-tag.component.scss](src/app/shared/components/station-tag/station-tag.component.scss)
             - [station\-tag.component.spec.ts](src/app/shared/components/station-tag/station-tag.component.spec.ts)
             - [station\-tag.component.ts](src/app/shared/components/station-tag/station-tag.component.ts)
           - __status\-indicator__
             - [status\-indicator.component.html](src/app/shared/components/status-indicator/status-indicator.component.html)
             - [status\-indicator.component.scss](src/app/shared/components/status-indicator/status-indicator.component.scss)
             - [status\-indicator.component.spec.ts](src/app/shared/components/status-indicator/status-indicator.component.spec.ts)
             - [status\-indicator.component.ts](src/app/shared/components/status-indicator/status-indicator.component.ts)
           - __switch\-room\-button__
             - [switch\-room\-button.component.html](src/app/shared/components/switch-room-button/switch-room-button.component.html)
             - [switch\-room\-button.component.scss](src/app/shared/components/switch-room-button/switch-room-button.component.scss)
             - [switch\-room\-button.component.spec.ts](src/app/shared/components/switch-room-button/switch-room-button.component.spec.ts)
             - [switch\-room\-button.component.ts](src/app/shared/components/switch-room-button/switch-room-button.component.ts)
           - __switch\-station\-button__
             - [switch\-station\-button.component.html](src/app/shared/components/switch-station-button/switch-station-button.component.html)
             - [switch\-station\-button.component.scss](src/app/shared/components/switch-station-button/switch-station-button.component.scss)
             - [switch\-station\-button.component.spec.ts](src/app/shared/components/switch-station-button/switch-station-button.component.spec.ts)
             - [switch\-station\-button.component.ts](src/app/shared/components/switch-station-button/switch-station-button.component.ts)
           - __toggle\-switch__
             - [toggle\-switch.component.html](src/app/shared/components/toggle-switch/toggle-switch.component.html)
             - [toggle\-switch.component.scss](src/app/shared/components/toggle-switch/toggle-switch.component.scss)
             - [toggle\-switch.component.spec.ts](src/app/shared/components/toggle-switch/toggle-switch.component.spec.ts)
             - [toggle\-switch.component.ts](src/app/shared/components/toggle-switch/toggle-switch.component.ts)
         - __methods__
     - __assets__
       - __favicon__
         - [android\-chrome\-192x192.png](src/assets/favicon/android-chrome-192x192.png)
         - [android\-chrome\-512x512.png](src/assets/favicon/android-chrome-512x512.png)
         - [apple\-touch\-icon.png](src/assets/favicon/apple-touch-icon.png)
         - [favicon\-16x16.png](src/assets/favicon/favicon-16x16.png)
         - [favicon\-32x32.png](src/assets/favicon/favicon-32x32.png)
         - [favicon.ico](src/assets/favicon/favicon.ico)
     - [index.html](src/index.html)
     - [main.ts](src/main.ts)
     - [manifest.json](src/manifest.json)
     - __styles__
       - __base__
         - [\_\_base\-dir.scss](src/styles/base/__base-dir.scss)
         - [\_typography.scss](src/styles/base/_typography.scss)
       - [styles.scss](src/styles/styles.scss)
       - __theme__
         - [\_\_theme\-dir.scss](src/styles/theme/__theme-dir.scss)
         - [\_classes.scss](src/styles/theme/_classes.scss)
         - [\_color\-palette.scss](src/styles/theme/_color-palette.scss)
   - [tsconfig.app.json](tsconfig.app.json)
   - [tsconfig.json](tsconfig.json)
   - [tsconfig.spec.json](tsconfig.spec.json)

