import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard } from "@capacitor/keyboard";
import { App } from "@capacitor/app";

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

export async function initCapacitorPlugins() {
  if (!isNative) return;

  if (Capacitor.isPluginAvailable("StatusBar")) {
    await StatusBar.setStyle({ style: Style.Light });
    if (platform === "android") {
      await StatusBar.setBackgroundColor({ color: "#FAF7F4" });
    }
  }

  if (Capacitor.isPluginAvailable("SplashScreen")) {
    await SplashScreen.hide();
  }

  if (Capacitor.isPluginAvailable("Keyboard") && platform === "ios") {
    Keyboard.setScroll({ isDisabled: false });
  }

  if (Capacitor.isPluginAvailable("App")) {
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  }
}
